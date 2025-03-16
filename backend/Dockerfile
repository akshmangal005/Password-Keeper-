FROM node:20-alpine
RUN npm install -g typescript 
RUN apk add --no-cache openssl
WORKDIR /src
COPY package*.json ./
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 8000
CMD ["npm", "start"]