# Etapa de compilación
FROM node:20-alpine AS build

WORKDIR /app

# Copiar archivos de definición de dependencias
COPY package*.json ./
COPY prisma ./prisma/

# Instalar todas las dependencias (incluyendo devDependencies para compilar)
RUN npm install

# Copiar el resto del código
COPY . .

# Generar cliente de Prisma y compilar TypeScript
RUN npm run build

# Etapa de producción
FROM node:20-alpine AS production

WORKDIR /app

# Copiar solo lo necesario para ejecutar
COPY --from=build /app/package*.json ./
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

# Exponer el puerto que usa Express
EXPOSE 3000

# Comando para iniciar la aplicación (incluye migraciones que ahora contienen el seed SQL)
CMD npx prisma migrate deploy && npm start
