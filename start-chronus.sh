#!/bin/bash
# Sobe todo o ambiente Chronus: backend (API, banco, Evolution) + frontend (React)
# Execute com: bash start-chronus.sh

set -e

echo "==> Iniciando backend..."
cd /c/Sistemas/ws-spring/api-chronus
docker-compose down   # opcional: garante estado limpo
docker-compose up -d --build

echo "==> Iniciando frontend..."
cd /c/Sistemas/ws-reactJs/chronus-frontend
docker-compose -f docker-compose.frontend.yml down
docker-compose -f docker-compose.frontend.yml up -d --build

echo ""
echo "✅ Ambiente Chronus rodando!"
echo "Frontend: http://localhost:3000"
echo "API:      http://localhost:8081"
echo "Evolution: http://localhost:8082"