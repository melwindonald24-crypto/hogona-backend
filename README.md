# Hogona Backend

Hogona Backend is a Node.js REST API for account authentication and user profiles. It uses MongoDB to store users and refresh-token sessions, JWTs for short-lived access tokens, and HTTP-only cookies for refresh sessions.

## Features

- User registration with bcrypt-hashed passwords
- Login with a 15-minute JWT access token
- Database-backed refresh-token sessions
- Logout and refresh-token revocation
- Authenticated access to the current user's profile
- Authenticated lookup of another user's public profile

## Tech stack

- Node.js with ES modules
- Express 5
- MongoDB and Mongoose
- bcrypt
- JSON Web Token (`HS256`)
- `cookie-parser` and `dotenv`

## Prerequisites

- Node.js 18 or later
- npm
- A MongoDB database (local or hosted)

## Installation and configuration

1. Install packages:

   ```bash
   npm install
   ```

2. Create `.env` in the project root:

   ```env
   PORT=3000
   MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/hogona
   ACCESS_TOKEN_SECRET=replace-this-with-a-long-random-secret
   ```

3. Start the API:

   ```bash
   node index.js
   ```

The application connects to MongoDB before starting the HTTP server. There is currently no `start`, `dev`, or automated-test script in `package.json`.

## Authentication

Send the access token returned from `/login` as a Bearer token for protected routes:

```http
Authorization: Bearer <access-token>
```

The access token expires after 15 minutes. The server also sets a `refreshToken` HTTP-only cookie intended to last 30 days. Requests to `/refresh` and `/logout` must include that cookie.

## API reference

All endpoints accept and return JSON unless noted otherwise. Routes currently have no common URL prefix.

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `POST` | `/register` | No | Create a user account. |
| `POST` | `/login` | No | Authenticate and receive an access token. |
| `GET` | `/refresh` | Refresh cookie | Create a new access token. |
| `POST` | `/logout` | Refresh cookie | Revoke the current refresh-token session. |
| `GET` | `/profile` | Bearer token | Get the authenticated user's profile. |
| `GET` | `/profile/:userId` | Bearer token | Get another user's public profile. |

### Register

```http
POST /register
Content-Type: application/json

{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "a-strong-password"
}
```

On success, the API responds with `201 Created`. Email addresses are stored in lowercase.

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "a-strong-password"
}
```

The success response contains:

```json
{
  "user": {
    "userId": "<mongo-object-id>",
    "name": "Ada Lovelace"
  },
  "accessToken": "<jwt>"
}
```

### Profile responses

`GET /profile` returns the signed-in user's name, creation date, and optional avatar URL:

```json
{
  "name": "Ada Lovelace",
  "createdAt": "2026-07-24T00:00:00.000Z",
  "avatar": null
}
```

`GET /profile/:userId` returns only the user's name and optional avatar URL. If a user cannot be found, the current implementation returns `null` with status `200`.

## Project structure

```text
index.js
Authentication/
  controller/                  Register, login, refresh, and logout handlers
  middleware/authMiddleware.js JWT Bearer-token validation
  models/RefreshToken.js       Refresh-token session schema
  router/                      Authentication route definitions
  services/                    Access- and refresh-token services
Users/
  controller/                  Current and public profile handlers
  models/User.js               User schema
  routes/profileRoutes.js      Profile route definitions
  services/                    Profile data retrieval
```

## Current implementation notes

- The refresh cookie uses `secure: true` and `sameSite: "none"`; browsers will retain it only over HTTPS. Adjust the cookie settings for local HTTP development if necessary.
- `refreshTokenService.generateToken` currently returns the created Mongoose document, rather than the random token string. This means the cookie value will not match the token lookup in `/refresh` or `/logout`. Store the document, then return its `refreshToken` string to resolve this.
- Login creates a `refreshToken` cookie, but logout clears `refreshtoken`. Cookie names are case-sensitive, so logout must clear `refreshToken` instead.
- The `axios` and third-party `crypto` packages are installed but are not imported by the application. Node's built-in `crypto` module is used instead.

## Security

- Never commit `.env`, database credentials, private keys, or JWT secrets.
- Use a long random value for `ACCESS_TOKEN_SECRET`.
- Use HTTPS in production because refresh sessions are configured as secure cookies.
- Add request validation, rate limiting, CORS configuration, and tests before exposing the API publicly.
