# 🎤 EventMatch – Plataforma Técnica para Eventos Culturais

EventMatch é uma plataforma web para conectar **produtores culturais** a **prestadores de serviços técnicos** (som, luz, montagem etc.), oferecendo:

- Cadastro de eventos
- Candidaturas a vagas técnicas
- Geração de protocolos de trabalho
- Portfólios públicos com upload de currículo
- Busca full-text em currículos
- Avaliações
- Chat seguro 1:1

---

## 🌍 Arquitetura & Deploy

| Camada        | Plataforma  | Tecnologias                  |
|---------------|-------------|------------------------------|
| Frontend      | [Vercel](https://vercel.com/)    | Vite + React + Tailwind        |
| Backend       | [Railway](https://railway.app/)  | Node.js + Express + PostgreSQL |
| Banco de Dados| Railway (PostgreSQL) | Prisma ORM, hospedado em container |

## 🧱 Estrutura do Projeto (Monorepo)

```bash
eventmatch/
├── frontend/     # React + Tailwind + Vite
└── backend/      # Node.js + Express + Prisma + Docker
```

---

## ⚙️ Ambientes e Instalação

### 🔧 Instalações Globais (no sistema)

Essas ferramentas devem ser instaladas **uma única vez** no sistema **Ubuntu 22.04 LTS**:

| Ferramenta                                                                 | Comando de Verificação        | Uso no Projeto                                                                 |
|----------------------------------------------------------------------------|-------------------------------|--------------------------------------------------------------------------------|
| [Git](https://git-scm.com/)                                               | `git --version`              | Versionamento de código com integração ao GitHub                               |
| [NVM – Node Version Manager](https://github.com/nvm-sh/nvm)              | `nvm --version`              | Gerenciador de versões do Node.js por usuário                                  |
| [Node.js (LTS)](https://nodejs.org/en/)                                   | `node -v`                    | Execução do backend (Express) e frontend (Vite + React)                        |
| npm (incluso com Node.js)                                                 | `npm -v`                     | Gerenciamento de dependências JavaScript no projeto                            |
| [Docker](https://docs.docker.com/engine/install/ubuntu/)                 | `docker --version`           | Containers para PostgreSQL e serviços backend                                  |
| [Docker Compose](https://docs.docker.com/compose/install/)               | `docker-compose --version`   | Orquestração local de múltiplos containers                                     |
| [Prisma CLI](https://www.prisma.io/docs/getting-started)                 | `prisma -v`                  | ORM utilizado para modelagem e acesso ao banco PostgreSQL                      |
| [Visual Studio Code](https://code.visualstudio.com/)                     | `code --version`             | Editor de código principal, com suporte a extensões como Tailwind, Prisma, etc.|

---

## 📦 Dependências Locais por Ambiente

As dependências abaixo são instaladas localmente dentro de suas respectivas pastas (`frontend/` e `backend/`), com `npm install`.

---

### 🖼️ Frontend – React + Vite + Tailwind

📁 Caminho: `eventmatch/frontend/`

#### 🔧 Instalação

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom react-hook-form zod react-hot-toast
```

---

### 🛠️ Backend – Node.js + Express + Prisma

📁 Caminho: `eventmatch/backend/`

#### 🔧 Instalação

```bash
npm install express prisma @prisma/client cors dotenv jsonwebtoken bcryptjs multer socket.io
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/socket.io
npx prisma init
```

---

## 🛠️ Status Atual do Desenvolvimento

### ✅ Módulos Implementados (1-4)

#### **Módulo 1 — Fundamentos & Configuração**
- [x] Rota `/health` (liveness/readiness): status, db, uptime, timestamp
- [x] Validação do `.env` no boot (DATABASE_URL/JWT_SECRET)
- [x] Error handler global (JSON padronizado; mapeia 4xx/5xx)
- [x] Rota 404 unificada
- [x] Middlewares-base: helmet, cors, express.json()
- [x] Inicialização configurável por PORT

#### **Módulo 2 — Autenticação & Usuário**
- [x] `/auth/register` (hash seguro de senha)
- [x] `/auth/login` (validação + geração de JWT)
- [x] `/users/me` (dados do usuário autenticado)
- [x] RBAC: middlewares `requireProducer` e `requireProvider`
- [x] JWT centralizado com `env.jwtSecret`

**Exemplo de resposta do login:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid-gerado",
    "name": "Artur Luna",
    "email": "artur@example.com"
  }
}
```

#### **Módulo 3 — Eventos**
- [x] `POST /events` (apenas produtor)
- [x] `GET /events` (listagem pública com ordenação/paginação)
- [x] `GET /events/me` (eventos do produtor autenticado)

#### **Módulo 4 — Protocolos (Candidaturas/Status)**
- [x] `POST /protocols/:eventId/apply` (prestador):
  - Bloqueio de auto-candidatura
  - Proteção contra duplicidade (índice único + retorno 409)
- [x] `GET /protocols/me` (prestador): lista as próprias candidaturas
- [x] `PUT /protocols/:id/status` (produtor dono):
  - Somente PENDENTE → ACEITO|RECUSADO
  - 403 se não for dono; 404 se inexistente; 422 para status inválidos

---

### 🚧 Roadmap de Desenvolvimento (Módulos 5-14)

#### **Módulo 5 — Portfólio & Upload de Currículo** 🔄 *Próximo*
**Objetivo:** Armazenar currículos (PDF/DOCX) no PostgreSQL e extrair texto

**Tarefas:**
- [ ] Middleware de upload (memória; 5 MB; allowlist pdf/docx)
- [ ] Verificação de MIME (file-type)
- [ ] Modelo `ResumeFile` (metadados + BYTEA data + textExtraction)
- [ ] Extração de texto (pdf-parse / mammoth) + heurísticas
- [ ] Endpoints: `POST /portfolio/upload`, `GET /portfolio/me/files`, `GET /portfolio/files/:id`

**Critério de Aceite:** Upload salva binário; extração retorna resumo; download funciona

---

#### **Módulo 6 — Busca Full-Text (PostgreSQL)** 🔄 *Próximo*
**Objetivo:** Pesquisar termos nos currículos extraídos

**Tarefas:**
- [ ] Coluna gerada `resume_search TSVECTOR` (pt_BR) + índice GIN
- [ ] Endpoint `GET /portfolio/search?q=&limit=&offset=`
- [ ] Implementação com `websearch_to_tsquery`, `ts_rank`, `ts_headline`
- [ ] Paginação e ordenação por relevância

**Critério de Aceite:** Resultados ordenados com snippet; performance aceitável

---

#### **Módulo 7 — Chat 1:1 Seguro**
**Objetivo:** Comunicação entre produtor e prestador com vínculo válido

**Tarefas:**
- [ ] Modelos/relacionamentos para mensagens
- [ ] Rotas REST: listar conversas/mensagens; enviar mensagem
- [ ] Socket.IO autenticado (JWT), rooms por par com protocolo ACEITO
- [ ] Regras de autorização em tempo real

**Critério de Aceite:** Mensagens fluem produtor↔prestador com vínculo válido

---

#### **Módulo 8 — Segurança Aplicacional**
**Objetivo:** Fortalecer a superfície de ataque

**Tarefas:**
- [ ] CORS restrito a domínios do frontend
- [ ] Rate-limit (auth, upload, busca)
- [ ] Validação de payloads (Zod) em rotas sensíveis
- [ ] Sanitização de entradas e texto extraído

**Critério de Aceite:** Respostas padronizadas (422/400/401/403/404/409), headers seguros

---

#### **Módulo 9 — Observabilidade & Logs**
**Objetivo:** Visibilidade e diagnóstico

**Tarefas:**
- [ ] Logger estruturado (requestId, nível, tempo)
- [ ] Métricas: tempo de extração, tamanho de arquivo, p95 de busca, taxa de erro
- [ ] Logs específicos para upload, extração, busca, chat

**Critério de Aceite:** Trilhas de auditoria e métricas disponíveis

---

#### **Módulo 10 — Banco & Operação (Railway)**
**Objetivo:** Estabilidade operacional

**Tarefas:**
- [ ] Migrações Prisma + SQL do FTS reprodutíveis
- [ ] ANALYZE pós-índice GIN; seeds mínimos
- [ ] Política de backup/restore; monitorar crescimento

**Critério de Aceite:** Migra em ambiente limpo; plano de backup documentado

---

#### **Módulo 11 — Qualidade (QA & Testes)**
**Objetivo:** Garantir regressão mínima

**Tarefas:**
- [ ] Unit tests (services de extração/sumário)
- [ ] Integração (auth → eventos → apply → status → upload → search → download)
- [ ] Fixtures PDF/DOCX pequenos
- [ ] Coleção Postman (flows ponta-a-ponta)

**Critério de Aceite:** Suíte passa local/CI; coleção executável

---

#### **Módulo 12 — CI/CD (Railway)**
**Objetivo:** Entrega contínua com segurança

**Tarefas:**
- [ ] GitHub Actions: lint, build, testes
- [ ] Passo de migração no deploy
- [ ] Verificação de .env obrigatórias
- [ ] Estratégia de rollback

**Critério de Aceite:** PR roda CI; merge faz deploy; rollback documentado

---

#### **Módulo 13 — Documentação & Runbooks**
**Objetivo:** Onboarding e operação sem atrito

**Tarefas:**
- [ ] README completo (setup, scripts, env, rotas)
- [ ] API docs (Swagger/Postman export)
- [ ] Runbooks: incidentes comuns (413/415, falhas de extração, DB cheio)

**Critério de Aceite:** Dev sobe o projeto em <10 min; APIs claras

---

#### **Módulo 14 — Polimento 4.0**
**Objetivo:** Fechar pendências e NFRs

**Tarefas:**
- [ ] Revisão de performance
- [ ] Linter/formatter
- [ ] Limites de tamanho/concorrência
- [ ] Próximos passos (ex.: migração para S3 se volume crescer)

**Critério de Aceite:** "Definition of Done" completo e release tag

---

## 🚀 Como Começar

1. Clone o repositório
2. Instale as dependências globais (veja tabela acima)
3. Instale as dependências do frontend: `cd frontend && npm install`
4. Instale as dependências do backend: `cd backend && npm install`
5. Configure as variáveis de ambiente (arquivos `.env`)
6. Execute as migrações do Prisma: `npx prisma migrate dev`
7. Inicie os servidores de desenvolvimento

---

## 📊 Progresso Geral

```
Módulos Completos: 4/14 (29%)
Próximos: Módulo 5 (Portfólio) e Módulo 6 (Busca FTS)
```

---


## 👥 Contribuidores

Artur Luna Marinho