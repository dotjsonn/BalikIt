# BalikIt 

BalikIt is a lost-and-found app. This backend handles accounts, login, and item posts.

Built with Node.js, TypeScript, Express, and MongoDB/Mongoose.

## Run

Copy `.env.example` to `.env`. Set `MONGODB_URI`, `JWT_SECRET`, and `PORT` (for example, `3002`).

```bash
npm install
npm run dev
```

To build and run:

```bash
npm run build
npm start
```

## Endpoints

Example base URL: `http://localhost:3002`. Send request bodies as JSON.

| Method | Endpoint | Purpose | Access |
| --- | --- | --- | --- |
| GET | `/health-check` | Server status | Public |
| POST | `/api/auth/register` | Register | Public |
| POST | `/api/auth/login` | Log in | Public |
| GET | `/api/auth/me` | Current user | Login |
| POST | `/api/auth/logout` | Log out | Public |
| GET | `/api/posts` | List posts, newest first | Public |
| POST | `/api/posts` | Create a post | Login |
| DELETE | `/api/posts/:id` | Delete a post | Post owner |

Login uses an HTTP-only `token` cookie. Send this cookie for protected routes. The JWT expires after 15 minutes.

## Request Fields

- **Register:** `name`, `username`, `password`.
- **Login:** `username`, `password`.
- **Create post:** `title`, `type`, `location`, `description`, `contact`.

All listed fields are required. Post `type` must be `lost` or `found`. The backend sets the owner and timestamps.
