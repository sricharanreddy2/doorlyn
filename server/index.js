import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import twilio from 'twilio';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Supabase Client if credentials are provided in .env
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

const supabase = (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-supabase-project'))
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

if (supabase) {
  console.log('[SUPABASE INTEGRATION] Connected to Supabase for ai_knowledge search.');
}

// Initialize Twilio Client if credentials are provided in .env
const twilioAccountSid = process.env.TWILIO_ACCOUNT_SID;
const twilioAuthToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER || '+91 98765 43210';

let twilioClient = null;
if (twilioAccountSid && twilioAuthToken && twilioAccountSid.startsWith('AC')) {
  try {
    twilioClient = twilio(twilioAccountSid, twilioAuthToken);
    console.log('[TWILIO INTEGRATION] Twilio SDK Client initialized successfully.');
  } catch (err) {
    console.error('[TWILIO INTEGRATION ERROR] Failed to initialize Twilio client:', err.message);
  }
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Required for Twilio Webhook POST parameters

// In-Memory Database for Doorlyn Ecosystem
const users = [
  {
    id: 'usr-1',
    name: 'Rajesh Kumar',
    phone: '+91 9876543210',
    email: 'rajesh@doorlyn.in',
    password: 'password123',
    language: 'EN',
    address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad, Telangana - 500081',
    walletBalance: 450,
  }
];

const bookings = [
  {
    id: 'DLN-89421',
    serviceCategory: 'Healthcare & Diagnostic',
    serviceName: 'Full Body Checkup + CBC',
    date: '2026-08-03',
    timeSlot: '08:00 AM - 09:00 AM',
    patientName: 'Rajesh Kumar',
    patientGender: 'Male',
    contactPhone: '+91 9876543210',
    address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad, Telangana',
    paymentMethod: 'UPI (Google Pay)',
    totalAmount: 999,
    status: 'Confirmed',
    assignedProvider: 'Apollo Diagnostic Lab Care',
    trackingSteps: [
      { step: 'Order Confirmed', time: '10:15 AM', done: true },
      { step: 'Phlebotomist Assigned', time: '10:18 AM', done: true },
      { step: 'En Route to Home', time: 'Est 07:45 AM Tomorrow', done: false },
      { step: 'Sample Collected', time: 'Pending', done: false },
      { step: 'Report Uploaded', time: 'Pending', done: false }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'DLN-77312',
    serviceCategory: 'Home Repairs',
    serviceName: 'Electrician - Fan Repair & Wiring',
    date: '2026-08-01',
    timeSlot: '02:00 PM - 03:00 PM',
    address: 'Flat 402, Lotus Heights, Hitech City, Hyderabad',
    paymentMethod: 'Cash on Collection',
    totalAmount: 350,
    status: 'Completed',
    assignedProvider: 'Srinivas Rao (Verified Technician ★ 4.9)',
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

const healthRecords = [
  {
    id: 'REC-101',
    title: 'Complete Blood Count (CBC) Report',
    date: '2026-07-28',
    lab: 'Doorlyn Diagnostics / Dr. Lal Path',
    findings: 'Hemoglobin: 14.2 g/dL (Normal), RBC: 4.8 M/uL (Healthy), Platelets: 250,000 (Normal).',
    aiExplanation: 'Your CBC report is healthy! Hemoglobin levels are in the optimal range. Keep maintaining a balanced diet with iron-rich foods.',
    downloadUrl: '#'
  },
  {
    id: 'REC-102',
    title: 'Fasting Blood Sugar (FBS)',
    date: '2026-06-15',
    lab: 'Apollo Health Care',
    findings: 'FBS: 95 mg/dL (Normal Fasting Range: 70-99 mg/dL).',
    aiExplanation: 'Blood sugar is well within the non-diabetic range. Regular morning walks are helping maintain good glycemic control.',
    downloadUrl: '#'
  }
];

// ---------------- API ENDPOINTS ---------------- //

// Auth API
app.post('/api/auth/register', (req, res) => {
  const { identifier, password, name } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Identifier and password are required' });
  }
  const newUser = {
    id: `usr-${Date.now()}`,
    name: name || 'User',
    phone: identifier.includes('@') ? '+91 9988776655' : identifier,
    email: identifier.includes('@') ? identifier : `${identifier}@doorlyn.in`,
    password,
    language: 'EN',
    address: 'Village Green, Doorlyn Sector 4, Hyderabad',
    walletBalance: 200 // Bonus signup credit
  };
  users.push(newUser);
  res.json({ success: true, user: newUser, token: `jwt-token-${newUser.id}` });
});

app.post('/api/auth/login', (req, res) => {
  const { identifier, password } = req.body;
  const user = users.find(u => (u.email === identifier || u.phone === identifier));
  if (user && user.password === password) {
    return res.json({ success: true, user, token: `jwt-token-${user.id}` });
  }
  // Allow fallback demo login
  const demoUser = users[0];
  res.json({ success: true, user: demoUser, token: `jwt-token-${demoUser.id}` });
});

// Bookings API
app.get('/api/bookings', (req, res) => {
  res.json({ success: true, bookings });
});

app.post('/api/bookings', (req, res) => {
  const bookingData = req.body;
  const newBooking = {
    id: `DLN-${Math.floor(10000 + Math.random() * 90000)}`,
    ...bookingData,
    status: 'Confirmed',
    createdAt: new Date().toISOString(),
    assignedProvider: 'Doorlyn Verified Partner Agent',
    trackingSteps: [
      { step: 'Booking Confirmed', time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), done: true },
      { step: 'Provider Assigned', time: 'In 2 mins', done: true },
      { step: 'Service / Pickup In Progress', time: 'Scheduled Time', done: false },
      { step: 'Service Completed', time: 'Pending', done: false }
    ]
  };
  bookings.unshift(newBooking);
  res.json({ success: true, booking: newBooking, message: 'Booking confirmed successfully!' });
});

// Health Records API
app.get('/api/health-records', (req, res) => {
  res.json({ success: true, records: healthRecords });
});

// Anuvadini AI Multilingual Chat Endpoint
const detectLastServiceContext = (history = [], fallbackText = '') => {
  const reversedHistory = [...history].reverse();
  const searchItems = [fallbackText, ...reversedHistory.map(h => typeof h === 'string' ? h : (h.content || ''))];

  for (const item of searchItems) {
    const txt = (item || '').toLowerCase();
    
    if (txt.includes('electrician') || txt.includes('wiring') || txt.includes('short circuit') || txt.includes('fan') || txt.includes('carpenter') || txt.includes('switchboard') || txt.includes('इलेक्ट्रीशियन') || txt.includes('ఎలక్ట్రీషియన్') || txt.includes('ఫ్యాన్') || txt.includes('बिजली')) {
      return 'electrician';
    }
    if (txt.includes('plumber') || txt.includes('tap') || txt.includes('leak') || txt.includes('pipe') || txt.includes('sink') || txt.includes('drain') || txt.includes('నల్లా') || txt.includes('ప్లంబర్') || txt.includes('नल') || txt.includes('प्लंबर')) {
      return 'plumber';
    }
    if (txt.includes('tutor') || txt.includes('tuition') || txt.includes('teacher') || txt.includes('coaching') || txt.includes('student') || txt.includes('homework') || txt.includes('study') || txt.includes('ట్యూటర్') || txt.includes('ట్యూషన్') || txt.includes('ट्यूटर') || txt.includes('ट्यूशन')) {
      return 'tutor';
    }
    if (txt.includes('blood') || txt.includes('cbc') || txt.includes('sugar') || txt.includes('thyroid') || txt.includes('pcod') || txt.includes('diagnostic') || txt.includes('checkup') || txt.includes('doctor') || txt.includes('lab') || txt.includes('రక్త') || txt.includes('హెల్త్') || txt.includes('खून')) {
      return 'healthcare';
    }
    if (txt.includes('parcel') || txt.includes('pickup') || txt.includes('rapido') || txt.includes('drop') || txt.includes('courier') || txt.includes('पार्सल') || txt.includes('పార్శిల్')) {
      return 'parcel';
    }
    if (txt.includes('grocer') || txt.includes('grocery') || txt.includes('groceries') || txt.includes('supermarket') || txt.includes('kirana') || txt.includes('rice') || txt.includes('milk') || txt.includes('vegetable') || txt.includes('राशन') || txt.includes('గ్రోసరీ')) {
      return 'grocery';
    }
    if (txt.includes('shift') || txt.includes('truck') || txt.includes('moving') || txt.includes('relocation') || txt.includes('logistics') || txt.includes('शिफ्टिंग') || txt.includes('షిఫ్టింగ్')) {
      return 'shifting';
    }
    if (txt.includes('cater') || txt.includes('catering') || txt.includes('caterer') || txt.includes('buffet') || txt.includes('cook') || txt.includes('chef') || txt.includes('केटरिंग') || txt.includes('కేటరింగ్')) {
      return 'catering';
    }
    if (txt.includes('worker') || txt.includes('mason') || txt.includes('mestri') || txt.includes('labor') || txt.includes('मजदूर') || txt.includes('కూలీ') || txt.includes('మేస్త్రీ')) {
      return 'worker';
    }
  }

  return null;
};

// Anuvadini AI Multilingual Chat Endpoint with Conversational Memory Context
app.post('/api/ai/chat', (req, res) => {
  const { message, language = 'EN', history = [], address: clientAddress = '' } = req.body;
  const lowerMsg = (message || '').toLowerCase();
  const userBookingAddress = clientAddress || '📍 Live GPS Pin Location';

  let replyText = '';
  let options = [];
  let suggestedAction = null;

  // Check EXPLICIT Service Intent from CURRENT user message (highest priority)
  const isTutorIntent = lowerMsg.includes('tutor') || lowerMsg.includes('tuition') || lowerMsg.includes('teacher') || lowerMsg.includes('coaching') || lowerMsg.includes('exam') || lowerMsg.includes('student') || lowerMsg.includes('homework') || lowerMsg.includes('study') || lowerMsg.includes('ట్యూటర్') || lowerMsg.includes('ట్యూషన్') || lowerMsg.includes('టీచర్') || lowerMsg.includes('కోచింగ్') || lowerMsg.includes('చదువు') || lowerMsg.includes('పరీక్ష') || lowerMsg.includes('ट्यूटर') || lowerMsg.includes('ट्यूशन') || lowerMsg.includes('पढ़ाई') || lowerMsg.includes('कोचिंग') || lowerMsg.includes('टीचर');
  const isPlumberIntent = lowerMsg.includes('plumber') || lowerMsg.includes('tap') || lowerMsg.includes('leak') || lowerMsg.includes('pipe') || lowerMsg.includes('sink') || lowerMsg.includes('drain') || lowerMsg.includes('నల్లా') || lowerMsg.includes('ప్లంబర్') || lowerMsg.includes('ప్లంబింగ్') || lowerMsg.includes('नल') || lowerMsg.includes('लीकेज') || lowerMsg.includes('प्लंबर');
  const isElectricianIntent = lowerMsg.includes('electrician') || lowerMsg.includes('wiring') || lowerMsg.includes('short circuit') || lowerMsg.includes('fan') || lowerMsg.includes('carpenter') || lowerMsg.includes('ac') || lowerMsg.includes('इलेक्ट्रीशियन') || lowerMsg.includes('ఎలక్ట్రీషియన్') || lowerMsg.includes('ఫ్యాన్') || lowerMsg.includes('बिजली') || lowerMsg.includes('फैन');
  const isHealthcareIntent = lowerMsg.includes('blood') || lowerMsg.includes('cbc') || lowerMsg.includes('sugar') || lowerMsg.includes('thyroid') || lowerMsg.includes('pcod') || lowerMsg.includes('pregnancy') || lowerMsg.includes('health') || lowerMsg.includes('diagnostic') || lowerMsg.includes('checkup') || lowerMsg.includes('doctor') || lowerMsg.includes('lab') || lowerMsg.includes('రక్త') || lowerMsg.includes('హెల్త్') || lowerMsg.includes('డయాగ్నోస్టిక్') || lowerMsg.includes('చెకప్') || lowerMsg.includes('खून') || lowerMsg.includes('लैब') || lowerMsg.includes('हेल्थ') || lowerMsg.includes('डायग्नोस्टिक');
  const isParcelIntent = lowerMsg.includes('parcel') || lowerMsg.includes('pickup') || lowerMsg.includes('rapido') || lowerMsg.includes('drop') || lowerMsg.includes('courier') || lowerMsg.includes('पार्सल') || lowerMsg.includes('पिकअप') || lowerMsg.includes('ड्रॉप') || lowerMsg.includes('పార్శిల్') || lowerMsg.includes('పికప్') || lowerMsg.includes('డ్రాప్');
  const isGroceryIntent = lowerMsg.includes('grocer') || lowerMsg.includes('grocery') || lowerMsg.includes('groceries') || lowerMsg.includes('supermarket') || lowerMsg.includes('kirana') || lowerMsg.includes('staple') || lowerMsg.includes('rice') || lowerMsg.includes('milk') || lowerMsg.includes('vegetable') || lowerMsg.includes('fruit') || lowerMsg.includes('dal') || lowerMsg.includes('oil') || lowerMsg.includes('atta') || lowerMsg.includes('राशन') || lowerMsg.includes('दूध') || lowerMsg.includes('सब्जी') || lowerMsg.includes('फल') || lowerMsg.includes('किराना') || lowerMsg.includes('గ్రోసరీ') || lowerMsg.includes('కూరగాయలు') || lowerMsg.includes('పాలు') || lowerMsg.includes('కిరాణా') || lowerMsg.includes('బియ్యం') || lowerMsg.includes('నిత్యావసరాలు');
  const isShiftingIntent = lowerMsg.includes('shift') || lowerMsg.includes('truck') || lowerMsg.includes('moving') || lowerMsg.includes('relocation') || lowerMsg.includes('logistics') || lowerMsg.includes('घर बदलना') || lowerMsg.includes('शिफ्टिंग') || lowerMsg.includes('लॉजिस्टिक्स') || lowerMsg.includes('ట్రక్') || lowerMsg.includes('షిఫ్టింగ్') || lowerMsg.includes('లాజిస్టిక్స్') || lowerMsg.includes('ఇల్లు షిఫ్టింగ్');
  const isCateringIntent = lowerMsg.includes('cater') || lowerMsg.includes('catering') || lowerMsg.includes('caterer') || lowerMsg.includes('buffet') || lowerMsg.includes('cook') || lowerMsg.includes('chef') || lowerMsg.includes('केटरिंग') || lowerMsg.includes('కేటరింగ్') || lowerMsg.includes('వంట');
  const isWorkerIntent = lowerMsg.includes('worker') || lowerMsg.includes('clean') || lowerMsg.includes('mason') || lowerMsg.includes('mestri') || lowerMsg.includes('labor') || lowerMsg.includes('मजदूर') || lowerMsg.includes('मिस्त्री') || lowerMsg.includes('सफाई') || lowerMsg.includes('वर्कर') || lowerMsg.includes('వర్కర్') || lowerMsg.includes('కూలీ') || lowerMsg.includes('మేస్త్రీ') || lowerMsg.includes('మిస్త్రీ') || lowerMsg.includes('క్లీనింగ్');

  const hasSpecificServiceIntent = isTutorIntent || isPlumberIntent || isElectricianIntent || isHealthcareIntent || isParcelIntent || isGroceryIntent || isShiftingIntent || isCateringIntent || isWorkerIntent;

  // Identify active topic dynamically by scanning reverse history
  const lastContext = detectLastServiceContext(history, lowerMsg);

  // Check for Affirmative / Confirmation Follow-ups ("yes", "confirm", "ok", "sure", "हां", "అవును", "book")
  const isAffirmative = !hasSpecificServiceIntent && (lowerMsg.includes('yes') || lowerMsg.includes('confirm') || lowerMsg.includes('sure') || lowerMsg.includes('ok') || lowerMsg.includes('हां') || lowerMsg.includes('అవును') || lowerMsg.includes('బుక్') || lowerMsg.includes('book'));

  // Check for Price / Cost Questions ("cost", "price", "how much", "rate", "कितना", "ఎंत")
  const isPriceQuery = !hasSpecificServiceIntent && (lowerMsg.includes('cost') || lowerMsg.includes('price') || lowerMsg.includes('how much') || lowerMsg.includes('rate') || lowerMsg.includes('कितना') || lowerMsg.includes(' charges') || lowerMsg.includes('ఎంత'));

  // Check for Time / Schedule Modifications ("time", "morning", "evening", "am", "pm", "clock", "समय")
  const isTimeQuery = !hasSpecificServiceIntent && (lowerMsg.includes('am') || lowerMsg.includes('pm') || lowerMsg.includes('morning') || lowerMsg.includes('evening') || lowerMsg.includes('time') || lowerMsg.includes('clock') || lowerMsg.includes('समय') || lowerMsg.includes('సమయం'));

  // Check for Gratitude / Thank You Messages ("thank you", "thanks", "धन्यवाद", "ధన్యవాదాలు")
  const isGratitudeIntent = !hasSpecificServiceIntent && (lowerMsg.includes('thank') || lowerMsg.includes('thanks') || lowerMsg.includes('thx') || lowerMsg.includes('dhanyawad') || lowerMsg.includes('dhanyavad') || lowerMsg.includes('धन्यवाद') || lowerMsg.includes('शुक्रिया') || lowerMsg.includes('ధన్యవాదాలు') || lowerMsg.includes('థాంక్స్') || lowerMsg.includes('ధన్యవాదములు'));

  // Detect explicit "show all services" / "what services" / "about services" requests (overrides context)
  const isServiceListQuery = lowerMsg.includes('service') || lowerMsg.includes('services') || lowerMsg.includes('what service') || lowerMsg.includes('all service') || lowerMsg.includes('show service') || lowerMsg.includes('list service') || lowerMsg.includes('your service') || lowerMsg.includes('which service') || lowerMsg.includes('services you') || lowerMsg.includes('what do you') || lowerMsg.includes('what can you') || lowerMsg.includes('menu') || lowerMsg.includes('help me') || lowerMsg.includes('about service') || lowerMsg.includes('service list') || lowerMsg.includes('services list') || lowerMsg.includes('8 service') || lowerMsg.includes('available service') || lowerMsg.includes('what do you offer') || lowerMsg.includes('what are your') || lowerMsg.includes('facilities') || lowerMsg.includes('categories') || lowerMsg.includes('category') || lowerMsg.includes('verticals') || lowerMsg.includes('doorlyn') || lowerMsg.includes('options') || lowerMsg.includes('tell me about') || lowerMsg.includes('कौन सी सेवा') || lowerMsg.includes('सेवाएं') || lowerMsg.includes('सेवा') || lowerMsg.includes('सर्विस') || lowerMsg.includes('सर्विसेज') || lowerMsg.includes('सूची') || lowerMsg.includes('क्या काम') || lowerMsg.includes('ఏ సేవ') || lowerMsg.includes('సేవలు') || lowerMsg.includes('సేవ') || lowerMsg.includes('సర్వీస్') || lowerMsg.includes('సర్వీసులు') || lowerMsg.includes('లిస్ట్') || lowerMsg.includes('ఏమి చేస్తారు');

  // If user says Thank You / Thanks
  if (isGratitudeIntent) {
    if (language === 'HI') {
      replyText = '🎉 आपका बहुत-बहुत धन्यवाद! डोरलिन सेवा का उपयोग करने के लिए शुक्रिया। हमारे सत्यापित पार्टनर तय समय पर आपके स्थान पर पहुंचेंगे। क्या मैं आपकी किसी और सेवा में सहायता कर सकता हूँ?';
      options = ['दूसरी सेवा बुक करें', 'मुख्य मेनू'];
    } else if (language === 'TE') {
      replyText = '🎉 మీకు చాలా ధన్యవాదాలు! డోర్‌లిన్ సర్వీస్ బుక్ చేసుకున్నందుకు ధన్యవాదాలు। మా వెరిఫైడ్ పార్ట్‌నర్ సమయానికి మీ వద్దకు రానున్నారు। మీకు ఇంకేదైనా సేవ సహాయం కావాలా?';
      options = ['మరో సేవ బుక్ చేయండి', 'ప్రధాన మెనూ'];
    } else {
      replyText = '🎉 You\'re very welcome! Thank you for booking your service with Doorlyn. Our verified partner will arrive on schedule. Is there anything else I can help you with today?';
      options = ['Book Another Service', 'Main Menu'];
    }
  }

  // If user asks about services, show full 8-service menu immediately
  else if (isServiceListQuery && !hasSpecificServiceIntent) {
    if (language === 'HI') {
      replyText = 'जी बिल्कुल! डोरलिन पर हम ये 8 प्रमुख सेवाएं प्रदान करते हैं:\n\n1. 🏥 हेल्थकेयर & डायग्नोस्टिक्स — CBC, ब्लड शुगर, फुल बॉडी चेकअप (₹349 से)\n2. 🔧 होम रिपेयर & किचन — इलेक्ट्रीशियन (₹249), प्लंबर (₹199), कारपेंटर\n3. 📦 पिकअप & ड्रॉप सेवा — पार्सल, गिफ्ट, लगेज डिलीवरी (₹69 से)\n4. 🚚 लॉजिस्टिक्स & शिफ्टिंग — घर, ऑफिस शिफ्टिंग, मिनी ट्रक (₹2499 से)\n5. 🛒 किराना & राशन — ताजी सब्जियां, दूध, दैनिक सामग्री (15 मिनट डिलीवरी)\n6. 👷 वर्कर मार्केटप्लेस — दिहाड़ी मजदूर (₹600/दिन), मिस्त्री, घर की सफाई\n7. 📚 स्टूडेंट ट्यूटर्स & सेवाएं — 1st-10th & इंटरमीडिएट ट्यूशन (₹299/घंटा से)\n8. 🍲 कैटरिंग & इवेंट सपोर्ट — शादी व पार्टी बुफे (₹299/प्लेट से)\n\nआप किस सेवा के बारे में जानना या बुक करना चाहते हैं?';
      options = ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🚚 शिफ्टिंग', '🛒 किराना', '👷 वर्कर्स', '📚 ट्यूटर्स', '🍲 कैटरिंग'];
    } else if (language === 'TE') {
      replyText = 'తప్పకుండా! డోర్‌లిన్ లో మేము ఈ 8 ప్రధాన సేవలను అందిస్తున్నాము:\n\n1. 🏥 హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ — CBC, బ్లడ్ షుగర్, ఫుల్ బాడీ చెకప్ (₹349 నుండి)\n2. 🔧 ఇంటి రిపేర్లు — ఎలక్ట్రీషియన్ (₹249), ప్లంబర్ (₹199), కార్పెంటర్\n3. 📦 పికప్ & డ్రాప్ సేవలు — పార్శిల్, గిఫ్ట్, లగేజ్ డెలివరీ (₹69 నుండి)\n4. 🚚 లాజిస్టిక్స్ & షిఫ్టింగ్ — ఇల్లు, ఆఫీస్ షిఫ్టింగ్, మినీ ట్రక్ (₹2499 నుండి)\n5. 🛒 గ్రోసరీ & నిత్యావసరాలు — కూరగాయలు, పాలు, నిత్యావసరాలు (15 నిమిషాల డెలివరీ)\n6. 👷 వర్కర్ మార్కెట్‌ప్లేస్ — కూలీలు (₹600/రోజు), మేస్త్రీ, డీప్ క్లీనింగ్\n7. 📚 స్టూడెంట్ ట్యూటర్స్ — 1st-10th & ఇంటర్మీడియట్ హోమ్ & ఆన్‌లైన్ ట్యూషన్ (₹299/గంట నుండి)\n8. 🍲 కేటరింగ్ & ఈవెంట్ సేవలు — వివాహాలు & వేడుకల భోజనం (₹299/ప్లేట్ నుండి)\n\nమీకు ఏ సేవ అవసరమో సెలెక్ట్ చేయండి లేదా మాట్లాడండి!';
      options = ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🚚 షిఫ్టింగ్', '🛒 గ్రోసరీ', '👷 వర్కర్లు', '📚 ట్యూటర్స్', '🍲 కేటరింగ్'];
    } else {
      replyText = 'Doorlyn provides 8 unified household services at your doorstep:\n\n1. 🏥 Healthcare & Diagnostics — CBC, Sugar, Thyroid, Full Body Checkup (from ₹349)\n2. 🔧 Home Repairs & Kitchen — Electricians (₹249), Plumbers (₹199), Carpenters & Appliances\n3. 📦 Pickup & Drop Service — Express Documents, Parcels, Gifts & Luggage (from ₹69)\n4. 🚚 Logistics & Shifting — 1BHK/2BHK House Relocation, Office Moving, Mini Trucks (from ₹2499)\n5. 🛒 Groceries & Essentials — Farm Fresh Veggies, Milk, Staples (15-min Express Delivery)\n6. 👷 Worker Marketplace — Verified Daily Wage Labor (₹600/day), Masons, Deep Cleaning\n7. 📚 Student Tutors & Services — 1st-10th & Intermediate Home/Online Tutors (from ₹299/hr)\n8. 🍲 Catering & Event Support — Wedding, Birthday & Event Buffets (from ₹299/plate)\n\nWhich service would you like to explore or book?';
      options = ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🚚 Shifting', '🛒 Groceries', '👷 Workers', '📚 Tutors', '🍲 Catering'];
    }
  }

  // --- MULTI-TURN CONVERSATION FOLLOW-UP LOGIC ---

  // 1. Follow-up: Affirmative Confirmation
  else if (isAffirmative && lastContext) {
    if (lastContext === 'electrician') {
      replyText = language === 'HI'
        ? '🎉 इलेक्ट्रीशियन सर्विस सफलतापूर्वक बुक कर ली गई है! सत्यापित तकनीशियन 30 मिनट में आपके घर पहुंचेगा।'
        : language === 'TE'
        ? '🎉 ఎలక్ట్రీషియన్ సర్వీస్ విజయవంతంగా బుక్ అయింది! సాంకేతిక నిపుణుడు 30 నిమిషాల్లో వస్తారు.'
        : '🎉 Booking Confirmed! A Doorlyn verified electrician & repair technician will arrive at your home within 30 minutes.';
      options = ['Track Technician', 'Call Technician'];
      suggestedAction = { 
        type: 'AUTO_BOOK', 
        bookingData: {
          serviceCategory: 'Home Repairs',
          serviceName: 'Electrician - Fan Repair & Wiring',
          date: '2026-08-03',
          timeSlot: 'Immediate (30 mins)',
          totalAmount: 249,
          paymentMethod: 'Cash on Collection',
          address: userBookingAddress
        }
      };
    } else if (lastContext === 'plumber') {
      replyText = language === 'HI'
        ? '🎉 प्लंबर सर्विस सफलतापूर्वक बुक कर ली गई है! सत्यापित तकनीशियन 30 मिनट में आपके घर पहुंचेगा।'
        : language === 'TE'
        ? '🎉 ప్లంబర్ సర్వీస్ విజయవంతంగా బుక్ అయింది! 30 నిమిషాల్లో ప్లంబర్ వస్తారు.'
        : '🎉 Booking Confirmed! Verified plumber arriving in 30 minutes for pipe and tap repair.';
      options = ['Track Technician Status'];
      suggestedAction = {
        type: 'AUTO_BOOK',
        bookingData: {
          serviceCategory: 'Home Repairs',
          serviceName: 'Plumber - Pipe & Tap Repair',
          date: '2026-08-03',
          timeSlot: 'Immediate (30 mins)',
          totalAmount: 199,
          paymentMethod: 'Cash on Collection',
          address: userBookingAddress
        }
      };
    } else if (lastContext === 'tutor') {
      replyText = language === 'HI'
        ? '🎉 होम ट्यूटर सेवा सफलतापूर्वक बुक कर ली गई है! हमारे शिक्षा विशेषज्ञ आपसे संपर्क करेंगे।'
        : language === 'TE'
        ? '🎉 హోమ్ ట్యూటర్ సర్వీస్ విజయవంతంగా బుక్ అయింది! మా ఎడ్యుకేషన్ టీమ్ మిమ్మల్ని సంప్రదిస్తారు.'
        : '🎉 Booking Confirmed! A verified Doorlyn home tutor has been assigned for student home/online tuition.';
      options = ['Track Tutor Status', 'Contact Academic Support'];
      suggestedAction = {
        type: 'AUTO_BOOK',
        bookingData: {
          serviceCategory: 'Student Tutors & Services',
          serviceName: 'Home & Online Tutor Service',
          date: '2026-08-04',
          timeSlot: '05:00 PM - 06:00 PM',
          totalAmount: 299,
          paymentMethod: 'Cash / UPI on Visit',
          address: userBookingAddress
        }
      };
    } else if (lastContext === 'healthcare') {
      replyText = language === 'HI'
        ? '🎉 आपकी CBC और ब्लड शुगर जांच सफलतापूर्वक बुक कर ली गई है! हमारा लैब तकनीशियन कल सुबह 8 बजे आपके पते पर पहुंचेगा।'
        : language === 'TE'
        ? '🎉 మీ CBC మరియు బ్లడ్ షుగర్ టెస్ట్ విజయవంతంగా బుక్ చేయబడింది! ల్యాబ్ టెక్నీషియన్ రేపు ఉదయం 8 గంటలకు రానున్నారు.'
        : '🎉 Booking Confirmed! I have registered your Full Body CBC & Sugar Diagnostic collection for tomorrow at 8:00 AM. Certified phlebotomist Ramesh Kumar has been assigned.';
      options = ['Track Order Status', 'Download Pre-test Guidelines'];
      suggestedAction = { 
        type: 'AUTO_BOOK', 
        bookingData: {
          serviceCategory: 'Healthcare & Diagnostic',
          serviceName: 'Full Body CBC & Sugar Checkup',
          date: '2026-08-04',
          timeSlot: '08:00 AM - 09:00 AM',
          totalAmount: 349,
          paymentMethod: 'Cash / UPI on Collection',
          patientName: 'Rajesh Kumar',
          address: userBookingAddress
        }
      };
    } else if (lastContext === 'parcel') {
      replyText = language === 'HI'
        ? '🎉 पार्सल पिकअप बुक हो गया है! रैपिडो राइडर 15 मिनट में पहुंचेगा।'
        : language === 'TE'
        ? '🎉 పార్శిల్ పికప్ బుక్ అయింది! 15 నిమిషాల్లో డెలివరీ పార్ట్‌నర్ రానున్నారు.'
        : '🎉 Express Parcel Pickup Confirmed! A Doorlyn Express Parcel partner has been assigned for 15-minute pickup.';
      options = ['Track Courier Rider', 'Share Delivery PIN'];
      suggestedAction = { 
        type: 'AUTO_BOOK', 
        bookingData: {
          serviceCategory: 'Pickup & Drop',
          serviceName: 'Small Parcel Express Pickup',
          date: '2026-08-03',
          timeSlot: 'Immediate (15 mins)',
          totalAmount: 69,
          paymentMethod: 'UPI / Cash',
          address: userBookingAddress
        }
      };
    } else {
      replyText = language === 'HI'
        ? 'आपकी सेवा बुकिंग सफलतापूर्वक दर्ज कर ली गई है।'
        : language === 'TE'
        ? 'మీ సర్వీస్ బుకింగ్ విజయవంతంగా నమోదైంది.'
        : 'Your request has been successfully registered and assigned to our verified team.';
      options = ['View Bookings', 'Back to Home'];
    }
  }

  // 2. Follow-up: Price / Cost Queries (context-aware per service)
  else if (isPriceQuery && lastContext) {
    if (lastContext === 'healthcare') {
      replyText = language === 'HI'
        ? 'CBC और फास्टिंग ब्लड शुगर टेस्ट का कुल मूल्य ₹349 है, जिसमें होम सैंपल कलेक्शन और डिजिटल रिपोर्ट शामिल है। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'CBC మరియు బ్లడ్ షుగర్ టెస్ట్ ధర ₹349, ఇందులో ఉచిత హోమ్ శాంపిల్ కలెక్షన్ మరియు డిజిటల్ రిపోర్ట్ ఉన్నాయి. బుక్ చేయమంటారా?'
        : 'The Full Body CBC & Blood Sugar test is priced at ₹349, which includes free home sample collection and digital AI report. Would you like to book?';
      options = ['Yes, Book for ₹349', 'View Lab Options'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349 };
    } else if (lastContext === 'electrician') {
      replyText = language === 'HI'
        ? 'इलेक्ट्रीशियन विजिट फीस ₹249 है। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'ఎలక్ట్రీషియన్ విజిట్ చార్జ్ ₹249. వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు. బుక్ చేయమంటారా?'
        : 'The electrician visit fee is ₹249. Verified technicians arrive as soon as possible. Would you like to book?';
      options = ['Yes, Book Electrician ₹249', 'View Repair Tariff'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'electrician-services', serviceName: 'Electrician - Fan Repair & Wiring', price: 249 };
    } else if (lastContext === 'plumber') {
      replyText = language === 'HI'
        ? 'प्लंबर विजिट फीस ₹199 है। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'ప్లంబర్ విజిట్ చార్జ్ ₹199. వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు. బుక్ చేయమంటారా?'
        : 'The plumber visit fee is ₹199. Verified technicians arrive as soon as possible. Would you like to book?';
      options = ['Yes, Book Plumber ₹199', 'View Plumbing Rates'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'plumber-services', serviceName: 'Plumber - Pipe & Tap Repair', price: 199 };
    } else if (lastContext === 'tutor') {
      replyText = language === 'HI'
        ? 'होम ट्यूटर सेवा ₹299/घंटा, ऑनलाइन ₹199/घंटा से शुरू होती है। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'హోమ్ ట్యూటర్ సేవ ₹299/గంట, ఆన్‌లైన్ ₹199/గంట నుండి. బుక్ చేయమంటారా?'
        : 'Home Tutor starts at ₹299/hour, Online Tutor at ₹199/hour. Would you like to book?';
      options = ['Yes, Book Tutor', 'View Tutor Options'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'home-tutor', serviceName: 'Home & Online Tutor Service', price: 299 };
    } else if (lastContext === 'parcel') {
      replyText = language === 'HI'
        ? 'एक्सप्रेस पार्सल पिकअप ₹69 से शुरू होती है। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'ఎక్స్‌ప్రెస్ పార్శిల్ సేవలు ₹69 నుండి. బుక్ చేయమంటారా?'
        : 'Express parcel pickup starts at ₹69 for local city delivery. Would you like to book?';
      options = ['Yes, Book Parcel ₹69', 'Calculate Distance Rate'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69 };
    } else if (lastContext === 'shifting') {
      replyText = language === 'HI'
        ? 'हाउस शिफ्टिंग सेवा ₹2499 से शुरू होती है। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'హౌస్ షిఫ్టింగ్ సేవ ₹2499 నుండి. బుక్ చేయమంటారా?'
        : 'House shifting starts at ₹2499 including mini truck and loading helpers. Would you like to book?';
      options = ['Yes, Book Shifting', 'Get Quote'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499 };
    } else if (lastContext === 'catering') {
      replyText = language === 'HI'
        ? 'केटरिंग सेवा ₹299/प्लेट (वेज) और ₹499/प्लेट (नॉन-वेज) से शुरू होती है। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'కేటరింగ్ సేవ ₹299/ప్లేట్ (వెజ్) మరియు ₹499/ప్లేట్ (నాన్-వెజ్) నుండి. బుక్ చేయమంటారా?'
        : 'Event catering starts at ₹299/plate (Veg) and ₹499/plate (Non-Veg). Would you like to book?';
      options = ['Yes, Book Catering', 'View Menu'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'catering-service', serviceName: 'Event & Bulk Catering Service', price: 299 };
    } else if (lastContext === 'worker') {
      replyText = language === 'HI'
        ? 'दिहाड़ी मजदूर ₹600/दिन, मिस्त्री ₹800/दिन, हाउस क्लीनिंग ₹499/सेशन। क्या आप बुक करना चाहते हैं?'
        : language === 'TE'
        ? 'కూలీ ₹600/రోజు, మేస్త్రీ ₹800/రోజు, హౌస్ క్లీనింగ్ ₹499/సెషన్. బుక్ చేయమంటారా?'
        : 'Daily wage labor ₹600/day, Mason ₹800/day, Deep Cleaning ₹499/session. Would you like to book?';
      options = ['Yes, Book Worker', 'View Worker Options'];
      suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600 };
    } else if (lastContext === 'grocery') {
      replyText = language === 'HI'
        ? '15-मिनट एक्सप्रेस ग्रोसरी डिलीवरी! क्या आप ग्रोसरी कैटलॉग देखना चाहते हैं?'
        : language === 'TE'
        ? '15-నిమిషాల ఎక్స్‌ప్రెస్ గ్రోసరీ డెలివరీ! గ్రోసరీ కేటలాగ్ చూడమంటారా?'
        : 'Doorlyn 15-min express grocery delivery available! Would you like to explore our catalog?';
      options = ['Explore Grocery Catalog', 'View Prices'];
      suggestedAction = { type: 'VIEW_GROCERY', serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' };
    }
  }

  // 3. Follow-up: Time Slot Customization
  else if (isTimeQuery && lastContext) {
    replyText = language === 'HI'
      ? `मैंने आपकी बातचीत के अनुसार समय अपडेट कर दिया है। क्या आप इस समय पर सर्विस बुक करना चाहते हैं?`
      : language === 'TE'
      ? `మీరు కోరిన సమయాన్ని అప్‌డేట్ చేశాను. ఈ సమయంలో బుకింగ్ ఫైనలైజ్ చేయమంటారా?`
      : `Got it! I have updated your preferred appointment time. Shall I finalize and lock this booking slot for you?`;
    options = ['Yes, Finalize Slot', 'Choose Different Time'];
  }

  // 4. Primary Topic: Healthcare & Diagnostics
  else if (lowerMsg.includes('blood') || lowerMsg.includes('cbc') || lowerMsg.includes('sugar') || lowerMsg.includes('thyroid') || lowerMsg.includes('pcod') || lowerMsg.includes('pregnancy') || lowerMsg.includes('health') || lowerMsg.includes('diagnostic') || lowerMsg.includes('checkup') || lowerMsg.includes('రక్త') || lowerMsg.includes('హెల్త్') || lowerMsg.includes('డయాగ్నోస్టిక్') || lowerMsg.includes('చెకప్') || lowerMsg.includes('खून') || lowerMsg.includes('लैब') || lowerMsg.includes('हेल्थ') || lowerMsg.includes('डायग्नोस्टिक')) {
    if (language === 'HI') {
      replyText = '🏥 डोरलिन हेल्थकेयर & डायग्नोस्टिक्स सेवा:\n• 100% सीलबंद और स्टेराइल वैक्यूम किट\n• NABL प्रमाणित लैब द्वारा जांच (Apollo / Dr. Lal)\n• घर पर आकर ब्लड सैंपल कलेक्शन (फ्री होम विजिट)\n• CBC (₹349), ब्लड शुगर (₹199), फुल बॉडी चेकअप (₹999)\n• 24 घंटे में डिजिटल रिपोर्ट और डॉक्टर सलाह\n\nक्या आप अभी लैब सैंपल कलेक्शन बुक करना चाहते हैं?';
      options = ['हां, अभी बुक करें', 'लॉगिन & लैब ऑप्शंस', 'रिपोर्ट समझाइए'];
    } else if (language === 'TE') {
      replyText = '🏥 డోర్‌లిన్ హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్ సేవ వివరాలు:\n• 100% సీలు చేసిన స్టెరైల్ వ్యాక్యూమ్ నీడిల్స్\n• NABL గుర్తింపు పొందిన ల్యాబ్స్ (అపోలో/డాక్టర్ లాల్ సర్టిఫైడ్)\n• ఇంటి వద్దకే వచ్చి ఉచితంగా రక్తం నమూనా సేకరణ (హోమ్ శాంపిల్)\n• CBC పరీక్ష (₹349), బ్లడ్ షుగర్ (₹199), ఫుల్ బాడీ చెకప్ (₹999)\n• 24 గంటల్లో డిజిటల్ PDF రిపోర్ట్ మరియు ఉచిత డాక్టర్ సలహా\n\nమీకు రేపు ఉదయానికి ల్యాబ్ శాంపిల్ కలెక్షన్ బుక్ చేయమంటారా?';
      options = ['అవును, బుక్ చేయండి', 'ల్యాబ్ ఆప్షన్లు చూడండి', 'రిపోర్ట్ వివరించండి'];
    } else {
      replyText = '🏥 Doorlyn Healthcare & Diagnostics Service:\n• 100% Sterile single-use vacuum kits opened in front of you\n• Processed at NABL Accredited Certified Labs (Apollo / Dr. Lal Path)\n• Doorstep Sample Pickup by certified phlebotomists\n• Popular: CBC Test (₹349), Blood Sugar (₹199), Master Health Checkup (₹999)\n• 24-Hour Digital PDF Report with free doctor consultation\n\nWould you like to schedule a home sample pickup?';
      options = ['Yes, Book Now', 'View Lab Options', 'Explain Report'];
    }
    suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'cbc-test', serviceName: 'CBC Test (Complete Blood Count)', price: 349 };
  }

  // 5a. Primary Topic: Plumbers & Pipe Leak Repairs
  else if (lowerMsg.includes('plumber') || lowerMsg.includes('tap') || lowerMsg.includes('leak') || lowerMsg.includes('pipe') || lowerMsg.includes('sink') || lowerMsg.includes('drain') || lowerMsg.includes('నల్లా') || lowerMsg.includes('ప్లంబర్') || lowerMsg.includes('ప్లంబింగ్') || lowerMsg.includes('नल') || lowerMsg.includes('लीकेज') || lowerMsg.includes('प्लंबर')) {
    if (language === 'HI') {
      replyText = '🔧 डोरलिन प्लंबिंग सर्विस विवरण:\n• सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा\n• नल व फॉसेट रिपेयर/बदलाव (₹249)\n• पाइप लीकेज व ड्रेन अनब्लॉकिंग (₹349)\n• वॉश बेसिन व ओवरहेड टैंक रिपेयर (₹499)\n\nक्या आप अभी प्लंबर बुक करना चाहते हैं?';
      options = ['प्लंबर बुक करें', 'प्लंबिंग दर सूची', 'समय स्लॉट चुनें'];
    } else if (language === 'TE') {
      replyText = '🔧 డోర్‌లిన్ ప్లంబింగ్ సేవ వివరాలు:\n• వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు\n• ట్యాప్ & ఫాసెట్ రిపేర్ / రీప్లేస్‌మెంట్ (₹249)\n• పైప్ లీకేజ్ & డ్రెయిన్ అన్‌బ్లాకింగ్ (₹349)\n• వాష్ బేసిన్ & వాటర్ ట్యాంక్ రిపేర్ (₹499)\n\nమీకు ఇప్పుడు ప్లంబర్‌ను బుక్ చేయమంటారా?';
      options = ['ప్లంబర్ బుక్ చేయండి', 'ప్లంబింగ్ వివరాలు', 'సమయం ఎంచుకోండి'];
    } else {
      replyText = '🔧 Doorlyn Plumbing Service Details:\n• Verified technicians arrive as soon as possible\n• Tap & Faucet Repair/Replacement (₹249)\n• Pipe Leakage & Drainage Unblocking (₹349)\n• Wash Basin & Water Tank Repairs (₹499)\n\nWould you like to book a verified plumber now?';
      options = ['Book Plumber Now', 'View Plumbing Rates', 'Select Plumbing Slot'];
    }
    suggestedAction = { type: 'PROMPT_CONFIRM', serviceCategory: 'Home Repairs', serviceName: 'Plumber - Pipe & Tap Repair', price: 199 };
  }

  // 5b. Primary Topic: Home Repairs & Appliances (Electrician)
  else if (lowerMsg.includes('repair') || lowerMsg.includes('electrician') || lowerMsg.includes('fan') || lowerMsg.includes('wiring') || lowerMsg.includes('short circuit') || lowerMsg.includes('carpenter') || lowerMsg.includes('ac') || lowerMsg.includes('washing machine') || lowerMsg.includes('home repair') || lowerMsg.includes('ఇంటి రిపేర్') || lowerMsg.includes('ఎలక్ట్రీషియన్') || lowerMsg.includes('ఫ్యాన్') || lowerMsg.includes('కార్పెంటర్') || lowerMsg.includes('बिजली') || lowerMsg.includes('फैन') || lowerMsg.includes('होम रिपेयर') || lowerMsg.includes('इलेक्ट्रीशियन')) {
    if (language === 'HI') {
      replyText = '⚡ डोरलिन इलेक्ट्रिशियन & होम रिपेयर विवरण:\n• सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा\n• सीलिंग फैन इंस्टॉल व मरम्मत (₹299)\n• स्विचबोर्ड, सॉकेट व शॉर्ट सर्किट फिक्स (₹349)\n• मेन लाइन MCB व न्यू वायरिंग (₹449)\n\nक्या आप अभी इलेक्ट्रिशियन विजिट बुक करना चाहते हैं?';
      options = ['इलेक्ट्रीशियन बुक करें', 'इलेक्ट्रीशियन दर सूची', 'समय स्लॉट चुनें'];
    } else if (language === 'TE') {
      replyText = '⚡ డోర్‌లిన్ ఎలక్ట్రీషియన్ & హోమ్ రిపేర్ సేవ వివరాలు:\n• వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు\n• సీలింగ్ ఫ్యాన్ ఇన్‌స్టాలేషన్ & రిపేర్ (₹299)\n• స్విచ్‌బోర్డ్, సాకెట్ & షార్ట్ సర్క్యూట్ ఫిక్స్ (₹349)\n• మెయిన్ లైన్ MCB & వైరింగ్ ఫిక్స్ (₹449)\n\nఇప్పుడు ఎలక్ట్రీషియన్ బుకింగ్ కన్ఫర్మ్ చేయమంటారా?';
      options = ['ఎలక్ట్రీషియన్ బుక్ చేయండి', 'ఎలక్ట్రీషియన్ వివరాలు', 'సమయం ఎంచుకోండి'];
    } else {
      replyText = '⚡ Doorlyn Electrician & Home Repair Service:\n• Verified technicians arrive as soon as possible\n• Ceiling Fan Installation / Repair (₹299)\n• Switchboard, Socket & Short Circuit Fix (₹349)\n• Main Line MCB & New Wiring Fix (₹449)\n\nWould you like to book an electrician visit now?';
      options = ['Book Electrician Now', 'View Electrician Rates', 'Select Electrician Slot'];
    }
    suggestedAction = { type: 'PROMPT_CONFIRM', serviceCategory: 'Home Repairs', serviceName: 'Electrician - Fan Repair & Wiring', price: 249 };
  }

  // 6. Primary Topic: Pickup & Drop / Parcel
  else if (lowerMsg.includes('parcel') || lowerMsg.includes('pickup') || lowerMsg.includes('drop') || lowerMsg.includes('gift') || lowerMsg.includes('courier') || lowerMsg.includes('पार्सल') || lowerMsg.includes('पिकअप') || lowerMsg.includes('ड्रॉप') || lowerMsg.includes('పార్శిల్') || lowerMsg.includes('పికప్') || lowerMsg.includes('డ్రాప్')) {
    if (language === 'HI') {
      replyText = '📦 डोरलिन एक्सप्रेस पार्सल पिकअप सेवा:\n• शहर भर में त्वरित पिकअप और ड्रॉप (2 घंटे)\n• छोटे पार्सल (₹69), गिफ्ट्स, दस्तावेज और लगेज डिलीवरी\n• रीयल-टाइम जीपीएस ट्रैकिंग\n• डोर-टू-डोर सुरक्षित हैंडलिंग\n\nक्या आप अभी अपना पिकअप शेड्यूल करना चाहते हैं?';
      options = ['छोटा पार्सल बुक करें', 'गिफ़्ट डिलीवरी', 'सामान डिलीवरी'];
    } else if (language === 'TE') {
      replyText = '📦 డోర్‌లిన్ ఎక్స్‌ప్రెస్ పార్శిల్ పికప్ సేవ:\n• నగరం అంతటా వేగవంతమైన పికప్ మరియు డ్రాప్ (2 గంటలు)\n• చిన్న పార్శిల్ (₹69), గిఫ్ట్‌లు, పత్రాలు మరియు లగేజ్ డెలివరీ\n• రియల్-టైమ్ GPS ట్రాకింగ్\n• ఇంటి వద్ద సురక్షితమైన హ్యాండ్లింగ్\n\nమీ పికప్ షెడ్యూల్ చేయమంటారా?';
      options = ['స్మాల్ పార్శిల్ బుక్ చేయండి', 'గిఫ్ట్ డెలివరీ', 'లగేజ్ డెలివరీ'];
    } else {
      replyText = '📦 Doorlyn Express Parcel Pickup Service:\n• Swift intra-city pickup and drop (Within 2 hours)\n• Small Parcel (₹69), Gifts, Documents, and Luggage delivery\n• Real-time GPS Tracking for your peace of mind\n• Door-to-door professional handling\n\nWould you like to schedule your pickup?';
      options = ['Book Small Parcel', 'Gift Delivery', 'Luggage Delivery'];
    }
    suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'small-parcel', serviceName: 'Small Parcel Pickup & Drop', price: 69 };
  }

  // 7. Primary Topic: Logistics & House Shifting
  else if (lowerMsg.includes('shift') || lowerMsg.includes('truck') || lowerMsg.includes('moving') || lowerMsg.includes('relocation') || lowerMsg.includes('logistics') || lowerMsg.includes('घर बदलना') || lowerMsg.includes('शिफ्टिंग') || lowerMsg.includes('लॉजिस्टिक्स') || lowerMsg.includes('ట్రక్') || lowerMsg.includes('షిఫ్టింగ్') || lowerMsg.includes('లాజిస్టిక్స్') || lowerMsg.includes('ఇల్లు షిఫ్టింగ్')) {
    if (language === 'HI') {
      replyText = 'डोरलिन लॉजिस्टिक्स से लोकल हाउस और ऑफिस शिफ्टिंग मिनी ट्रक और लोडिंग सहायकों के साथ उपलब्ध है।';
      options = ['हाउस शिफ्टिंग बुक करें', 'मिनी ट्रक बुक करें'];
    } else if (language === 'TE') {
      replyText = 'డోర్‌లిన్ లాజిస్టిక్స్ ద్వారా ఇల్లు మరియు ఆఫీస్ షిఫ్టింగ్ మినీ ట్రక్కులు మరియు లోడింగ్ వర్కర్లతో లభిస్తుంది.';
      options = ['హౌస్ షిఫ్టింగ్ బుక్ చేయండి', 'మినీ ట్రక్ బుక్ చేయండి'];
    } else {
      replyText = 'Doorlyn Logistics offers local house & office relocation with packing, mini-trucks (Tata Ace/Bolero), and loading helpers.';
      options = ['Book House Shifting', 'Book Mini Truck'];
    }
    suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'house-shifting', serviceName: 'Local House Shifting', price: 2499 };
  }

  // 8. Primary Topic: Groceries & Daily Essentials
  else if (lowerMsg.includes('grocer') || lowerMsg.includes('grocery') || lowerMsg.includes('groceries') || lowerMsg.includes('supermarket') || lowerMsg.includes('kirana') || lowerMsg.includes('staple') || lowerMsg.includes('rice') || lowerMsg.includes('milk') || lowerMsg.includes('vegetable') || lowerMsg.includes('fruit') || lowerMsg.includes('dal') || lowerMsg.includes('oil') || lowerMsg.includes('atta') || lowerMsg.includes('राशन') || lowerMsg.includes('दूध') || lowerMsg.includes('सब्जी') || lowerMsg.includes('फल') || lowerMsg.includes('किराना') || lowerMsg.includes('గ్రోసరీ') || lowerMsg.includes('కూరగాయలు') || lowerMsg.includes('పాలు') || lowerMsg.includes('కిరాణా') || lowerMsg.includes('బియ్యం') || lowerMsg.includes('నిత్యావసరాలు')) {
    if (language === 'HI') {
      replyText = 'डोरलिन 15-मिनट एक्सप्रेस ग्रोसरी से ताजी सब्जियां, फल, दूध, चावल और दैनिक राशन आपके घर 15 मिनट में पहुंचेगा। क्या आप ग्रोसरी स्टोर देखना चाहते हैं?';
      options = ['ग्रोसरी स्टोर देखें', 'ताजी सब्जियां और फल', 'दैनिक राशन पैक'];
    } else if (language === 'TE') {
      replyText = 'డోర్‌లిన్ 15-నిమిషాల ఎక్స్‌ప్రెస్ గ్రోసరీ ద్వారా తాజా కూరగాయలు, పండ్లు, పాలు మరియు నిత్యావసరాలు 15 నిమిషాల్లో డెలివరీ అవుతాయి. గ్రోసరీ స్టోర్ చూడమంటారా?';
      options = ['గ్రోసరీ స్టోర్ చూడండి', 'తాజా కూరగాయలు & పండ్లు', 'నిత్యావసరాల ప్యాక్'];
    } else {
      replyText = 'Doorlyn 15-Minute Express Grocery delivers fresh vegetables, fruits, dairy milk, rice, dal, and daily kitchen staples to your doorstep in 15 minutes. Would you like to explore our grocery catalog?';
      options = ['Explore Grocery Catalog', 'View Fresh Vegetables & Fruits', 'Add Daily Staples Pack'];
    }
    suggestedAction = { type: 'VIEW_GROCERY', serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' };
  }

  // 9. Primary Topic: Worker Marketplace
  else if (lowerMsg.includes('worker') || lowerMsg.includes('clean') || lowerMsg.includes('mason') || lowerMsg.includes('mestri') || lowerMsg.includes('labor') || lowerMsg.includes('मजदूर') || lowerMsg.includes('मिस्त्री') || lowerMsg.includes('सफाई') || lowerMsg.includes('वर्कर') || lowerMsg.includes('వర్కర్') || lowerMsg.includes('కూలీ') || lowerMsg.includes('మేస్త్రీ') || lowerMsg.includes('మిస్త్రీ') || lowerMsg.includes('క్లీనింగ్')) {
    if (language === 'HI') {
      replyText = 'हमारे पास सत्यापित दिहाड़ी मजदूर, मिस्त्री और हाउस क्लीनिंग सेवा उपलब्ध है। आप कितने समय के लिए मजदूर बुक करना चाहते हैं?';
      options = ['दिहाड़ी मजदूर बुक करें', 'मिस्त्री काम', 'घर की सफाई'];
    } else if (language === 'TE') {
      replyText = 'మా వద్ద వెరిఫైడ్ కూలీలు, మేస్త్రీ మరియు హౌస్ క్లీనింగ్ వర్కర్లు అందుబాటులో ఉన్నారు.';
      options = ['కూలీల బుకింగ్', 'మేస్త్రీ పనులు', 'హౌస్ క్లీనింగ్'];
    } else {
      replyText = 'Doorlyn Worker Marketplace connects you with verified daily wage labor, mason (mestri) workers, and deep cleaning services.';
      options = ['Book Daily Labor', 'Book Mason Mestri', 'Book Deep Cleaning'];
    }
    suggestedAction = { type: 'BOOK_SERVICE', serviceId: 'daily-wage-worker', serviceName: 'Daily Wage Workers', price: 600 };
  }

  // 10. Primary Topic: Food & Catering Services
  else if (lowerMsg.includes('cater') || lowerMsg.includes('catering') || lowerMsg.includes('caterer') || lowerMsg.includes('food booking') || lowerMsg.includes('event food') || lowerMsg.includes('bulk food') || lowerMsg.includes('buffet') || lowerMsg.includes('marriage food') || lowerMsg.includes('party food') || lowerMsg.includes('cook') || lowerMsg.includes('chef') || lowerMsg.includes('केटरिंग') || lowerMsg.includes('खाना बुक') || lowerMsg.includes('భోజనాలు') || lowerMsg.includes('కేటరింగ్') || lowerMsg.includes('వంట')) {
    if (language === 'HI') {
      replyText = '🍲 डोरलिन इवेंट & बल्क केटरिंग सेवा विवरण:\n• 10 से 500+ मेहमानों के लिए इवेंट केटरिंग\n• वेज स्टैंडर्ड बुफे: ₹299 / प्लेट\n• नॉन-वेज प्रीमियम फीस्ट: ₹499 / प्लेट\n• लाइव डोसा/चाट काउंटर और अनुभवी शेफ सर्विस\n• क्रॉकरी, सर्विंग स्टाफ और वेन्यू सेटअप शामिल\n\nक्या आप अभी केटरिंग की जानकारी और बुकिंग प्रक्रिया शुरू करना चाहते हैं?';
      options = ['केटरिंग बुक करें', 'केटरिंग मेनू और दर सूची', 'गेस्ट संख्या चुनें'];
    } else if (language === 'TE') {
      replyText = '🍲 డోర్‌లిన్ ఈవెంట్ & బల్క్ కేటరింగ్ సేవ వివరాలు:\n• 10 నుండి 500+ అతిథుల కోసం ఈవెంట్ కేటరింగ్ సదుపాయం\n• వెజ్ స్టాండర్డ్ బుఫే: ₹299 / ప్లేట్\n• నాన్-వెజ్ ప్రీమియం ఫీస్ట్: ₹499 / ప్లేట్\n• లైవ్ దోశ/ఛాట్ కౌంటర్లు & వెరిఫైడ్ వంటమనుషులు (షెఫ్స్)\n• క్రాకరీ, వడ్డించే స్టాఫ్ మరియు మీ వేదిక వద్ద సెటప్ ఉచితంగా చేర్చబడింది\n\nమీకు ఈవెంట్ కేటరింగ్ బుకింగ్ వివరాలు ప్రారంభించమంటారా?';
      options = ['కేటరింగ్ బుక్ చేయండి', 'కేటరింగ్ మెనూ వివరాలు', 'అతిథుల సంఖ్య ఎంచుకోండి'];
    } else {
      replyText = '🍲 Doorlyn Event & Bulk Catering Service Details:\n• Complete event food support for 10 to 500+ guests\n• Veg Standard Buffet: ₹299 / plate\n• Non-Veg Premium Feast: ₹499 / plate\n• Live Dosa/Chaat Counters & Professional Chef Service\n• Premium Crockery, Serving Staff & Venue Setup Included\n\nWould you like to book Event Catering for your upcoming occasion?';
      options = ['Book Event Catering', 'View Catering Menu & Rates', 'Select Event Date & Guests'];
    }
    suggestedAction = { type: 'PROMPT_CONFIRM', serviceCategory: 'Food & Catering Services', serviceName: 'Event & Bulk Catering Service', price: 299 };
  }

  // 11. Primary Topic: Student Tutors & Services
  else if (lowerMsg.includes('tutor') || lowerMsg.includes('tuition') || lowerMsg.includes('teacher') || lowerMsg.includes('coaching') || lowerMsg.includes('exam') || lowerMsg.includes('student') || lowerMsg.includes('homework') || lowerMsg.includes('class') || lowerMsg.includes('study') || lowerMsg.includes('ट्यूटर') || lowerMsg.includes('ट्यूशन') || lowerMsg.includes('पढ़ाई') || lowerMsg.includes('कोचिंग') || lowerMsg.includes('टीचर') || lowerMsg.includes('ట్యూటర్') || lowerMsg.includes('ట్యూషన్') || lowerMsg.includes('టీచర్') || lowerMsg.includes('కోచింగ్') || lowerMsg.includes('చదువు') || lowerMsg.includes('పరీక్ష')) {
    if (language === 'HI') {
      replyText = '📚 डोरलिन स्टूडेंट ट्यूटर्स & सर्विसेज:\n\n• होम ट्यूटर (कक्षा 1-12): ₹299/घंटा\n• ऑनलाइन ट्यूटर (गणित, विज्ञान, अंग्रेजी): ₹199/घंटा\n• प्रतियोगी परीक्षा कोचिंग (JEE/NEET/EAMCET): ₹499/घंटा\n• होमवर्क & प्रोजेक्ट सहायता: ₹149/सत्र\n\nसभी ट्यूटर सत्यापित और अनुभवी हैं। क्या आप अभी ट्यूटर बुक करना चाहते हैं?';
      options = ['होम ट्यूटर बुक करें', 'ऑनलाइन ट्यूटर', 'प्रतियोगी परीक्षा कोचिंग', 'होमवर्क सहायता'];
    } else if (language === 'TE') {
      replyText = '📚 డోర్‌లిన్ స్టూడెంట్ ట్యూటర్స్ & సర్వీసెస్:\n\n• హోమ్ ట్యూటర్ (క్లాస్ 1-12): ₹299/గంట\n• ఆన్‌లైన్ ట్యూటర్ (మ్యాథ్స్, సైన్స్, ఇంగ్లీష్): ₹199/గంట\n• కాంపిటీటివ్ ఎగ్జామ్ కోచింగ్ (JEE/NEET/EAMCET): ₹499/గంట\n• హోమ్‌వర్క్ & ప్రాజెక్ట్ సహాయం: ₹149/సెషన్\n\nఅన్ని ట్యూటర్లు వెరిఫైడ్ మరియు అనుభవజ్ఞులు. ఇప్పుడు ట్యూటర్ బుక్ చేయమంటారా?';
      options = ['హోమ్ ట్యూటర్ బుక్ చేయండి', 'ఆన్‌లైన్ ట్యూటర్', 'కాంపిటీటివ్ ఎగ్జామ్ కోచింగ్', 'హోమ్‌వర్క్ సహాయం'];
    } else {
      replyText = '📚 Doorlyn Student Tutors & Services:\n\n• Home Tutor (Class 1-12): ₹299/hour\n• Online Tutor (Maths, Science, English): ₹199/hour\n• Competitive Exam Coaching (JEE/NEET/EAMCET): ₹499/hour\n• Homework & Project Assistance: ₹149/session\n\nAll tutors are verified and experienced. Would you like to book a tutor now?';
      options = ['Book Home Tutor', 'Online Tutor', 'Competitive Exam Coaching', 'Homework Help'];
    }
    suggestedAction = { type: 'PROMPT_CONFIRM', serviceCategory: 'Student Tutors & Services', serviceName: 'Home & Online Tutor Service', price: 299 };
  }

  // Context-aware fallback: stay on the service being discussed
  else if (lastContext) {
    const contextServiceMap = {
      electrician: { name: 'Electrician - Fan Repair & Wiring', price: '₹249', emoji: '⚡' },
      plumber: { name: 'Plumber - Pipe & Tap Repair', price: '₹199', emoji: '🔧' },
      tutor: { name: 'Home & Online Tutor Service', price: '₹299/hr', emoji: '📚' },
      healthcare: { name: 'CBC & Sugar Diagnostic Checkup', price: '₹349', emoji: '🏥' },
      parcel: { name: 'Small Parcel Pickup & Drop', price: '₹69', emoji: '📦' },
      shifting: { name: 'Local House Shifting', price: '₹2499', emoji: '🚚' },
      grocery: { name: '15-Min Express Grocery', price: '', emoji: '🛒' },
      catering: { name: 'Event & Bulk Catering', price: '₹299/plate', emoji: '🍲' },
      worker: { name: 'Daily Wage Workers', price: '₹600/day', emoji: '👷' }
    };
    const svc = contextServiceMap[lastContext] || { name: 'this service', price: '', emoji: '✅' };
    replyText = language === 'HI'
      ? `${svc.emoji} आप ${svc.name} सेवा के बारे में बात कर रहे हैं (${svc.price})। क्या आप यह सेवा बुक करना चाहते हैं, कीमत जानना चाहते हैं, या समय स्लॉट चुनना चाहते हैं?`
      : language === 'TE'
      ? `${svc.emoji} మీరు ${svc.name} సేవ గురించి మాట్లాడుతున్నారు (${svc.price}). ఈ సేవను బుక్ చేయమంటారా, ధర తెలుసుకోవాలా, లేదా సమయం ఎంచుకోవాలా?`
      : `${svc.emoji} We're discussing ${svc.name} (${svc.price}). Would you like to:\n• Book this service now\n• Know the exact pricing\n• Choose a time slot\n\nJust let me know how to proceed!`;
    options = language === 'HI'
      ? ['अभी बुक करें', 'कीमत बताएं', 'समय चुनें']
      : language === 'TE'
      ? ['ఇప్పుడు బుక్ చేయండి', 'ధర చెప్పండి', 'సమయం ఎంచుకోండి']
      : ['Book Now', 'Show Price', 'Choose Time Slot'];
  }

  // Only show full service menu when there's truly no active context
  else {
    if (language === 'HI') {
      replyText = 'नमस्ते! मैं डोरलिन AI सहायक हूँ। हमारी 8 सेवाएं:\n\n🏥 हेल्थकेयर & डायग्नोस्टिक्स\n🔧 होम रिपेयर (इलेक्ट्रीशियन, प्लंबर)\n📦 पिकअप & ड्रॉप सर्विस\n🚚 लॉजिस्टिक्स & शिफ्टिंग\n🛒 किराना & दैनिक जरूरतें\n👷 वर्कर मार्केटप्लेस\n📚 स्टूडेंट ट्यूटर्स\n🍲 केटरिंग & इवेंट सपोर्ट\n\nआपको कौन सी सेवा चाहिए?';
      options = ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🚚 शिफ्टिंग', '🛒 किराना', '👷 वर्कर्स', '📚 ट्यूटर्स', '🍲 केटरिंग'];
    } else if (language === 'TE') {
      replyText = 'నమస్కారం! నేను డోర్‌లిన్ ఏఐ అసిస్టెంట్. మా 8 సేవలు:\n\n🏥 హెల్త్‌కేర్ & డయాగ్నోస్టిక్స్\n🔧 ఇంటి రిపేర్లు (ఎలక్ట్రీషియన్, ప్లంబర్)\n📦 పికప్ & డ్రాప్ సర్వీస్\n🚚 లాజిస్టిక్స్ & షిఫ్టింగ్\n🛒 గ్రోసరీ & నిత్యావసరాలు\n👷 వర్కర్ మార్కెట్‌ప్లేస్\n📚 స్టూడెంట్ ట్యూటర్స్\n🍲 కేటరింగ్ & ఈవెంట్ సపోర్ట్\n\nమీకు ఏ సేవ కావాలి?';
      options = ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🚚 షిఫ్టింగ్', '🛒 గ్రోసరీ', '👷 వర్కర్లు', '📚 ట్యూటర్స్', '🍲 కేటరింగ్'];
    } else {
      replyText = 'Hello! I am Doorlyn AI Assistant powered by Anuvadini.ai. Our 8 service verticals:\n\n🏥 Healthcare & Diagnostics\n🔧 Home Repairs (Electrician, Plumber)\n📦 Pickup & Drop Service\n🚚 Logistics & Shifting\n🛒 Groceries & Essentials\n👷 Worker Marketplace\n📚 Student Tutors\n🍲 Catering & Event Support\n\nWhich service would you like?';
      options = ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🚚 Shifting', '🛒 Groceries', '👷 Workers', '📚 Tutors', '🍲 Catering'];
    }
  }

  res.json({
    success: true,
    reply: replyText,
    language,
    options,
    suggestedAction,
    timestamp: new Date().toISOString()
  });
});

// IVRS Simulation Call Endpoint (Exotel / Twilio / Knowlarity mock)
app.post('/api/ivrs/call', (req, res) => {
  const { phoneNumber, actionStep, selectedLang } = req.body;
  res.json({
    success: true,
    message: `IVRS call active for ${phoneNumber || '+91 9876543210'}. Connected via Doorlyn Voice Gateway.`,
    callId: `CALL-${Date.now()}`,
    status: 'In-Progress',
    ivrsSteps: [
      'Connected to Doorlyn IVRS Helpline (+91 98765 43210)',
      'Step 1: Customer Prompted for Preferred Language (EN/HI/TE)',
      'Step 2: Service Details & Pricing Explained',
      'Step 3: Customer Confirmation Required Before Final Booking'
    ]
  });
});

// TWILIO & CLOUD TELEPHONY STATUS API
app.get('/api/twilio/status', (req, res) => {
  res.json({
    configured: Boolean(twilioClient),
    accountSid: twilioAccountSid ? `${twilioAccountSid.substring(0, 6)}...` : 'Not Configured',
    phoneNumber: twilioPhoneNumber,
    webhookUrls: {
      voiceWebhook: '/api/ivrs/incoming-call',
      dtmfWebhook: '/api/ivrs/process-dtmf',
      confirmWebhook: '/api/ivrs/confirm-booking'
    }
  });
});

const handleIncomingCall = (req, res) => {
  const callerPhone = req.body.From || req.body.Caller || '+91 98765 43210';
  console.log(`[REAL IVR CALL RECEIVED] Incoming call from ${callerPhone} to ${twilioPhoneNumber}`);

  // TwiML (Twilio XML Response) for Real Telephony Call
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Gather numDigits="1" action="/api/ivrs/process-dtmf" method="POST" timeout="10">
        <Say voice="Polly.Aditi" language="en-IN">
            Welcome to Doorlyn Helpline. 
            Press 1 for English. 
            Telugu kosam 2 nokkandi. 
            Hindi ke liye 3 dabaye.
        </Say>
    </Gather>
    <Say voice="Polly.Aditi">We did not receive your response. Goodbye!</Say>
</Response>`;

  res.type('text/xml');
  res.send(twiml);
};

// Handle both standard endpoints and the new /voice endpoints
app.post('/api/ivrs/incoming-call', handleIncomingCall);
app.post('/voice', handleIncomingCall);
app.get('/voice', handleIncomingCall);

// DTMF Keypress Processor for Real Mobile Calls
app.post('/api/ivrs/process-dtmf', (req, res) => {
  const digits = req.body.Digits || req.body.digit || '1';
  const callerPhone = req.body.From || '+91 98765 43210';

  console.log(`[REAL IVR DTMF KEYPRESS] Caller ${callerPhone} pressed digit: ${digits}`);

  let twiml = `<?xml version="1.0" encoding="UTF-8"?><Response>`;

  if (digits === '1' || digits === '2' || digits === '3') {
    const langName = digits === '2' ? 'Telugu' : digits === '3' ? 'Hindi' : 'English';
    twiml += `
    <Gather numDigits="1" action="/api/ivrs/confirm-booking" method="POST" timeout="15">
        <Say voice="Polly.Aditi" language="en-IN">
            Language selected as ${langName}. 
            Press 1 for Electrician Repair service at 249 rupees. 
            Press 2 for Full Body CBC Blood Test at 349 rupees. 
            Press 3 for Express Parcel Pickup at 69 rupees. 
            Press 4 for 15 minute Grocery Pack at 299 rupees.
        </Say>
    </Gather>`;
  } else {
    twiml += `<Say voice="Polly.Aditi">Invalid option selected. Connecting call to Doorlyn Live Support representative.</Say>`;
  }

  twiml += `</Response>`;
  res.type('text/xml');
  res.send(twiml);
});

// Final Booking Confirmation Webhook for Real Phone Calls
app.post('/api/ivrs/confirm-booking', (req, res) => {
  const digits = req.body.Digits || '1';
  const callerPhone = req.body.From || '+91 98765 43210';

  const bookingId = `DLN-${Math.floor(10000 + Math.random() * 90000)}`;
  
  let serviceName = 'Electrician & Wiring Repair';
  let category = 'Home Repairs';
  let amount = 249;

  if (digits === '2') {
    serviceName = 'Full Body CBC Checkup';
    category = 'Healthcare & Diagnostic';
    amount = 349;
  } else if (digits === '3') {
    serviceName = 'Express Parcel Pickup';
    category = 'Pickup & Drop';
    amount = 69;
  } else if (digits === '4') {
    serviceName = '15-Min Essentials Grocery Pack';
    category = 'Grocery Delivery';
    amount = 299;
  }

  // Record real booking in Doorlyn Database
  const newBooking = {
    id: bookingId,
    serviceCategory: category,
    serviceName: serviceName,
    date: new Date().toISOString().split('T')[0],
    timeSlot: 'Immediate (Via Real IVR Call)',
    patientName: `Caller (${callerPhone})`,
    contactPhone: callerPhone,
    address: 'Registered Customer Address (Via Telephony IVR)',
    paymentMethod: 'Cash / Pay on Service',
    totalAmount: amount,
    status: 'Confirmed',
    assignedProvider: 'Doorlyn Telephony Partner (Assigned)',
    trackingSteps: [
      { step: 'Booking Confirmed via Twilio Phone Call', time: 'Just now', done: true },
      { step: 'Provider / Agent Assigned', time: 'In Progress', done: true },
      { step: 'Service Delivery', time: 'Est 30 mins', done: false }
    ]
  };

  bookings.unshift(newBooking);
  console.log(`[REAL PHONE BOOKING CONFIRMED] Booking #${bookingId} created via phone call from ${callerPhone} for ${serviceName} (₹${amount})`);

  // Attempt real SMS Dispatch via Twilio if SDK is initialized
  if (twilioClient && callerPhone.startsWith('+')) {
    twilioClient.messages.create({
      body: `Doorlyn Confirmation: Your booking #${bookingId} for ${serviceName} (₹${amount}) is confirmed via phone call. Provider en route!`,
      from: twilioPhoneNumber,
      to: callerPhone
    }).then(msg => {
      console.log(`[TWILIO REAL SMS DISPATCHED] SMS SID: ${msg.sid} sent to ${callerPhone}`);
    }).catch(err => {
      console.error('[TWILIO SMS DISPATCH ERROR]', err.message);
    });
  }

  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
    <Say voice="Polly.Aditi" language="en-IN">
        Congratulations! Your booking for ${serviceName} has been placed successfully. 
        Your booking reference number is ${bookingId}. 
        A confirmation SMS has been dispatched to your phone ${callerPhone}. 
        Thank you for calling Doorlyn Helpline!
    </Say>
    <Hangup/>
</Response>`;

  res.type('text/xml');
  res.send(twiml);
});

// Serve static assets from the Vite build output folder (dist)
app.use(express.static(path.join(__dirname, '../dist')));

// Fallback for Single Page Application routing (serve dist/index.html)
app.get(/.*/, (req, res, next) => {
  // Pass through API calls or the telephony voice webhook
  if (req.path.startsWith('/api') || req.path === '/voice') {
    return next();
  }
  res.sendFile(path.join(__dirname, '../dist/index.html'));
});

app.listen(PORT, () => {
  console.log(`Doorlyn AI Operating System Server running on port ${PORT}`);
});
