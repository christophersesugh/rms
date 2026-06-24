# Abutu

> An intelligent venue and workspace reservation system with AI-powered assistance.

Abutu is a modern full-stack web application that lets users browse, book, and manage event venues and coworking spaces. An integrated AI chatbot helps users find availability and make reservations through natural conversation.

Built with Next.js 16, React 19, Prisma 7, Tailwind CSS 4, and the Vercel AI SDK.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript 5 |
| **UI** | React 19, Tailwind CSS 4, shadcn/ui |
| **Database** | SQLite (via Turso/libsql + Prisma) |
| **Authentication** | NextAuth 5 (Credentials, JWT) |
| **AI** | Vercel AI SDK (OpenAI GPT-4o) |
| **Validation** | Zod 4 |
| **Charts** | Recharts |

## Features

- **User Authentication** — Register, login, and JWT-based session management
- **Browse Venues** — View event spaces with capacity, location, and pricing
- **Browse Workspaces** — Explore coworking spots with type, capacity, and pricing
- **Reservation Management** — Book, view, and cancel reservations
- **AI Chat Assistant** — Conversational booking assistant powered by OpenAI
- **Admin Dashboard** — System-wide statistics and management overview
- **Dark/Light Mode** — Full theme support with glassmorphism UI

## Project Structure

```
src/
├── app/
│   ├── (auth)/login/page.tsx       # Login page
│   ├── (auth)/register/page.tsx    # Registration page
│   ├── (dashboard)/
│   │   ├── dashboard/page.tsx      # User dashboard
│   │   ├── venues/page.tsx         # Browse venues
│   │   ├── workspaces/page.tsx     # Browse workspaces
│   │   ├── reservations/page.tsx   # My reservations
│   │   ├── admin/page.tsx          # Admin panel
│   │   └── not-found.tsx           # 404 page
│   ├── api/                        # API route handlers
│   └── page.tsx                    # Landing page
├── components/
│   ├── chat-widget.tsx             # AI chat assistant
│   └── ui/                         # shadcn/ui components
└── lib/
    ├── utils.ts                    # Utility functions
    └── validations.ts              # Zod validation schemas
```

## Diagrams

System design diagrams are available in `docs/diagrams/`:

| Diagram | File |
|---|---|
| System Architecture | [`docs/diagrams/system-architecture-diagram.md`](docs/diagrams/system-architecture-diagram.md) |
| ER Diagram | [`docs/diagrams/er-diagram.md`](docs/diagrams/er-diagram.md) |
| Use Case Diagram | [`docs/diagrams/use-case-diagram.md`](docs/diagrams/use-case-diagram.md) |
| Level 1 DFD | [`docs/diagrams/level-1-dfd.md`](docs/diagrams/level-1-dfd.md) |
| Reservation Flowchart | [`docs/diagrams/reservation-flowchart.md`](docs/diagrams/reservation-flowchart.md) |
| AI Agent Workflow | [`docs/diagrams/ai-agent-workflow.md`](docs/diagrams/ai-agent-workflow.md) |

## Prerequisites

- **Node.js** 20+
- **pnpm** (recommended) or npm
- **OpenAI API key** (for AI chat feature)

## Getting Started

```bash
# 1. Clone the repository
git clone <repo-url> && cd rms

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and OPENAI_API_KEY

# 4. Generate Prisma client and seed the database
pnpm prisma generate
pnpm prisma db seed

# 5. Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Default Test Account

After seeding, you can log in with:

- **Email:** `admin@reservesync.app`
- **Password:** `password123`

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm prisma generate` | Generate Prisma client |
| `pnpm prisma db seed` | Seed database with sample data |

## Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite database URL (e.g., `file:./dev.db`) |
| `DATABASE_AUTH_TOKEN` | Auth token for Turso (optional for local dev) |
| `NEXTAUTH_SECRET` | Secret for JWT encryption |
| `NEXTAUTH_URL` | Application URL (defaults to `http://localhost:3000`) |
| `OPENAI_API_KEY` | OpenAI API key for AI chat |

## License

MIT
