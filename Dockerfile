# Imagen raiz
FROM node

# Carpeta raiz
WORKDIR /apitechu

# Copia de archivos de proyecto
ADD . /apitechu

# Instalo paquetes necesarios
RUN npm install --only-prod

# Puerto que expone
EXPOSE 3000

# Comando inicialización
CMD ["node", "server.js"]
