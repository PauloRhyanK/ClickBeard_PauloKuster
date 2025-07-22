# ClickBeard 💈
Sistema de Agendamento para Barbearia – Desenvolvido por PauloKuster

## Sobre o Projeto
O ClickBeard é um sistema completo de agendamento para barbearias, desenvolvido com Next.js 15 e TypeScript. O sistema permite o gerenciamento de agendamentos entre clientes, barbeiros e administradores.

## Como Executar

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

## Database Schema

Baseado no arquivo [`init.sql`](init.sql), o sistema utiliza as seguintes tabelas:

- **Users** - Dados dos usuários (clientes, barbeiros, admin)
- **Specialties** - Especialidades disponíveis
- **Barber_Specialities** - Relacionamento barbeiro-especialidades
- **Appointments** - Agendamentos realizados

![Schema do Banco](docs/ClickBeard_db.png)
*Diagrama Entidade-Relacionamento inicial do banco*

## Prótótipo do projeto
Antes do desenvolvimento, reaproveitei um pouco de outro projeto para fazer o protótipo, que ainda passou por mudanças no decorrer do dsenolvimento.
[Figma inicial do projeto](https://www.figma.com/design/MeEWysFF3gDhvoC6Y64aQp/ClickBeard?node-id=0-1&t=ns7VfXsjm1uEo4Y-1)


## Arquitetura do Frontend

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



## Funcionalidades

-  Autenticação JWT
-  Cadastro de usuários (Cliente/Barbeiro)
-  Agendamento de horários
-  Filtros dinâmicos de barbeiros e especialidades
-  Histórico de agendamentos
-  Interface responsiva
-  Validação de formulários
-  Gerenciamento de estado local

---

*Desenvolvido por Paulo Kuster*