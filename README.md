# ClickBeard 💈

## Sumário

- [Como Executar](#como-executar) — Instalação e execução do projeto (frontend e backend)
- [Deploy em Produção](#deploy-em-produção) — Informações sobre domínio, hospedagem e arquitetura
- [Database Schema](#database-schema) — Estrutura do banco de dados
- [Prótótipo do projeto](#protótipo-do-projeto) — Link e explicação do protótipo visual
- [Arquitetura do Frontend](#arquitetura-do-frontend) — Estrutura, telas e componentes principais
- [Arquitetura do Backend](#arquitetura-do-backend) — Estrutura de pastas e funcionalidades
- [API Endpoints](#api-endpoints) — Documentação dos principais endpoints da API
Sistema de Agendamento para Barbearia – Desenvolvido por PauloKuster

## Sobre o Projeto
O ClickBeard é um sistema completo de agendamento para barbearias, desenvolvido com Next.js 15 e TypeScript. O sistema permite o gerenciamento de agendamentos entre clientes, barbeiros e administradores.

# Como Executar


Na pasta frontend
```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run dev

# Executar com Turbopack (mais rápido)
npm run devt

# Build para produção
npm run build

# Executar em produção
npm start
```
#### Configuração do .env (Frontend)

O arquivo `.env.local` na pasta `Frontend` com a variável de ambiente abaixo:
- `NEXT_PUBLIC_API_BASE_URL`: Endereço que está rodando o backend.

```env
NEXT_PUBLIC_API_BASE_URL=https://endereço.backend:PORTA
```



Na pasta backend

```bash
# Instalar dependências
npm install

# Executar em modo desenvolvimento
npm run docker

# Build para produção
npm run build
```
### Testes

```bash
npm test            # Executa os testes
npm run test:watch  # Executa os testes em modo watch
```
#### Configuração do .env (Backend)

Para que o backend funcione corretamente, é necessário criar um arquivo `.env` na pasta `backend` com as variáveis de ambiente abaixo:

```env
DATABASE_URL=postgresql://usuario:senha@host:porta/dbname
JWT_SECRET=sua_chave_secreta
PORT=3000
```

- `DATABASE_URL`: String de conexão do banco PostgreSQL (Neon). Você encontra essa URL no painel da Neon.
- `JWT_SECRET`: Chave secreta usada para assinar e validar os tokens JWT.
- `PORT`: Porta em que o backend irá rodar localmente (Se for usar)


# Deploy em Produção

O ClickBeard está disponível publicamente:

- **Domínio:** [ClickBeard.com.br](https://ClickBeard.com.br) — endereço oficial do sistema.
- **Frontend:** Hospedado na [Vercel](https://vercel.com/). Cada atualização na branch principal já publica uma nova versão.

- **Backend:** Hospedado na [Render](https://render.com/). Por ser um serviço gratuito, o backend pode entrar em modo de "sleep" após algum tempo sem uso. Isso faz com que a primeira requisição após um período de inatividade seja mais lenta, mas depois o desempenho volta ao normal.

- **Banco de Dados:** Utiliza [Neon](https://neon.tech/) — banco PostgreSQL

> ⚠️ **Atenção:** Se o site demorar para responder após um tempo sem uso, é porque o backend está "adormecido" na Render. Basta aguardar alguns segundos na primeira requisição; as próximas serão rápidas!


# Database Schema

Baseado no arquivo [`init.sql`](init.sql), o sistema utiliza as seguintes tabelas:

- **Users** - Dados dos usuários (clientes, barbeiros, admin)
- **Specialties** - Especialidades disponíveis
- **Barber_Specialities** - Relacionamento barbeiro-especialidades
- **Appointments** - Agendamentos realizados

![Schema do Banco](docs/ClickBeard_db.png)
*Diagrama Entidade-Relacionamento inicial do banco*

# Protótipo do projeto
Antes do desenvolvimento, reaproveitei um pouco de outro projeto para fazer o protótipo, que ainda passou por mudanças no decorrer do dsenolvimento.
[Figma inicial do projeto](https://www.figma.com/design/MeEWysFF3gDhvoC6Y64aQp/ClickBeard?node-id=0-1&t=ns7VfXsjm1uEo4Y-1)


# Arquitetura do Frontend

### Estrutura Principal
O frontend foi dividido em **três telas principais**:

- **Login** - Autenticação de usuários
- **Registro** - Cadastro de novos usuários  
- **Dashboard** - Painel principal com *(Novo Agendamento / Listagem de agendamentos)*

### Tipos de Usuário

#### Cliente
-  Pode agendar seu atendimento, escolhendo **barbeiro, especialidade e horário**
-  Pode cancelar seu atendimento
-  Pode ver seus próximos agendamentos
-  Pode ver seu histórico de agendamentos

#### Barbeiro
-  Pode agendar novos atendimentos para clientes
-  **Não pode cancelar agendamentos** (precisa falar com o administrador)
-  Pode visualizar os seus agendamentos para o dia selecionado

####  Admin
-  Pode agendar novos atendimentos para clientes e barbeiros
-  Pode cancelar agendamentos
-  Pode **visualizar todos os atendimentos** do dia selecionado, com todos os dados (cliente, barbeiro e tipo de serviço)

##  Estrutura de Pastas

### Pasta `app/`
```
app/
├── api/              # Regras de negócio de cada requisição (API Routes)
│   ├── login/        # Endpoint de autenticação
│   ├── register/     # Endpoint de registro
│   ├── token/        # Validação de token
│   ├── clients/      # Listagem de clientes
│   ├── hours/        # Horários disponíveis
│   ├── appointment/  # Criar agendamento
│   └── appointments/ # Listar agendamentos
├── login/           # Página de login
├── register/        # Página de registro
├── dashboard/       # Dashboard principal
├── layout.tsx       # Layout raiz da aplicação
├── page.tsx         # Página inicial
└── globals.css      # Estilos globais
```

###  Pasta `components/`
- **[`ListAppointment`](frontend/src/components/ListAppointment.tsx)** - Componente da lista de atendimentos e histórico para todos os tipos de usuário
- **[`NewAppointment`](frontend/src/components/NewAppointment.tsx)** - Componente de criar novo agendamento
- **[`HoursAppointment`](frontend/src/components/HoursApointment.tsx)** - Componente da listagem de horários para um novo agendamento

### Pasta `lib/` *(Separação da lógica de negócio)*
- **[`appointmentService`](frontend/src/lib/appoitmentService.ts)** - Lógica para requisições de dados sobre agendamentos
- **[`auth`](frontend/src/lib/auth.ts)** - Lógica de requisição para autenticação
- **[`clientService`](frontend/src/lib/clientService.ts)** - Lógica de requisição para dados e listagem de clientes

##  Fluxos Principais

###  **Fluxo de Login**
1. **Página de Login** ([`/login`](frontend/src/app/login/page.tsx)):
   - Recebe email e senha do usuário
   - Valida formato do email e tamanho mínimo da senha
   - Chama função [`loginUser`](frontend/src/lib/auth.ts) para autenticação

2. **Autenticação** ([`auth.ts`](frontend/src/lib/auth.ts)):
   - Faz validação dos dados de entrada
   - Envia requisição para `/api/login`
   - Armazena token, tipo de usuário e ID no localStorage
   - Redireciona para o dashboard em caso de sucesso

### **Fluxo de Registro**
1. **Página de Registro** ([`/register`](frontend/src/app/register/page.tsx)):
   - Formulário com nome, email, senha, tipo de usuário
   - Seleção de data de nascimento
   - Para barbeiros: seleção múltipla de especialidades
   - Validação de campos obrigatórios

2. **Processamento**:
   - Envia dados para `/api/register`
   - Retorna feedback de sucesso ou erro

### **Fluxo do Dashboard**
1. **Verificação de Autenticação**:
   - Verifica token, usuário e role no localStorage
   - Valida token com [`verifyToken`](frontend/src/lib/auth.ts)
   - Redireciona para login se inválido

2. **Renderização Condicional**:
   - Carrega componentes [`NewAppointment`](frontend/src/components/NewAppointment.tsx) e [`ListAppointment`](frontend/src/components/ListAppointment.tsx)
   - Interface adapta-se conforme o tipo de usuário

### **Fluxo de Agendamento**
1. **Seleção de Data**:
   - Usuário seleciona data (mínimo: data atual)
   - Sistema busca horários disponíveis via [`fetchAvailableHours`](frontend/src/lib/appoitmentService.ts)

2. **Filtros Dinâmicos**:
   - **Especialidades**: Filtra barbeiros por especialidade
   - **Barbeiros**: Mostra apenas barbeiros disponíveis
   - **Horários**: Exibe apenas horários livres

3. **Criação do Agendamento**:
   - Validação de campos obrigatórios
   - Para admin/barbeiro: obrigatório selecionar cliente
   - Envio via [`fetchNewAppointment`](frontend/src/lib/appoitmentService.ts)

### **Fluxo de Listagem**
1. **Busca de Dados**:
   - [`fetchAppointments`](frontend/src/lib/appoitmentService.ts) busca agendamentos por role
   - Separação entre agendamentos futuros e histórico

2. **Exibição por Tipo de Usuário**:
   - **Cliente**: Próximos agendamentos + histórico
   - **Barbeiro/Admin**: Agendamentos agrupados por período (manhã, tarde, noite)

## Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **Axios** - Cliente HTTP
- **React Hooks** - Gerenciamento de estado

# Arquitetura do Backend

```txt
clickbeard-backend/
├─ src/
│  ├─ controllers/
│  ├─ middlewares/
│  ├─ routes/
│  ├─ services/
│  ├─ prisma/
│  ├─ utils/
│  ├─ types/
│  ├─ app.ts
│  └─ server.ts
├─ prisma/
│  └─ schema.prisma
├─ docker-compose.yml
├─ Dockerfile
├─ .env
├─ tsconfig.json
├─ nodemon.json
├─ package.json
```



## Funcionalidades

-  Autenticação JWT
-  Cadastro de usuários (Cliente/Barbeiro)
-  Agendamento de horários
-  Filtros dinâmicos de barbeiros e especialidades
-  Histórico de agendamentos
-  Interface responsiva
-  Validação de formulários
-  Gerenciamento de estado local

## Arquitetura do backend

## Fluxo de Login de Usuário

O fluxo de login de usuário segue as etapas abaixo:

1. **Envio dos dados:**
   - O usuário envia um JSON com `email` e `pass` para o endpoint `/users/login`.
   - Ambos os campos são obrigatórios.

2. **Validação dos dados:**
   - Se faltar algum campo, retorna 400 com mensagem de dados inválidos.

3. **Busca do usuário:**
   - O sistema procura o usuário pelo e-mail informado.
   - Se não encontrar, retorna 400 com mensagem de dados inválidos.

4. **Validação da senha:**
   - A senha enviada é comparada com o hash salvo no banco usando bcrypt.
   - Se não bater, retorna 400 com mensagem de dados inválidos.

5. **Geração do token JWT:**
   - Se o login for bem-sucedido, é gerado um token JWT contendo o id, role, email e nome do usuário.
   - O token tem validade de 1 dia.

6. **Resposta:**
   - Retorna 200 com o token JWT e os dados do usuário (nome, email, role).

**Observações:**
- O token JWT deve ser guardado pelo cliente e enviado em endpoints protegidos.
- O campo `role` define o tipo de acesso do usuário (client, barber, admin).
 
## Fluxo de Registro de Usuário

O fluxo de registro de usuário foi implementado com as seguintes etapas:

1. **Validação dos dados:**
   - Os campos obrigatórios são: `name_user`, `email_user`, `pass_user`, `type_user`.
   - O campo `type_user` deve ser `client` ou `barber`.
   - Se faltar algum campo obrigatório ou o tipo for inválido, retorna 400.

2. **Verificação de e-mail duplicado:**
   - O sistema verifica se já existe um usuário com o mesmo e-mail (`email_user`).
   - Se existir, retorna 400 com mensagem de e-mail já cadastrado.

3. **Criptografia da senha:**
   - A senha é criptografada usando bcrypt antes de ser salva no banco.

4. **Criação do usuário:**
   - O usuário é criado na tabela `Users` do banco PostgreSQL, usando Prisma ORM.
   - Campos opcionais como `age_user` e `hiring_date` podem ser enviados.

5. **Resposta:**
   - Se tudo ocorrer bem, retorna 201 e `{ success: true }`.

## Fluxo de Listagem de Horários e Barbeiros

O endpoint `/hours` permite consultar os horários disponíveis para agendamento em uma data específica, além de listar os barbeiros, suas especialidades e horários já ocupados.

### Regras e Fluxo

1. **Autenticação obrigatória:**
   - O usuário deve enviar um token JWT válido no header `Authorization`.
2. **Envio da data:**
   - O parâmetro `date` (formato `YYYY-MM-DD`) deve ser enviado via query string.
   - Se não enviar a data, retorna 400.
3. **Consulta de barbeiros:**
   - O sistema busca todos os barbeiros cadastrados.
   - Se não houver barbeiros, retorna `{ success: false, message: 'Sem dados' }`.
4. **Montagem dos horários:**
   - Para cada horário padrão do dia, verifica se todos os barbeiros estão ocupados naquele horário.
   - O campo `selected` será `true` se todos os barbeiros estiverem ocupados, e `false` se pelo menos um barbeiro estiver livre.
5. **Montagem dos barbeiros:**
   - Para cada barbeiro, retorna nome, email, especialidades e horários já marcados.
6. **Resposta:**
   - Se houver dados, retorna `{ success: true, hours, barbers }`.
   - Se não houver barbeiros, retorna `{ success: false, message: 'Sem dados' }`.


## Testes Automatizados

Os testes de registro de usuário garantem que:
  - O cadastro funciona corretamente.
  - Não é possível cadastrar com campos obrigatórios faltando.
  - Não é possível cadastrar com tipo inválido.
  - Não é possível cadastrar e-mail duplicado.
  - O banco é limpo antes de cada teste para evitar conflitos.



### Fluxo de Autorização e Listagem de Clientes

### Regras de Autorização

O endpoint de listagem de clientes (`GET /users/clients`) é protegido por autenticação JWT e autorização de papel (role). Apenas usuários autenticados com papel `admin` ou `barber` podem acessar este recurso.

- O token JWT deve ser enviado no header `Authorization` no formato: `Bearer <token>`.
- O middleware valida o token e extrai o papel do usuário (`role`).
- Se o papel for `admin` ou `barber`, o acesso é permitido. Caso contrário, retorna 403.

## Fluxo de Criação de Agendamento (Appointment)

O endpoint `/appointments` permite que um cliente agende um horário com um barbeiro para uma especialidade específica.

### Regras e Fluxo

1. **Autenticação obrigatória:**
   - O usuário deve enviar um token JWT válido no header `Authorization`.
2. **Apenas clientes podem agendar:**
   - O usuário autenticado deve ter o papel `client`.
3. **Campos obrigatórios:**
   - `date`, `hour`, `email_barber`, `email_client`, `speciality`.
4. **Data não pode ser retroativa:**
   - Não é permitido agendar para datas/horários no passado.
5. **Barbeiro e cliente devem existir:**
   - O sistema verifica se ambos existem e têm os papéis corretos.
6. **Especialidade deve existir e ser do barbeiro:**
   - O barbeiro deve possuir a especialidade informada.
7. **Horário deve estar livre para o barbeiro:**
   - Não pode haver outro agendamento para o barbeiro no mesmo horário.
8. **Resposta:**
   - Se tudo estiver correto, retorna `{ success: true }` e status 201.
   - Se houver qualquer conflito ou erro de validação, retorna `{ success: false, message: <motivo> }` e status 400.


# Api Endpoints

1. O usuário faz login e recebe um token JWT.
2. O token é enviado no header Authorization para acessar `/users/clients`.
3. O backend valida o token e o papel do usuário.
4. Se autorizado, retorna a lista de clientes cadastrados.
5. O campo `id_user` é retornado como string para evitar problemas de serialização.

---
### GET /users/clients

**Descrição:** Retorna a lista de usuários do tipo `client`. Apenas para usuários autenticados com papel `admin` ou `barber`.

**Headers:**
- Authorization: Bearer `<jwt_token>`

**Respostas:**
- 200:
  ```json
  [
    {
      "id_user": "1",
      "name_user": "Cliente 1",
      "email_user": "cliente1@exemplo.com",
      "age_user": 25,
      "created_at": "2025-07-22T00:00:00.000Z"
    },
    // ...
  ]
  ```
- 401: `{ "error": "Token inválido ou ausente" }`
- 403: `{ "error": "Acesso negado" }`
- 500: `{ "error": "Erro ao buscar clientes", "details": "..." }`

**Exemplo de uso com curl:**
```bash
curl -H "Authorization: Bearer <jwt_token>" http://localhost:3000/users/clients
```
---
### GET /appointments/list

**Descrição:** Lista agendamentos conforme o papel do usuário autenticado. O retorno e os filtros variam para client, barber e admin.

**Headers:**
- Authorization: Bearer `<jwt_token>`

**Query Params:**
- `date` (obrigatório para barber e admin): Data no formato `YYYY-MM-DD`.
- `email_user` (opcional, apenas para admin): E-mail do cliente ou barbeiro para filtrar os agendamentos.

**Regras e Fluxo:**
1. **Autenticação obrigatória:**
   - O usuário deve enviar um token JWT válido no header `Authorization`.
2. **Acesso por papel:**
   - `client`: lista apenas seus próprios agendamentos (não precisa enviar `date`).
   - `barber`: lista seus agendamentos do dia informado em `date` (obrigatório).
   - `admin`: lista todos os agendamentos do dia informado em `date` (obrigatório), podendo filtrar por `email_user` (cliente ou barbeiro).
3. **Restrições:**
   - Se não houver agendamentos, retorna `{ success: false, message: 'Sem dados' }`.
   - Se faltar parâmetro obrigatório, retorna 400 com mensagem adequada.
   - Se papel não for permitido, retorna 403.
4. **Formato do retorno:**
   - Cada agendamento traz: `date`, `hour`, `barber` (nome, email), `client` (nome, email), `speciality` (array).

**Respostas:**
- 200 (com dados):
  ```json
  {
    "success": true,
    "appointments": [
      {
        "date": "2025-07-23",
        "hour": "10:00",
        "barber": { "name": "Barber", "email": "barber@teste.com" },
        "speciality": ["Corte"],
        "client": { "name": "Client", "email": "client@teste.com" }
      }
    ]
  }
  ```
- 200 (sem dados): `{ "success": false, "message": "Sem dados" }`
- 400: `{ "success": false, "message": "<motivo>" }`
- 401: `{ "error": "Token inválido ou ausente" }`
- 403: `{ "success": false, "message": "Acesso negado" }`
- 500: `{ "success": false, "message": "Erro ao buscar agendamentos", "details": "..." }`

**Exemplo de uso com curl:**
Para cliente:
```bash
curl -H "Authorization: Bearer <jwt_token>" http://localhost:3000/appointments/list
```
Para barbeiro:
```bash
curl -H "Authorization: Bearer <jwt_token>" "http://localhost:3000/appointments/list?date=2025-07-23"
```
Para admin (todos do dia):
```bash
curl -H "Authorization: Bearer <jwt_token>" "http://localhost:3000/appointments/list?date=2025-07-23"
```
Para admin filtrando por e-mail:
```bash
curl -H "Authorization: Bearer <jwt_token>" "http://localhost:3000/appointments/list?date=2025-07-23&email_user=client@teste.com"
```

---

### POST /users/register

**Descrição:** Registra um novo usuário (cliente ou barbeiro).

**Body JSON:**
```
{
  "name_user": "Nome do Usuário",
  "email_user": "email@exemplo.com",
  "pass_user": "senha123",
  "type_user": "client" // ou "barber"
  // "age_user": 25, // opcional
  // "hiring_date": "2025-07-22T00:00:00.000Z" // opcional
}
```

**Respostas:**
- 201: `{ "success": true }`
- 400: `{ "error": "Parâmetros obrigatórios ausentes" }`
- 400: `{ "error": "Tipo de usuário inválido" }`
- 400: `{ "error": "E-mail já cadastrado" }`

---

### POST /users/login

**Descrição:** Realiza o login do usuário e retorna um token JWT e dados do usuário.

**Body JSON:**
```
{
  "email": "email@exemplo.com",
  "pass": "senha123"
}
```

**Respostas:**
- 200: 
  ```json
  {
    "success": true,
    "token": "<jwt_token>",
    "user": {
      "name": "Nome do Usuário",
      "email": "email@exemplo.com",
      "role": "client" // ou "barber"
    }
  }
  ```
- 400: 
  ```json
  {
    "success": false,
    "message": "Dados invalidos"
  }
  ```


### GET /hours

**Descrição:** Lista horários disponíveis para agendamento e barbeiros, para uma data específica.

**Headers:**
- Authorization: Bearer `<jwt_token>`

**Query Params:**
- `date` (obrigatório): Data no formato `YYYY-MM-DD`.

**Respostas:**
- 200 (com dados):
  ```json
  {
    "success": true,
    "hours": [
      { "hour": "09:00", "selected": false },
      { "hour": "10:00", "selected": true }
    ],
    "barbers": [
      {
        "name": "Barber",
        "email": "barber@teste.com",
        "specialities": ["Corte", "Barba"],
        "appointments": ["09:00", "10:00"]
      }
    ]
  }
  ```
- 200 (sem barbeiros): `{ "success": false, "message": "Sem dados" }`
- 400: `{ "success": false, "message": "Data obrigatória" }`
- 401: `{ "error": "Token inválido ou ausente" }`

**Exemplo de uso com curl:**
```bash
curl -H "Authorization: Bearer <jwt_token>" "http://localhost:3000/hours?date=2025-07-22"
```

---
### POST /appointments

**Descrição:** Cria um novo agendamento entre cliente e barbeiro para uma especialidade.

**Headers:**
- Authorization: Bearer `<jwt_token>`

**Body JSON:**
```
{
  "date": "2025-07-23",
  "hour": "10:00",
  "email_barber": "barber@teste.com",
  "email_client": "client@teste.com",
  "speciality": "Corte"
}
```

**Respostas:**
- 201: `{ "success": true }`
- 400: `{ "success": false, "message": "<motivo>" }`
- 401: `{ "error": "Token inválido ou ausente" }`
- 500: `{ "success": false, "message": "Erro ao criar agendamento", "details": "..." }`

**Exemplo de uso com curl:**
```bash
curl -X POST -H "Authorization: Bearer <jwt_token>" -H "Content-Type: application/json" \
  -d '{"date":"2025-07-23","hour":"10:00","email_barber":"barber@teste.com","email_client":"client@teste.com","speciality":"Corte"}' \
  http://localhost:3000/appointments
```
### POST /appointments/cancel

**Descrição:** Cancela um agendamento existente. Apenas o cliente do agendamento ou um admin podem cancelar.

**Headers:**
- Authorization: Bearer `<jwt_token>`

**Body JSON:**
```
{
  "date": "2025-07-23",
  "hour": "10:00",
  "email_barber": "barber@teste.com",
  "email_client": "client@teste.com"
}
```

**Regras e Fluxo:**
1. **Autenticação obrigatória:**
   - O usuário deve enviar um token JWT válido no header `Authorization`.
2. **Apenas cliente do agendamento ou admin podem cancelar:**
   - O cliente autenticado só pode cancelar seus próprios agendamentos.
   - Admin pode cancelar qualquer agendamento.
3. **Campos obrigatórios:**
   - `date`, `hour`, `email_barber`, `email_client`.
4. **Busca e validação:**
   - O sistema busca o agendamento ativo (não cancelado) com os dados informados.
   - Se não encontrar, retorna 404.
   - Se não for o cliente do agendamento ou admin, retorna 403.
5. **Cancelamento:**
   - O campo `canceled_at` do agendamento é preenchido com a data/hora atual.
6. **Resposta:**
   - Se tudo estiver correto, retorna `{ success: true }` e status 200.
   - Se houver qualquer conflito ou erro de validação, retorna `{ success: false, message: <motivo> }` e status adequado.

**Respostas:**
- 200: `{ "success": true }`
- 400: `{ "success": false, "message": "Campos obrigatórios ausentes" }`
- 403: `{ "success": false, "message": "Apenas o cliente do agendamento ou admin pode cancelar" }`
- 404: `{ "success": false, "message": "Agendamento não encontrado ou já cancelado" }`
- 500: `{ "success": false, "message": "Erro ao cancelar agendamento", "details": "..." }`

**Exemplo de uso com curl:**
```bash
curl -X POST -H "Authorization: Bearer <jwt_token>" -H "Content-Type: application/json" \
  -d '{"date":"2025-07-23","hour":"10:00","email_barber":"barber@teste.com","email_client":"client@teste.com"}' \
  http://localhost:3000/appointments/cancel
```

---

*Desenvolvido por Paulo Kuster*

