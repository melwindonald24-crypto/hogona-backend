# Hogona Backend

Hogona Backend is a Node.js REST API for authentication, user profiles, trip preferences, and hotel discovery. It uses MongoDB for application data, JWTs for short-lived access tokens, HTTP-only cookies for refresh sessions, and SerpApi for hotel search results.

## Features

- User registration with bcrypt-hashed passwords
- Login with a 15-minute JWT access token
- Database-backed refresh-token sessions
- Logout and refresh-token revocation
- Authenticated access to the current user's profile
- Authenticated lookup of another user's public profile
- Save trip preferences, including destination, dates, group size, and travel type
- Search hotels using the authenticated user's saved trip preferences

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
   SERP_API_KEY=your-serpapi-key
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
| `POST` | `/preferences` | Bearer token | Save the authenticated user's trip preferences. |
| `GET` | `/hotels` | Bearer token | Search hotels using the authenticated user's saved preferences. |

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

### Save trip preferences

```http
POST /preferences
Authorization: Bearer <access-token>
Content-Type: application/json

{
  "district": "Mysuru",
  "startDate": "2026-08-02",
  "endDate": "2026-08-04",
  "groupSize": 5,
  "travelType": "budget"
}
```

All fields are required. `groupSize` must be a number. `travelType` currently accepts `budget` or `luxuary` (the latter is the value currently defined by the API schema).

#### Date format requirement

Dates **must** use the ISO 8601 calendar-date format: `YYYY-MM-DD`.

```json
{
  "startDate": "2026-08-02",
  "endDate": "2026-08-04"
}
```

Do not send dates in `DD-MM-YYYY` format. For example, JavaScript interprets `"02-08-2026"` as 8 February 2026, rather than 2 August 2026. That can result in a past date being sent to the hotel provider and a `400 Bad Request` response stating that `check_in_date` cannot be in the past.

The check-in date must be today or later, and the check-out date must be after the check-in date.

### Search hotels

```http
GET /hotels
Authorization: Bearer <access-token>
```

This endpoint uses preferences stored through `POST /preferences` and queries SerpApi's Google Hotels engine. Save trip preferences before calling it. The API returns an array of normalized hotel results.

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
trip/
  controllers/                 Trip preference and hotel handlers
  models/trip.js               Trip schema
  routes/tripRoutes.js         Trip route definitions
  services/serpHotelServices.js SerpApi hotel search and result mapping
```

## Current implementation notes

- The refresh cookie uses `secure: true` and `sameSite: "none"`; browsers will retain it only over HTTPS. Adjust the cookie settings for local HTTP development if necessary.
- `refreshTokenService.generateToken` currently returns the created Mongoose document, rather than the random token string. This means the cookie value will not match the token lookup in `/refresh` or `/logout`. Store the document, then return its `refreshToken` string to resolve this.
- Login creates a `refreshToken` cookie, but logout clears `refreshtoken`. Cookie names are case-sensitive, so logout must clear `refreshToken` instead.
- Hotel search requires a valid `SERP_API_KEY`. SerpApi returns `400 Bad Request` when required search parameters are invalid, including when `check_in_date` is in the past.
- The third-party `crypto` package is installed but is not imported by the application. Node's built-in `crypto` module is used instead.

## Security

- Never commit `.env`, database credentials, private keys, or JWT secrets.
- Use a long random value for `ACCESS_TOKEN_SECRET`.
- Treat `SERP_API_KEY` as a secret and rotate it immediately if it is exposed in logs, screenshots, source code, or chat messages.
- Use HTTPS in production because refresh sessions are configured as secure cookies.
- Add request validation, rate limiting, CORS configuration, and tests before exposing the API publicly.
