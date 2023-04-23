# ==== CONFIGURE =====
FROM node:16-alpine 
WORKDIR /usr/src/app/wisor-ai-ha
COPY package*.json ./
COPY . .


RUN npm install

EXPOSE 3000

CMD ["npm", "start"]
