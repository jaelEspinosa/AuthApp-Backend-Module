# Backend en Nest

## Funcionalidad:


```
Estamos ante un sistema de autenticación completo, con token, hasheo de contraseñas y envio de email tanto
de confirmación de email, como para poder resetear el password en caso necesario.


```
## Ejecutar la app en localhost:

```
Con docker desktop corriendo ejecutar el comando:
docker compose up -d

```
Copiar el ```.env.template``` y renombrarlo a ```.env```


```
Las variables de entorno hay que sustituirlas por las que procedan, sobre todo las de la cuenta de correo,
para que el backend pueda enviar los correos de verificación de cuenta y reset de contraseña.

ejemplo:

EMAIL_HOST=smtp.gmail.com
EMAIL_PASS=wfykaysyqloasdfs
EMAIL_PORT=465
EMAIL_USER=username@gmail.com

```

Los endPoints configurados serian los siguientes:

- 'http://localhost:3000/auth/login' --> De tipo ```Post``` en el body mandamos un objeto con el email y password
- 'http://localhost:3000/auth/register' --> De tipo ```Post``` en el body mandamos un objeto con el name, email y password
- 'http://localhost:3000/auth/verify' --> De tipo ```Put``` en el body mandamos un objeto con el token de un solo uso.
- 'http://localhost:3000/auth/forgotPassword' --> De tipo ```Put``` en el body mandamos un objeto con el email
- 'http://localhost:3000/auth/reset-password' --> De tipo ```Put``` en el body mandamos un objeto con el email y el token de un solo uso.
- 'http://localhost:3000/auth/check-token' --> De tipo ```Get``` en las headers enviamos el token con el formato Bearer Token, este último endpoint nos sirve
    para comprobar si el usuario esta autenticado.



### Finalmente en nuestra consola ejecutamos el comando ```npm run start:dev```  ,y ya deberia estar nuestro backend preparado para recibir peticiones




