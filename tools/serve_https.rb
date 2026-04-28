require 'webrick'
require 'webrick/https'
require 'openssl'

root = File.expand_path('.')
cert = OpenSSL::X509::Certificate.new(File.read('cert.pem'))
pkey = OpenSSL::PKey::RSA.new(File.read('key.pem'))

server = WEBrick::HTTPServer.new(
  Port: 8766,
  DocumentRoot: root,
  SSLEnable: true,
  SSLCertificate: cert,
  SSLPrivateKey: pkey,
  BindAddress: '0.0.0.0'
)

trap('INT') { server.shutdown }
server.start
