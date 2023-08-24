FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:18-alpine AS final
WORKDIR /app
COPY --from=builder ./app/dist ./dist
COPY package*.json ./
RUN npm ci
ENV PORT=5000
ENV NODE_ENV=production
EXPOSE 5000
CMD [ "npm", "start" ]
