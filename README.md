# 📦 EventMatch – Ambiente de Desenvolvimento

Este documento detalha o ambiente de desenvolvimento configurado para o projeto **EventMatch**, incluindo todas as ferramentas globais instaladas, suas versões, comandos de verificação e o propósito de cada uma no contexto da aplicação.

---

## ✅ Sistema

- **SO:** Ubuntu Linux 22.04 LTS
- **Editor:** Visual Studio Code
- **Shell:** bash
- **Repositório:** GitHub

---

## 🧰 Instalações Globais

| Ferramenta        | Versão Sugerida | Comando de Verificação       | Uso no Projeto | Instalação |
|-------------------|------------------|-------------------------------|----------------|------------|
| **Git**           | 2.30+            | `git --version`               | Versionamento (GitHub) | `sudo apt install git` |
| **nvm**           | 0.39+            | `nvm --version`               | Gerenciar versões do Node.js | [Script Oficial NVM](https://github.com/nvm-sh/nvm) |
| **Node.js**       | 18+ (usando 22+) | `node -v`                     | Backend (Express) + Frontend (Vite/React) | `nvm install --lts` |
| **npm**           | 9+               | `npm -v`                      | Gerenciador de pacotes JavaScript | Incluído com Node |
| **Docker**        | 20+              | `docker --version`            | Containers de Banco de Dados e Backend | `sudo apt install docker.io` |
| **Docker Compose**| 1.29+            | `docker-compose --version`    | Orquestração dos containers | `sudo apt install docker-compose` |
| **Prisma CLI**    | 5+               | `prisma -v`                   | ORM para PostgreSQL (backend) | `npm install -g prisma` |
| **VS Code**       | 1.70+            | `code --version`              | IDE usada no projeto | `sudo snap install code --classic` |

---

## 🧭 Utilização de Cada Ferramenta

### 1. Git
> Versionamento de código, controle de branches e integração com GitHub. Utilizado para CI/CD e colaboração.

### 2. NVM + Node.js + npm
> Base da stack de desenvolvimento:
- Backend: API REST em Node.js + Express
- Frontend: SPA em React (Vite + Tailwind)
- npm: gerenciamento de pacotes para ambos os lados

### 3. Docker + Docker Compose
> Usado para containerizar o banco de dados PostgreSQL, e futuramente o backend.
Permite ambiente isolado e replicável com comandos simples.

### 4. Prisma CLI
> ORM utilizado no backend. Gerencia o schema do banco e gera clientes tipados TypeScript para acesso aos dados.

### 5. Visual Studio Code
> Editor de código principal. Recomendado com as extensões:
- **Prisma**
- **Tailwind CSS IntelliSense**
- **Prettier**
- **ESLint**

---

## 📁 Estrutura do Projeto

```bash
eventmatch/
├── frontend/     # React + Tailwind + Vite
└── backend/      # Node.js + Express + Prisma + Docker