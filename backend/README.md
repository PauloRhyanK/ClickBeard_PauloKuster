
# ClickBeard Backend

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

## Testes Automatizados

Os testes de registro de usuário garantem que:
  - O cadastro funciona corretamente.
  - Não é possível cadastrar com campos obrigatórios faltando.
  - Não é possível cadastrar com tipo inválido.
  - Não é possível cadastrar e-mail duplicado.
  - O banco é limpo antes de cada teste para evitar conflitos.



## Fluxo de Autorização e Listagem de Clientes

### Regras de Autorização

O endpoint de listagem de clientes (`GET /users/clients`) é protegido por autenticação JWT e autorização de papel (role). Apenas usuários autenticados com papel `admin` ou `barber` podem acessar este recurso.

- O token JWT deve ser enviado no header `Authorization` no formato: `Bearer <token>`.
- O middleware valida o token e extrai o papel do usuário (`role`).
- Se o papel for `admin` ou `barber`, o acesso é permitido. Caso contrário, retorna 403.

### Fluxo do Endpoint

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