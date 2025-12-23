FROM node:20-alpine

WORKDIR /app

# package.json だけ先にコピー（キャッシュ効かせる）
COPY package*.json ./

RUN npm install

# 残りコピー
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]