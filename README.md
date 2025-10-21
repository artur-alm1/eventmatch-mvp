# 🎤 EventMatch – Plataforma Técnica para Eventos Culturais

EventMatch é uma plataforma web para conectar **produtores culturais** a **prestadores de serviços técnicos** (som, luz, montagem etc.), oferecendo:

- Cadastro de eventos
- Candidaturas a vagas técnicas
- Geração de protocolos de trabalho
- Portfólios públicos
- Avaliações
- Chat seguro 1:1

---

## 🌍 Infraestrutura e Deploy

A aplicação será implantada em **plataformas modernas e escaláveis**, de acordo com a arquitetura definida na [Documentação Técnica 2.0 e 3.0].

### 🔼 Frontend → Vercel
- SPA desenvolvida em React com Vite + Tailwind
- Deploy contínuo conectado ao GitHub
- URL pública do frontend será gerada automaticamente pela Vercel

### 🛠 Backend → RailWay
- API REST construída com Node.js + Express + Prisma
- Banco de Dados PostgreSQL gerenciado pelo RailWay
- Armazenamento de arquivos (currículos, avatares) via Parse File API
- Backend pode ser containerizado com Docker para ambientes locais ou testes

---

## 🧱 Estrutura do Projeto (Monorepo)

```bash
eventmatch/
├── frontend/     # React + Tailwind + Vite
└── backend/      # Node.js + Express + Prisma + Docker


## ⚙️ Ambientes e Instalações

### 🔧 Instalações Globais (no sistema)

Essas ferramentas devem ser instaladas **uma única vez** no sistema **Ubuntu 22.04 LTS**:

| Ferramenta                                                                 | Comando de Verificação         | Uso no Projeto                                                                 |
|----------------------------------------------------------------------------|--------------------------------|---------------------------------------------------------------------------------|
| [Git](https://git-scm.com/)                                               | `git --version`               | Versionamento de código com integração ao GitHub                               |
| [NVM – Node Version Manager](https://github.com/nvm-sh/nvm)              | `nvm --version`               | Gerenciador de versões do Node.js por usuário                                  |
| [Node.js (LTS)](https://nodejs.org/en/)                                   | `node -v`                     | Execução do backend (Express) e frontend (Vite + React)                        |
| npm (incluso com Node.js)                                                 | `npm -v`                      | Gerenciamento de dependências JavaScript no projeto                            |
| [Docker](https://docs.docker.com/engine/install/ubuntu/)                 | `docker --version`            | Containers para PostgreSQL e serviços backend                                  |
| [Docker Compose](https://docs.docker.com/compose/install/)               | `docker-compose --version`    | Orquestração local de múltiplos containers                                     |
| [Prisma CLI](https://www.prisma.io/docs/getting-started)                 | `prisma -v`                   | ORM utilizado para modelagem e acesso ao banco PostgreSQL via Back4App         |
| [Visual Studio Code](https://code.visualstudio.com/)                     | `code --version`              | Editor de código principal, com suporte a extensões como Tailwind, Prisma, etc.|

---

---

## 📦 Dependências Locais por Ambiente

As dependências abaixo são instaladas localmente dentro de suas respectivas pastas (`frontend/` e `backend/`), com `npm install`.

---

### 🖼️ Frontend – React + Vite + Tailwind

📁 Caminho: `eventmatch/frontend/`

#### 🔧 Instalações

```bash
npm install
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm install axios react-router-dom react-hook-form zod react-hot-toast


---

### 🛠️ Backend – Node.js + Express + Prisma

📁 Caminho: `eventmatch/backend/`

#### 🔧 Instalações

```bash
npm install express prisma @prisma/client cors dotenv jsonwebtoken bcryptjs multer socket.io
npm install -D typescript ts-node-dev @types/node @types/express @types/cors @types/jsonwebtoken @types/bcryptjs @types/socket.io
npx prisma init
