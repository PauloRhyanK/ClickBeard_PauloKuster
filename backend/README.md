
# ClickBeard Backend

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

## Endpoints de Usuário

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