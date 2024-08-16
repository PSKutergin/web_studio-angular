# Используем официальный образ Node.js
FROM node:22.4.1-alpine as build

# Устанавливаем рабочую директорию
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальные файлы проекта
COPY . .

# Указываем порт, который использует приложение
EXPOSE 3000

# Указываем команду по умолчанию (может быть переопределена в docker-compose)
CMD ["npm", "start"]
