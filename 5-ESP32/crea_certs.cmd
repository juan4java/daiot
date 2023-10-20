REM -- Set local IP --
set IP=192.168.0.37
set "openssl=C:\Program Files\OpenSSL-Win64\bin\openssl.exe"
set OUT_PATH=..\mosquitto\certs
set SUBJECT_CA=/C=AR/ST=CABA/L=CABA/O=FiUBA/OU=CA/CN=%IP%
set SUBJECT_SERVER=/C=AR/ST=CABA/L=CABA/O=FiUBA/OU=Server/CN=%IP%
set SUBJECT_CLIENT=/C=AR/ST=CABA/L=CABA/O=FiUBA/OU=Client/CN=%IP%

:generate_CA
   echo "%SUBJECT_CA%"
   "%openssl%" req -x509 -nodes -sha256 -newkey rsa:2048 -subj "%SUBJECT_CA%" -days 365 -keyout ca.key -out ca.crt


:generate_server
   echo "%SUBJECT_SERVER%"
   "%openssl%" req -nodes -sha256 -new -subj "%SUBJECT_SERVER%" -keyout server.key -out server.csr
   "%openssl%" x509 -req -sha256 -in server.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out server.crt -days 365


:generate_client
   echo "%SUBJECT_CLIENT%"
   "%openssl%" req -new -nodes -sha256 -subj "%SUBJECT_CLIENT%" -out client.csr -keyout client.key 
   "%openssl%" x509 -req -sha256 -in client.csr -CA ca.crt -CAkey ca.key -CAcreateserial -out client.crt -days 365


:copy_keys_to_broker
   mkdir %OUT_PATH%
   move .\ca.crt %OUT_PATH%
   move .\server.crt %OUT_PATH%
   move .\server.key %OUT_PATH%

exit
