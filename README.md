# TreinoFacil

**Descrição** Aplicação para acompanhamento de treinos para alunos e professores. Alunos podem ver exercícios do dia e marcar como concluídos; professores futuramente poderão gerenciar alunos.

## Público‑alvo

- **Alunos**: acompanhar exercícios diários.
- **Professores** (futuro): acompanhar desempenho dos alunos.

## Tecnologias

- Frontend: React (Vite).
- Backend: Node.js, Express, Supabase.

## Estrutura de pastas

```
/└─ client/      # Frontend React
/└─ server/      # Backend Express + Supabase
```

## Como rodar localmente

1. Clone o repositório.
2. Copie `.env.example` para `.env` em cada pasta e configure:
   - `VITE_API_URL` no client.
   - `SUPABASE_URL`, `SUPABASE_KEY` no server.
3. Instale dependências:
   ```bash
   cd client && npm install
   cd ../server && npm install
   ```
4. Inicie em modo desenvolvimento:
   ```bash
   cd server && npm run dev
   cd ../client && npm run dev
   ```
5. Acesse `http://localhost:3000`.

## Deploy

- Frontend e backend hospedados no Vercel.
- Configure variáveis de ambiente no painel do Vercel.

---