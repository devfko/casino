## Casino

Frontend desarrollado en VueJS con Vuetify

### Configuration

Crear archivo _.env.local_ para pruebas locales o _.env_ para producción con la siguiente estructura de datos

```sh
VUE_APP_NODE_ENV = production
VUE_APP_URL_API_LOCAL = http://localhost:3000/graphql
VUE_APP_URL_API_PROD = //Ruta de conexión a la API de producción, Ejemplo: https://ruta-api-heroku.com/endpoint
VUE_APP_TIMER = //Tiempo de duración en milisegundos del Timer, Ejemplo: 180000
VUE_APP_MINIMUM_BET = //Valor minimo para unirse al juego, Ejemplo: 15000
```

### Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Team

[![`@devfko`](https://instagram-brand.com/wp-content/uploads/2016/11/Instagram_AppIcon_Aug2017.png?w=20)](https://www.instagram.com/devfko/) `@devfko`