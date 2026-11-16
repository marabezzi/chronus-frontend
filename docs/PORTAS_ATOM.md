# Registro de portas ATOM — 2026-11-07

Esta aplicação reserva portas **exclusivas no host** para coexistir com outros sistemas ATOM no mesmo computador. Portas **internas** de contêineres isolados podem se repetir.

## Este repositório

Frontend React 3000 e proxy para API Chronus dedicada na porta 8111; no Docker a API do repositório api-chronus é resolvida como chronus-api:8111.

## Verificação no computador

```bash
docker ps --format 'table {{.Names}}\t{{.Ports}}'
sudo ss -ltnp
```

Não execute stacks simultâneos com mapeamentos coincidentes. Revise os arquivos `.env` locais: valores definidos neles prevalecem sobre padrões do repositório.

**HTTPS em produção:** apenas um gateway/proxy deve ocupar 80/443 no mesmo IP; mantenha os ingressos existentes até configurar um proxy compartilhado. Alterar portas públicas pode invalidar desafios ACME/Let's Encrypt e requer homologação antes do merge.
