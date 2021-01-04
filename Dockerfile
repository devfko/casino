FROM node:12.2

#USER node

RUN mkdir -p /app

# Se establece el directorio de trabajo
WORKDIR /app

# Se establecen variables de entorno
ENV VUE_APP_NODE_ENV = production
ENV VUE_APP_URL_API_PROD = https://casino-api-devfko.herokuapp.com/graphql
ENV VUE_APP_TIMER = 180000
ENV VUE_APP_MINIMUM_BET = 15000

# Instala los paquetes existentes en el package.json
COPY package*.json ./

RUN npm install -g --quiet

RUN npm install @vue/cli-service

# Copia la aplicación
COPY . .

RUN npm run build

EXPOSE 8080

CMD [ "npm", "start" ]