FROM node:12.2

#USER node

RUN mkdir -p /app

# Se establece el directorio de trabajo
WORKDIR /app

# Se establecen variables de entorno
ENV VUE_APP_NODE_ENV=
ENV VUE_APP_URL_API_PROD=
ENV VUE_APP_TIMER=
ENV VUE_APP_MINIMUM_BET=

# Instala los paquetes existentes en el package.json
COPY package*.json ./

RUN npm install -g --quiet

RUN npm install @vue/cli-service

# Copia la aplicación
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]