#!/bin/bash

# Проверяем наличие аргумента с именем env файла
ENV_FILE=${1:-.env.prod}

echo "🚀 Начинаем развертывание бота..."

# Получаем последние изменения из git
echo "📥 Получаем последние изменения..."
git pull

# Проверяем существование env файла
if [ ! -f "$ENV_FILE" ]; then
    echo "❌ Ошибка: Файл $ENV_FILE не найден!"
    exit 1
fi

# Останавливаем текущий контейнер
echo "🛑 Останавливаем текущий контейнер..."
docker compose down

# Пересобираем и запускаем контейнер с новым кодом
echo "🏗️ Собираем и запускаем новый контейнер..."
ENV_FILE=$ENV_FILE docker compose up --build -d

# Проверяем статус контейнера
echo "🔍 Проверяем статус контейнера..."
sleep 5
if [ "$(docker ps -q -f name=pchan-bot)" ]; then
    echo "✅ Бот успешно запущен!"
    echo "📝 Логи доступны через команду: docker compose logs -f"
else
    echo "❌ Ошибка: Контейнер не запустился!"
    echo "🔍 Проверьте логи: docker compose logs"
    exit 1
fi
