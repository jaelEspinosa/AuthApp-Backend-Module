# Backend en Nest

```
Con docker desktop corriendo ejecutar el comando:
docker compose up -d

```
Copiar el ```.env.template``` y renombrarlo a ```.env```


```
La variables de entorno hay que sustituirlas por las que procedan, sobre todo las de la cuenta de correo,
para que el backend pueda enviar los correos de verificación de cuenta y reset de contraseña.

ejemplo:

EMAIL_HOST=smtp.gmail.com
EMAIL_PASS=wfykaysyqloasdfs
EMAIL_PORT=465
EMAIL_USER=username@gmail.com

```


# Funcionalidad:


```
Estamos ante un sistema de autenticación completo, con token, hasheo de contraseñas y envio de email tanto
de confirmación de email, como para poder resetear el password en caso necesario.


```