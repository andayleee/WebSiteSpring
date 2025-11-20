## Необходимые команды для развертывания на сайте
### Сборка файла и отправка на сервер

./mvnw clean package  - пересборка JAR файла для сервера

scp target/website-0.0.1-SNAPSHOT.jar root@{АЙПИ СЕРВЕРА}:/opt/mysite/ - отправка на сервер

### После на сервере:

sudo systemctl reload nginx - перезагрузка nginx

sudo systemctl restart mysite - перезагрузка сайта

### Также надо не забыть внести изменения на гит