#!/bin/bash
# Para todos os containers Chronus

echo "==> Parando frontend..."
cd /c/Sistemas/ws-reactJs/chronus-frontend
docker-compose -f docker-compose.frontend.yml down

echo "==> Parando backend..."
cd /c/Sistemas/ws-spring/api-chronus
docker-compose down

echo "✅ Ambiente parado."