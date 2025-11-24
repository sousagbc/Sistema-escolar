# Sistema Escolar - Fullstack (TypeScript)

Projeto exemplo com Frontend (React + Vite) e Backend (Node + Express) em TypeScript, usando Prisma para Postgres e validação com Zod. Comunicação entre front e back via axios.

Principais funcionalidades:
- CRUD de alunos, professores e matérias
- Matrícula de alunos em turmas (classes)
- Lançamento de notas e faltas
- Cálculo automático de média por matrícula
- Endpoint para boletim individual

Como rodar localmente (exemplo):

1) Backend

```
cd backend
cp .env.example .env
npm install
npx prisma migrate dev --name init
npm run seed
npm run dev
```

2) Frontend

```
cd frontend
npm install
npm run dev
```

Deploy: o repositório contém `Dockerfile`s e instruções para deploy em plataformas como Vercel (frontend) e Railway/Render (backend). Use um Postgres gerenciado (Neon, PlanetScale, Railway) e configure `DATABASE_URL`.

Observações:
- Uso de TypeScript, Zod, Prisma e Axios conforme solicitado.
- Documentação dos endpoints está nos arquivos do backend (rotas simples).
