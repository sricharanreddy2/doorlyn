import { supabase, isSupabaseConfigured } from '../lib/supabaseClient.js';

export const EMBEDDED_KNOWLEDGE_BASE = [
  // =========================================================================
  // 0. DOORLYN INTRODUCTION & FAQ (EN, HI, TE)
  // =========================================================================
  {
    category: 'general',
    service_id: 'doorlyn-about',
    title: 'About Doorlyn - Household Operating System',
    question: 'What is Doorlyn? What is Doorlyn AI? Tell me about Doorlyn. What does Doorlyn do?',
    answer: "Doorlyn is India's first AI-powered multilingual household operating system unifying 8 essential doorstep services into one platform: Healthcare & Diagnostics, Home Repairs, Pickup & Drop, Logistics & Shifting, 15-Minute Express Groceries, Worker Marketplace, Student Tutors, and Event Catering with conversational AI and 24/7 IVRS phone support.",
    language: 'EN',
    keywords: ['doorlyn', 'about doorlyn', 'what is doorlyn', 'what does doorlyn do', 'tell me about doorlyn', 'doorlyn ai', 'overview', 'introduction', 'services', 'platform', 'household'],
    price: 0,
    metadata: { serviceCategory: 'General Information', serviceName: 'About Doorlyn' }
  },
  {
    category: 'general',
    service_id: 'doorlyn-about',
    title: 'डोरलिन (Doorlyn) परिचय और संपूर्ण सेवाएं',
    question: 'डोरलिन क्या है? डोरलिन क्या काम करता है? डोरलिन के बारे में बताएं। What is Doorlyn? What does Doorlyn do?',
    answer: 'डोरलिन भारत का पहला बहुभाषी एआई घरेलू ऑपरेटिंग सिस्टम है जो 8 प्रमुख सेवाएं आपके घर तक पहुंचाता है: 🏥 हेल्थकेयर & डायग्नोस्टिक्स, 🔧 होम रिपेयर, 📦 पिकअप & ड्रॉप, 🚚 लॉजिस्टिक्स & शिफ्टिंग, 🛒 15-मिनट किराना, 👷 मजदूर मार्केटप्लेस, 📚 स्टूडेंट ट्यूटर्स और 🍲 कैटरिंग।',
    language: 'HI',
    keywords: ['डोरलिन क्या है', 'डोरलिन', 'doorlyn', 'परिचय', 'डोरलिन क्या करता है', 'डोरलिन के बारे में', 'about doorlyn', 'what is doorlyn', 'सेवाएं'],
    price: 0,
    metadata: { serviceCategory: 'General Information', serviceName: 'About Doorlyn' }
  },
  {
    category: 'general',
    service_id: 'doorlyn-about',
    title: 'డోర్‌లిన్ (Doorlyn) పరిచయం మరియు సేవలు',
    question: 'డోర్‌లిన్ అంటే ఏమిటి? డోర్‌లిన్ ఏమి చేస్తుంది? డోర్‌లిన్ గురించి చెప్పండి. What is Doorlyn? What does Doorlyn do?',
    answer: 'డోర్‌లిన్ భారతదేశపు మొట్టమొదటి బహుభాషా ఏఐ గృహ సేవల ఆపరేటింగ్ సిస్టమ్. మేము 8 ముఖ్యమైన సేవలను మీ ఇంటి వద్దకే అందిస్తున్నాము: 🏥 హెల్త్‌కేర్, 🔧 ఇంటి రిపేర్లు, 📦 పికప్ & డ్రాప్, 🚚 లాజిస్టిక్స్ & షిఫ్టింగ్, 🛒 15-నిమిషాల గ్రోసరీ, 👷 వర్కర్ మార్కెట్‌ప్లేస్, 📚 స్టూడెంట్ ట్యూటర్స్ మరియు 🍲 కేటరింగ్.',
    language: 'TE',
    keywords: ['డోర్‌లిన్ అంటే ఏమిటి', 'డోర్‌లిన్', 'doorlyn', 'పరిచయం', 'డోర్‌లిన్ ఏమి చేస్తుంది', 'డోర్‌లిన్ గురించి', 'about doorlyn', 'what is doorlyn', 'సేవలు'],
    price: 0,
    metadata: { serviceCategory: 'General Information', serviceName: 'About Doorlyn' }
  },

  // =========================================================================
  // 0.1 LIVE DRIVER & ORDER TRACKING (EN, HI, TE)
  // =========================================================================
  {
    category: 'tracking',
    service_id: 'order-tracking',
    title: 'Live Driver and Order Tracking',
    question: 'Can I track my driver? How to track order status and driver location?',
    answer: 'Yes, you can track your driver, rider, or service technician in real-time with Doorlyn live GPS tracking. Once your booking is confirmed, click "Track Order" or visit the Bookings section to see live map location, estimated arrival time, and contact your assigned partner.',
    language: 'EN',
    keywords: ['track driver', 'track my driver', 'driver', 'tracking', 'track', 'live tracking', 'gps', 'order tracking', 'driver location', 'where is my driver'],
    price: 0,
    metadata: { serviceCategory: 'Order Tracking', serviceName: 'Live Driver & Order Tracking' }
  },
  {
    category: 'tracking',
    service_id: 'order-tracking',
    title: 'लाइव ड्राइवर और ऑर्डर ट्रैकिंग',
    question: 'क्या मैं अपने ड्राइवर को ट्रैक कर सकता हूँ? ड्राइवर को कैसे ट्रैक करें? Can I track my driver?',
    answer: 'हाँ, आप डोरलिन लाइव जीपीएस ट्रैकिंग के जरिए अपने ड्राइवर, राइडर या सर्विस तकनीशियन को रियल-टाइम में ट्रैक कर सकते हैं। बुकिंग के बाद Live Tracking बटन पर क्लिक करके ड्राइवर की लोकेशन और पहुंचने का समय देख सकते हैं।',
    language: 'HI',
    keywords: ['ड्राइवर ट्रैक', 'ट्रैकिंग', 'ड्राइवर', 'लाइव ट्रैकिंग', 'ऑर्डर ट्रैक', 'track driver', 'track my driver'],
    price: 0,
    metadata: { serviceCategory: 'Order Tracking', serviceName: 'Live Driver & Order Tracking' }
  },
  {
    category: 'tracking',
    service_id: 'order-tracking',
    title: 'లైవ్ డ్రైవర్ మరియు ఆర్డర్ ట్రాకింగ్',
    question: 'నేను నా డ్రైవర్‌ను ట్రాక్ చేయవచ్చా? డ్రైవర్‌ను ఎలా ట్రాక్ చేయాలి? Can I track my driver?',
    answer: 'అవును, డోర్‌లిన్ లైవ్ GPS ట్రాకింగ్ ద్వారా మీరు మీ డ్రైవర్, రైడర్ లేదా టెక్నీషియన్‌ను రియల్-టైమ్‌లో ట్రాక్ చేయవచ్చు. బుకింగ్ కన్ఫర్మ్ అయిన తర్వాత Track Order బటన్ ద్వారా లైవ్ మ్యాప్ లొకేషన్ మరియు సమయం తెలుసుకోవచ్చు.',
    language: 'TE',
    keywords: ['డ్రైవర్ ట్రాక్', 'ట్రాకింగ్', 'డ్రైవర్', 'లైవ్ ట్రాకింగ్', 'ఆర్డర్ ట్రాక్', 'track driver', 'track my driver'],
    price: 0,
    metadata: { serviceCategory: 'Order Tracking', serviceName: 'Live Driver & Order Tracking' }
  },

  // =========================================================================
  // 1. HEALTHCARE & DIAGNOSTICS (EN, HI, TE)
  // =========================================================================
  {
    category: 'healthcare',
    service_id: 'cbc-test',
    title: 'Complete Blood Count (CBC) Diagnostic Test',
    question: 'How do I book a CBC blood test and what are the inclusions and price? I need a CBC blood test',
    answer: 'Doorlyn provides home sample collection for Complete Blood Count (CBC) at ₹349. Includes Hemoglobin, RBC, WBC differential, and Platelet count processed at NABL-accredited labs (Apollo/Dr. Lal Path). Our certified phlebotomist uses 100% sterile sealed vacuum kits. Digital AI report is delivered within 24 hours.',
    language: 'EN',
    keywords: ['cbc', 'blood test', 'hemoglobin', 'platelet', 'wbc', 'rbc', 'diagnostic', 'sample collection', 'phlebotomist', 'lab'],
    price: 349,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'CBC Test (Complete Blood Count)' }
  },
  {
    category: 'healthcare',
    service_id: 'cbc-test',
    title: 'सीबीसी (CBC) ब्लड टेस्ट और होम सैंपल कलेक्शन',
    question: 'सीबीसी ब्लड टेस्ट कैसे बुक करें और इसकी कीमत क्या है? मुझे ब्लड टेस्ट चाहिए',
    answer: 'डोरलिन पर सीबीसी (CBC) ब्लड टेस्ट मात्र ₹349 में उपलब्ध है। इसमें हीमोग्लोबिन, आरबीसी, डब्ल्यूबीसी और प्लेटलेट काउंट शामिल हैं। एनएबीएल (NABL) प्रमाणित लैब से जांच और 100% सीलबंद स्टेराइल किट से घर पर फ्री सैंपल कलेक्शन। 24 घंटे में डिजिटल रिपोर्ट उपलब्ध।',
    language: 'HI',
    keywords: ['सीबीसी', 'ब्लड टेस्ट', 'खून की जांच', 'हीमोग्लोबिन', 'प्लेटलेट', 'डायग्नोस्टिक', 'सैंपल', 'लैब', 'cbc'],
    price: 349,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'CBC Test (Complete Blood Count)' }
  },
  {
    category: 'healthcare',
    service_id: 'cbc-test',
    title: 'సీబీసీ (CBC) బ్లడ్ టెస్ట్ మరియు హోమ్ శాంపిల్ కలెక్షన్',
    question: 'CBC బ్లడ్ టెస్ట్ ఎలా బుక్ చేయాలి మరియు దాని ధర ఎంత? నాకు బ్లడ్ టెస్ట్ కావాలి',
    answer: 'డోర్‌లిన్ ద్వారా కంప్లీట్ బ్లడ్ కౌంట్ (CBC) పరీక్ష ₹349 కే లభిస్తుంది. ఇందులో హిమోగ్లోబిన్, RBC, WBC, ప్లేట్‌లెట్ కౌంట్ ఉంటాయి. NABL గుర్తింపు పొందిన ల్యాబ్స్ ద్వారా పరీక్ష మరియు ఇంటి వద్దకే వచ్చి ఉచితంగా శాంపిల్ సేకరణ. 24 గంటల్లో డిజిటల్ రిపోర్ట్ వస్తుంది.',
    language: 'TE',
    keywords: ['సిబిసి', 'బ్లడ్ టెస్ట్', 'రక్త పరీక్ష', 'హిమోగ్లోబిన్', 'ప్లేట్‌లెట్', 'డయాగ్నోస్టిక్', 'శాంపిల్', 'cbc'],
    price: 349,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'CBC Test (Complete Blood Count)' }
  },
  {
    category: 'healthcare',
    service_id: 'blood-sugar',
    title: 'Blood Sugar & Diabetes Screening (FBS / PPBS / HbA1c)',
    question: 'What is the price for fasting blood sugar and HbA1c test?',
    answer: 'Doorlyn offers Fasting Blood Sugar (FBS) at ₹149, Post Prandial (PPBS) at ₹149, Dual FBS+PPBS Combo at ₹249, and HbA1c 3-month marker at ₹349. Home sample collection by certified staff with smart AI glycemic control insights.',
    language: 'EN',
    keywords: ['sugar', 'blood sugar', 'fbs', 'ppbs', 'hba1c', 'diabetes', 'glucose', 'fasting sugar'],
    price: 199,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Blood Sugar Test (FBS / PPBS)' }
  },
  {
    category: 'healthcare',
    service_id: 'blood-sugar',
    title: 'ब्लड शुगर और डायबिटीज जांच (FBS / PPBS / HbA1c)',
    question: 'ब्लड शुगर और फास्टिंग शुगर जांच की दर क्या है?',
    answer: 'डोरलिन पर फास्टिंग ब्लड शुगर (FBS) ₹149, पोस्ट प्रांडियल (PPBS) ₹149 और HbA1c 3 महीने का टेस्ट ₹349 में उपलब्ध है। घर बैठे सुरक्षित सैंपल कलेक्शन और डिजिटल रिपोर्ट।',
    language: 'HI',
    keywords: ['शुगर', 'ब्लड शुगर', 'डायबिटीज', 'मधुमेह', 'फास्टिंग', 'hba1c', 'fbs', 'ppbs'],
    price: 199,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Blood Sugar Test (FBS / PPBS)' }
  },
  {
    category: 'healthcare',
    service_id: 'blood-sugar',
    title: 'బ్లడ్ షుగర్ మరియు డయాబెటిస్ టెస్ట్ (FBS / PPBS / HbA1c)',
    question: 'బ్లడ్ షుగర్ మరియు ఫాస్టింగ్ షుగర్ టెస్ట్ ధర ఎంత?',
    answer: 'డోర్‌లిన్ లో ఫాస్టింగ్ బ్లడ్ షుగర్ (FBS) ₹149, భోజనం తర్వాత షుగర్ (PPBS) ₹149 మరియు 3 నెలల HbA1c టెస్ట్ ₹349 కే లభిస్తాయి. ఉచిత హోమ్ శాంపిల్ కలెక్షన్ మరియు ఏఐ డైట్ టిప్స్ అందుతాయి.',
    language: 'TE',
    keywords: ['షుగర్', 'బ్లడ్ షుగర్', 'డయాబెటిస్', 'మధుమేహం', 'ఫాస్టింగ్', 'hba1c', 'fbs', 'ppbs'],
    price: 199,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Blood Sugar Test (FBS / PPBS)' }
  },
  {
    category: 'healthcare',
    service_id: 'full-body',
    title: 'Full Body Master Health Checkup (68 Parameters)',
    question: 'What is included in the Full Body Health Checkup and what is the cost?',
    answer: 'Doorlyn Master Health Checkup is ₹999 (covers 68 parameters: CBC, Lipid/Cholesterol Profile, Liver Function LFT, Kidney Function KFT, Thyroid TSH & Fasting Sugar). Includes free tele-doctor consultation and historical health tracking.',
    language: 'EN',
    keywords: ['full body', 'checkup', 'master health', 'lipid', 'cholesterol', 'liver', 'lft', 'kidney', 'kft', 'thyroid', 'health package'],
    price: 999,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Full Body Checkup (Master Health Package)' }
  },
  {
    category: 'healthcare',
    service_id: 'full-body',
    title: 'फुल बॉडी मास्टर हेल्थ चेकअप (68 पैरामीटर्स)',
    question: 'फुल बॉडी चेकअप में क्या शामिल है और कितना खर्च आता है?',
    answer: 'डोरलिन मास्टर हेल्थ पैकेज मात्र ₹999 में उपलब्ध है (68 टेस्ट: सीबीसी, लिपिड/कोलेस्ट्रॉल, लिवर LFT, किडनी KFT, थायराइड और शुगर)। इसमें डॉक्टर का मुफ्त परामर्श और डिजिटल रिपोर्ट शामिल है।',
    language: 'HI',
    keywords: ['फुल बॉडी', 'मास्टर हेल्थ', 'हेल्थ चेकअप', 'कोलेस्ट्रॉल', 'लिवर', 'किडनी', 'थायराइड', 'पूरा चेकअप'],
    price: 999,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Full Body Checkup (Master Health Package)' }
  },
  {
    category: 'healthcare',
    service_id: 'full-body',
    title: 'ఫుల్ బాడీ మాస్టర్ హెల్త్ చెకప్ (68 పారామీటర్లు)',
    question: 'ఫుల్ బాడీ హెల్త్ చెకప్‌లో ఏయే టెస్టులు ఉంటాయి మరియు ఖర్చు ఎంత?',
    answer: 'డోర్‌లిన్ మాస్టర్ హెల్త్ చెకప్ కేవలం ₹999 కే లభిస్తుంది (68 టెస్టులు: CBC, లిపిడ్/కొలెస్ట్రాల్, లివర్ LFT, కిడ్నీ KFT, థైరాయిడ్ మరియు షుగర్). ఉచిత టెలీ-డాక్టర్ కన్సల్టేషన్ లభిస్తుంది.',
    language: 'TE',
    keywords: ['ఫుల్ బాడీ', 'హెల్త్ చెకప్', 'మాస్టర్ చెకప్', 'కొలెస్ట్రాల్', 'లివర్', 'కిడ్నీ', 'థైరాయిడ్', 'మొత్తం పరీక్ష'],
    price: 999,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Full Body Checkup (Master Health Package)' }
  },
  {
    category: 'healthcare',
    service_id: 'pcod-screening',
    title: 'Women PCOD / PCOS Hormone Screening',
    question: 'What tests are available for PCOD and PCOS?',
    answer: 'Doorlyn PCOD/PCOS Screening costs ₹1299 and includes FSH, LH, Prolactin, Fasting Insulin, and Free Testosterone. Female phlebotomists are available on request with personalized gynecologist report guide.',
    language: 'EN',
    keywords: ['pcod', 'pcos', 'women health', 'hormone', 'fsh', 'lh', 'prolactin', 'periods', 'female'],
    price: 1299,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Women\'s Health: PCOD / PCOS Screening' }
  },

  // =========================================================================
  // 2. HOME REPAIRS & KITCHEN (EN, HI, TE)
  // =========================================================================
  {
    category: 'repairs',
    service_id: 'electrician-services',
    title: 'Electrician & Fan Repair Services',
    question: 'What are the electrician charges, response time, and warranty? I need an electrician',
    answer: 'Doorlyn Electrician visit fee is ₹249. Includes fan repair & capacitor (₹199), switchboard/socket fitting (₹149), MCB fuse & wiring repair (₹249), and inverter setup (₹399). Verified technicians arrive as soon as possible.',
    language: 'EN',
    keywords: ['electrician', 'electric', 'fan', 'wiring', 'short circuit', 'switchboard', 'mcb', 'inverter', 'fuse', 'light'],
    price: 249,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Electricians' }
  },
  {
    category: 'repairs',
    service_id: 'electrician-services',
    title: 'इलेक्ट्रीशियन और पंखा रिपेयर सर्विस',
    question: 'इलेक्ट्रीशियन की विजिट फीस और वारंटी क्या है?',
    answer: 'डोरलिन इलेक्ट्रीशियन विजिट फीस ₹249 है। पंखा रिपेयर (₹199), स्विचबोर्ड फिटिंग (₹149), एमसीबी वायरिंग (₹249) और इन्वर्टर सेटअप (₹399)। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।',
    language: 'HI',
    keywords: ['इलेक्ट्रीशियन', 'बिजली', 'पंखा', 'फैन', 'वायरिंग', 'स्विच', 'शॉर्ट सर्किट', 'इन्वर्टर', 'mcb'],
    price: 249,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Electricians' }
  },
  {
    category: 'repairs',
    service_id: 'electrician-services',
    title: 'ఎలక్ట్రీషియన్ మరియు ఫ్యాన్ రిపేర్ సర్వీస్',
    question: 'ఎలక్ట్రీషియన్ ఛార్జీలు మరియు వారంటీ వివరాలు ఏమిటి?',
    answer: 'డోర్‌లిన్ ఎలక్ట్రీషియన్ విజిట్ ఫీజు ₹249. ఫ్యాన్ రిపేర్ (₹199), స్విచ్ బోర్డ్ ఫిట్టింగ్ (₹149), MCB వైరింగ్ (₹249) మరియు ఇన్వర్టర్ సెటప్ (₹399). వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.',
    language: 'TE',
    keywords: ['ఎలక్ట్రీషియన్', 'కరెంట్', 'ఫ్యాన్', 'వైరింగ్', 'స్విచ్ బోర్డ్', 'షార్ట్ సర్క్యూట్', 'ఇన్వర్టర్'],
    price: 249,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Electricians' }
  },
  {
    category: 'repairs',
    service_id: 'plumbing-services',
    title: 'Plumber - Tap, Pipe Leakage & Drain Cleaning',
    question: 'What are the plumber charges and services covered?',
    answer: 'Doorlyn Plumber visit fee is ₹199 / ₹299. Covers tap & faucet repair (₹149), sink & washbasin drain blockage removal (₹199), wall mixer fitting (₹299), and pipe leak sealing (₹349). Verified technicians arrive as soon as possible.',
    language: 'EN',
    keywords: ['plumber', 'plumbing', 'pipe', 'tap', 'leak', 'drain', 'sink', 'washbasin', 'water leakage', 'tank'],
    price: 199,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Plumbers' }
  },
  {
    category: 'repairs',
    service_id: 'plumbing-services',
    title: 'प्लंबर - नल, पाइप लीकेज और ड्रेन सफाई',
    question: 'प्लंबर की दरें और सेवाएं क्या हैं?',
    answer: 'डोरलिन प्लंबर विजिट फीस ₹199 है। नल रिपेयर (₹149), ड्रेन ब्लॉकेज हटाना (₹199), पाइप लीकेज सीलिंग (₹349) और शॉवर फिटिंग (₹299)। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।',
    language: 'HI',
    keywords: ['प्लंबर', 'नल', 'पाइप', 'लीकेज', 'ड्रेन', 'सिंक', 'पानी लीकेज', 'वॉशबेसिन'],
    price: 199,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Plumbers' }
  },
  {
    category: 'repairs',
    service_id: 'plumbing-services',
    title: 'ప్లంబర్ - నల్లా, పైప్ లీకేజ్ మరియు డ్రెయిన్ క్లీనింగ్',
    question: 'ప్లంబర్ రేట్లు మరియు సేవలు ఏమిటి?',
    answer: 'డోర్‌లిన్ ప్లంబర్ విజిట్ ఫీజు ₹199. నల్లా/ట్యాప్ రిపేర్ (₹149), సింక్ డ్రెయిన్ అన్‌బ్లాకింగ్ (₹199), పైప్ లీకేజ్ సీలింగ్ (₹349) మరియు షవర్ ఫిట్టింగ్ (₹299). వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.',
    language: 'TE',
    keywords: ['ప్లంబర్', 'నల్లా', 'ట్యాప్', 'పైప్', 'లీకేజ్', 'డ్రెయిన్', 'సింక్', 'నీటి లీకేజీ'],
    price: 199,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Plumbers' }
  },
  {
    category: 'repairs',
    service_id: 'carpenter-services',
    title: 'Carpenter - Furniture Repair & Lock Installation',
    question: 'What are the carpentry charges and services?',
    answer: 'Doorlyn Carpenter services start at ₹349. Includes door handle & Godrej lock installation (₹249), bed & dining table repair (₹349), and kitchen cabinet hinge alignment (₹299). Skilled craftsmen with 5+ years experience.',
    language: 'EN',
    keywords: ['carpenter', 'carpentry', 'wood', 'furniture', 'door lock', 'cabinet', 'bed repair', 'hinge'],
    price: 349,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Carpenters' }
  },
  {
    category: 'repairs',
    service_id: 'appliance-repair',
    title: 'Appliance Repair - AC, Refrigerator, Washing Machine, RO',
    question: 'How much does AC servicing or washing machine repair cost?',
    answer: 'Doorlyn Appliance Repair starts at ₹399. AC foam jet wash is ₹499, AC gas refill is ₹1299, washing machine motor/drain fix is ₹399, fridge repair is ₹449, and RO water purifier filter replacement is ₹349.',
    language: 'EN',
    keywords: ['appliance', 'ac', 'ac service', 'gas refill', 'washing machine', 'fridge', 'refrigerator', 'ro', 'water purifier'],
    price: 399,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Appliance Repair Technicians' }
  },

  // =========================================================================
  // 3. PICKUP & DROP SERVICE (EN, HI, TE)
  // =========================================================================
  {
    category: 'pickup-drop',
    service_id: 'small-parcel',
    title: 'Small Parcel Express Pickup & Drop',
    question: 'How does Doorlyn Express Parcel work and what is the rate?',
    answer: 'Doorlyn Express Parcel starts at ₹69 for up to 5kg local delivery. Nearest delivery rider is dispatched within 15 minutes. Features live GPS map tracking, weatherproof tamper-proof pouch, and secure 4-digit handover PIN.',
    language: 'EN',
    keywords: ['parcel', 'pickup', 'drop', 'courier', 'express', 'documents', 'keys', 'tiffin', 'rapido', 'delivery'],
    price: 69,
    metadata: { serviceCategory: 'Pickup & Drop', serviceName: 'Small Parcel Pickup & Drop' }
  },
  {
    category: 'pickup-drop',
    service_id: 'small-parcel',
    title: 'छोटा पार्सल एक्सप्रेस पिकअप & ड्रॉप',
    question: 'पार्सल डिलीवरी का चार्ज और समय क्या है?',
    answer: 'डोरलिन एक्सप्रेस पार्सल मात्र ₹69 से शुरू होता है (5 किलो तक)। 15 मिनट में राइडर पिकअप के लिए पहुंचेगा। लाइव जीपीएस ट्रैकिंग, वाटरप्रूफ पाउच और 4-अंकीय ओटीपी पिन सुरक्षा उपलब्ध है।',
    language: 'HI',
    keywords: ['पार्सल', 'पिकअप', 'ड्रॉप', 'कूरियर', 'डिलीवरी', 'दस्तावेज', 'चाबी', 'टिफिन'],
    price: 69,
    metadata: { serviceCategory: 'Pickup & Drop', serviceName: 'Small Parcel Pickup & Drop' }
  },
  {
    category: 'pickup-drop',
    service_id: 'small-parcel',
    title: 'చిన్న పార్శిల్ ఎక్స్‌ప్రెస్ పికప్ & డ్రాప్',
    question: 'పార్శిల్ డెలివరీ ఛార్జీ మరియు సమయం ఎంత?',
    answer: 'డోర్‌లిన్ ఎక్స్‌ప్రెస్ పార్శిల్ సేవలు కేవలం ₹69 నుండి ప్రారంభమవుతాయి (5 కేజీల వరకు). 15 నిమిషాల్లో డెలివరీ రైడర్ వస్తారు. లైవ్ GPS ట్రాకింగ్ మరియు 4-అంకెల సెక్యూరిటీ పిన్ సదుపాయం కలదు.',
    language: 'TE',
    keywords: ['పార్శిల్', 'పికప్', 'డ్రాప్', 'కొరియర్', 'డెలివరీ', 'కీలు', 'డాక్యుమెంట్స్', 'టిఫిన్'],
    price: 69,
    metadata: { serviceCategory: 'Pickup & Drop', serviceName: 'Small Parcel Pickup & Drop' }
  },

  // =========================================================================
  // 4. LOGISTICS & SHIFTING (EN, HI, TE)
  // =========================================================================
  {
    category: 'logistics',
    service_id: 'house-shifting',
    title: 'Local House & Office Shifting with Mini Truck',
    question: 'What is the price for house shifting and mini truck hire?',
    answer: 'Doorlyn House Shifting starts at ₹2499 (1BHK at ₹1999, 2BHK at ₹2999, 3BHK Villa at ₹4499). Includes dedicated Tata Ace / Bolero mini truck, experienced loading helpers, multi-layer bubble packing, and furniture dismantling/reassembly.',
    language: 'EN',
    keywords: ['shifting', 'house shifting', 'packers', 'movers', 'truck', 'tata ace', 'bolero', 'relocation', 'logistics', 'office shifting'],
    price: 2499,
    metadata: { serviceCategory: 'Logistics & Shifting', serviceName: 'Local House Shifting' }
  },
  {
    category: 'logistics',
    service_id: 'house-shifting',
    title: 'लोकल हाउस व ऑफिस शिफ्टिंग और मिनी ट्रक',
    question: 'घर बदलने और मिनी ट्रक का खर्च कितना है?',
    answer: 'डोरलिन हाउस शिफ्टिंग ₹2499 से शुरू होती है (1BHK ₹1999, 2BHK ₹2999, 3BHK ₹4499)। इसमें टाटा ऐस/बोलेरो मिनी ट्रक, सामान उठाने वाले हेल्पर, बबल रैप पैकिंग और फर्नीचर असेंबली शामिल हैं।',
    language: 'HI',
    keywords: ['शिफ्टिंग', 'घर बदलना', 'पैकर्स', 'मूवर्स', 'ट्रक', 'टाटा ऐस', 'लॉजिस्टिक्स'],
    price: 2499,
    metadata: { serviceCategory: 'Logistics & Shifting', serviceName: 'Local House Shifting' }
  },
  {
    category: 'logistics',
    service_id: 'house-shifting',
    title: 'లోకల్ హౌస్ & ఆఫీస్ షిఫ్టింగ్ మరియు మినీ ట్రక్',
    question: 'ఇల్లు షిఫ్టింగ్ మరియు మినీ ట్రక్ బుకింగ్ ఛార్జ్ ఎంత?',
    answer: 'డోర్‌లిన్ హౌస్ షిఫ్టింగ్ ₹2499 నుండి ప్రారంభమవుతుంది (1BHK ₹1999, 2BHK ₹2999, 3BHK ₹4499). టాటా ఏస్/బొలెరో మినీ ట్రక్, హెల్పర్లు, బబుల్ ర్యాప్ ప్యాకింగ్ మరియు ఫర్నిచర్ అసెంబ్లింగ్ అన్నీ ఉంటాయి.',
    language: 'TE',
    keywords: ['షిఫ్టింగ్', 'ఇల్లు మారడం', 'మినీ ట్రక్', 'టాటా ఏస్', 'ప్యాకర్స్', 'మూవర్స్', 'లాజిస్టిక్స్'],
    price: 2499,
    metadata: { serviceCategory: 'Logistics & Shifting', serviceName: 'Local House Shifting' }
  },

  // =========================================================================
  // 5. GROCERIES & ESSENTIALS (EN, HI, TE)
  // =========================================================================
  {
    category: 'groceries',
    service_id: 'fresh-veg-fruits',
    title: '15-Minute Express Grocery Delivery & Farm Fresh Produce',
    question: 'How fast is grocery delivery and what items are available? Book a grocery delivery',
    answer: 'Doorlyn delivers groceries in 15 minutes from local dark stores with free delivery on orders above ₹149. Essential veggie baskets start at ₹199, monthly staples pack (Rice, Dal, Oil, Ghee) at ₹899, fresh dairy milk & curd at ₹149.',
    language: 'EN',
    keywords: ['grocery', 'groceries', 'book a grocery delivery', 'grocery delivery', 'vegetables', 'fruits', 'milk', 'curd', 'rice', 'dal', 'oil', 'ghee', '15 min delivery', 'kirana'],
    price: 199,
    metadata: { serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
  },
  {
    category: 'groceries',
    service_id: 'fresh-veg-fruits',
    title: '15-मिनट एक्सप्रेस ग्रोसरी डिलीवरी और ताजी सब्जियां',
    question: 'किराना सामान कितनी देर में डिलीवर होता है और क्या उपलब्ध है? ग्रोसरी डिलीवरी बुक करें',
    answer: 'डोरलिन से ताजी सब्जियां, दूध, राशन व दालें मात्र 15 मिनट में घर पहुंचाई जाती हैं। ₹149 से ऊपर के ऑर्डर पर फ्री डिलीवरी। डेली वेज बास्केट ₹199, किचन राशन पैक ₹899 और दूध-दही ₹149 में उपलब्ध।',
    language: 'HI',
    keywords: ['किराना', 'राशन', 'ग्रोसरी डिलीवरी', 'ग्रोसरी', 'सब्जी', 'फल', 'दूध', 'दही', 'चावल', 'दाल', 'तेल', '15 मिनट डिलीवरी'],
    price: 199,
    metadata: { serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
  },
  {
    category: 'groceries',
    service_id: 'fresh-veg-fruits',
    title: '15-నిమిషాల ఎక్స్‌ప్రెస్ గ్రోసరీ డెలివరీ మరియు తాజా కూరగాయలు',
    question: 'గ్రోసరీ ఎంత సమయంలో డెలివరీ అవుతుంది మరియు ఏయే వస్తువులు ఉన్నాయి? గ్రోసరీ డెలివరీ బుక్ చేయండి',
    answer: 'డోర్‌లిన్ తాజా కూరగాయలు, పాలు, నిత్యావసరాలను 15 నిమిషాల్లో మీ ఇంటికి డెలివరీ చేస్తుంది. ₹149 పైన ఆర్డర్లకు ఉచిత డెలివరీ. డైలీ వెజ్ బాస్కెట్ ₹199, కిచెన్ స్టేపుల్స్ ప్యాక్ ₹899 లభిస్తాయి.',
    language: 'TE',
    keywords: ['గ్రోసరీ', 'గ్రోసరీ డెలివరీ', 'కూరగాయలు', 'పండ్లు', 'పాలు', 'పెరుగు', 'బియ్యం', 'పప్పు', 'నూనె', '15 నిమిషాలు'],
    price: 199,
    metadata: { serviceCategory: 'Grocery & Daily Essentials', serviceName: 'Doorlyn 15-Min Express Grocery' }
  },

  // =========================================================================
  // 6. WORKER MARKETPLACE (EN, HI, TE)
  // =========================================================================
  {
    category: 'worker-market',
    service_id: 'daily-wage-worker',
    title: 'Verified Daily Wage Workers, Masons (Mestri) & Cleaning',
    question: 'What are the daily wage rates for labor and masons?',
    answer: 'Doorlyn Worker Marketplace provides Aadhaar-verified workers: General Daily Wage Labor at ₹600/day (Half-day ₹349), Senior Mason (Mestri) at ₹900/day, Full Home Deep Cleaning at ₹1199, and Water Tank Cleaning at ₹599.',
    language: 'EN',
    keywords: ['worker', 'labor', 'daily wage', 'mason', 'mestri', 'coolie', 'cleaning', 'deep clean', 'tank cleaning', 'helper'],
    price: 600,
    metadata: { serviceCategory: 'Worker Marketplace', serviceName: 'Daily Wage Workers' }
  },
  {
    category: 'worker-market',
    service_id: 'daily-wage-worker',
    title: 'सत्यापित दिहाड़ी मजदूर, मिस्त्री और सफाई कर्मचारी',
    question: 'मजदूर और मिस्त्री का प्रतिदिन का किराया क्या है?',
    answer: 'डोरलिन पर आधार-सत्यापित कामगार उपलब्ध हैं: सामान्य दिहाड़ी मजदूर ₹600/दिन (हाफ डे ₹349), हेड मिस्त्री ₹900/दिन, घर की डीप क्लीनिंग ₹1199 और पानी की टंकी सफाई ₹599।',
    language: 'HI',
    keywords: ['मजदूर', 'दिहाड़ी', 'मिस्त्री', 'लेबर', 'सफाई', 'क्लीनिंग', 'टंकी सफाई', 'हेल्पर'],
    price: 600,
    metadata: { serviceCategory: 'Worker Marketplace', serviceName: 'Daily Wage Workers' }
  },
  {
    category: 'worker-market',
    service_id: 'daily-wage-worker',
    title: 'వెరిఫైడ్ దినసరి కూలీలు, మేస్త్రీ మరియు క్లీనింగ్ సేవలు',
    question: 'కూలీలు మరియు మేస్త్రీ రోజువారీ ఛార్జీ ఎంత?',
    answer: 'డోర్‌లిన్ ఆధార్-ధృవీకరించబడిన వర్కర్లను అందిస్తుంది: సాధారణ దినసరి కూలీ ₹600/రోజు (హాఫ్ డే ₹349), హెడ్ మేస్త్రీ ₹900/రోజు, ఫుల్ హోమ్ డీప్ క్లీనింగ్ ₹1199, వాటర్ ట్యాంక్ క్లీనింగ్ ₹599.',
    language: 'TE',
    keywords: ['కూలీ', 'దినసరి', 'మేస్త్రీ', 'లేబర్', 'క్లీనింగ్', 'ట్యాంక్ క్లీనింగ్', 'హెల్పర్'],
    price: 600,
    metadata: { serviceCategory: 'Worker Marketplace', serviceName: 'Daily Wage Workers' }
  },

  // =========================================================================
  // 7. STUDENT TUTORS & SERVICES (EN, HI, TE)
  // =========================================================================
  {
    category: 'student-services',
    service_id: 'home-tutor',
    title: 'Home & Online Tutors (Class 1st - 10th & Intermediate)',
    question: 'What are the tutor fees and teaching subjects?',
    answer: 'Doorlyn Home Tutors start at ₹2500/month or ₹299/hour for personalized 1-on-1 teaching in Maths, Science, English, and regional languages. Primary tuition is ₹1800/mo, High School ₹2500/mo, Intermediate MPC/BiPC coaching is ₹3500/mo.',
    language: 'EN',
    keywords: ['tutor', 'tuition', 'teacher', 'home tutor', 'online tutor', 'maths', 'science', 'exam', 'student', 'coaching'],
    price: 299,
    metadata: { serviceCategory: 'Student Tutors & Services', serviceName: 'Home & Online Tutor Service' }
  },
  {
    category: 'student-services',
    service_id: 'home-tutor',
    title: 'होम व ऑनलाइन ट्यूटर (कक्षा 1 से 10 व इंटरमीडिएट)',
    question: 'होम ट्यूटर की फीस और विषय क्या हैं?',
    answer: 'डोरलिन होम ट्यूटर सेवा ₹299/घंटा या ₹2500/माह से शुरू होती है (गणित, विज्ञान, अंग्रेजी और अन्य विषय)। प्राइमरी ट्यूशन ₹1800/माह, हाई स्कूल ₹2500/माह और इंटरमीडिएट ₹3500/माह में उपलब्ध है।',
    language: 'HI',
    keywords: ['ट्यूटर', 'ट्यूशन', 'शिक्षक', 'टीचर', 'होम ट्यूटर', 'पढ़ाई', 'गणित', 'साइंस', 'कोचिंग'],
    price: 299,
    metadata: { serviceCategory: 'Student Tutors & Services', serviceName: 'Home & Online Tutor Service' }
  },
  {
    category: 'student-services',
    service_id: 'home-tutor',
    title: 'హోమ్ & ఆన్‌లైన్ ట్యూటర్స్ (1వ నుండి 10వ తరగతి & ఇంటర్)',
    question: 'హోమ్ ట్యూటర్ ఫీజులు మరియు సబ్జెక్టుల వివరాలు ఏమిటి?',
    answer: 'డోర్‌లిన్ హోమ్ ట్యూటర్ సర్వీస్ ₹299/గంట లేదా ₹2500/నెల నుండి లభిస్తుంది (మ్యాథ్స్, సైన్స్, ఇంగ్లీష్, తెలుగు). ప్రైమరీ ట్యూషన్ ₹1800/నెల, హైస్కూల్ ₹2500/నెల మరియు ఇంటర్మీడియట్ ₹3500/నెల ఉంటుంది.',
    language: 'TE',
    keywords: ['ట్యూటర్', 'ట్యూషన్', 'టీచర్', 'హోమ్ ట్యూటర్', 'చదువు', 'లెక్కలు', 'సైన్స్', 'కోచింగ్'],
    price: 299,
    metadata: { serviceCategory: 'Student Tutors & Services', serviceName: 'Home & Online Tutor Service' }
  },

  // =========================================================================
  // 8. CATERING & EVENT SUPPORT (EN, HI, TE)
  // =========================================================================
  {
    category: 'catering',
    service_id: 'wedding-catering',
    title: 'Event, Wedding & Birthday Catering (Per Plate)',
    question: 'What are the catering prices per plate and menu options?',
    answer: 'Doorlyn Event Catering offers FSSAI hygiene certified multi-course feasts: Traditional Veg Buffet at ₹299/plate, Royal Non-Veg Biryani Feast at ₹450/plate, and Birthday Party Snack Combos at ₹249/plate. Includes buffet setup, crockery, and servers.',
    language: 'EN',
    keywords: ['catering', 'caterer', 'food', 'wedding', 'birthday', 'buffet', 'biryani', 'plates', 'party', 'cook'],
    price: 299,
    metadata: { serviceCategory: 'Food & Catering Services', serviceName: 'Event & Bulk Catering Service' }
  },
  {
    category: 'catering',
    service_id: 'wedding-catering',
    title: 'इवेंट, शादी और जन्मदिन कैटरिंग (प्रति प्लेट)',
    question: 'कैटरिंग का प्रति प्लेट खर्च और मेनू क्या है?',
    answer: 'डोरलिन कैटरिंग सेवा में एफएसएसएआई (FSSAI) प्रमाणित भोजन उपलब्ध है: वेज बुफे ₹299/प्लेट, नॉन-वेज बिरयानी दावत ₹450/प्लेट और बर्थडे स्नैक पैक ₹249/प्लेट। क्रॉकरी, सर्विंग स्टाफ और वेन्यू सेटअप शामिल है।',
    language: 'HI',
    keywords: ['कैटरिंग', 'खाना', 'शादी', 'बर्थडे', 'बुफे', 'बिरयानी', 'प्लेट', 'पार्टी', 'हलवाई'],
    price: 299,
    metadata: { serviceCategory: 'Food & Catering Services', serviceName: 'Event & Bulk Catering Service' }
  },
  {
    category: 'catering',
    service_id: 'wedding-catering',
    title: 'ఈవెంట్, వివాహం & బర్త్‌డే కేటరింగ్ (ప్లేట్ చొప్పున)',
    question: 'కేటరింగ్ ప్లేట్ ధర మరియు మెనూ వివరాలు ఏమిటి?',
    answer: 'డోర్‌లిన్ కేటరింగ్ సేవల్లో FSSAI సర్టిఫైడ్ రుచికరమైన భోజనం లభిస్తుంది: వెజ్ బుఫే ₹299/ప్లేట్, రాయల్ దమ్ బిర్యానీ నాన్-వెజ్ ఫీస్ట్ ₹450/ప్లేట్ మరియు బర్త్‌డే ప్యాక్ ₹249/ప్లేట్. క్రాకరీ, సర్వింగ్ స్టాఫ్ సెటప్ చేర్చబడింది.',
    language: 'TE',
    keywords: ['కేటరింగ్', 'భోజనం', 'వివాహం', 'పెళ్లి', 'బర్త్‌డే', 'బిర్యానీ', 'బుఫే', 'ప్లేట్లు', 'వంట'],
    price: 299,
    metadata: { serviceCategory: 'Food & Catering Services', serviceName: 'Event & Bulk Catering Service' }
  },

  // =========================================================================
  // 9. GENERAL, IVRS HELPLINE & WALLET (EN, HI, TE)
  // =========================================================================
  {
    category: 'general',
    service_id: 'ivrs-helpline',
    title: 'Doorlyn Voice IVRS Toll-Free Helpline',
    question: 'How do I call Doorlyn helpline or use the IVRS phone system?',
    answer: 'You can call Doorlyn 24/7 Toll-Free IVRS Hotline at 1800-DOORLYN (1800-366-7596). Supports English, Hindi, and Telugu automated voice booking and live technician transfer with zero internet required.',
    language: 'EN',
    keywords: ['ivrs', 'helpline', 'call', 'toll free', 'phone', 'support', 'customer care', 'hotline', '1800'],
    price: 0,
    metadata: { serviceCategory: 'Customer Support', serviceName: 'Doorlyn IVRS Voice Helpline' }
  },
  {
    category: 'general',
    service_id: 'ivrs-helpline',
    title: 'डोरलिन वॉइस आईवीआरएस टोल-फ्री हेल्पलाइन',
    question: 'डोरलिन हेल्पलाइन पर कॉल कैसे करें?',
    answer: 'आप डोरलिन की 24/7 टोल-फ्री हेल्पलाइन 1800-DOORLYN (1800-366-7596) पर कॉल कर सकते हैं। यह बिना इंटरनेट के हिंदी, अंग्रेजी और तेलुगु में वॉयस बुकिंग की सुविधा देता है।',
    language: 'HI',
    keywords: ['आईवीआरएस', 'हेल्पलाइन', 'कॉल', 'फोन', 'टोल फ्री', 'कस्टमर केयर', '1800', 'ivrs'],
    price: 0,
    metadata: { serviceCategory: 'Customer Support', serviceName: 'Doorlyn IVRS Voice Helpline' }
  },
  {
    category: 'general',
    service_id: 'ivrs-helpline',
    title: 'డోర్‌లిన్ వాయిస్ IVRS టోల్-ఫ్రీ హెల్ప్‌లైన్',
    question: 'డోర్‌లిన్ హెల్ప్‌లైన్‌కి ఎలా కాల్ చేయాలి?',
    answer: 'మీరు 24/7 డోర్‌లిన్ ఉచిత టోల్-ఫ్రీ హెల్ప్‌లైన్ 1800-DOORLYN (1800-366-7596) కు కాల్ చేయవచ్చు. ఇంటర్నెట్ లేకుండా తెలుగు, హిందీ, ఇంగ్లీషులలో నేరుగా వాయిస్ బుకింగ్ చేసుకోవచ్చు.',
    language: 'TE',
    keywords: ['ఐవిఆర్ఎస్', 'హెల్ప్‌లైన్', 'కాల్', 'ఫోన్', 'టోల్ ఫ్రీ', 'కస్టమర్ కేర్', '1800', 'ivrs'],
    price: 0,
    metadata: { serviceCategory: 'Customer Support', serviceName: 'Doorlyn IVRS Voice Helpline' }
  },
  {
    category: 'general',
    service_id: 'wallet-policy',
    title: 'Doorlyn Wallet, Signup Bonus & Payment Methods',
    question: 'How does the Doorlyn wallet work and what payment methods are accepted?',
    answer: 'Every new Doorlyn user receives ₹200 bonus credit upon registration. We accept UPI (Google Pay, PhonePe, Paytm), Cash/UPI on Delivery, Debit/Credit Cards, and Doorlyn Wallet with instant 100% refund guarantee on cancellations.',
    language: 'EN',
    keywords: ['wallet', 'bonus', 'balance', 'payment', 'upi', 'cash', 'refund', 'money', 'discount', 'coupon'],
    price: 0,
    metadata: { serviceCategory: 'Wallet & Account', serviceName: 'Doorlyn Wallet & Payments' }
  },

  // =========================================================================
  // 10. CANCELLATION, REFUNDS, COUPONS & SERVICE GUARANTEES (EN, HI, TE)
  // =========================================================================
  {
    category: 'general',
    service_id: 'cancellation-policy',
    title: 'Doorlyn Cancellation & Refund Policy',
    question: 'What is the cancellation policy? Can I cancel my booking and get a refund?',
    answer: 'Cancellations are 100% free before the service partner or phlebotomist is dispatched. If cancelled, any prepaid amount is credited instantly to your Doorlyn Wallet or refunded back to your original payment method within 24 hours. No hidden charges or cancellation fees.',
    language: 'EN',
    keywords: ['cancellation', 'cancel', 'refund', 'money back', 'free cancellation', 'policy', 'charges'],
    price: 0,
    metadata: { serviceCategory: 'Customer Policy', serviceName: 'Cancellation & Refund Policy' }
  },
  {
    category: 'general',
    service_id: 'cancellation-policy',
    title: 'डोरलिन रद्दीकरण और धन वापसी (Refund) नीति',
    question: 'कैंसिलेशन पॉलिसी क्या है? क्या मैं अपनी बुकिंग रद्द करके रिफंड पा सकता हूँ?',
    answer: 'सर्विस पार्टनर या लैब तकनीशियन के निकलने से पहले बुकिंग रद्द करना 100% मुफ्त है। रद्द करने पर पूरी राशि तुरंत आपके डोरलिन वॉलेट में या 24 घंटे के भीतर आपके मूल भुगतान खाते में वापस जमा कर दी जाती है।',
    language: 'HI',
    keywords: ['कैंसिलेशन', 'रद्द', 'रिफंड', 'पैसे वापस', 'रिफंड नीति', 'कैंसिल'],
    price: 0,
    metadata: { serviceCategory: 'Customer Policy', serviceName: 'Cancellation & Refund Policy' }
  },
  {
    category: 'general',
    service_id: 'cancellation-policy',
    title: 'డోర్‌లిన్ రద్దు మరియు రీఫండ్ విధానం',
    question: 'క్యాన్సిలేషన్ విధానం ఏమిటి? నేను బుకింగ్ రద్దు చేసి రీఫండ్ పొందవచ్చా?',
    answer: 'సర్వీస్ పార్ట్‌నర్ బయలుదేరడానికి ముందు బుకింగ్ రద్దు చేయడం 100% ఉచితం. రద్దు చేసినట్లయితే, చెల్లించిన మొత్తం తక్షణమే మీ డోర్‌లిన్ వాలెట్‌లో జమవుతుంది లేదా 24 గంటల్లో మీ బ్యాంక్ ఖాతాకు రీఫండ్ అవుతుంది.',
    language: 'TE',
    keywords: ['క్యాన్సిలేషన్', 'రద్దు', 'రీఫండ్', 'డబ్బులు వెనక్కి', 'క్యాన్సిల్'],
    price: 0,
    metadata: { serviceCategory: 'Customer Policy', serviceName: 'Cancellation & Refund Policy' }
  },
  {
    category: 'general',
    service_id: 'coupons-discounts',
    title: 'Doorlyn Promo Coupons & Discount Offers',
    question: 'What coupon codes or discounts are available? How to get discount on service?',
    answer: 'Available coupons: 1) FIRSTDOOR — Flat ₹150 OFF on your 1st booking (min order ₹300). 2) HEALTH50 — Save ₹200 on Healthcare & Diagnostics (min order ₹500). 3) RURAL20 — Special ₹100 discount for senior citizens and rural bookings. Apply codes during checkout or ask Doorlyn AI!',
    language: 'EN',
    keywords: ['coupon', 'coupons', 'discount', 'promo', 'offer', 'code', 'firstdoor', 'health50', 'cheap', 'save'],
    price: 0,
    metadata: { serviceCategory: 'Promotions', serviceName: 'Coupons & Discounts' }
  },
  {
    category: 'general',
    service_id: 'coupons-discounts',
    title: 'डोरलिन कूपन कोड और डिस्काउंट ऑफर',
    question: 'क्या कोई कूपन कोड या डिस्काउंट उपलब्ध है?',
    answer: 'उपलब्ध कूपन: 1) FIRSTDOOR — पहली बुकिंग पर ₹150 की छूट। 2) HEALTH50 — हेल्थकेयर टेस्ट पर ₹200 की छूट। 3) RURAL20 — ग्रामीण और वरिष्ठ नागरिकों के लिए ₹100 की छूट। चेकआउट के समय कोड दर्ज करें!',
    language: 'HI',
    keywords: ['कूपन', 'डिस्काउंट', 'ऑफर', 'प्रमोशन', 'छूट', 'कोड', 'firstdoor'],
    price: 0,
    metadata: { serviceCategory: 'Promotions', serviceName: 'Coupons & Discounts' }
  },
  {
    category: 'general',
    service_id: 'coupons-discounts',
    title: 'డోర్‌లిన్ కూపన్ కోడ్‌లు మరియు డిస్కౌంట్ ఆఫర్లు',
    question: 'ఏవైనా కూపన్ కోడ్‌లు లేదా డిస్కౌంట్లు ఉన్నాయా?',
    answer: 'లభ్యమయ్యే కూపన్లు: 1) FIRSTDOOR — మొదటి బుకింగ్‌పై ₹150 తగ్గింపు. 2) HEALTH50 — హెల్త్‌కేర్ పరీక్షలపై ₹200 తగ్గింపు. 3) RURAL20 — సీనియర్ సిటిజన్లు మరియు గ్రామీణ ప్రాంతాలకు ₹100 తగ్గింపు. చెకౌట్ సమయంలో ఉపయోగించండి!',
    language: 'TE',
    keywords: ['కూపన్', 'డిస్కౌంట్', 'ఆఫర్', 'తగ్గింపు', 'కోడ్', 'firstdoor'],
    price: 0,
    metadata: { serviceCategory: 'Promotions', serviceName: 'Coupons & Discounts' }
  },
  {
    category: 'repairs',
    service_id: 'appliance-detailed-rates',
    title: 'AC Servicing, Gas Refill & Appliance Repair Rates',
    question: 'What are the charges for AC foam servicing, gas refill, and washing machine repair?',
    answer: 'Doorlyn Appliance Rates: AC Foam Jet Servicing at ₹499 (indoor/outdoor deep wash), AC Gas Refill (R32/R410) at ₹1299, Washing Machine Motor/Drain Pump repair at ₹399, Refrigerator Cooling fix at ₹449, and RO Water Purifier filter replacement at ₹349. Verified technicians arrive as soon as possible.',
    language: 'EN',
    keywords: ['ac service', 'ac repair', 'gas refill', 'foam wash', 'washing machine', 'fridge repair', 'ro filter', 'appliance rates'],
    price: 499,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Appliance Repair Rates' }
  },
  {
    category: 'repairs',
    service_id: 'painting-waterproofing-rates',
    title: 'Wall Painting & Waterproofing Seepage Rates',
    question: 'How much does single room painting and wall dampness waterproofing cost?',
    answer: 'Doorlyn Painting & Waterproofing: Single Room Repaint (putty + primer + 2 coats Asian Paints) at ₹1499, Wall Seepage & Dampness Polymer Treatment at ₹1999. Includes color consultation and dust-free machine sanding.',
    language: 'EN',
    keywords: ['painting', 'waterproofing', 'wall dampness', 'seepage', 'paint cost', 'room repaint', 'asian paints'],
    price: 1499,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Painting & Waterproofing Rates' }
  },
  {
    category: 'worker-market',
    service_id: 'tank-home-cleaning-rates',
    title: 'Water Tank Cleaning & Full Home Deep Cleaning Rates',
    question: 'What are the rates for overhead water tank cleaning and 2BHK deep home cleaning?',
    answer: 'Doorlyn Cleaning Rates: Overhead 1000L PVC Water Tank Cleaning (6-stage UV disinfection) at ₹599, Underground Sump Cleaning (5000L) at ₹999, Bathroom Deep Scrubbing at ₹499/bath, Kitchen Oil Degreasing at ₹799, and Full 2BHK House Deep Cleaning at ₹1999.',
    language: 'EN',
    keywords: ['tank cleaning', 'water tank', 'home cleaning', 'deep cleaning', 'bathroom cleaning', 'kitchen cleaning', 'sump cleaning'],
    price: 599,
    metadata: { serviceCategory: 'Worker Marketplace', serviceName: 'Deep Cleaning & Tank Purification' }
  },

  // =========================================================================
  // 11. INDIVIDUAL SERVICE DETAILS & SPECIFIC SUB-SERVICE PRICING (EN, HI, TE)
  // =========================================================================
  {
    category: 'healthcare',
    service_id: 'antenatal-checkup',
    title: 'Pregnancy Care & Antenatal Blood Test Panel',
    question: 'What is included in the pregnancy antenatal checkup and what is the cost?',
    answer: 'Doorlyn Antenatal Pregnancy Panel is ₹1499 for 1st Trimester (includes Blood Grouping & Rh Type, Hemoglobin & Iron, HIV/HBsAg viral screening, and Urine routine) and ₹1299 for 2nd Trimester OGTT Glucose & Ferritin. Priority morning home sample collection by female phlebotomists.',
    language: 'EN',
    keywords: ['pregnancy', 'antenatal', 'pregnant', 'blood group', 'rh factor', 'hiv', 'hbsag', 'iron', 'trimester', 'baby'],
    price: 1499,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Antenatal Checkup (Pregnancy Care)' }
  },
  {
    category: 'healthcare',
    service_id: 'thyroid-test',
    title: 'Thyroid Profile Test (T3, T4, Ultrasensitive TSH)',
    question: 'How much does a thyroid test cost and what are T3 T4 TSH details?',
    answer: 'Doorlyn Thyroid Testing: Ultrasensitive TSH Screening at ₹249, Total Thyroid Profile (T3 + T4 + TSH) at ₹449, and Free Active Thyroid Profile (FT3 + FT4 + TSH) at ₹699. Fasting required for 8 hours. Uses CLIA technology for maximum accuracy.',
    language: 'EN',
    keywords: ['thyroid', 'tsh', 't3', 't4', 'ft3', 'ft4', 'hypothyroidism', 'hyperthyroidism', 'metabolism', 'weight'],
    price: 449,
    metadata: { serviceCategory: 'Healthcare & Diagnostic', serviceName: 'Thyroid Profile Test' }
  },
  {
    category: 'repairs',
    service_id: 'carpenter-services',
    title: 'Carpenter Furniture Repair & Godrej Door Lock Installation',
    question: 'What are the charges for door lock installation and furniture repair?',
    answer: 'Doorlyn Carpenter Rates: Godrej/Europa Main Door Lock & Latch Fitting at ₹249, Bed & Dining Table Wooden Repair at ₹349, and Modular Kitchen Cabinet Hinge Alignment at ₹299. Skilled craftsmen with 5+ years experience.',
    language: 'EN',
    keywords: ['carpenter', 'door lock', 'godrej lock', 'furniture repair', 'cabinet', 'hinge', 'latch', 'wooden bed'],
    price: 349,
    metadata: { serviceCategory: 'Home Repairs', serviceName: 'Carpenters' }
  },
  {
    category: 'pickup-drop',
    service_id: 'express-luggage-gift',
    title: 'Same Day Delivery, Gift Flowers & Railway Luggage Drop',
    question: 'What are the rates for same day delivery, gifts, and railway station luggage drop?',
    answer: 'Doorlyn Delivery Options: Guaranteed 2-Hour Express Delivery at ₹129, Heavy Box Parcel (up to 15kg) at ₹179, Cake & Flower Surprise Drop with custom greeting note at ₹99, and Railway Station / Bus Stand Heavy Luggage Drop at ₹199.',
    language: 'EN',
    keywords: ['same day delivery', 'express delivery', 'gift delivery', 'cake delivery', 'flowers', 'luggage drop', 'railway station', 'bus stand'],
    price: 129,
    metadata: { serviceCategory: 'Pickup & Drop', serviceName: 'Express Goods & Gift Delivery' }
  },
  {
    category: 'logistics',
    service_id: 'office-truck-hire',
    title: 'Office Relocation & Tata Ace / Bolero Pickup Hire',
    question: 'What are the rates for office shifting and renting Tata Ace Chota Hathi?',
    answer: 'Doorlyn Logistics Rates: Small Office Relocation (up to 10 workstations with anti-static IT packing) at ₹4999, Corporate Overnight Shift at ₹8999, Tata Ace (Chota Hathi) Mini Truck Rent at ₹799 for first 5km, and Mahindra Bolero Open Pickup at ₹999 for first 5km.',
    language: 'EN',
    keywords: ['office shifting', 'office relocation', 'tata ace', 'chota hathi', 'bolero pickup', 'truck hire', 'mini truck'],
    price: 799,
    metadata: { serviceCategory: 'Logistics & Shifting', serviceName: 'Office Move & Truck Hire' }
  },
  {
    category: 'student-services',
    service_id: 'epass-scholarship-counseling',
    title: 'Epass Scholarship Form Help & College Career Counseling',
    question: 'How to get help with Epass government scholarship application and college counseling?',
    answer: 'Doorlyn Student Services: Epass & Govt Scholarship Online Application & Document Upload Assistance at ₹299, 1-on-1 College Entrance & Stream Career Counseling Session at ₹499.',
    language: 'EN',
    keywords: ['epass', 'scholarship', 'scholarship form', 'college counseling', 'career guidance', 'student help'],
    price: 299,
    metadata: { serviceCategory: 'Student Tutors & Services', serviceName: 'Scholarship & Career Guidance' }
  },
  {
    category: 'catering',
    service_id: 'birthday-pooja-catering',
    title: 'Birthday Party Meal Box, Balloon Decor & Satvik Pooja Catering',
    question: 'What are the charges for birthday party catering, balloon decor, and satvik pooja meals?',
    answer: 'Doorlyn Event Special Combos: Kid Birthday Snack Box (mini burger, fries, pasta, juice) at ₹249/plate, Birthday Food + Arch Balloon Decor + Sound System Combo at ₹6999 (50 plates), Satyanarayana Swamy Pooja Satvik Catering (no onion/garlic) at ₹299/plate, and Corporate Bento Box Lunch at ₹199/plate.',
    language: 'EN',
    keywords: ['birthday catering', 'balloon decor', 'pooja catering', 'satvik food', 'bento box', 'corporate lunch', 'sound system'],
    price: 249,
    metadata: { serviceCategory: 'Food & Catering Services', serviceName: 'Party Decor & Satvik Catering' }
  }
];

// Minimum relevance threshold to avoid false positive matches
const MIN_RELEVANCE_THRESHOLD = 150;

/**
 * Normalizes query string:
 * - lowercase
 * - trim whitespace
 * - remove punctuation
 * - normalize repeated spaces
 */
export function normalizeQuery(raw) {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .trim()
    .replace(/[^\w\s\u0900-\u097F\u0C00-\u0C7F]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts candidate questions from a knowledge row question field
 */
export function extractCandidateQuestions(item) {
  if (!item) return [];
  const qStr = item.question || '';
  const parts = qStr.split(/[?.;\n]+/);
  const candidates = [];

  for (const part of parts) {
    const norm = normalizeQuery(part);
    if (norm && norm.length >= 2) {
      if (!candidates.includes(norm)) {
        candidates.push(norm);
      }
    }
  }

  const fullNorm = normalizeQuery(qStr);
  if (fullNorm && !candidates.includes(fullNorm)) {
    candidates.push(fullNorm);
  }

  return candidates;
}

const GENERIC_DOORLYN_PATTERNS = [
  'what is doorlyn',
  'what is doorlyn ai',
  'tell me about doorlyn',
  'what does doorlyn do',
  'about doorlyn',
  'doorlyn info',
  'who is doorlyn',
  'doorlyn kya hai',
  'डोरलिन क्या है',
  'डोरलिन के बारे में बताएं',
  'डोरलिन क्या काम करता है',
  'డోర్‌లిన్ అంటే ఏమిటి',
  'డోర్‌లిన్ గురించి చెప్పండి',
  'డోర్‌లిన్ ఏమి చేస్తుంది',
  'doorlyn'
];

function isGenericDoorlynQuery(qNorm) {
  if (GENERIC_DOORLYN_PATTERNS.includes(qNorm)) return true;

  if (qNorm.includes('doorlyn')) {
    const specificServiceKeywords = [
      'blood', 'cbc', 'sugar', 'diabetes', 'test', 'health', 'doctor', 'lab', 'checkup',
      'electrician', 'repair', 'plumber', 'carpenter', 'ac', 'parcel', 'courier', 'shift',
      'truck', 'grocery', 'groceries', 'labor', 'worker', 'tutor', 'tuition', 'catering',
      'driver', 'track', 'tracking', 'order', 'booking', 'price', 'cost',
      'ब्लड', 'टेस्ट', 'सीबीसी', 'इलेक्ट्रीशियन', 'किराना', 'ट्रैक',
      'బ్లడ్', 'టెస్ట్', 'సిబిసి', 'ఎలక్ట్రీషియన్', 'గ్రోసరీ', 'ట్రాక్'
    ];
    const hasServiceKeyword = specificServiceKeywords.some(kw => qNorm.includes(kw));
    return !hasServiceKeyword;
  }

  return false;
}

/**
 * Scores a knowledge item based on 4-tier ranking:
 * 1. Exact normalized question match (1000+ pts)
 * 2. Strong phrase match in question (500-999 pts)
 * 3. Keyword match (200-499 pts)
 * 4. Category / service match (50-199 pts)
 */
function scoreKnowledgeItem(item, qNorm, userLang) {
  if (!item || !qNorm) return 0;

  const isGeneric = isGenericDoorlynQuery(qNorm);
  const cat = (item.category || '').toLowerCase();
  const serviceId = (item.service_id || '').toLowerCase();
  const isIntroRow = serviceId === 'doorlyn-about' || cat === 'general';

  // Requirement 6: Healthcare/service rows must NOT be selected for generic Doorlyn questions
  if (isGeneric) {
    if (isIntroRow) {
      return 2000;
    } else {
      return 0;
    }
  }

  const candidateQuestions = extractCandidateQuestions(item);
  const titleNorm = normalizeQuery(item.title || '');
  const keywords = Array.isArray(item.keywords)
    ? item.keywords.map(k => normalizeQuery(k))
    : [];
  const metaCategory = normalizeQuery(item.metadata?.serviceCategory || '');
  const metaName = normalizeQuery(item.metadata?.serviceName || '');

  let score = 0;
  let hasMatch = false;

  const isMatchingLang = (item.language || 'EN').toUpperCase() === (userLang || 'EN').toUpperCase();
  const langBonus = isMatchingLang ? 50 : 0;

  // TIER 1: EXACT NORMALIZED QUESTION MATCH
  for (const cq of candidateQuestions) {
    if (cq === qNorm) {
      score = 1000 + langBonus;
      return score;
    }
  }

  // TIER 2: STRONG PHRASE MATCH IN QUESTION OR TITLE
  for (const cq of candidateQuestions) {
    if (cq.includes(qNorm) && qNorm.length >= 4) {
      score = Math.max(score, 750 + langBonus);
      hasMatch = true;
    } else if (qNorm.includes(cq) && cq.length >= 4) {
      score = Math.max(score, 700 + langBonus);
      hasMatch = true;
    }
  }

  if (titleNorm.includes(qNorm) && qNorm.length >= 4) {
    score = Math.max(score, 650 + langBonus);
    hasMatch = true;
  } else if (qNorm.includes(titleNorm) && titleNorm.length >= 4) {
    score = Math.max(score, 600 + langBonus);
    hasMatch = true;
  }

  if (hasMatch && score >= 500) {
    return score;
  }

  // TIER 3: KEYWORD MATCH
  let keywordPoints = 0;
  for (const kw of keywords) {
    if (!kw) continue;
    if (qNorm === kw) {
      keywordPoints += 200;
      hasMatch = true;
    } else if (qNorm.includes(kw) && kw.length >= 3) {
      keywordPoints += 120;
      hasMatch = true;
    } else if (kw.includes(qNorm) && qNorm.length >= 3) {
      keywordPoints += 100;
      hasMatch = true;
    }
  }

  if (keywordPoints > 0) {
    score = Math.max(score, Math.min(480, 200 + keywordPoints + langBonus));
  }

  // TIER 4: CATEGORY / SERVICE MATCH
  let categoryPoints = 0;
  if (cat && qNorm.includes(cat.replace(/-/g, ' '))) {
    categoryPoints += 100;
    hasMatch = true;
  }
  if (metaCategory && qNorm.includes(metaCategory)) {
    categoryPoints += 80;
    hasMatch = true;
  }
  if (metaName && qNorm.includes(metaName)) {
    categoryPoints += 80;
    hasMatch = true;
  }

  if (categoryPoints > 0) {
    score = Math.max(score, 100 + categoryPoints + langBonus);
  }

  // Token Overlap Check for query tokens
  const queryTokens = qNorm.split(/\s+/).filter(t => t.length > 2);
  let matchedTokens = 0;
  for (const token of queryTokens) {
    if (candidateQuestions.some(cq => cq.includes(token)) || titleNorm.includes(token) || keywords.some(kw => kw.includes(token))) {
      matchedTokens++;
    }
  }

  if (queryTokens.length > 0 && matchedTokens > 0) {
    const tokenRatio = matchedTokens / queryTokens.length;
    if (tokenRatio >= 0.5 && score < 150 && hasMatch) {
      score = 150 + Math.floor(tokenRatio * 50) + langBonus;
    }
  }

  return score;
}

/**
 * Searches public.ai_knowledge in Supabase, with automatic fallback to built-in knowledge base.
 */
export async function searchAIKnowledge(userQuestion, language = 'EN', options = {}) {
  const rawQuery = (userQuestion || '').trim();
  const lang = (language || 'EN').toUpperCase();
  const limit = options.limit || 5;
  const qNorm = normalizeQuery(rawQuery);

  let supabaseResults = [];
  let source = 'embedded';

  if (isSupabaseConfigured && supabase) {
    try {
      let sbQuery = supabase
        .from('ai_knowledge')
        .select('*');

      if (options.category) {
        sbQuery = sbQuery.eq('category', options.category);
      }

      const { data, error } = await sbQuery.limit(50);

      if (!error && Array.isArray(data) && data.length > 0) {
        source = 'supabase';
        supabaseResults = data;
      }
    } catch (err) {
      console.warn('Supabase ai_knowledge search notice (falling back to embedded knowledge):', err.message);
    }
  }

  const knowledgePool = supabaseResults.length > 0 ? supabaseResults : EMBEDDED_KNOWLEDGE_BASE;

  const scoredItems = knowledgePool.map(item => {
    const score = scoreKnowledgeItem(item, qNorm, lang);
    return {
      ...item,
      relevanceScore: score
    };
  });

  const filteredSorted = scoredItems
    .filter(item => item.relevanceScore >= MIN_RELEVANCE_THRESHOLD)
    .sort((a, b) => b.relevanceScore - a.relevanceScore);

  const topMatch = filteredSorted.length > 0 ? filteredSorted[0] : null;
  const hasMatch = Boolean(topMatch && topMatch.relevanceScore >= MIN_RELEVANCE_THRESHOLD);

  // Requirement 11: Add console/debug information
  console.log('[AI Knowledge Search Debug]', {
    normalizedQuery: qNorm,
    candidateQuestions: topMatch ? extractCandidateQuestions(topMatch) : [],
    relevanceScore: topMatch ? topMatch.relevanceScore : 0,
    selectedQuestion: topMatch ? topMatch.question : null,
    selectedCategory: topMatch ? topMatch.category : null,
    selectedTitle: topMatch ? topMatch.title : null,
    source,
    hasMatch
  });

  return {
    knowledge: filteredSorted.slice(0, limit),
    source,
    topMatch: hasMatch ? topMatch : null,
    hasMatch
  };
}

function getInteractiveOptions(topMatch, lang = 'EN') {
  if (!topMatch) {
    if (lang === 'HI') return ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🛒 किराना'];
    if (lang === 'TE') return ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🛒 గ్రోసరీ'];
    return ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🛒 Groceries'];
  }

  const cat = (topMatch.category || '').toLowerCase();

  if (cat === 'healthcare') {
    if (lang === 'HI') return ['हां, अभी बुक करें', 'लॉगिन & लैब ऑप्शंस', 'रिपोर्ट समझाइए', '📝 Open Full Booking Form'];
    if (lang === 'TE') return ['అవును, బుక్ చేయండి', 'ల్యాబ్ ఆప్షన్లు చూడండి', 'రిపోర్ట్ వివరించండి', '📝 Open Full Booking Form'];
    return ['Book Diagnostic Now', 'View Lab Options', 'Explain Report', '📝 Open Full Booking Form'];
  }

  if (cat === 'repairs') {
    if (lang === 'HI') return ['सत्यापित तकनीशियन बुक करें', 'दर सूची देखें', '📍 प्राथमिक पता', '📝 Open Full Booking Form'];
    if (lang === 'TE') return ['టెక్నీషియన్ బుక్ చేయండి', 'ధరల వివరాలు', '📍 ప్రాథమిక అడ్రస్', '📝 Open Full Booking Form'];
    return ['Book Verified Pro Now', 'View Tariff Card', '📍 Use Primary Address', '📝 Open Full Booking Form'];
  }

  if (cat === 'pickup-drop') {
    if (lang === 'HI') return ['पार्सल पिकअप बुक करें', 'लाइव जीपीएस ट्रैक करें', '📝 Open Full Booking Form'];
    if (lang === 'TE') return ['పార్శిల్ పికప్ బుక్ చేయండి', 'లైవ్ GPS ట్రాకింగ్', '📝 Open Full Booking Form'];
    return ['Book Parcel Pickup Now', 'Track Courier Rider', '📝 Open Full Booking Form'];
  }

  if (cat === 'logistics') {
    if (lang === 'HI') return ['हाउस शिफ्टिंग बुक करें', 'मिनी ट्रक बुक करें', '📝 Open Full Booking Form'];
    if (lang === 'TE') return ['హౌస్ షిఫ్టింగ్ బుక్ చేయండి', 'మినీ ట్రక్ బుక్ చేయండి', '📝 Open Full Booking Form'];
    return ['Book House Shifting', 'Rent Mini Truck', '📝 Open Full Booking Form'];
  }

  if (cat === 'groceries') {
    if (lang === 'HI') return ['ताज़ी सब्जियां देखें', 'दैनिक राशन पैक', 'ग्रोसरी कार्ट'];
    if (lang === 'TE') return ['తాజా కూరగాయలు చూడండి', 'నిత్యావసరాల ప్యాక్', 'గ్రోసరీ కార్ట్'];
    return ['View Fresh Produce', 'Add Daily Staples Pack', 'Open Grocery Cart'];
  }

  if (cat === 'worker-market') {
    if (lang === 'HI') return ['मजदूर बुक करें', 'मिस्त्री बुक करें', 'डीप क्लीनिंग'];
    if (lang === 'TE') return ['కూలీ బుక్ చేయండి', 'మేస్త్రీ బుక్ చేయండి', 'డీప్ క్లీనింగ్'];
    return ['Book Daily Wage Worker', 'Book Mason (Mestri)', 'Deep Home Cleaning'];
  }

  if (cat === 'student-services') {
    if (lang === 'HI') return ['होम ट्यूटर बुक करें', 'ऑनलाइन ट्यूटर', 'कोचिंग सपोर्ट'];
    if (lang === 'TE') return ['హోమ్ ట్యూటర్ బుక్ చేయండి', 'ఆన్‌లైన్ ట్యూటర్', 'స్టడీ సపోర్ట్'];
    return ['Book Home Tutor', 'Explore Online Tuition', 'Exam Counseling'];
  }

  if (cat === 'catering') {
    if (lang === 'HI') return ['केटरिंग बुक करें', 'वेज मेनू देखें', 'नॉन-वेज बिरयानी'];
    if (lang === 'TE') return ['కేటరింగ్ బుక్ చేయండి', 'వెజ్ మెనూ చూడండి', 'నాన్-వెజ్ బిర్యానీ'];
    return ['Book Event Catering', 'View Veg Buffet', 'Non-Veg Feast'];
  }

  if (cat === 'tracking') {
    if (lang === 'HI') return ['📍 लाइव ट्रैकिंग खोलें', 'सक्रिय ऑर्डर देखें', 'सहायता'];
    if (lang === 'TE') return ['📍 లైవ్ ట్రాకింగ్ తెరవండి', 'ఆర్డర్స్ చూడండి', 'సహాయం'];
    return ['📍 Open Live Tracking', 'View Active Orders', 'Support'];
  }

  if (lang === 'HI') return ['सेवाएं देखें', 'विवरण देखें', 'मुख्य मेनू'];
  if (lang === 'TE') return ['సేవలు చూడండి', 'వివరాలు చూడండి', 'ప్రధాన మెనూ'];
  return ['View Services', 'View Details', 'Main Menu'];
}

function buildSuggestedAction(topMatch) {
  if (!topMatch) return null;

  const cat = (topMatch.category || '').toLowerCase();
  const meta = topMatch.metadata || {};

  if (cat === 'groceries') {
    return {
      type: 'VIEW_GROCERY',
      serviceCategory: 'Grocery & Daily Essentials',
      serviceName: meta.serviceName || topMatch.title
    };
  }

  if (cat === 'tracking') {
    return {
      type: 'VIEW_TRACKING',
      serviceCategory: 'Order Tracking',
      serviceName: 'Live Driver Tracking'
    };
  }

  if (topMatch.price && topMatch.price > 0) {
    return {
      type: 'BOOK_SERVICE',
      serviceId: topMatch.service_id || 'srv-kb',
      serviceName: meta.serviceName || topMatch.title,
      price: topMatch.price,
      serviceCategory: meta.serviceCategory || (
        cat === 'healthcare' ? 'Healthcare & Diagnostic' :
        cat === 'repairs' ? 'Home Repairs' :
        cat === 'pickup-drop' ? 'Pickup & Drop' :
        cat === 'logistics' ? 'Logistics & Shifting' :
        cat === 'worker-market' ? 'Worker Marketplace' :
        cat === 'student-services' ? 'Student Tutors & Services' :
        cat === 'catering' ? 'Food & Catering Services' : 'Doorlyn Service'
      )
    };
  }

  return null;
}

export async function generateDoorlynAIResponse(userQuestion, language = 'EN', _history = []) {
  const query = (userQuestion || '').trim();
  const lang = (language || 'EN').toUpperCase();

  const searchResult = await searchAIKnowledge(query, lang);
  const { topMatch, hasMatch, source } = searchResult;

  if (hasMatch && topMatch) {
    const replyText = topMatch.answer;
    const options = getInteractiveOptions(topMatch, lang);
    const suggestedAction = buildSuggestedAction(topMatch);

    return {
      success: true,
      reply: replyText,
      options,
      suggestedAction,
      source,
      knowledge: topMatch
    };
  }

  // Requirement 8: Safe fallback when no relevant knowledge row is found
  let defaultReply = '';
  let defaultOptions = [];

  if (lang === 'HI') {
    defaultReply = 'मैं डोरलिन सेवाओं, बुकिंग, ट्रैकिंग, ग्रोसरी, होम रिपेयर, हेल्थकेयर और अन्य डोरलिन सेवाओं में आपकी सहायता कर सकता हूँ। आप क्या जानना चाहते हैं?';
    defaultOptions = ['🏥 हेल्थकेयर', '🔧 होम रिपेयर', '📦 पिकअप & ड्रॉप', '🛒 किराना', '🚚 शिफ्टिंग', '👷 वर्कर्स'];
  } else if (lang === 'TE') {
    defaultReply = 'నేను డోర్‌లిన్ సేవలు, బుకింగ్స్, ట్రాకింగ్, గ్రోసరీ, ఇంటి రిపేర్లు, హెల్త్‌కేర్ మరియు ఇతర డోర్‌లిన్ సేవలలో మీకు సహాయం చేయగలను. మీరు ఏమి తెలుసుకోవాలనుకుంటున్నారు?';
    defaultOptions = ['🏥 హెల్త్‌కేర్', '🔧 ఇంటి రిపేర్లు', '📦 పికప్ & డ్రాప్', '🛒 గ్రోసరీ', '🚚 షిఫ్టింగ్', '👷 వర్కర్లు'];
  } else {
    defaultReply = 'I can help you with Doorlyn services, bookings, tracking, groceries, home repairs, healthcare, and other Doorlyn services. What would you like to know?';
    defaultOptions = ['🏥 Healthcare', '🔧 Home Repairs', '📦 Pickup & Drop', '🛒 Groceries', '🚚 Shifting', '👷 Workers'];
  }

  return {
    success: true,
    reply: defaultReply,
    options: defaultOptions,
    suggestedAction: null,
    source,
    knowledge: null
  };
}
