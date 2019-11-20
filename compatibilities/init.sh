# Generate TLS key/cert
openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout selfsigned-key.pem -out selfsigned-crt.pem \
  -subj "/C=UK/O=DWP/CN=localhost"
echo '' > .env
echo 'TLS_KEY="'$(sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g' selfsigned-key.pem)'"' >> .env
echo 'TLS_CERT="'$(sed -E ':a;N;$!ba;s/\r{0,1}\n/\\n/g' selfsigned-crt.pem)'"' >> .env
chmod 400 .env
rm selfsigned-*.pem
# (sleep 15; echo "Removing $(pwd)/.env environment config file"; rm .env)&

npm start