# Finmid Challenge

In this repository you can find the following challanges:
- [Fullstack challange](/Fullstack.md)
- [Frontend challange](/Frontend.md)

## Submission

Clone this repository, and create a private repo with your submission. Then please add the users: [@TheHatSky](https://github.com/TheHatSky) and [@n1tsi](https://github.com/n1tsi). We will do our best to look into your code as soon as possible, but if for some reason we don't get back to you, please send us an email.

# The API

The API contains a few endpoints that you'll need to use:

- `POST /login`
- `GET /users`
- `GET /smes`
- `GET /transactions`

We have a Swagger UI available and runs alongside the API at `http://localhost:3000/docs`.

## Packages

| Package name | Description                                               | Available at          | Swagger Docs               |
| ------------ | --------------------------------------------------------- | --------------------- | -------------------------- |
| api          | Simple Express.js API                                     | http://localhost:3000 | http://localhost:3000/docs |
| client       | React application, bootstrapped using Vite.js             | http://localhost:3300 | N/A                        |
| lib-common   | Common types shared by the API and potentially the client | N/A                   | N/A                        |

## Mock data and run the services

### `pnpm run create-data`

The data for the API is stored in `packages/api/src/data`, in the form of `json` files. Run this command before the other ones, to generate the data and get started with the API.

```
$ pnpm run create-data

✨ Created Users: packages/api/src/data/users.json
   Users and passwords:
      gandalf.the.grey@test.com / 123code
      frodo.baggins@test.com / 123code
      gollum@test.com / 123code
✨ Created SMEs: packages/api/src/data/smes.json
✨ Created Transactions: packages/api/src/data/transactions.json
```

### `pnpm run start`

Serves the React application using Vite.

### `pnpm run backend`

Starts the Node API.
