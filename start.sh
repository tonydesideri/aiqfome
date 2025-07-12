#!/bin/bash

set -e

echo "Iniciando AiqFome..."

if ! docker info > /dev/null 2>&1; then
    echo "Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

if [ ! -f .env ]; then
    echo "Arquivo .env não encontrado. Copiando de .env.example..."
    cp .env.example .env
    echo "Arquivo .env criado."
fi

echo "Parando containers existentes..."
docker compose down

echo "Construindo e iniciando os serviços..."
docker compose up --build -d

echo ""
echo "AiqFome iniciado com sucesso!"
echo "API disponível em: http://localhost:3333"
echo "Swagger disponível em: http://localhost:3333/api"
echo "Banco de dados disponível em: localhost:5432"
