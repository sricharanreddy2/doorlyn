# Doorlyn 🚀
> **AI-Powered Unified Service Platform**

Doorlyn is a comprehensive, multi-service platform designed to streamline everyday needs—ranging from **healthcare & doctor visits** to **home repairs, daily chores, and grocery deliveries**—all within a single app. Featuring an intelligent **Multilingual AI Voice Assistant** and **Real Cloud Telephony (Twilio IVR Integration)**, Doorlyn makes service discovery, scheduling, and tracking seamless for all users, including those who prefer voice interactions in local Indian languages.

---

## 🌟 Key Features

### 1. 🤖 Multilingual AI Voice & Text Assistant
- **Voice & Text Capabilities**: Interactive conversational AI powered by **Anuvadini AI** and Web Speech API.
- **Intent Recognition & Action Dispatch**: Understands user requests (e.g., *"Book a doctor for tomorrow"*, *"I need an electrician"*, *"Show my health records"*) and automatically populates booking workflows or navigates to relevant views.
- **Multilingual Support**: Supports English, Hindi, Telugu, Tamil, Kannada, and more.

### 2. 🏥 Unified Service Directory & Grocery Store
- **Healthcare Services**: Book home doctor visits, lab tests, nursing care, and digital consultations.
- **Home & Repair Services**: Electricians, plumbers, AC technicians, home cleaning, and carpenting.
- **Grocery & Daily Essentials**: Built-in cart system for ordering fresh produce and household items.

### 3. 📞 Cloud Telephony & IVR Integration
- **Twilio IVR System**: Integrated Express server handling real-time IVR calls for booking services over the phone.
- **Interactive Voice Response**: Voice prompts for selecting services, scheduling time slots, and receiving SMS confirmations.

### 4. 📍 Live Order & Service Tracking
- **Real-Time Status Updates**: Track active bookings from *Confirmed* → *Provider Assigned* → *In Transit* → *Completed*.
- **Interactive Provider Info**: View assigned provider details, contact options, and live ETA tracking.

### 5. 📁 Digital Health Records Vault
- Upload, organize, and view prescriptions, diagnostic reports, and medical histories safely.

### 6. 🔐 Supabase Authentication & Real-time Database
- Secure user authentication (Email/Password, Session Management).
- PostgreSQL database powering profiles, bookings, categories, and provider data.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4, Lucide Icons, Framer Motion
- **State Management**: React Context API (`AuthContext`, `BookingContext`, `CartContext`, `LanguageContext`)
- **Effects & UI**: Canvas Confetti

### Backend & Database
- **Server**: Node.js + Express 5
- **Database & Auth**: Supabase (`@supabase/supabase-js`)
- **Telephony**: Twilio SDK & TwiML
- **AI & Speech**: Anuvadini AI API & Web Speech API (SpeechRecognition & SpeechSynthesis)

---

## 📁 Project Structure

```
doorlyn/
├── server/                   # Express backend server for Twilio IVR & Webhooks
│   └── index.js              # Express routes, Twilio TwiML voice responses, SMS dispatch
├── src/
│   ├── assets/               # Static assets & images
│   ├── components/           # Reusable UI components & Modals
│   │   ├── ai/               # AI Assistant components (VoiceStatus, ProviderCard, etc.)
│   │   ├── Navbar.jsx        # Global navigation header
│   │   ├── BottomNav.jsx     # Mobile navigation bar
│   │   ├── BookingModal.jsx  # Service booking & checkout modal
│   │   ├── LiveTrackingModal.jsx # Real-time provider tracking modal
│   │   ├── IVRSModal.jsx     # Cloud Telephony simulation modal
│   │   └── HealthRecordModal.jsx # Health records management modal
│   ├── context/              # Context providers (Auth, Booking, Cart, Language)
│   ├── data/                 # Static fallback datasets & translations
│   ├── lib/                  # Supabase client initialization
│   ├── services/             # AI provider service, knowledge base, tool handlers
│   ├── utils/                # Anuvadini AI integration & search helpers
│   ├── views/                # Top-level screen views (Home, Assistant, Bookings, Profile, Grocery, Auth)
│   ├── App.jsx               # Main application component
│   └── main.jsx              # Application entry point
├── supabase_schema.sql       # Database table schemas, policies & sample data
├── .env.example              # Environment variables template
├── package.json              # Project dependencies and scripts
└── vite.config.js            # Vite configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher)
- **Supabase Account** (for authentication & database)
- **Twilio Account** *(optional, for live IVR call testing)*

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/sricharanreddy2/doorlyn.git
   cd doorlyn
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Copy the example environment file and fill in your Supabase and Twilio credentials:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   # Twilio Configuration
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number

   # Anuvadini AI Configuration
   ANUVADINI_API_KEY=your_anuvadini_api_key

   # Supabase Configuration
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

   # Server Port
   PORT=3000
   ```

4. **Initialize Database**:
   Execute the contents of `supabase_schema.sql` in your Supabase project's SQL Editor to set up tables (`profiles`, `services`, `bookings`, `health_records`, etc.).

---

## 💻 Running the Application

### Option 1: Run Frontend & Backend Simultaneously (Recommended)
```bash
npm run start:all
```

### Option 2: Run Separately

- **Run Frontend Only**:
  ```bash
  npm run dev
  ```
  App will be available at `http://localhost:5173`.

- **Run Express Backend Server Only**:
  ```bash
  npm run server
  ```
  Server will run at `http://localhost:3000`.

---

## 📜 Available Scripts

| Script | Command | Description |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts Vite development server for frontend |
| `npm run server` | `node server/index.js` | Starts Express server for Twilio IVR webhooks |
| `npm run start:all` | `concurrently ...` | Runs both Vite frontend and Express server concurrently |
| `npm run build` | `vite build` | Builds production bundle |
| `npm run lint` | `oxlint` | Lints codebase using Oxlint |

---

## 📡 Express & Twilio Endpoints

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/twilio/voice` | `POST` | TwiML webhook triggered when a user calls the Doorlyn Twilio phone number |
| `/api/twilio/gather-intent` | `POST` | Processes voice keypresses or speech inputs during IVR call |
| `/api/twilio/confirm-booking` | `POST` | Finalizes IVR booking and sends SMS confirmation |
| `/api/twilio/trigger-call` | `POST` | Triggers an outbound IVR call to a user's phone number |

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request or open an Issue for bug reports or feature requests.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
