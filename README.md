# Hogona Backend

An Express and MongoDB backend for user authentication. It provides endpoints to register users, log in with email and password, issue a JWT access token, manage refresh-token sessions, and log out.

## Stack

- Node.js with ES modules
- Express 5
- MongoDB / Mongoose
- JSON Web Tokens
- bcrypt password hashing
- HTTP-only cookies for refresh sessions

## Prerequisites

- Node.js 18 or later
- A MongoDB database (local or hosted)

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root:

   ```env
   PORT=3000
   MONGO_CONNECTION_STRING=mongodb://127.0.0.1:27017/hogona
   ACCESS_TOKEN_SECRET=replace-with-a-long-random-secret
   ```

3. Start the server:

   ```bash
   node index.js
   ```

The server connects to MongoDB before listening on `PORT`.

## API

All routes accept JSON request bodies. No URL prefix is currently configured.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/register` | Create a user account |
| `POST` | `/login` | Authenticate and receive an access token |
| `POST` | `/refresh` | Issue a new access token from the refresh-session cookie |
| `POST` | `/logout` | Revoke the refresh session |

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

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "ada@example.com",
  "password": "a-strong-password"
}
```

On success, the intended response includes the user and a JWT access token. Access tokens use the `HS256` algorithm and expire after 15 minutes. The server also sets a `refreshToken` HTTP-only cookie intended to last 30 days.

## Project layout

```text
index.js                         Application entry point and MongoDB connection
Authentication/
  controller/                    Register, login, refresh, and logout handlers
  middleware/                    JWT authentication middleware
  models/                        Refresh-token session model
  router/                        Authentication route definitions
  services/                      Access- and refresh-token helpers
Users/models/User.js             User model
```

## Current implementation notes

- Cookies are configured with `secure: true` and `sameSite: "none"`, so browsers require HTTPS to retain the refresh cookie.
- The refresh-token service currently returns the newly created Mongoose document from `generateToken`, rather than the token string. As a result, the value written to the cookie will not match the value queried by `/refresh`; return the generated `refreshToken` string after storing it to make refresh work.
- `/logout` clears `refreshtoken`, while login sets `refreshToken`; cookie names must match for the browser cookie to be removed.
- `authMiddleware.js` reads `req.Headers` rather than `req.headers`, and stores the user ID on `res` instead of `req`. Correcting both is necessary before using it to protect routes.

## Scripts

The project currently has no automated test or development script. Start it with `node index.js`; add a `dev` script using `nodemon` if automatic restarts are desired.

## Security

Keep `.env` private, use a strong unique `ACCESS_TOKEN_SECRET`, and never commit database URLs or credentials.
