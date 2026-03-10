# DevFolio — Professional Portfolio Builder

A dynamic web application that enables users to create and customize professional portfolios with real-time previews, drag-and-drop section management, and one-click publishing.

## Tech Stack

**Frontend:** React.js, Tailwind CSS, Framer Motion, dnd-kit, Vite

**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication

**Deployment:** Vercel (serverless)

## Features

- **Drag-and-Drop Builder** — Intuitively arrange portfolio sections with smooth reordering. No code required.
- **Real-Time Preview** — See changes reflected instantly as you edit content, colors, and layout.
- **Modular Sections** — Hero, About, Skills, Projects, Experience, Education, and Contact sections.
- **Custom Themes** — Full control over colors and typography to match your personal brand.
- **One-Click Publish** — Generate a shareable public URL instantly for your portfolio.
- **Secure Authentication** — JWT-based login and registration with encrypted passwords.
- **Responsive Design** — Fully optimized for desktop, tablet, and mobile devices.

## Project Structure

```
Portfolio Builder/
  client/                   React frontend (Vite)
    src/
      components/           Reusable UI components
        Builder/            Drag-and-drop builder components
        Preview/            Live portfolio preview
      context/              Auth and Portfolio state management
      pages/                Route-level page components
      utils/                API client configuration
  server/                   Express.js backend
    api/                    Serverless entry point
    middleware/             JWT auth middleware
    models/                 Mongoose schemas (User, Portfolio)
    routes/                 REST API routes (auth, portfolio)
```

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier) or local MongoDB instance

### Setup

1. **Clone the repository**

```bash
git clone https://github.com/your-username/portfolio-builder.git
cd portfolio-builder
```

2. **Configure the server**

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio-builder?retryWrites=true&w=majority
JWT_SECRET=your_secret_key_here
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

3. **Configure the client**

```bash
cd ../client
npm install
```

4. **Run locally**

Start the server:

```bash
cd server
npm run dev
```

Start the client (in a separate terminal):

```bash
cd client
npm run dev
```

The app will be available at `http://localhost:5173`.

## API Endpoints

| Method | Endpoint                   | Description              | Auth |
|--------|----------------------------|--------------------------|------|
| POST   | /api/auth/register         | Create new account       | No   |
| POST   | /api/auth/login            | Login                    | No   |
| GET    | /api/auth/me               | Get current user         | Yes  |
| GET    | /api/portfolios            | List user portfolios     | Yes  |
| POST   | /api/portfolios            | Create new portfolio     | Yes  |
| GET    | /api/portfolios/:id        | Get portfolio by ID      | Yes  |
| PUT    | /api/portfolios/:id        | Update portfolio         | Yes  |
| DELETE | /api/portfolios/:id        | Delete portfolio         | Yes  |
| GET    | /api/portfolios/public/:slug | View published portfolio | No   |

## Deployment

Both `client` and `server` are configured for Vercel deployment.

**Server:** Set Root Directory to `server` and add environment variables (MONGODB_URI, JWT_SECRET, CLIENT_URL, NODE_ENV).

**Client:** Set Root Directory to `client` and add `VITE_API_URL` pointing to your deployed server URL.

## License

MIT
