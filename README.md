# Doorlyn

Doorlyn is an AI-powered unified service platform designed to make everyday services simple, accessible, and convenient. Instead of using multiple apps for different needs, users can discover, book, manage, and pay for various services through a single platform with an AI conversational assistant.

## Features & Highlights

- **Unified Services**: Booking healthcare, local home services, groceries, and daily utility assistance in one app.
- **AI Voice & Text Assistant**: Multilingual support powered by Anuvadini AI & custom tools for natural interaction.
- **Real Cloud Telephony**: Twilio IVR integration for phone-based bookings.
- **Supabase Backend**: Database and real-time backend functionality.

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sricharanreddy2/doorlyn.git
   cd doorlyn
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

4. **Run the Development Server**:
   - Frontend: `npm run dev`
   - Express Backend Server: `npm start` (or `node server/index.js`)

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide React
- **Backend / DB**: Node.js, Express, Supabase
- **AI & Speech**: Anuvadini AI, Web Speech API, Twilio Voice IVR
