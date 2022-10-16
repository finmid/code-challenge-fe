# Auth Service

This is a mock authentication service that uses Json Web Tokens (JWT). It will check `auth.json` and see if the user can login or not. To run:

```
$ pnpm run dev
```

It will listen on `localhost:3000`.

## Token Structure

The JWT payload will have this structure:

```json
{
  "userData": {
    "id": "b3f271ef-e73b-4c12-ad85-665c3686017a",
    "smeId": "6fa0ea41-9249-43d5-8479-81af6a55b946",
    "name": "Gandalf the Grey",
    "email": "gandalf.the.grey@test.com",
    "profileImage": "http://localhost:3000/static/gandalf.png"
  },
  "iat": 1665919770,
  "exp": 1665923370
}
```

## Logging in

`POST /login`

```json
{
  "email": "gandalf.the.grey@test.com",
  "password": "123code"
}
```

Responses:

```json
// 403

{
  "message": "Incorrect login or password"
}
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVC...mdC8vCbRAxYYa-IupLqomZ8h_YqRPGJcFw7L4" // the JWT
}
```
