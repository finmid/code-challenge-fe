# Auth Service

This is a mock authentication service that uses JWT tokens. It will check `auth.json` and see if the user can login or not. To run:

```
$ pnpm run dev
```

It will listen on `localhost:3000`.

## Token Structure

The JWT token payload will have this structure:

```json
{
  "userData": {
    "id": "b3f271ef-e73b-4c12-ad85-665c3686017a",
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
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyRGF0YSI6eyJpZCI6ImIzZjI3MWVmLWU3M2ItNGMxMi1hZDg1LTY2NWMzNjg2MDE3YSIsIm5hbWUiOiJHYW5kYWxmIHRoZSBHcmV5IiwiZW1haWwiOiJnYW5kYWxmLnRoZS5ncmV5QHRlc3QuY29tIiwicHJvZmlsZUltYWdlIjoiaHR0cDovL2xvY2FsaG9zdDozMDAwL3N0YXRpYy9nYW5kYWxmLnBuZyJ9LCJpYXQiOjE2NjU5MTk3NzAsImV4cCI6MTY2NTkyMzM3MH0.F_lz8fmdC8vCbRAxYYa-IupLqomZ8h_YqRPGJcFw7L4"
}
```
