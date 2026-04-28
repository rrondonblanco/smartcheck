package cl.reuse.smartcheck.probe

import android.util.Log
import okhttp3.MediaType.Companion.toMediaType
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody.Companion.toRequestBody
import org.json.JSONObject
import java.io.IOException
import java.security.SecureRandom
import java.security.cert.X509Certificate
import java.util.concurrent.TimeUnit
import javax.net.ssl.SSLContext
import javax.net.ssl.X509TrustManager

/**
 * Cliente HTTP minimalista. Sólo necesitamos un POST.
 *
 * Diseño:
 *  - Sin Retrofit: para 1 endpoint es overkill y suma 200KB+ al APK.
 *  - JSON con org.json (incluido en Android, no agrega tamaño).
 *  - Reintentos con backoff exponencial (3 intentos, 1s/2s/4s).
 *  - En DEBUG aceptamos cualquier cert (incluido autofirmado del server local
 *    de Rob). En RELEASE eso se desactiva — TI configurará pinning real.
 *
 * Nota de seguridad: el TrustManager permisivo SÓLO aplica si BuildConfig.DEBUG
 * es true. En release, OkHttp usa el truststore por defecto del sistema.
 */
class ApiClient(private val baseUrl: String) {

    private val client: OkHttpClient = buildClient()

    /**
     * POST /api/probe/upload
     * Devuelve true si el server respondió 2xx. No reintenta más allá de los 3 intentos
     * internos — el caller decide qué hacer con el fallo (retry manual, error UI).
     */
    fun uploadProbe(payload: JSONObject): Result<String> {
        val url = "$baseUrl/api/probe/upload"
        val body = payload.toString().toRequestBody(JSON_MEDIA)
        val req = Request.Builder()
            .url(url)
            .post(body)
            .header("User-Agent", "SmartCheckProbe/${BuildConfig.VERSION_NAME}")
            .header("Accept", "application/json")
            .build()

        var lastError: Exception? = null
        repeat(3) { attempt ->
            try {
                Log.d(TAG, "POST $url (attempt ${attempt + 1})")
                client.newCall(req).execute().use { resp ->
                    val text = resp.body?.string().orEmpty()
                    if (resp.isSuccessful) {
                        Log.i(TAG, "upload OK: $text")
                        return Result.success(text)
                    }
                    lastError = IOException("HTTP ${resp.code}: $text")
                    Log.w(TAG, "upload non-2xx: ${resp.code}")
                }
            } catch (e: Exception) {
                lastError = e
                Log.w(TAG, "upload attempt failed: ${e.message}")
            }
            // backoff: 1s, 2s, 4s
            Thread.sleep(1000L shl attempt)
        }
        return Result.failure(lastError ?: IOException("upload failed after 3 attempts"))
    }

    private fun buildClient(): OkHttpClient {
        val builder = OkHttpClient.Builder()
            .connectTimeout(10, TimeUnit.SECONDS)
            .readTimeout(15, TimeUnit.SECONDS)
            .writeTimeout(15, TimeUnit.SECONDS)
            .retryOnConnectionFailure(true)

        if (BuildConfig.DEBUG) {
            // Trust-all sólo en debug, para conectar al server local (cert autofirmado).
            // El AGP marca un warning si esto se activa en release: bien, así nos protege.
            applyDebugInsecureTrust(builder)
        }
        return builder.build()
    }

    private fun applyDebugInsecureTrust(builder: OkHttpClient.Builder) {
        val trust: X509TrustManager = object : X509TrustManager {
            override fun checkClientTrusted(c: Array<out X509Certificate>?, a: String?) {}
            override fun checkServerTrusted(c: Array<out X509Certificate>?, a: String?) {}
            override fun getAcceptedIssuers(): Array<X509Certificate> = emptyArray()
        }
        val ctx = SSLContext.getInstance("TLS").apply {
            init(null, arrayOf(trust), SecureRandom())
        }
        builder.sslSocketFactory(ctx.socketFactory, trust)
        builder.hostnameVerifier { _, _ -> true }
    }

    companion object {
        private const val TAG = "SmartCheck/ApiClient"
        private val JSON_MEDIA = "application/json; charset=utf-8".toMediaType()
    }
}
