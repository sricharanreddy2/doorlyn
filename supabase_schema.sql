-- ==============================================================================
-- DOORLYN SUPABASE DATABASE SETUP SCRIPT
-- ==============================================================================
-- Run this SQL in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ==============================================================================

-- 1. Create the `profiles` table to store Doorlyn user details
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  name text,
  phone text,
  email text,
  address text,
  wallet_balance numeric default 200.00,
  referral_code text,
  is_phone_verified boolean default false,
  is_email_verified boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on `profiles`
alter table public.profiles enable row level security;

-- 3. Create RLS Policies for secure user data access
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" 
  on public.profiles 
  for select 
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" 
  on public.profiles 
  for insert 
  with check (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" 
  on public.profiles 
  for update 
  using (auth.uid() = id);

-- 4. Trigger to automatically create a profile row whenever a new user signs up in Supabase Auth
create or replace function public.handle_new_user()
returns trigger as $$
declare
  clean_name text;
  ref_code text;
begin
  clean_name := coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1), 'Doorlyn Member');
  ref_code := 'DOORLYN-' || upper(substr(md5(random()::text), 1, 6));

  insert into public.profiles (
    id,
    name,
    email,
    phone,
    address,
    wallet_balance,
    referral_code,
    is_phone_verified,
    is_email_verified
  ) values (
    new.id,
    clean_name,
    new.email,
    coalesce(new.raw_user_meta_data->>'phone', new.phone, ''),
    coalesce(new.raw_user_meta_data->>'address', ''),
    200.00,
    ref_code,
    coalesce((new.phone is not null and length(new.phone) > 5), false),
    coalesce((new.email_confirmed_at is not null), false)
  )
  on conflict (id) do nothing;
  
  return new;
end;
$$ language plpgsql security definer;

-- Recreate the trigger
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 5. Helper function for updated_at timestamps
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ==============================================================================
-- 6. Create the `ai_knowledge` table for Doorlyn Multilingual AI Assistant
-- ==============================================================================
create table if not exists public.ai_knowledge (
  id bigint generated always as identity primary key,
  category text not null,
  service_id text,
  title text not null,
  question text not null,
  answer text not null,
  language text not null default 'EN',
  keywords text[] default '{}',
  price numeric default null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on `ai_knowledge`
alter table public.ai_knowledge enable row level security;

-- Public read access on `ai_knowledge` for AI assistant query
drop policy if exists "Allow public read on ai_knowledge" on public.ai_knowledge;
create policy "Allow public read on ai_knowledge"
  on public.ai_knowledge
  for select
  using (true);

-- Indexes for lightning fast AI knowledge searches
create index if not exists idx_ai_knowledge_lang on public.ai_knowledge (language);
create index if not exists idx_ai_knowledge_cat on public.ai_knowledge (category);
create index if not exists idx_ai_knowledge_service on public.ai_knowledge (service_id);
create index if not exists idx_ai_knowledge_keywords on public.ai_knowledge using gin (keywords);

-- ==============================================================================
-- 7. Seed Multilingual Knowledge Base (English, Hindi, Telugu)
-- ==============================================================================
insert into public.ai_knowledge (category, service_id, title, question, answer, language, keywords, price, metadata)
values
  -- Healthcare (EN, HI, TE)
  (
    'healthcare',
    'cbc-test',
    'Complete Blood Count (CBC) Diagnostic Test',
    'How do I book a CBC blood test and what are the inclusions and price?',
    'Doorlyn provides home sample collection for Complete Blood Count (CBC) at ₹349. Includes Hemoglobin, RBC, WBC differential, and Platelet count processed at NABL-accredited labs (Apollo/Dr. Lal Path). Our certified phlebotomist uses 100% sterile sealed vacuum kits. Digital AI report is delivered within 24 hours.',
    'EN',
    array['cbc', 'blood test', 'hemoglobin', 'platelet', 'wbc', 'rbc', 'diagnostic', 'sample collection', 'phlebotomist', 'lab'],
    349,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "CBC Test (Complete Blood Count)"}'::jsonb
  ),
  (
    'healthcare',
    'cbc-test',
    'सीबीसी (CBC) ब्लड टेस्ट और होम सैंपल कलेक्शन',
    'सीबीसी ब्लड टेस्ट कैसे बुक करें और इसकी कीमत क्या है?',
    'डोरलिन पर सीबीसी (CBC) ब्लड टेस्ट मात्र ₹349 में उपलब्ध है। इसमें हीमोग्लोबिन, आरबीसी, डब्ल्यूबीसी और प्लेटलेट काउंट शामिल हैं। एनएबीएल (NABL) प्रमाणित लैब से जांच और 100% सीलबंद स्टेराइल किट से घर पर फ्री सैंपल कलेक्शन। 24 घंटे में डिजिटल रिपोर्ट उपलब्ध।',
    'HI',
    array['सीबीसी', 'ब्लड टेस्ट', 'खून की जांच', 'हीमोग्लोबिन', 'प्लेटलेट', 'डायग्नोस्टिक', 'सैंपल', 'लैब', 'cbc'],
    349,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "CBC Test (Complete Blood Count)"}'::jsonb
  ),
  (
    'healthcare',
    'cbc-test',
    'సీబీసీ (CBC) బ్లడ్ టెస్ట్ మరియు హోమ్ శాంపిల్ కలెక్షన్',
    'CBC బ్లడ్ టెస్ట్ ఎలా బుక్ చేయాలి మరియు దాని ధర ఎంత?',
    'డోర్‌లిన్ ద్వారా కంప్లీట్ బ్లడ్ కౌంట్ (CBC) పరీక్ష ₹349 కే లభిస్తుంది. ఇందులో హిమోగ్లోబిన్, RBC, WBC, ప్లేట్‌లెట్ కౌంట్ ఉంటాయి. NABL గుర్తింపు పొందిన ల్యాబ్స్ ద్వారా పరీక్ష మరియు ఇంటి వద్దకే వచ్చి ఉచితంగా శాంపిల్ సేకరణ. 24 గంటల్లో డిజిటల్ రిపోర్ట్ వస్తుంది.',
    'TE',
    array['సిబిసి', 'బ్లడ్ టెస్ట్', 'రక్త పరీక్ష', 'హిమోగ్లోబిన్', 'ప్లేట్‌లెట్', 'డయాగ్నోస్టిక్', 'శాంపిల్', 'cbc'],
    349,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "CBC Test (Complete Blood Count)"}'::jsonb
  ),
  (
    'healthcare',
    'blood-sugar',
    'Blood Sugar & Diabetes Screening (FBS / PPBS / HbA1c)',
    'What is the price for fasting blood sugar and HbA1c test?',
    'Doorlyn offers Fasting Blood Sugar (FBS) at ₹149, Post Prandial (PPBS) at ₹149, Dual FBS+PPBS Combo at ₹249, and HbA1c 3-month marker at ₹349. Home sample collection by certified staff with smart AI glycemic control insights.',
    'EN',
    array['sugar', 'blood sugar', 'fbs', 'ppbs', 'hba1c', 'diabetes', 'glucose', 'fasting sugar'],
    199,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Blood Sugar Test (FBS / PPBS)"}'::jsonb
  ),
  (
    'healthcare',
    'blood-sugar',
    'ब्लड शुगर और डायबिटीज जांच (FBS / PPBS / HbA1c)',
    'ब्लड शुगर और फास्टिंग शुगर जांच की दर क्या है?',
    'डोरलिन पर फास्टिंग ब्लड शुगर (FBS) ₹149, पोस्ट प्रांडियल (PPBS) ₹149 और HbA1c 3 महीने का टेस्ट ₹349 में उपलब्ध है। घर बैठे सुरक्षित सैंपल कलेक्शन और डिजिटल रिपोर्ट।',
    'HI',
    array['शुगर', 'ब्लड शुगर', 'डायबिटीज', 'मधुमेह', 'फास्टिंग', 'hba1c', 'fbs', 'ppbs'],
    199,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Blood Sugar Test (FBS / PPBS)"}'::jsonb
  ),
  (
    'healthcare',
    'blood-sugar',
    'బ్లడ్ షుగర్ మరియు డయాబెటిస్ టెస్ట్ (FBS / PPBS / HbA1c)',
    'బ్లడ్ షుగర్ మరియు ఫాస్టింగ్ షుగర్ టెస్ట్ ధర ఎంత?',
    'డోర్‌లిన్ లో ఫాస్టింగ్ బ్లడ్ షుగర్ (FBS) ₹149, భోజనం తర్వాత షుగర్ (PPBS) ₹149 మరియు 3 నెలల HbA1c టెస్ట్ ₹349 కే లభిస్తాయి. ఉచిత హోమ్ శాంపిల్ కలెక్షన్ మరియు ఏఐ డైట్ టిప్స్ అందుతాయి.',
    'TE',
    array['షుగర్', 'బ్లడ్ షుగర్', 'డయాబెటిస్', 'మధుమేహం', 'ఫాస్టింగ్', 'hba1c', 'fbs', 'ppbs'],
    199,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Blood Sugar Test (FBS / PPBS)"}'::jsonb
  ),
  (
    'healthcare',
    'full-body',
    'Full Body Master Health Checkup (68 Parameters)',
    'What is included in the Full Body Health Checkup and what is the cost?',
    'Doorlyn Master Health Checkup is ₹999 (covers 68 parameters: CBC, Lipid/Cholesterol Profile, Liver Function LFT, Kidney Function KFT, Thyroid TSH & Fasting Sugar). Includes free tele-doctor consultation and historical health tracking.',
    'EN',
    array['full body', 'checkup', 'master health', 'lipid', 'cholesterol', 'liver', 'lft', 'kidney', 'kft', 'thyroid', 'health package'],
    999,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Full Body Checkup (Master Health Package)"}'::jsonb
  ),
  (
    'healthcare',
    'full-body',
    'फुल बॉडी मास्टर हेल्थ चेकअप (68 पैरामीटर्स)',
    'फुल बॉडी चेकअप में क्या शामिल है और कितना खर्च आता है?',
    'डोरलिन मास्टर हेल्थ पैकेज मात्र ₹999 में उपलब्ध है (68 टेस्ट: सीबीसी, लिपिड/कोलेस्ट्रॉल, लिवर LFT, किडनी KFT, थायराइड और शुगर)। इसमें डॉक्टर का मुफ्त परामर्श और डिजिटल रिपोर्ट शामिल है।',
    'HI',
    array['फुल बॉडी', 'मास्टर हेल्थ', 'हेल्थ चेकअप', 'कोलेस्ट्रॉल', 'लिवर', 'किडनी', 'थायराइड', 'पूरा चेकअप'],
    999,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Full Body Checkup (Master Health Package)"}'::jsonb
  ),
  (
    'healthcare',
    'full-body',
    'ఫుల్ బాడీ మాస్టర్ హెల్త్ చెకప్ (68 పారామీటర్లు)',
    'ఫుల్ బాడీ హెల్త్ చెకప్‌లో ఏయే టెస్టులు ఉంటాయి మరియు ఖర్చు ఎంత?',
    'డోర్‌లిన్ మాస్టర్ హెల్త్ చెకప్ కేవలం ₹999 కే లభిస్తుంది (68 టెస్టులు: CBC, లిపిడ్/కొలెస్ట్రాల్, లివర్ LFT, కిడ్నీ KFT, థైరాయిడ్ మరియు షుగర్). ఉచిత టెలీ-డాక్టర్ కన్సల్టేషన్ లభిస్తుంది.',
    'TE',
    array['ఫుల్ బాడీ', 'హెల్త్ చెకప్', 'మాస్టర్ చెకప్', 'కొలెస్ట్రాల్', 'లివర్', 'కిడ్నీ', 'థైరాయిడ్', 'మొత్తం పరీక్ష'],
    999,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Full Body Checkup (Master Health Package)"}'::jsonb
  ),

  -- Home Repairs (EN, HI, TE)
  (
    'repairs',
    'electrician-services',
    'Electrician & Fan Repair Services',
    'What are the electrician charges and response time?',
    'Doorlyn Electrician visit fee is ₹249. Includes fan repair & capacitor (₹199), switchboard/socket fitting (₹149), MCB fuse & wiring repair (₹249), and inverter setup (₹399). Verified technicians arrive as soon as possible.',
    'EN',
    array['electrician', 'electric', 'fan', 'wiring', 'short circuit', 'switchboard', 'mcb', 'inverter', 'fuse', 'light'],
    249,
    '{"serviceCategory": "Home Repairs", "serviceName": "Electricians"}'::jsonb
  ),
  (
    'repairs',
    'electrician-services',
    'इलेक्ट्रीशियन और पंखा रिपेयर सर्विस',
    'इलेक्ट्रीशियन की विजिट फीस और वारंटी क्या है?',
    'डोरलिन इलेक्ट्रीशियन विजिट फीस ₹249 है। पंखा रिपेयर (₹199), स्विचबोर्ड फिटिंग (₹149), एमसीबी वायरिंग (₹249) और इन्वर्टर सेटअप (₹399)। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।',
    'HI',
    array['इलेक्ट्रीशियन', 'बिजली', 'पंखा', 'फैन', 'वायरिंग', 'स्विच', 'शॉर्ट सर्किट', 'इन्वर्टर', 'mcb'],
    249,
    '{"serviceCategory": "Home Repairs", "serviceName": "Electricians"}'::jsonb
  ),
  (
    'repairs',
    'electrician-services',
    'ఎలక్ట్రీషియన్ మరియు ఫ్యాన్ రిపేర్ సర్వీస్',
    'ఎలక్ట్రీషియన్ ఛార్జీలు మరియు వారంటీ వివరాలు ఏమిటి?',
    'డోర్‌లిన్ ఎలక్ట్రీషియన్ విజిట్ ఫీజు ₹249. ఫ్యాన్ రిపేర్ (₹199), స్విచ్ బోర్డ్ ఫిట్టింగ్ (₹149), MCB వైరింగ్ (₹249) మరియు ఇన్వర్టర్ సెటప్ (₹399). వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.',
    'TE',
    array['ఎలక్ట్రీషియన్', 'కరెంట్', 'ఫ్యాన్', 'వైరింగ్', 'స్విచ్ బోర్డ్', 'షార్ట్ సర్క్యూట్', 'ఇన్వర్టర్'],
    249,
    '{"serviceCategory": "Home Repairs", "serviceName": "Electricians"}'::jsonb
  ),
  (
    'repairs',
    'plumbing-services',
    'Plumber - Tap, Pipe Leakage & Drain Cleaning',
    'What are the plumber charges and services covered?',
    'Doorlyn Plumber visit fee is ₹199 / ₹299. Covers tap & faucet repair (₹149), sink & washbasin drain blockage removal (₹199), wall mixer fitting (₹299), and pipe leak sealing (₹349). Verified technicians arrive as soon as possible.',
    'EN',
    array['plumber', 'plumbing', 'pipe', 'tap', 'leak', 'drain', 'sink', 'washbasin', 'water leakage', 'tank'],
    199,
    '{"serviceCategory": "Home Repairs", "serviceName": "Plumbers"}'::jsonb
  ),
  (
    'repairs',
    'plumbing-services',
    'प्लंबर - नल, पाइप लीकेज और ड्रेन सफाई',
    'प्लंबर की दरें और सेवाएं क्या हैं?',
    'डोरलिन प्लंबर विजिट फीस ₹199 है। नल रिपेयर (₹149), ड्रेन ब्लॉकेज हटाना (₹199), पाइप लीकेज सीलिंग (₹349) और शॉवर फिटिंग (₹299)। सत्यापित तकनीशियन जल्द से जल्द पहुंचेगा।',
    'HI',
    array['प्लंबर', 'नल', 'पाइप', 'लीकेज', 'ड्रेन', 'सिंक', 'पानी लीकेज', 'वॉशबेसिन'],
    199,
    '{"serviceCategory": "Home Repairs", "serviceName": "Plumbers"}'::jsonb
  ),
  (
    'repairs',
    'plumbing-services',
    'ప్లంబర్ - నల్లా, పైప్ లీకేజ్ మరియు డ్రెయిన్ క్లీనింగ్',
    'ప్లంబర్ రేట్లు మరియు సేవలు ఏమిటి?',
    'డోర్‌లిన్ ప్లంబర్ విజిట్ ఫీజు ₹199. నల్లా/ట్యాప్ రిపేర్ (₹149), సింక్ డ్రెయిన్ అన్‌బ్లాకింగ్ (₹199), పైప్ లీకేజ్ సీలింగ్ (₹349) మరియు షవర్ ఫిట్టింగ్ (₹299). వెరిఫైడ్ టెక్నీషియన్ సాధ్యమైనంత త్వరగా వస్తారు.',
    'TE',
    array['ప్లంబర్', 'నల్లా', 'ట్యాప్', 'పైప్', 'లీకేజ్', 'డ్రెయిన్', 'సింక్', 'నీటి లీకేజీ'],
    199,
    '{"serviceCategory": "Home Repairs", "serviceName": "Plumbers"}'::jsonb
  ),

  -- Pickup & Drop (EN, HI, TE)
  (
    'pickup-drop',
    'small-parcel',
    'Small Parcel Express Pickup & Drop',
    'How does Doorlyn Express Parcel work and what is the rate?',
    'Doorlyn Express Parcel starts at ₹69 for up to 5kg local delivery. Nearest delivery rider is dispatched within 15 minutes. Features live GPS map tracking, weatherproof tamper-proof pouch, and secure 4-digit handover PIN.',
    'EN',
    array['parcel', 'pickup', 'drop', 'courier', 'express', 'documents', 'keys', 'tiffin', 'rapido', 'delivery'],
    69,
    '{"serviceCategory": "Pickup & Drop", "serviceName": "Small Parcel Pickup & Drop"}'::jsonb
  ),
  (
    'pickup-drop',
    'small-parcel',
    'छोटा पार्सल एक्सप्रेस पिकअप & ड्रॉप',
    'पार्सल डिलीवरी का चार्ज और समय क्या है?',
    'डोरलिन एक्सप्रेस पार्सल मात्र ₹69 से शुरू होता है (5 किलो तक)। 15 मिनट में राइडर पिकअप के लिए पहुंचेगा। लाइव जीपीएस ट्रैकिंग, वाटरप्रूफ पाउच और 4-अंकीय ओटीपी पिन सुरक्षा उपलब्ध है।',
    'HI',
    array['पार्सल', 'पिकअप', 'ड्रॉप', 'कूरियर', 'डिलीवरी', 'दस्तावेज', 'चाबी', 'टिफिन'],
    69,
    '{"serviceCategory": "Pickup & Drop", "serviceName": "Small Parcel Pickup & Drop"}'::jsonb
  ),
  (
    'pickup-drop',
    'small-parcel',
    'చిన్న పార్శిల్ ఎక్స్‌ప్రెస్ పికప్ & డ్రాప్',
    'పార్శిల్ డెలివరీ ఛార్జీ మరియు సమయం ఎంత?',
    'డోర్‌లిన్ ఎక్స్‌ప్రెస్ పార్శిల్ సేవలు కేవలం ₹69 నుండి ప్రారంభమవుతాయి (5 కేజీల వరకు). 15 నిమిషాల్లో డెలివరీ రైడర్ వస్తారు. లైవ్ GPS ట్రాకింగ్ మరియు 4-అంకెల సెక్యూరిటీ పిన్ సదుపాయం కలదు.',
    'TE',
    array['పార్శిల్', 'పికప్', 'డ్రాప్', 'కొరియర్', 'డెలివరీ', 'కీలు', 'డాక్యుమెంట్స్', 'టిఫిన్'],
    69,
    '{"serviceCategory": "Pickup & Drop", "serviceName": "Small Parcel Pickup & Drop"}'::jsonb
  ),

  -- Logistics & Shifting (EN, HI, TE)
  (
    'logistics',
    'house-shifting',
    'Local House & Office Shifting with Mini Truck',
    'What is the price for house shifting and mini truck hire?',
    'Doorlyn House Shifting starts at ₹2499 (1BHK at ₹1999, 2BHK at ₹2999, 3BHK Villa at ₹4499). Includes dedicated Tata Ace / Bolero mini truck, experienced loading helpers, multi-layer bubble packing, and furniture dismantling/reassembly.',
    'EN',
    array['shifting', 'house shifting', 'packers', 'movers', 'truck', 'tata ace', 'bolero', 'relocation', 'logistics', 'office shifting'],
    2499,
    '{"serviceCategory": "Logistics & Shifting", "serviceName": "Local House Shifting"}'::jsonb
  ),
  (
    'logistics',
    'house-shifting',
    'लोकल हाउस व ऑफिस शिफ्टिंग और मिनी ट्रक',
    'घर बदलने और मिनी ट्रक का खर्च कितना है?',
    'डोरलिन हाउस शिफ्टिंग ₹2499 से शुरू होती है (1BHK ₹1999, 2BHK ₹2999, 3BHK ₹4499)। इसमें टाटा ऐस/बोलेरो मिनी ट्रक, सामान उठाने वाले हेल्पर, बबल रैप पैकिंग और फर्नीचर असेंबली शामिल हैं।',
    'HI',
    array['शिफ्टिंग', 'घर बदलना', 'पैकर्स', 'मूवर्स', 'ट्रक', 'टाटा ऐस', 'लॉजिस्टिक्स'],
    2499,
    '{"serviceCategory": "Logistics & Shifting", "serviceName": "Local House Shifting"}'::jsonb
  ),
  (
    'logistics',
    'house-shifting',
    'లోకల్ హౌస్ & ఆఫీస్ షిఫ్టింగ్ మరియు మినీ ట్రక్',
    'ఇల్లు షిఫ్టింగ్ మరియు మినీ ట్రక్ బుకింగ్ ఛార్జ్ ఎంత?',
    'డోర్‌లిన్ హౌస్ షిఫ్టింగ్ ₹2499 నుండి ప్రారంభమవుతుంది (1BHK ₹1999, 2BHK ₹2999, 3BHK ₹4499). టాటా ఏస్/బొలెరో మినీ ట్రక్, హెల్పర్లు, బబుల్ ర్యాప్ ప్యాకింగ్ మరియు ఫర్నిచర్ అసెంబ్లింగ్ అన్నీ ఉంటాయి.',
    'TE',
    array['షిఫ్టింగ్', 'ఇల్లు మారడం', 'మినీ ట్రక్', 'టాటా ఏస్', 'ప్యాకర్స్', 'మూవర్స్', 'లాజిస్టిక్స్'],
    2499,
    '{"serviceCategory": "Logistics & Shifting", "serviceName": "Local House Shifting"}'::jsonb
  ),

  -- Groceries (EN, HI, TE)
  (
    'groceries',
    'fresh-veg-fruits',
    '15-Minute Express Grocery Delivery & Farm Fresh Produce',
    'How fast is grocery delivery and what items are available?',
    'Doorlyn delivers groceries in 15 minutes from local dark stores with free delivery on orders above ₹149. Essential veggie baskets start at ₹199, monthly staples pack (Rice, Dal, Oil, Ghee) at ₹899, fresh dairy milk & curd at ₹149.',
    'EN',
    array['grocery', 'groceries', 'vegetables', 'fruits', 'milk', 'curd', 'rice', 'dal', 'oil', 'ghee', '15 min delivery', 'kirana'],
    199,
    '{"serviceCategory": "Grocery & Daily Essentials", "serviceName": "Doorlyn 15-Min Express Grocery"}'::jsonb
  ),
  (
    'groceries',
    'fresh-veg-fruits',
    '15-मिनट एक्सप्रेस ग्रोसरी डिलीवरी और ताजी सब्जियां',
    'किराना सामान कितनी देर में डिलीवर होता है और क्या उपलब्ध है?',
    'डोरलिन से ताजी सब्जियां, दूध, राशन व दालें मात्र 15 मिनट में घर पहुंचाई जाती हैं। ₹149 से ऊपर के ऑर्डर पर फ्री डिलीवरी। डेली वेज बास्केट ₹199, किचन राशन पैक ₹899 और दूध-दही ₹149 में उपलब्ध।',
    'HI',
    array['किराना', 'राशन', 'सब्जी', 'फल', 'दूध', 'दही', 'चावल', 'दाल', 'तेल', '15 मिनट डिलीवरी'],
    199,
    '{"serviceCategory": "Grocery & Daily Essentials", "serviceName": "Doorlyn 15-Min Express Grocery"}'::jsonb
  ),
  (
    'groceries',
    'fresh-veg-fruits',
    '15-నిమిషాల ఎక్స్‌ప్రెస్ గ్రోసరీ డెలివరీ మరియు తాజా కూరగాయలు',
    'గ్రోసరీ ఎంత సమయంలో డెలివరీ అవుతుంది మరియు ఏయే వస్తువులు ఉన్నాయి?',
    'డోర్‌లిన్ తాజా కూరగాయలు, పాలు, నిత్యావసరాలను 15 నిమిషాల్లో మీ ఇంటికి డెలివరీ చేస్తుంది. ₹149 పైన ఆర్డర్లకు ఉచిత డెలివరీ. డైలీ వెజ్ బాస్కెట్ ₹199, కిచెన్ స్టేపుల్స్ ప్యాక్ ₹899 లభిస్తాయి.',
    'TE',
    array['గ్రోసరీ', 'కూరగాయలు', 'పండ్లు', 'పాలు', 'పెరుగు', 'బియ్యం', 'పప్పు', 'నూనె', '15 నిమిషాలు'],
    199,
    '{"serviceCategory": "Grocery & Daily Essentials", "serviceName": "Doorlyn 15-Min Express Grocery"}'::jsonb
  ),

  -- Worker Marketplace (EN, HI, TE)
  (
    'worker-market',
    'daily-wage-worker',
    'Verified Daily Wage Workers, Masons (Mestri) & Cleaning',
    'What are the daily wage rates for labor and masons?',
    'Doorlyn Worker Marketplace provides Aadhaar-verified workers: General Daily Wage Labor at ₹600/day (Half-day ₹349), Senior Mason (Mestri) at ₹900/day, Full Home Deep Cleaning at ₹1199, and Water Tank Cleaning at ₹599.',
    'EN',
    array['worker', 'labor', 'daily wage', 'mason', 'mestri', 'coolie', 'cleaning', 'deep clean', 'tank cleaning', 'helper'],
    600,
    '{"serviceCategory": "Worker Marketplace", "serviceName": "Daily Wage Workers"}'::jsonb
  ),
  (
    'worker-market',
    'daily-wage-worker',
    'सत्यापित दिहाड़ी मजदूर, मिस्त्री और सफाई कर्मचारी',
    'मजदूर और मिस्त्री का प्रतिदिन का किराया क्या है?',
    'डोरलिन पर आधार-सत्यापित कामगार उपलब्ध हैं: सामान्य दिहाड़ी मजदूर ₹600/दिन (हाफ डे ₹349), हेड मिस्त्री ₹900/दिन, घर की डीप क्लीनिंग ₹1199 और पानी की टंकी सफाई ₹599।',
    'HI',
    array['मजदूर', 'दिहाड़ी', 'मिस्त्री', 'लेबर', 'सफाई', 'क्लीनिंग', 'टंकी सफाई', 'हेल्पर'],
    600,
    '{"serviceCategory": "Worker Marketplace", "serviceName": "Daily Wage Workers"}'::jsonb
  ),
  (
    'worker-market',
    'daily-wage-worker',
    'వెరిఫైడ్ దినసరి కూలీలు, మేస్త్రీ మరియు క్లీనింగ్ సేవలు',
    'కూలీలు మరియు మేస్త్రీ రోజువారీ ఛార్జీ ఎంత?',
    'డోర్‌లిన్ ఆధార్-ధృవీకరించబడిన వర్కర్లను అందిస్తుంది: సాధారణ దినసరి కూలీ ₹600/రోజు (హాఫ్ డే ₹349), హెడ్ మేస్త్రీ ₹900/రోజు, ఫుల్ హోమ్ డీప్ క్లీనింగ్ ₹1199, వాటర్ ట్యాంక్ క్లీనింగ్ ₹599.',
    'TE',
    array['కూలీ', 'దినసరి', 'మేస్త్రీ', 'లేబర్', 'క్లీనింగ్', 'ట్యాంక్ క్లీనింగ్', 'హెల్పర్'],
    600,
    '{"serviceCategory": "Worker Marketplace", "serviceName": "Daily Wage Workers"}'::jsonb
  ),

  -- Student Tutors (EN, HI, TE)
  (
    'student-services',
    'home-tutor',
    'Home & Online Tutors (Class 1st - 10th & Intermediate)',
    'What are the tutor fees and teaching subjects?',
    'Doorlyn Home Tutors start at ₹2500/month or ₹299/hour for personalized 1-on-1 teaching in Maths, Science, English, and regional languages. Primary tuition is ₹1800/mo, High School ₹2500/mo, Intermediate MPC/BiPC coaching is ₹3500/mo.',
    'EN',
    array['tutor', 'tuition', 'teacher', 'home tutor', 'online tutor', 'maths', 'science', 'exam', 'student', 'coaching'],
    299,
    '{"serviceCategory": "Student Tutors & Services", "serviceName": "Home & Online Tutor Service"}'::jsonb
  ),
  (
    'student-services',
    'home-tutor',
    'होम व ऑनलाइन ट्यूटर (कक्षा 1 से 10 व इंटरमीडिएट)',
    'होम ट्यूटर की फीस और विषय क्या हैं?',
    'डोरलिन होम ट्यूटर सेवा ₹299/घंटा या ₹2500/माह से शुरू होती है (गणित, विज्ञान, अंग्रेजी और अन्य विषय)। प्राइमरी ट्यूशन ₹1800/माह, हाई स्कूल ₹2500/माह और इंटरमीडिएट ₹3500/माह में उपलब्ध है।',
    'HI',
    array['ट्यूटर', 'ट्यूशन', 'शिक्षक', 'टीचर', 'होम ट्यूटर', 'पढ़ाई', 'गणित', 'साइंस', 'कोचिंग'],
    299,
    '{"serviceCategory": "Student Tutors & Services", "serviceName": "Home & Online Tutor Service"}'::jsonb
  ),
  (
    'student-services',
    'home-tutor',
    'హోమ్ & ఆన్‌లైన్ ట్యూటర్స్ (1వ నుండి 10వ తరగతి & ఇంటర్)',
    'హోమ్ ట్యూటర్ ఫీజులు మరియు సబ్జెక్టుల వివరాలు ఏమిటి?',
    'డోర్‌లిన్ హోమ్ ట్యూటర్ సర్వీస్ ₹299/గంట లేదా ₹2500/నెల నుండి లభిస్తుంది (మ్యాథ్స్, సైన్స్, ఇంగ్లీష్, తెలుగు). ప్రైమరీ ట్యూషన్ ₹1800/నెల, హైస్కూల్ ₹2500/నెల మరియు ఇంటర్మీడియట్ ₹3500/నెల ఉంటుంది.',
    'TE',
    array['ట్యూటర్', 'ట్యూషన్', 'టీచర్', 'హోమ్ ట్యూటర్', 'చదువు', 'లెక్కలు', 'సైన్స్', 'కోచింగ్'],
    299,
    '{"serviceCategory": "Student Tutors & Services", "serviceName": "Home & Online Tutor Service"}'::jsonb
  ),

  -- Catering & Events (EN, HI, TE)
  (
    'catering',
    'wedding-catering',
    'Event, Wedding & Birthday Catering (Per Plate)',
    'What are the catering prices per plate and menu options?',
    'Doorlyn Event Catering offers FSSAI hygiene certified multi-course feasts: Traditional Veg Buffet at ₹299/plate, Royal Non-Veg Biryani Feast at ₹450/plate, and Birthday Party Snack Combos at ₹249/plate. Includes buffet setup, crockery, and servers.',
    'EN',
    array['catering', 'caterer', 'food', 'wedding', 'birthday', 'buffet', 'biryani', 'plates', 'party', 'cook'],
    299,
    '{"serviceCategory": "Food & Catering Services", "serviceName": "Event & Bulk Catering Service"}'::jsonb
  ),
  (
    'catering',
    'wedding-catering',
    'इवेंट, शादी और जन्मदिन कैटरिंग (प्रति प्लेट)',
    'कैटरिंग का प्रति प्लेट खर्च और मेनू क्या है?',
    'डोरलिन कैटरिंग सेवा में एफएसएसएआई (FSSAI) प्रमाणित भोजन उपलब्ध है: वेज बुफे ₹299/प्लेट, नॉन-वेज बिरयानी दावत ₹450/प्लेट और बर्थडे स्नैक पैक ₹249/प्लेट। क्रॉकरी, सर्विंग स्टाफ और वेन्यू सेटअप शामिल है।',
    'HI',
    array['कैटरिंग', 'खाना', 'शादी', 'बर्थडे', 'बुफे', 'बिरयानी', 'प्लेट', 'पार्टी', 'हलवाई'],
    299,
    '{"serviceCategory": "Food & Catering Services", "serviceName": "Event & Bulk Catering Service"}'::jsonb
  ),
  (
    'catering',
    'wedding-catering',
    'ఈవెంట్, వివాహం & బర్త్‌డే కేటరింగ్ (ప్లేట్ చొప్పున)',
    'కేటరింగ్ ప్లేట్ ధర మరియు మెనూ వివరాలు ఏమిటి?',
    'డోర్‌లిన్ కేటరింగ్ సేవల్లో FSSAI సర్టిఫైడ్ రుచికరమైన భోజనం లభిస్తుంది: వెజ్ బుఫే ₹299/ప్లేట్, రాయల్ దమ్ బిర్యానీ నాన్-వెజ్ ఫీస్ట్ ₹450/ప్లేట్ మరియు బర్త్‌డే ప్యాక్ ₹249/ప్లేట్. క్రాకరీ, సర్వింగ్ స్టాఫ్ సెటప్ చేర్చబడింది.',
    'TE',
    array['కేటరింగ్', 'భోజనం', 'వివాహం', 'పెళ్లి', 'బర్త్‌డే', 'బిర్యానీ', 'బుఫే', 'ప్లేట్లు', 'వంట'],
    299,
    '{"serviceCategory": "Food & Catering Services", "serviceName": "Event & Bulk Catering Service"}'::jsonb
  ),

  -- General & Helpline (EN, HI, TE)
  (
    'general',
    'ivrs-helpline',
    'Doorlyn Voice IVRS Toll-Free Helpline',
    'How do I call Doorlyn helpline or use the IVRS phone system?',
    'You can call Doorlyn 24/7 Toll-Free IVRS Hotline at 1800-DOORLYN (1800-366-7596). Supports English, Hindi, and Telugu automated voice booking and live technician transfer with zero internet required.',
    'EN',
    array['ivrs', 'helpline', 'call', 'toll free', 'phone', 'support', 'customer care', 'hotline', '1800'],
    0,
    '{"serviceCategory": "Customer Support", "serviceName": "Doorlyn IVRS Voice Helpline"}'::jsonb
  ),
  (
    'general',
    'ivrs-helpline',
    'डोरलिन वॉइस आईवीआरएस टोल-फ्री हेल्पलाइन',
    'डोरलिन हेल्पलाइन पर कॉल कैसे करें?',
    'आप डोरलिन की 24/7 टोल-फ्री हेल्पलाइन 1800-DOORLYN (1800-366-7596) पर कॉल कर सकते हैं। यह बिना इंटरनेट के हिंदी, अंग्रेजी और तेलुगु में वॉयस बुकिंग की सुविधा देता है।',
    'HI',
    array['आईवीआरएस', 'हेल्पलाइन', 'कॉल', 'फोन', 'टोल फ्री', 'कस्टमर केयर', '1800', 'ivrs'],
    0,
    '{"serviceCategory": "Customer Support", "serviceName": "Doorlyn IVRS Voice Helpline"}'::jsonb
  ),
  (
    'general',
    'ivrs-helpline',
    'డోర్‌లిన్ వాయిస్ IVRS టోల్-ఫ్రీ హెల్ప్‌లైన్',
    'డోర్‌లిన్ హెల్ప్‌లైన్‌కి ఎలా కాల్ చేయాలి?',
    'మీరు 24/7 డోర్‌లిన్ ఉచిత టోల్-ఫ్రీ హెల్ప్‌లైన్ 1800-DOORLYN (1800-366-7596) కు కాల్ చేయవచ్చు. ఇంటర్నెట్ లేకుండా తెలుగు, హిందీ, ఇంగ్లీషులలో నేరుగా వాయిస్ బుకింగ్ చేసుకోవచ్చు.',
    'TE',
    array['ఐవిఆర్ఎస్', 'హెల్ప్‌లైన్', 'కాల్', 'ఫోన్', 'టోల్ ఫ్రీ', 'కస్టమర్ కేర్', '1800', 'ivrs'],
    0,
    '{"serviceCategory": "Customer Support", "serviceName": "Doorlyn IVRS Voice Helpline"}'::jsonb
  ),
  (
    'general',
    'cancellation-policy',
    'Doorlyn Cancellation & Refund Policy',
    'What is the cancellation policy? Can I cancel my booking and get a refund?',
    'Cancellations are 100% free before the service partner or phlebotomist is dispatched. If cancelled, any prepaid amount is credited instantly to your Doorlyn Wallet or refunded back to your original payment method within 24 hours. No hidden charges or cancellation fees.',
    'EN',
    array['cancellation', 'cancel', 'refund', 'money back', 'free cancellation', 'policy', 'charges'],
    0,
    '{"serviceCategory": "Customer Policy", "serviceName": "Cancellation & Refund Policy"}'::jsonb
  ),
  (
    'general',
    'cancellation-policy',
    'डोरलिन रद्दीकरण और धन वापसी (Refund) नीति',
    'कैंसिलेशन पॉलिसी क्या है? क्या मैं अपनी बुकिंग रद्द करके रिफंड पा सकता हूँ?',
    'सर्विस पार्टनर या लैब तकनीशियन के निकलने से पहले बुकिंग रद्द करना 100% मुफ्त है। रद्द करने पर पूरी राशि तुरंत आपके डोरलिन वॉलेट में या 24 घंटे के भीतर आपके मूल भुगतान खाते में वापस जमा कर दी जाती है।',
    'HI',
    array['कैंसिलेशन', 'रद्द', 'रिफंड', 'पैसे वापस', 'रिफंड नीति', 'कैंसिल'],
    0,
    '{"serviceCategory": "Customer Policy", "serviceName": "Cancellation & Refund Policy"}'::jsonb
  ),
  (
    'general',
    'cancellation-policy',
    'డోర్‌లిన్ రద్దు మరియు రీఫండ్ విధానం',
    'క్యాన్సిలేషన్ విధానం ఏమిటి? నేను బుకింగ్ రద్దు చేసి రీఫండ్ పొందవచ్చా?',
    'సర్వీస్ పార్ట్‌నర్ బయలుదేరడానికి ముందు బుకింగ్ రద్దు చేయడం 100% ఉచితం. రద్దు చేసినట్లయితే, చెల్లించిన మొత్తం తక్షణమే మీ డోర్‌లిన్ వాలెట్‌లో జమవుతుంది లేదా 24 గంటల్లో మీ బ్యాంక్ ఖాతాకు రీఫండ్ అవుతుంది.',
    'TE',
    array['క్యాన్సిలేషన్', 'రద్దు', 'రీఫండ్', 'డబ్బులు వెనక్కి', 'క్యాన్సిల్'],
    0,
    '{"serviceCategory": "Customer Policy", "serviceName": "Cancellation & Refund Policy"}'::jsonb
  ),
  (
    'general',
    'coupons-discounts',
    'Doorlyn Promo Coupons & Discount Offers',
    'What coupon codes or discounts are available? How to get discount on service?',
    'Available coupons: 1) FIRSTDOOR — Flat ₹150 OFF on your 1st booking (min order ₹300). 2) HEALTH50 — Save ₹200 on Healthcare & Diagnostics (min order ₹500). 3) RURAL20 — Special ₹100 discount for senior citizens and rural bookings. Apply codes during checkout or ask Doorlyn AI!',
    'EN',
    array['coupon', 'coupons', 'discount', 'promo', 'offer', 'code', 'firstdoor', 'health50', 'cheap', 'save'],
    0,
    '{"serviceCategory": "Promotions", "serviceName": "Coupons & Discounts"}'::jsonb
  ),
  (
    'repairs',
    'appliance-detailed-rates',
    'AC Servicing, Gas Refill & Appliance Repair Rates',
    'What are the charges for AC foam servicing, gas refill, and washing machine repair?',
    'Doorlyn Appliance Rates: AC Foam Jet Servicing at ₹499 (indoor/outdoor deep wash), AC Gas Refill (R32/R410) at ₹1299, Washing Machine Motor/Drain Pump repair at ₹399, Refrigerator Cooling fix at ₹449, and RO Water Purifier filter replacement at ₹349. Verified technicians arrive as soon as possible.',
    'EN',
    array['ac service', 'ac repair', 'gas refill', 'foam wash', 'washing machine', 'fridge repair', 'ro filter', 'appliance rates'],
    499,
    '{"serviceCategory": "Home Repairs", "serviceName": "Appliance Repair Rates"}'::jsonb
  ),
  (
    'healthcare',
    'antenatal-checkup',
    'Pregnancy Care & Antenatal Blood Test Panel',
    'What is included in the pregnancy antenatal checkup and what is the cost?',
    'Doorlyn Antenatal Pregnancy Panel is ₹1499 for 1st Trimester (includes Blood Grouping & Rh Type, Hemoglobin & Iron, HIV/HBsAg viral screening, and Urine routine) and ₹1299 for 2nd Trimester OGTT Glucose & Ferritin. Priority morning home sample collection by female phlebotomists.',
    'EN',
    array['pregnancy', 'antenatal', 'pregnant', 'blood group', 'rh factor', 'hiv', 'hbsag', 'iron', 'trimester', 'baby'],
    1499,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Antenatal Checkup (Pregnancy Care)"}'::jsonb
  ),
  (
    'healthcare',
    'thyroid-test',
    'Thyroid Profile Test (T3, T4, Ultrasensitive TSH)',
    'How much does a thyroid test cost and what are T3 T4 TSH details?',
    'Doorlyn Thyroid Testing: Ultrasensitive TSH Screening at ₹249, Total Thyroid Profile (T3 + T4 + TSH) at ₹449, and Free Active Thyroid Profile (FT3 + FT4 + TSH) at ₹699. Fasting required for 8 hours. Uses CLIA technology for maximum accuracy.',
    'EN',
    array['thyroid', 'tsh', 't3', 't4', 'ft3', 'ft4', 'hypothyroidism', 'hyperthyroidism', 'metabolism', 'weight'],
    449,
    '{"serviceCategory": "Healthcare & Diagnostic", "serviceName": "Thyroid Profile Test"}'::jsonb
  ),
  (
    'repairs',
    'carpenter-services',
    'Carpenter Furniture Repair & Godrej Door Lock Installation',
    'What are the charges for door lock installation and furniture repair?',
    'Doorlyn Carpenter Rates: Godrej/Europa Main Door Lock & Latch Fitting at ₹249, Bed & Dining Table Wooden Repair at ₹349, and Modular Kitchen Cabinet Hinge Alignment at ₹299. Skilled craftsmen with 5+ years experience.',
    'EN',
    array['carpenter', 'door lock', 'godrej lock', 'furniture repair', 'cabinet', 'hinge', 'latch', 'wooden bed'],
    349,
    '{"serviceCategory": "Home Repairs", "serviceName": "Carpenters"}'::jsonb
  ),
  (
    'pickup-drop',
    'express-luggage-gift',
    'Same Day Delivery, Gift Flowers & Railway Luggage Drop',
    'What are the rates for same day delivery, gifts, and railway station luggage drop?',
    'Doorlyn Delivery Options: Guaranteed 2-Hour Express Delivery at ₹129, Heavy Box Parcel (up to 15kg) at ₹179, Cake & Flower Surprise Drop with custom greeting note at ₹99, and Railway Station / Bus Stand Heavy Luggage Drop at ₹199.',
    'EN',
    array['same day delivery', 'express delivery', 'gift delivery', 'cake delivery', 'flowers', 'luggage drop', 'railway station', 'bus stand'],
    129,
    '{"serviceCategory": "Pickup & Drop", "serviceName": "Express Goods & Gift Delivery"}'::jsonb
  ),
  (
    'logistics',
    'office-truck-hire',
    'Office Relocation & Tata Ace / Bolero Pickup Hire',
    'What are the rates for office shifting and renting Tata Ace Chota Hathi?',
    'Doorlyn Logistics Rates: Small Office Relocation (up to 10 workstations with anti-static IT packing) at ₹4999, Corporate Overnight Shift at ₹8999, Tata Ace (Chota Hathi) Mini Truck Rent at ₹799 for first 5km, and Mahindra Bolero Open Pickup at ₹999 for first 5km.',
    'EN',
    array['office shifting', 'office relocation', 'tata ace', 'chota hathi', 'bolero pickup', 'truck hire', 'mini truck'],
    799,
    '{"serviceCategory": "Logistics & Shifting", "serviceName": "Office Move & Truck Hire"}'::jsonb
  ),
  (
    'student-services',
    'epass-scholarship-counseling',
    'Epass Scholarship Form Help & College Career Counseling',
    'How to get help with Epass government scholarship application and college counseling?',
    'Doorlyn Student Services: Epass & Govt Scholarship Online Application & Document Upload Assistance at ₹299, 1-on-1 College Entrance & Stream Career Counseling Session at ₹499.',
    'EN',
    array['epass', 'scholarship', 'scholarship form', 'college counseling', 'career guidance', 'student help'],
    299,
    '{"serviceCategory": "Student Tutors & Services", "serviceName": "Scholarship & Career Guidance"}'::jsonb
  ),
  (
    'catering',
    'birthday-pooja-catering',
    'Birthday Party Meal Box, Balloon Decor & Satvik Pooja Catering',
    'What are the charges for birthday party catering, balloon decor, and satvik pooja meals?',
    'Doorlyn Event Special Combos: Kid Birthday Snack Box (mini burger, fries, pasta, juice) at ₹249/plate, Birthday Food + Arch Balloon Decor + Sound System Combo at ₹6999 (50 plates), Satyanarayana Swamy Pooja Satvik Catering (no onion/garlic) at ₹299/plate, and Corporate Bento Box Lunch at ₹199/plate.',
    'EN',
    array['birthday catering', 'balloon decor', 'pooja catering', 'satvik food', 'bento box', 'corporate lunch', 'sound system'],
    249,
    '{"serviceCategory": "Food & Catering Services", "serviceName": "Party Decor & Satvik Catering"}'::jsonb
  );
