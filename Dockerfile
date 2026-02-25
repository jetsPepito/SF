FROM node:22-alpine AS base

WORKDIR /app

# Installer les dépendances
COPY package.json ./
COPY prisma ./prisma
# npm install créera package-lock.json automatiquement s'il n'existe pas
RUN npm install

# Générer le client Prisma
RUN npx prisma generate

# Copier le reste du code
COPY . .

# Build en mode production
RUN npm run build

EXPOSE 3000
ENV PORT=3000
ENV NODE_ENV=production

CMD ["npm", "start"]

