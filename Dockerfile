FROM node:18-alpine

WORKDIR /app

# Устанавливаем зависимости
COPY package.json ./
RUN npm config set strict-ssl false
RUN npm install

# Для продакшена используем build и start
# Для разработки используем dev скрипт с ts-node
COPY . .
CMD if [ "$ENV" = "dev" ]; then \
        npm run dev; \
    else \
        npm run build && npm start; \
    fi
