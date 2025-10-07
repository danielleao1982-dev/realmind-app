# RealMind v5 (PWA)

App leve, em português, com:
- Testes de realidade (log local)
- Respiração guiada (4-4-4, 4-7-8)
- Diário (humor + texto)
- Agenda (tarefas com data)
- SOS (atalhos úteis)
- Estatísticas simples
- Backup/restore local (JSON)
- PWA installable + offline

## Como publicar no GitHub Pages
1. Crie um repositório `realmind` (ou outro nome).
2. Envie **todos** os arquivos desta pasta na raiz do repo.
3. Ative **Settings → Pages → Deploy from branch** e selecione `main`/`root`.
4. Aguarde o deploy e acesse a URL do Pages.
5. Teste a instalação no Android (Chrome) e verifique o `service-worker` e o `manifest`.

## Como gerar APK
- Use PWABuilder (ou TWA/Capacitor) apontando para a URL do GitHub Pages.
- Recomendado: ícone 512×512 `maskable-512.png`.

> Observação: Os dados ficam no `localStorage` do navegador do usuário.
