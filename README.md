# Eventify AI – Smart Celebration & Event Planner
> **PromptWars Virtual Challenge 05: Celebration & Event Planner**

Eventify AI is an intelligent, full-stack celebration planning platform designed to assist hosts and event planners in organizing weddings, birthdays, anniversaries, college festivals, corporate events, and community celebrations. Built with Google Gemini 3.8 Flash, React, Express, and MongoDB Mongoose.

---

## 1. Key Features

- **Gemini 3.8 Flash AI Event Planner:** Synthesizes complete structured celebration blueprints including:
  - Executive event overview & vibe strategy
  - Personalized theme inspirations & color palettes
  - Strict zero-over-budget category allocation (never exceeding total budget)
  - Visual preparation timeline with milestone countdowns
  - Food & catering menus (with veg/non-veg breakdown)
  - Vendor checklist with essential questions
  - Decoration and entertainment inspirations
  - Host precautions and pro tips
- **Interactive Budget Management:**
  - Real-time tracking of estimated vs actual expenses
  - Recharts interactive category pie charts and comparison bar charts
  - Add, edit, delete expense line items with payment settlement status
- **Smart Budget Optimizer (AI):**
  - Heuristic and Gemini audit of spending
  - Identifies 10–25% savings without compromising guest experience
  - Vendor negotiation playbook with actionable tactics
- **Vendor Management:**
  - Categories: Venue, Catering, Decoration, Photography, Music & DJ, Transportation
  - Track contact info, quotes, and booking lifecycle (Inquired, Quoted, Booked, Completed)
- **Task Checklist & Timeline:**
  - Filter by pending, completed, or priority
  - Confetti micro-interactions upon task completion
  - Progress percentage meter
- **Guest List & RSVP Manager:**
  - Track guest groups (Family, Friends, VIP, Colleagues), plus-ones, and dietary restrictions
  - Live RSVP attendance counts
- **AI Invitation Copywriter:**
  - Generate customized invitations across 5 tones (Royal & Grand, Modern & Elegant, Poetic Rhyme, Casual & Warm, Corporate)
  - Formats: WhatsApp ready (with emojis & formatting), Printed Card text, Concise SMS
- **Dedicated AI Event Assistant (Copilot):**
  - In-context conversational drawer answering questions about songs, itineraries, vendor queries, and menus
- **Export & Share Suite:**
  - Export full master plan to PDF using `jsPDF`
  - Shareable event link with one-click clipboard copy and WhatsApp integration
- **Dark Mode & Responsive UI:**
  - Tailored purple (#7C3AED) & pink (#EC4899) palette with persistent light/dark mode

---

## 2. Technology Stack

- **Frontend:**
  - React 19 with TypeScript
  - Tailwind CSS v4
  - Lucide React icons
  - React Router DOM v7
  - Recharts (Analytics and visual charts)
  - Canvas-confetti (celebratory interactions)
  - jsPDF (printable master plan export)
- **Backend:**
  - Node.js & Express.js
  - TypeScript (via `tsx`)
  - MongoDB with Mongoose Schema models (`User`, `Event`, `Expense`, `Task`, `Vendor`, `Guest`)
  - Resilient persistent store fallback ensuring zero runtime crashes
  - `@google/genai` SDK with `gemini-3.8-flash`
  - JSON Web Tokens (JWT) & `bcryptjs` password hashing

---

## 3. Project Structure

```
├── .env.example              # Environment variables template
├── index.html                # Entry HTML with meta tags and typography
├── metadata.json             # AI Studio applet configuration
├── package.json              # Project scripts and dependencies
├── server.ts                 # Full-stack Express server with Vite middleware
├── tsconfig.json             # TypeScript configuration
├── vite.config.ts            # Vite bundler configuration
│
├── server/
│   ├── db/
│   │   └── store.ts          # Resilient persistent storage & Mongoose connector
│   ├── middleware/
│   │   └── auth.ts           # JWT authentication middleware
│   ├── models/
│   │   ├── User.ts           # Mongoose User schema
│   │   ├── Event.ts          # Mongoose Event schema
│   │   ├── Expense.ts        # Mongoose Expense schema
│   │   ├── Task.ts           # Mongoose Task schema
│   │   ├── Vendor.ts         # Mongoose Vendor schema
│   │   ├── Guest.ts          # Mongoose Guest schema
│   │   └── index.ts          # Central model exports
│   ├── routes/
│   │   ├── auth.ts           # Register, login, demo login, me
│   │   └── events.ts         # Event CRUD, sub-resources, AI generators
│   ├── services/
│   │   └── gemini.ts         # Google Gemini 3.8 Flash AI service
│   └── types.ts              # Server TypeScript interfaces
│
└── src/
    ├── App.tsx               # Root application router
    ├── index.css             # Tailwind CSS & theme tokens
    ├── main.tsx              # React DOM mounting
    ├── components/
    │   ├── AuthModal.tsx             # Sign in, Sign up, Demo login modal
    │   ├── BudgetOptimizerModal.tsx  # Gemini budget optimizer
    │   ├── EventAssistantDrawer.tsx  # AI concierge drawer
    │   ├── Footer.tsx                # Footer with categories & metadata
    │   ├── InvitationWriterModal.tsx # Multi-tone invitation generator
    │   ├── LoadingSkeleton.tsx       # AI generation overlay & skeletons
    │   ├── Navbar.tsx                # Responsive navigation with dark mode
    │   ├── NotificationToast.tsx     # Toast notifications
    │   └── ShareModal.tsx            # Shareable event card & link copy
    ├── context/
    │   ├── AuthContext.tsx           # Authentication state provider
    │   └── ThemeContext.tsx          # Light/Dark mode state provider
    ├── pages/
    │   ├── LandingPage.tsx           # Hero, interactive calculator, features
    │   ├── DashboardPage.tsx         # User portfolio, deadlines, metrics
    │   ├── CreateEventPage.tsx       # AI event creation wizard
    │   └── EventDetailPage.tsx       # Tabbed master plan workspace
    ├── services/
    │   └── api.ts                    # Centralized client API service
    ├── types/
    │   └── index.ts                  # Shared frontend types
    └── utils/
        └── pdfGenerator.ts           # Publication-ready jsPDF exporter
```

---

## 4. Setup & Installation

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure Environment Variables
Create a `.env` file based on `.env.example`:
```env
# Gemini API Key (Required for AI generation)
GEMINI_API_KEY="your-gemini-api-key"

# App URL (automatically provided in Cloud Run/AI Studio)
APP_URL="http://localhost:3000"

# Optional MongoDB connection (app defaults to persistent file storage if MongoDB is offline)
MONGODB_URI="mongodb://localhost:27017/eventify"

# JWT Secret
JWT_SECRET="eventify-secret-jwt-key"

# Port
PORT=3000
```

### Step 3: Start the Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:3000`.

### Step 4: Build for Production
```bash
npm run build
npm start
```

---

## 5. Instant Demo Credentials

For quick evaluation without manual signup:
- **Click:** "Instant 1-Click Demo Login" on any sign-in prompt
- **Account:** Priya & Rahul Sharma
- **Preloaded Event:** The Royal Jaipur Wedding & Apex Tech Summit
- **Features Tested:** Recharts analytics, 100% budget adherence, PDF download, and AI chat.
