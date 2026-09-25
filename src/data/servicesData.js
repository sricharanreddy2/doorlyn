export const servicesData = [
  {
    id: 'healthcare',
    titleKey: 'catHealthcare',
    subtitleKey: 'subHealthcare',
    icon: 'Activity',
    color: 'from-emerald-600 to-teal-700',
    badge: 'Home Collection Available',
    subFeatures: [
      { title: 'Sterile Sealed Kit', desc: 'Single-use vacuum sealed needle & tube opened live in front of you.', icon: 'ShieldCheck' },
      { title: 'NABL Accredited Labs', desc: 'Samples processed at certified diagnostic centers (Apollo / Dr. Lal Path).', icon: 'Award' },
      { title: 'AI Smart Explanation', desc: 'Translates complex medical jargon into simplified health insights.', icon: 'Sparkles' },
      { title: '24-Hr Digital PDF', desc: 'Instant WhatsApp & app report download with historical health trends.', icon: 'FileText' }
    ],
    items: [
      {
        id: 'cbc-test',
        name: 'CBC Test (Complete Blood Count)',
        price: 349,
        mrp: 600,
        includes: ['Hemoglobin Count', 'RBC & WBC Count', 'Platelet Count', 'Automated Cell Analyzer'],
        tag: 'Popular',
        category: 'Diagnostics',
        subServices: [
          { id: 'cbc-basic', name: 'Standard Complete Blood Count (CBC)', price: 349, mrp: 600, desc: 'Hemoglobin, RBC, WBC & Platelet count' },
          { id: 'cbc-sugar', name: 'CBC + Fasting Blood Sugar Combo', price: 449, mrp: 750, desc: 'Complete blood count plus morning fasting glucose check' },
          { id: 'cbc-hba1c', name: 'CBC + HbA1c Diabetes Profile', price: 599, mrp: 950, desc: 'Blood count with 3-month average glucose marker' },
          { id: 'cbc-vitals', name: 'CBC + Vitamin D3 & B12 Panel', price: 799, mrp: 1400, desc: 'Complete blood count plus bone & nerve vitamin levels' }
        ],
        subFeatures: [
          { title: 'Hemoglobin & Anemia Check', desc: 'Measures oxygen carrying capacity and detects iron deficiency.', icon: 'HeartPulse' },
          { title: 'Immunity & Infection Screening', desc: 'Full WBC differential count for virus & bacterial immunity status.', icon: 'ShieldCheck' },
          { title: 'Platelet Density Check', desc: 'Monitors blood clotting factors & dengue/viral fever health.', icon: 'Activity' },
          { title: 'Free Home Sample Pickup', desc: 'Certified phlebotomist visits your doorstep at your chosen time.', icon: 'Clock' }
        ]
      },
      {
        id: 'blood-sugar',
        name: 'Blood Sugar Test (FBS / PPBS)',
        price: 199,
        mrp: 350,
        includes: ['Fasting Blood Sugar', 'Post Prandial Sugar', 'HbA1c Blood Marker'],
        tag: 'Fast Result',
        category: 'Diagnostics',
        subServices: [
          { id: 'fbs-only', name: 'Fasting Blood Sugar (FBS)', price: 149, mrp: 250, desc: 'Morning 8-hour fasting blood glucose measurement' },
          { id: 'ppbs-only', name: 'Post Prandial Sugar (PPBS)', price: 149, mrp: 250, desc: 'Blood glucose test 2 hours after meal' },
          { id: 'fbs-ppbs-combo', name: 'Dual Sugar Package (FBS + PPBS)', price: 249, mrp: 450, desc: 'Complete pre-meal and post-meal glucose evaluation' },
          { id: 'hba1c-special', name: 'HbA1c Glycated Hemoglobin Test', price: 349, mrp: 550, desc: '3-month average glycemic control marker' }
        ],
        subFeatures: [
          { title: 'Fasting & Post-Prandial Range', desc: 'Measures morning glucose & 2-hour post-meal glycemic levels.', icon: 'Activity' },
          { title: 'HbA1c 3-Month Average', desc: 'Long-term blood sugar control assessment for diabetes care.', icon: 'Award' },
          { title: 'Smart Diet Recommendation', desc: 'AI analyzes sugar levels and provides personalized meal tips.', icon: 'Sparkles' }
        ]
      },
      {
        id: 'full-body',
        name: 'Full Body Checkup (Master Health Package)',
        price: 999,
        mrp: 2499,
        includes: ['CBC Test', 'Lipid Profile (Cholesterol)', 'Liver Function (LFT)', 'Kidney Function (KFT)', 'Thyroid & Fasting Sugar'],
        tag: 'Best Seller',
        category: 'Diagnostics',
        subServices: [
          { id: 'master-68', name: 'Master Health Package (68 Parameters)', price: 999, mrp: 2499, desc: 'CBC, Lipid, LFT, KFT, Thyroid & Fasting Sugar' },
          { id: 'executive-84', name: 'Executive Senior Citizen Full Body (84 Parameters)', price: 1499, mrp: 3500, desc: 'Includes Vitamin D, B12, Urine micro, ECG & Calcium' },
          { id: 'cardiac-care', name: 'Comprehensive Cardiac & Lipid Screening', price: 1299, mrp: 2800, desc: 'High-sensitivity CRP, Lipid Profile & Cardiac Risk markers' }
        ],
        subFeatures: [
          { title: '68 Diagnostic Parameters', desc: 'Complete vital organ screening covering Heart, Liver, Kidney & Sugar.', icon: 'HeartPulse' },
          { title: 'Lipid & Cholesterol Profile', desc: 'HDL, LDL, Triglycerides & Cardiac Risk Ratio evaluation.', icon: 'Activity' },
          { title: 'Liver & Kidney Function', desc: 'Bilirubin, SGOT/SGPT, Creatinine & Uric Acid screening.', icon: 'ShieldCheck' },
          { title: 'Free Tele-Doctor Consultation', desc: 'Discuss your digital lab report with a verified general physician.', icon: 'UserCheck' }
        ]
      },
      {
        id: 'pcod-screening',
        name: 'Women\'s Health: PCOD / PCOS Screening',
        price: 1299,
        mrp: 2800,
        includes: ['Hormone Panel (FSH/LH)', 'Prolactin', 'Free Testosterone', 'Pelvic Ultrasound Guidance'],
        tag: 'Women Special',
        category: 'Women Health',
        subServices: [
          { id: 'pcos-basic', name: 'PCOS Hormone Panel (FSH, LH, Prolactin)', price: 1299, mrp: 2800, desc: 'Essential female reproductive hormone screening' },
          { id: 'pcos-advanced', name: 'PCOS Advanced + Thyroid & Insulin Resistance', price: 1799, mrp: 3600, desc: 'Hormone panel plus fasting insulin & thyroid profile' }
        ],
        subFeatures: [
          { title: 'Complete Hormone Evaluation', desc: 'FSH, LH, Prolactin, Fasting Insulin & Male Hormone markers.', icon: 'HeartPulse' },
          { title: 'Female Phlebotomist Option', desc: 'Female sample collection expert assigned upon request.', icon: 'UserCheck' },
          { title: 'Gynecologist Report Explainer', desc: 'Personalized PCOS management guide provided with test results.', icon: 'Sparkles' }
        ]
      },
      {
        id: 'antenatal-checkup',
        name: 'Women\'s Health: Antenatal Checkup (Pregnancy Care)',
        price: 1499,
        mrp: 3200,
        includes: ['Blood Group & Rh Type', 'HIV/HBsAg Screening', 'Hemoglobin & Iron Levels', 'Urine Routine & Micro'],
        tag: 'Pregnancy Care',
        category: 'Women Health',
        subServices: [
          { id: 'pregnancy-first-trimester', name: '1st Trimester Pregnancy Blood Panel', price: 1499, mrp: 3200, desc: 'Blood group, Rh factor, Hemoglobin, HIV/HBsAg & Urine' },
          { id: 'pregnancy-second-trimester', name: '2nd Trimester Glucose & Iron Panel', price: 1299, mrp: 2600, desc: 'Oral Glucose Tolerance Test (OGTT) & Serum Ferritin' }
        ],
        subFeatures: [
          { title: 'Maternal & Fetal Safety Panel', desc: 'Screens blood group incompatibility, viral markers & iron levels.', icon: 'ShieldCheck' },
          { title: 'Gentle Home Sample Collection', desc: 'Priority morning collection designed for expecting mothers.', icon: 'HeartPulse' }
        ]
      },
      {
        id: 'thyroid-test',
        name: 'Thyroid Profile Test (T3, T4, TSH)',
        price: 449,
        mrp: 850,
        includes: ['Total T3', 'Total T4', 'Ultrasensitive TSH'],
        tag: 'Essential',
        category: 'Diagnostics',
        subServices: [
          { id: 'tsh-only', name: 'Ultrasensitive TSH Screening', price: 249, mrp: 450, desc: 'Thyroid Stimulating Hormone level check' },
          { id: 'total-thyroid', name: 'Complete Thyroid Profile (T3, T4, TSH)', price: 449, mrp: 850, desc: 'Total T3, Total T4 & TSH screening' },
          { id: 'free-thyroid', name: 'Free Thyroid Profile (FT3, FT4, TSH)', price: 699, mrp: 1200, desc: 'Unbound active free thyroid hormone measurement' }
        ],
        subFeatures: [
          { title: 'Hypo & Hyperthyroidism Check', desc: 'Evaluates metabolic rate, fatigue factors, and weight management.', icon: 'Activity' },
          { title: 'High Precision Chemiluminescence', desc: 'Advanced CLIA lab testing method for maximum accuracy.', icon: 'Award' }
        ]
      }
    ]
  },
  {
    id: 'repairs',
    titleKey: 'catHomeRepairs',
    subtitleKey: 'subHomeRepairs',
    icon: 'Wrench',
    color: 'from-amber-600 to-orange-700',
    badge: '30-Min Arrival',
    subFeatures: [
      { title: 'Verified Quality Service', desc: 'Full support and re-visit assistance if any issue reoccurs.', icon: 'ShieldCheck' },
      { title: 'Background Checked Pros', desc: 'Aadhaar verified experts with 5+ years certified repair experience.', icon: 'UserCheck' },
      { title: 'Insulated Safety Gear', desc: 'Heavy-duty insulated tools & voltage testers for 100% electrical safety.', icon: 'Wrench' },
      { title: 'Transparent Rate Card', desc: 'Upfront fixed inspection & labor rates with no surprise charges.', icon: 'CheckCircle2' }
    ],
    items: [
      {
        id: 'electrician-services',
        name: 'Electricians',
        price: 249,
        mrp: 450,
        includes: ['Fan Repair & Installation', 'Full Home Wiring Inspection', 'Inverter Installation & Battery Setup', 'Switchboard Repair'],
        tag: 'Verified Experts',
        category: 'Repairs',
        subServices: [
          { id: 'fan-repair', name: 'Ceiling Fan Repair & Capacitor Replacement', price: 199, mrp: 350, desc: 'Fixes low speed, noise, and replaces faulty capacitor' },
          { id: 'switchboard-fix', name: 'Switchboard Repair & 16A Socket Fitting', price: 149, mrp: 250, desc: 'Repairs burnt switches, adds new heavy load power sockets' },
          { id: 'mcb-wiring', name: 'MCB Fuse Replacement & Circuit Fault Finding', price: 249, mrp: 450, desc: 'Inspects tripping MCB breaker & hidden short circuits' },
          { id: 'inverter-setup', name: 'Inverter & Battery Dual Wiring Installation', price: 399, mrp: 700, desc: 'Complete inverter setup, battery acid check & back-up wiring' },
          { id: 'tube-light-fitting', name: 'LED Batten & Fancy Light Installation', price: 129, mrp: 200, desc: 'Fits wall lights, chandelier & LED batten strips' }
        ],
        subFeatures: [
          { title: 'Ceiling Fan & Motor Repair', desc: 'Winding check, capacitor replacement & noise-free balancing.', icon: 'Wrench' },
          { title: 'Circuit & Wiring Safety Inspection', desc: 'Detects hidden short circuits, MCB trips, and grounding faults.', icon: 'ShieldCheck' },
          { title: 'Switchboard & Socket Upgrades', desc: 'Heavy load 16A modular socket installation for AC & Geysers.', icon: 'CheckCircle2' },
          { title: 'Inverter & Battery Wiring', desc: 'Dual wiring setup & battery acid water top-up maintenance.', icon: 'Activity' }
        ]
      },
      {
        id: 'plumbing-services',
        name: 'Plumbers',
        price: 299,
        mrp: 500,
        includes: ['Leakage Repairs & Sealing', 'Pipe Replacement & New Installation', 'Water Tank Cleaning & Repair', 'Tap & Shower Fitting'],
        tag: 'Instant Service',
        category: 'Repairs',
        subServices: [
          { id: 'tap-leak', name: 'Tap & Flush Tank Leakage Repair', price: 149, mrp: 250, desc: 'Replaces worn out washers, spindles, and Teflon tape sealing' },
          { id: 'clog-cleaning', name: 'Sink & Washbasin Drain Blockage Removal', price: 199, mrp: 350, desc: 'Clears trapped food waste and hair clogs in drainage pipe' },
          { id: 'shower-mixer', name: 'Wall Mixer & Shower Head Installation', price: 299, mrp: 500, desc: 'Fits bathroom hot & cold water wall mixer taps' },
          { id: 'pipe-fitting', name: 'CPVC / UPVC Pipe Leak Sealing & Fitting', price: 349, mrp: 600, desc: 'Replaces broken water supply pipes and elbow joints' }
        ],
        subFeatures: [
          { title: 'High-Pressure Leak Sealing', desc: 'Waterproof sealant & Teflon tape pipe joint leak repair.', icon: 'Wrench' },
          { title: 'Tap, Mixer & Shower Fittings', desc: 'Precision installation of wall mixers, health faucets & taps.', icon: 'CheckCircle2' },
          { title: 'Drainage & Clog Removal', desc: 'Removes blockages in sink, washbasin & bathroom drain pipes.', icon: 'ShieldCheck' }
        ]
      },
      {
        id: 'carpenter-services',
        name: 'Carpenters',
        price: 349,
        mrp: 600,
        includes: ['Furniture Repair', 'Door & Window Lock Installation', 'Modular Kitchen Cabinet Repair', 'Wooden Wall Shelf Mounting'],
        tag: 'Custom Craft',
        category: 'Repairs',
        subServices: [
          { id: 'door-lock-fitting', name: 'Door Handle, Latch & Main Lock Installation', price: 249, mrp: 400, desc: 'Fits Godrej / Europa main door locks & latches' },
          { id: 'furniture-repair', name: 'Bed, Table & Wooden Chair Repair', price: 349, mrp: 600, desc: 'Fixes loose joints, wobbly legs, and broken wood panels' },
          { id: 'cabinet-hinge', name: 'Modular Kitchen Drawer & Hinge Alignment', price: 299, mrp: 500, desc: 'Adjusts soft-close hinges and hydraulic drawer channels' }
        ],
        subFeatures: [
          { title: 'Door & Lock Installation', desc: 'Al interior door hinge alignment, handle & Godrej lock fitting.', icon: 'Wrench' },
          { title: 'Modular Furniture Assembly', desc: 'IKEA / Pepperfry wardrobe, bed frame & TV unit assembly.', icon: 'CheckCircle2' }
        ]
      },
      {
        id: 'appliance-repair',
        name: 'Appliance Repair Technicians',
        price: 399,
        mrp: 750,
        includes: ['AC Servicing & Gas Refill', 'Refrigerator Cooling Repair', 'Washing Machine Drum & Motor', 'Water Purifier RO Filter Service', 'Gas Stove, Mixer & Rice Cooker'],
        tag: 'Verified Experts',
        category: 'Repairs',
        subServices: [
          { id: 'ac-foam-wash', name: 'Split / Window AC Foam Power Jet Servicing', price: 499, mrp: 850, desc: 'Deep outdoor & indoor coil wash with anti-fungal foam' },
          { id: 'ac-gas-refill', name: 'AC Gas Top-Up & Leakage Repair', price: 1299, mrp: 2200, desc: 'R32 / R410 refrigerant gas charging with pressure test' },
          { id: 'washing-machine-fix', name: 'Washing Machine Motor & Drain Pump Fix', price: 399, mrp: 750, desc: 'Repairs drum vibration, noise, and water drainage errors' },
          { id: 'fridge-repair', name: 'Refrigerator Cooling & Gas Repair', price: 449, mrp: 800, desc: 'Compressor relay, thermostat, and gas charging check' },
          { id: 'ro-service', name: 'Water Purifier RO Filter Replacement', price: 349, mrp: 600, desc: 'Sediment, carbon & membrane filter service + TDS check' }
        ],
        subFeatures: [
          { title: 'AC Foam & Power Jet Wash', desc: 'Deep indoor coil wash, filter cleaning, and gas pressure check.', icon: 'Sparkles' },
          { title: 'Washing Machine Motor Repair', desc: 'Fixes drum vibration, drain pump blockage, and PCB board issues.', icon: 'Wrench' },
          { title: 'RO Water Purifier Servicing', desc: 'Sediment, carbon & membrane filter replacement + TDS calibration.', icon: 'ShieldCheck' }
        ]
      },
      {
        id: 'painting-waterproofing',
        name: 'Painting & Waterproofing',
        price: 1499,
        mrp: 3000,
        includes: ['Interior & Exterior Painting', 'Wall Crack Sealing', 'Roof Waterproofing Treatment', 'Color Consultation'],
        tag: 'Long Lasting',
        category: 'Repairs',
        subServices: [
          { id: 'single-room-paint', name: 'Single Room Wall Touch-up & Repaint', price: 1499, mrp: 3000, desc: 'Putty touch-up, primer & 2 coats washable emulsion' },
          { id: 'wall-dampness', name: 'Wall Seepage & Waterproofing Treatment', price: 1999, mrp: 3800, desc: 'Polymer chemical coating for damp walls' }
        ],
        subFeatures: [
          { title: 'Wall Dampness & Crack Sealing', desc: 'Polymer crack filler & damp-proof primer application.', icon: 'ShieldCheck' },
          { title: 'Dust-Free Sanding & Paint Finish', desc: 'Asian Paints / Berger premium washable emulsion finish.', icon: 'Sparkles' }
        ]
      }
    ]
  },
  {
    id: 'pickup-drop',
    titleKey: 'catPickupDrop',
    subtitleKey: 'subPickupDrop',
    icon: 'PackageCheck',
    color: 'from-blue-600 to-indigo-700',
    badge: 'Parcel Express',
    subFeatures: [
      { title: '15-Min Pickup Guarantee', desc: 'Nearest Rapido express rider dispatched for immediate doorstep pickup.', icon: 'Clock' },
      { title: 'Live GPS Tracking', desc: 'Real-time live map tracking from pickup point to final destination.', icon: 'Truck' },
      { title: 'Secure 4-Digit Handover PIN', desc: 'Package delivered only after recipient verifies security OTP.', icon: 'Lock' },
      { title: 'Tamper-Proof Waterproof Pouch', desc: 'Protects documents, keys, gifts & electronics from rain & dust.', icon: 'ShieldCheck' }
    ],
    items: [
      {
        id: 'small-parcel',
        name: 'Small Parcel Pickup & Drop',
        price: 69,
        mrp: 120,
        includes: ['Documents & Keys', 'Up to 5 kg', 'Live GPS Tracking', 'Direct OTP Verification'],
        tag: 'Fast Delivery',
        category: 'Express Parcel',
        subServices: [
          { id: 'keys-docs', name: 'Urgent Documents & Keys Transfer', price: 69, mrp: 120, desc: 'Passports, agreements, home/office keys & chargers' },
          { id: 'tiffin-food', name: 'Home Cooked Food & Tiffin Express Box', price: 79, mrp: 140, desc: 'Insulated hot pouch delivery for lunch & dinner boxes' },
          { id: 'gadget-drop', name: 'Mobile, Laptop & Electronics Transfer', price: 99, mrp: 160, desc: 'Bubble padded safe delivery for electronic devices' }
        ],
        subFeatures: [
          { title: 'Urgent Document & Key Transfer', desc: 'Home/Office keys, passports, contracts & forgotten chargers.', icon: 'Clock' },
          { title: 'Weatherproof Sealed Bag', desc: 'Comes with free rain protection sleeve for safe transport.', icon: 'ShieldCheck' }
        ]
      },
      {
        id: 'same-day-delivery',
        name: 'Same Day Express Delivery',
        price: 129,
        mrp: 200,
        includes: ['City-wide Delivery', 'Up to 15 kg', 'Dedicated Delivery Agent'],
        tag: 'Guaranteed 2 Hrs',
        category: 'Express Parcel',
        subServices: [
          { id: '2hr-express', name: 'Guaranteed 2-Hour Express Delivery', price: 129, mrp: 200, desc: 'Direct point-to-point delivery within city limits' },
          { id: 'bulk-parcel-15kg', name: 'Heavy Box Parcel (Up to 15kg)', price: 179, mrp: 280, desc: 'Delivers heavy retail goods, clothes & books' }
        ],
        subFeatures: [
          { title: 'Guaranteed 2-Hour Delivery', desc: 'Direct point-to-point delivery without hub routing delays.', icon: 'Clock' },
          { title: 'Up to 15 kg Carrying Capacity', desc: 'Ideal for laptops, clothes, food boxes & office files.', icon: 'Package' }
        ]
      },
      {
        id: 'gift-delivery',
        name: 'Gift & Festival Package Delivery',
        price: 99,
        mrp: 180,
        includes: ['Handle with Care', 'Custom Greeting Card Note', 'Instant Photo Proof'],
        tag: 'Special Care',
        category: 'Express Parcel',
        subServices: [
          { id: 'cake-flower-gift', name: 'Cake, Flowers & Festive Sweets Drop', price: 99, mrp: 180, desc: 'Special non-tilt handling for fragile cakes & bouquets' },
          { id: 'custom-card-gift', name: 'Surprise Delivery + Personal Note Card', price: 129, mrp: 220, desc: 'Rider delivers surprise gift with your custom text note' }
        ],
        subFeatures: [
          { title: 'Fragile Handle-With-Care Protocol', desc: 'Specialized padding for cakes, sweets, flowers & glass gifts.', icon: 'Sparkles' },
          { title: 'Photo Handover Confirmation', desc: 'Rider uploads live picture proof upon successful delivery.', icon: 'CheckCircle2' }
        ]
      },
      {
        id: 'luggage-delivery',
        name: 'Luggage & Heavy Bag Delivery',
        price: 199,
        mrp: 350,
        includes: ['Up to 35 kg', 'Railway Station & Bus Stand Drop'],
        tag: 'Travel Friendly',
        category: 'Express Parcel',
        subServices: [
          { id: 'station-luggage', name: 'Railway Station / Bus Stand Luggage Drop', price: 199, mrp: 350, desc: 'Transports heavy suitcases directly to platform or bus bay' }
        ],
        subFeatures: [
          { title: 'Heavy Travel Bag Transfer', desc: 'Transports suitcases & trolley bags directly to Railway station or Airport.', icon: 'Truck' }
        ]
      }
    ]
  },
  {
    id: 'logistics',
    titleKey: 'catLogistics',
    subtitleKey: 'subLogistics',
    icon: 'Truck',
    color: 'from-cyan-700 to-blue-900',
    badge: 'House Shifting & Trucks',
    subFeatures: [
      { title: 'Dedicated Mini-Truck', desc: 'Tata Ace / Bolero pickup truck dedicated exclusively to your move.', icon: 'Truck' },
      { title: 'Multi-Layer Packing', desc: 'Heavy bubble wrap, corrugated sheets, & stretch film protection.', icon: 'Package' },
      { title: 'Experienced Loading Helpers', desc: 'Trained movers to safely lift heavy furniture, fridge & washing machine.', icon: 'Users' },
      { title: 'Furniture Assembly & Setup', desc: 'Beds, wardrobes & appliances uninstalled and reassembled.', icon: 'Wrench' }
    ],
    items: [
      {
        id: 'house-shifting',
        name: 'Local House Shifting',
        price: 2499,
        mrp: 4500,
        includes: ['1BHK / 2BHK / 3BHK Relocation', 'Packing Materials Included', 'Loading & Unloading Helpers', 'Disassembly & Reassembly'],
        tag: 'Stress-Free',
        category: 'Relocation',
        subServices: [
          { id: '1bhk-move', name: '1BHK House Shifting (Tata Ace + 2 Helpers)', price: 1999, mrp: 3800, desc: 'Complete packing, loading, transport & unloading for 1BHK' },
          { id: '2bhk-move', name: '2BHK Family House Shifting (Bolero + 3 Helpers)', price: 2999, mrp: 5200, desc: 'Full multi-layer packing for fridge, TV, bed & kitchen' },
          { id: '3bhk-villa-move', name: '3BHK Villa / Independent House Shifting', price: 4499, mrp: 7800, desc: '14ft container truck + 4 expert movers with insurance' },
          { id: 'single-appliance-move', name: 'Single Heavy Item Shifting (Fridge / Sofa / Bed)', price: 899, mrp: 1600, desc: 'Transports 1 heavy item with loading helpers' }
        ],
        subFeatures: [
          { title: 'Full 1BHK / 2BHK House Relocation', desc: 'Complete end-to-end packing, loading, transport, & unloading.', icon: 'Truck' },
          { title: 'Heavy Furniture Dismantling', desc: 'Teak beds, wardrobes, and dining tables safely unbolted & packed.', icon: 'Wrench' },
          { title: 'Transit Safety Insurance Option', desc: 'Covers any accidental damage during intra-city transit.', icon: 'ShieldCheck' }
        ]
      },
      {
        id: 'office-shifting',
        name: 'Office Relocation',
        price: 4999,
        mrp: 8999,
        includes: ['Commercial Office Setup', 'IT Equipment Safe Transport', 'Desk & Cabinet Moving'],
        tag: 'Corporate',
        category: 'Relocation',
        subServices: [
          { id: 'small-office-10desks', name: 'Small Office Relocation (Up to 10 Workstations)', price: 4999, mrp: 8999, desc: 'Desks, chairs, monitors, anti-static IT packing' },
          { id: 'corporate-office', name: 'Large Corporate Office Custom Shift', price: 8999, mrp: 15000, desc: 'Overnight shift with zero business downtime' }
        ],
        subFeatures: [
          { title: 'IT & Monitor Anti-Static Packing', desc: 'Special anti-static bubble wrap for desktop PCs, servers & monitors.', icon: 'ShieldCheck' },
          { title: 'Weekend / Night Shift Move', desc: 'Shift your office overnight with zero business operational downtime.', icon: 'Clock' }
        ]
      },
      {
        id: 'goods-transport',
        name: 'Goods Transportation (Mini Truck)',
        price: 799,
        mrp: 1500,
        includes: ['Tata Ace / Mahindra Bolero Pickup', 'Bulk Goods Transport', 'Dedicated Driver'],
        tag: 'On Demand',
        category: 'Relocation',
        subServices: [
          { id: 'tata-ace-rent', name: 'Tata Ace (Chota Hathi) Hire (First 5 km)', price: 799, mrp: 1500, desc: '1.5 Ton mini truck for commercial & retail goods' },
          { id: 'bolero-pickup-rent', name: 'Mahindra Bolero Pickup (First 5 km)', price: 999, mrp: 1800, desc: '2.5 Ton open body truck for long items & heavy pipes' }
        ],
        subFeatures: [
          { title: 'Tata Ace (Chota Hathi) On-Demand', desc: '1.5 Ton open / closed body truck available within 20 minutes.', icon: 'Truck' }
        ]
      }
    ]
  },
  {
    id: 'groceries',
    titleKey: 'catGroceries',
    subtitleKey: 'subGroceries',
    icon: 'ShoppingCart',
    color: 'from-emerald-700 to-green-800',
    badge: '15-Min Doorstep Express',
    subFeatures: [
      { title: '15-Minute Delivery', desc: 'Local dark store fulfillment for instant 15-minute home delivery.', icon: 'Clock' },
      { title: 'Farm Fresh Produce', desc: 'Daily morning farm harvest with 100% quality & weight check.', icon: 'Sparkles' },
      { title: 'Zero-Plastic Eco Bag', desc: 'Delivered in eco-friendly biodegradable bags.', icon: 'Leaf' },
      { title: '1-Tap Replacement', desc: 'Instant replacement if any item is damaged or sub-standard.', icon: 'CheckCircle2' }
    ],
    items: [
      {
        id: 'fresh-veg-fruits',
        name: 'Fresh Vegetables & Fruits Combo',
        price: 199,
        mrp: 300,
        includes: ['1kg Tomatoes', '1kg Onions', '1kg Potatoes', '500g Fresh Bananas'],
        tag: 'Farm Fresh',
        category: 'Grocery',
        subServices: [
          { id: 'daily-veg-kit', name: 'Daily Essential Veggie Basket (Tomatoes, Onions, Potatoes 1kg each)', price: 199, mrp: 300, desc: 'Farm fresh morning harvest essentials' },
          { id: 'exotic-fruit-kit', name: 'Exotic Fresh Fruit Basket (Apples, Bananas, Pomegranate)', price: 299, mrp: 450, desc: '1kg Apples, 1kg Bananas & 500g Fresh Pomegranates' }
        ],
        subFeatures: [
          { title: 'Triple-Washed Organic Vegetables', desc: 'Cleaned, graded, and packed in ventilated fresh pouches.', icon: 'Sparkles' },
          { title: 'Weight Accuracy Guarantee', desc: 'Digital scale weighed at dispatch for 100% exact quantity.', icon: 'CheckCircle2' }
        ]
      },
      {
        id: 'staples-oil-ghee',
        name: 'Rice, Dal, Cooking Oil & Ghee Pack',
        price: 899,
        mrp: 1200,
        includes: ['5kg Sona Masoori Rice', '1kg Toor Dal', '1L Sunflower Oil', '500ml Pure Cow Ghee'],
        tag: 'Daily Essential',
        category: 'Grocery',
        subServices: [
          { id: 'monthly-staple-pack', name: 'Monthly Kitchen Essentials Pack (5kg Rice + 1kg Dal + 1L Oil)', price: 899, mrp: 1200, desc: 'Sona Masoori Rice, Toor Dal & Freedom Sunflower Oil' },
          { id: 'pure-cow-ghee-500ml', name: 'Heritage / Amul Pure Cow Ghee (500ml Jar)', price: 349, mrp: 420, desc: '100% pure granular aromatic cow ghee' }
        ],
        subFeatures: [
          { title: 'Aged Premium Rice & Unpolished Dal', desc: 'Pest-free double boiled rice & high protein unpolished pulses.', icon: 'Award' },
          { title: '100% Pure Agmark Ghee & Oil', desc: 'Cold-pressed healthy cooking oil & aromatic cow ghee.', icon: 'ShieldCheck' }
        ]
      },
      {
        id: 'milk-curd-dairy',
        name: 'Fresh Milk, Curd & Dry Fruits',
        price: 349,
        mrp: 450,
        includes: ['2L Toned Milk', '1kg Fresh Curd', '250g Premium Almonds & Cashews'],
        tag: 'Daily Fresh',
        category: 'Grocery',
        subServices: [
          { id: 'daily-dairy-pack', name: 'Fresh Milk & Thick Curd Pack (2L Milk + 1kg Curd)', price: 149, mrp: 200, desc: 'Delivered in cold insulated thermal pouches' },
          { id: 'dry-fruit-power-pack', name: 'Premium Almonds & Cashews Combo (250g each)', price: 499, mrp: 750, desc: 'California Almonds & Whole W240 Cashews' }
        ],
        subFeatures: [
          { title: 'Cold-Chain Chilled Delivery', desc: 'Insulated thermal bag transport ensures milk & curd stay cold.', icon: 'Clock' }
        ]
      },
      {
        id: 'snacks-drinks',
        name: 'Snacks, Sweets, Chocolates & Juices',
        price: 249,
        mrp: 350,
        includes: ['Assorted Chips & Namkeen', 'Traditional Sweets', 'Chocolate Bar & 1L Fresh Fruit Juice'],
        tag: 'Treats',
        category: 'Grocery',
        subServices: [
          { id: 'party-snack-box', name: 'Family Party Snack Box (Namkeen, Chips & 1L Juice)', price: 249, mrp: 350, desc: 'Haldiram Namkeen, Lays Chips & Tropicana Juice' }
        ],
        subFeatures: [
          { title: 'Hygiene Sealed Snack Packs', desc: 'Crispy namkeen, pure ghee sweets & 100% fruit juices.', icon: 'Sparkles' }
        ]
      }
    ]
  },
  {
    id: 'worker-market',
    titleKey: 'catWorkerMarket',
    subtitleKey: 'subWorkerMarket',
    icon: 'HardHat',
    color: 'from-orange-600 to-amber-700',
    badge: 'Verified Skilled Workers',
    subFeatures: [
      { title: 'Biometric Aadhaar Verified', desc: 'All daily wage workers and mestris are police-verified with Govt ID.', icon: 'UserCheck' },
      { title: 'Flexible Hourly or Daily Rates', desc: 'Choose half-day (4h), full-day (8h), or multi-day contract labor.', icon: 'Clock' },
      { title: 'Skill-Specific Equipment', desc: 'Mestris & deep cleaning staff arrive equipped with heavy tools.', icon: 'Wrench' },
      { title: 'On-Site Supervisor Support', desc: 'Direct coordinator helpline to ensure smooth work completion.', icon: 'Users' }
    ],
    items: [
      {
        id: 'daily-wage-worker',
        name: 'Daily Wage Workers',
        price: 600,
        mrp: 800,
        includes: ['Full Day (8 Hours)', 'Heavy Lifting & Shifting', 'Garden Maintenance & Field Work'],
        tag: 'Local Labor',
        category: 'Workers',
        subServices: [
          { id: 'half-day-helper', name: 'Half Day General Helper (4 Hours)', price: 349, mrp: 500, desc: 'Ideal for short house shifting, loading or garden cleanup' },
          { id: 'full-day-helper', name: 'Full Day General Worker (8 Hours)', price: 600, mrp: 800, desc: 'Full shift heavy lifting, debris removal & manual labor' },
          { id: 'garden-maintenance-worker', name: 'Garden Trimming & Lawn Maintenance Worker', price: 549, mrp: 750, desc: 'Grass cutting, hedge trimming & weed removal' }
        ],
        subFeatures: [
          { title: 'Unskilled & Semi-Skilled Labor', desc: 'Perfect for garden clearing, house debris removal & heavy loading.', icon: 'UserCheck' },
          { title: 'Full 8-Hour Work Shift', desc: 'Standard work shift with dedicated productivity & supervision.', icon: 'Clock' }
        ]
      },
      {
        id: 'construction-worker',
        name: 'Construction & Mason Workers (Mestri)',
        price: 900,
        mrp: 1200,
        includes: ['Mason (Mestri) Work', 'Bricklaying & Cementing', 'Wall Construction & Plastering'],
        tag: 'Skilled Mestri',
        category: 'Workers',
        subServices: [
          { id: 'master-mestri-full-day', name: 'Head Mason (Senior Mestri) - 8 Hours', price: 900, mrp: 1200, desc: 'Expert brickwork, tile fixing, plastering & wall construction' },
          { id: 'assistant-mason-helper', name: 'Assistant Mason (Coolie Helper) - 8 Hours', price: 650, mrp: 850, desc: 'Mixes concrete, carries bricks, assists head mestri' }
        ],
        subFeatures: [
          { title: 'Master Mason (Mestri) Craftsmanship', desc: 'Precision tile fitting, brickwork, wall plastering & flooring.', icon: 'Wrench' }
        ]
      },
      {
        id: 'home-cleaning',
        name: 'Home Deep Cleaning Services',
        price: 1199,
        mrp: 2000,
        includes: ['Full House Deep Cleaning', 'Bathroom & Kitchen Scrubbing', 'Floor Polishing & Cobweb removal'],
        tag: 'Hygienic',
        category: 'Workers',
        subServices: [
          { id: 'bathroom-deep-clean', name: 'Bathroom & Washroom Deep Scrubbing (Per Bath)', price: 499, mrp: 850, desc: 'Tile stain removal, mirror shine & sanitization' },
          { id: 'kitchen-degreasing', name: 'Kitchen Oil Degreasing & Chimney Cleaning', price: 799, mrp: 1400, desc: 'Removes stubborn cooking grease & cabinet scrub' },
          { id: 'full-home-deep-clean', name: 'Full 2BHK House Deep Cleaning Package', price: 1999, mrp: 3500, desc: 'Includes all rooms, balcony, kitchen & 2 bathrooms' }
        ],
        subFeatures: [
          { title: 'High-Pressure Scrubbing Machines', desc: 'Deep tile gunk removal, oil degreasing in kitchen & bath sanitize.', icon: 'Sparkles' }
        ]
      },
      {
        id: 'water-tank-cleaning',
        name: 'Water Tank Cleaning Services',
        price: 599,
        mrp: 1000,
        includes: ['Overhead & Underground Tank Cleaning', 'Sludge Removal & UV Disinfection'],
        tag: 'Clean Water',
        category: 'Workers',
        subServices: [
          { id: 'overhead-tank-1000l', name: 'Overhead PVC Water Tank Cleaning (Up to 1000L)', price: 599, mrp: 1000, desc: 'Sludge extraction, jet wash & UV antibacterial spray' },
          { id: 'underground-sump-5000l', name: 'Underground Sump Deep Cleaning (Up to 5000L)', price: 999, mrp: 1800, desc: 'Submersible pump dewatering & manual wall scrub' }
        ],
        subFeatures: [
          { title: '6-Stage Tank Purification', desc: 'Submersible de-watering, sludge extraction, high-pressure jet wash & UV treatment.', icon: 'ShieldCheck' }
        ]
      }
    ]
  },
  {
    id: 'student-services',
    titleKey: 'catStudentServices',
    subtitleKey: 'subStudentServices',
    icon: 'GraduationCap',
    color: 'from-purple-600 to-indigo-800',
    badge: 'Experienced Educators',
    subFeatures: [
      { title: 'Certified & Vetted Tutors', desc: 'Degree-holding educators with proven teaching track records.', icon: 'Award' },
      { title: '1-on-1 Personalized Teaching', desc: 'Customized learning pace suited to student\'s strengths & weaknesses.', icon: 'UserCheck' },
      { title: 'Weekly Test & WhatsApp Reports', desc: 'Regular performance assessment reports shared with parents.', icon: 'FileText' },
      { title: 'Flexible Timings & Hybrid Support', desc: 'Home visits combined with online doubt-clearing sessions.', icon: 'Clock' }
    ],
    items: [
      {
        id: 'home-tutor',
        name: 'Home Tutors (1st to 10th Class & Intermediate)',
        price: 2500,
        mrp: 4000,
        includes: ['Maths, Science, English, Regional Languages', '1-on-1 Personalized Home Teaching', 'Weekly Tests & Progress Reports'],
        tag: 'Personalized',
        category: 'Education',
        subServices: [
          { id: 'primary-tutor', name: 'Primary Home Tutor (Class 1 to 5 - All Subjects)', price: 1800, mrp: 3000, desc: 'Daily 1-hour home visits, homework & foundational reading' },
          { id: 'secondary-maths-science', name: 'High School Tutor (Class 6 to 10 - Maths & Science)', price: 2500, mrp: 4000, desc: 'Board exam preparation, concept clarity & weekly tests' },
          { id: 'intermediate-mpc', name: 'Intermediate MPC / BiPC Entrance Specialist', price: 3500, mrp: 5500, desc: 'IIT-JEE / NEET foundation & EAMCET coaching' }
        ],
        subFeatures: [
          { title: 'Subject Specialist Home Faculty', desc: 'Dedicated tutor for Maths, Physics, Chemistry, English & Regional languages.', icon: 'Award' },
          { title: 'Exam Prep & Homework Assistance', desc: 'Focus on board exam preparation, concept clarity & daily homework.', icon: 'FileText' }
        ]
      },
      {
        id: 'online-tutor',
        name: 'Online Tutors & Exam Prep',
        price: 1500,
        mrp: 2500,
        includes: ['Live Interactive Classes', 'Doubt Solving Sessions', 'Digital Study Material'],
        tag: 'Flexible Time',
        category: 'Education',
        subServices: [
          { id: 'online-1on1-coaching', name: 'Online 1-on-1 Personalized Live Tuition', price: 1500, mrp: 2500, desc: 'Interactive digital whiteboard + recorded video lessons' }
        ],
        subFeatures: [
          { title: 'Live HD Video Classroom', desc: 'Interactive digital whiteboard, recorded lectures & instant doubt clearing.', icon: 'Sparkles' }
        ]
      },
      {
        id: 'educational-assistance',
        name: 'Educational Assistance & Career Guidance',
        price: 499,
        mrp: 1000,
        includes: ['Scholarship Application Help', 'College Entrance Counseling', 'Homework Assistance'],
        tag: 'Student Support',
        category: 'Education',
        subServices: [
          { id: 'epass-scholarship-form', name: 'Epass & Govt Scholarship Application Assistance', price: 299, mrp: 500, desc: 'Helps students complete document upload & Epass verification' },
          { id: 'college-counseling', name: 'Higher Education & Career Counseling Session', price: 499, mrp: 1000, desc: '1-on-1 counseling for college admissions & stream selection' }
        ],
        subFeatures: [
          { title: 'Government Scholarship Form Guidance', desc: 'Helps students apply for Epass, National & Merit scholarships.', icon: 'CheckCircle2' }
        ]
      }
    ]
  },
  {
    id: 'catering',
    titleKey: 'catCatering',
    subtitleKey: 'subCatering',
    icon: 'UtensilsCrossed',
    color: 'from-rose-600 to-red-800',
    badge: 'Bulk Plates & Event Setup',
    subFeatures: [
      { title: 'FSSAI Hygiene Certified', desc: 'Food prepared under strict food safety & sanitized kitchen standards.', icon: 'CheckCircle2' },
      { title: 'Live Food Counters & Buffet', desc: 'Complete elegant buffet setup, live tandoor/dosa stalls & desserts.', icon: 'Sparkles' },
      { title: 'Uniformed Hospitality Staff', desc: 'Professional waiters and service staff for table hosting.', icon: 'Users' },
      { title: 'Custom Plate Scaling (50-5000+)', desc: 'Flexible menu customization for house parties or grand weddings.', icon: 'Award' }
    ],
    items: [
      {
        id: 'wedding-catering',
        name: 'Wedding Party Catering (Per Plate)',
        price: 450,
        mrp: 650,
        includes: ['Traditional Veg & Non-Veg Multi-Course Menu', 'Live Food Stalls & Sweet Counter', 'Complete Buffet Setup & Service Staff'],
        tag: 'Grand Feast',
        category: 'Events',
        subServices: [
          { id: 'traditional-veg-buffet', name: 'Traditional South/North Indian Veg Buffet (Per Plate)', price: 349, mrp: 500, desc: '2 Rice items, 3 Curries, Sambar, Rasam, Sweets & Ice Cream' },
          { id: 'royal-non-veg-buffet', name: 'Royal Dum Biryani & Non-Veg Feast (Per Plate)', price: 450, mrp: 650, desc: 'Hyderabadi Chicken Biryani, Mutton Curry, Starters & Desserts' }
        ],
        subFeatures: [
          { title: 'Grand Multi-Course Royal Feast', desc: 'Biryani, starters, authentic curries, rotis, live chaat & sweet stalls.', icon: 'Sparkles' },
          { title: 'Complete Crockery & Buffet Setup', desc: 'Includes premium melamine/chafing dishes, tables, & uniformed servers.', icon: 'Users' }
        ]
      },
      {
        id: 'birthday-catering',
        name: 'Birthday Party Catering & Decorations',
        price: 350,
        mrp: 500,
        includes: ['Kid-Friendly Snacks & Meals', 'Custom Birthday Cake Setup', 'Sound System & Balloon Decor'],
        tag: 'Fun Party',
        category: 'Events',
        subServices: [
          { id: 'kid-party-snack-pack', name: 'Kid Party Snack & Meal Combo (Per Plate)', price: 249, mrp: 380, desc: 'Mini burgers, pasta, french fries, juice box & cake' },
          { id: 'full-birthday-setup', name: 'Catering + Balloon Decor & Sound System Package', price: 6999, mrp: 12000, desc: '50 Plates food + Arch balloon decoration & DJ speaker' }
        ],
        subFeatures: [
          { title: 'Snack Box & Theme Cake Setup', desc: 'Nuggets, mini burgers, pasta, fresh juices & birthday cake.', icon: 'Sparkles' }
        ]
      },
      {
        id: 'corporate-catering',
        name: 'Corporate & House Event Catering',
        price: 299,
        mrp: 450,
        includes: ['Hygiene Certified Cooking', 'Custom Plate Quantities (50 to 5000 plates)', 'Instant On-Site Service'],
        tag: 'Professional',
        category: 'Events',
        subServices: [
          { id: 'bento-box-lunch', name: 'Executive Packed Lunch Box (Per Plate)', price: 199, mrp: 300, desc: 'Hygienic 5-compartment sealed lunch box for office events' },
          { id: 'house-pooja-catering', name: 'Satyanarayana Swamy Pooja Satvik Catering (Per Plate)', price: 299, mrp: 450, desc: '100% pure sattvic food cooked without onion or garlic' }
        ],
        subFeatures: [
          { title: 'Hot Packed Meal Boxes or Buffet', desc: 'Hygienic bento meal boxes or executive buffet layout for offices.', icon: 'CheckCircle2' }
        ]
      }
    ]
  }
];

export const couponsData = [
  { code: 'FIRSTDOOR', discount: 150, minOrder: 300, desc: 'Flat ₹150 OFF on your first Doorlyn booking' },
  { code: 'HEALTH50', discount: 200, minOrder: 500, desc: 'Save ₹200 on Healthcare & Diagnostic Tests' },
  { code: 'RURAL20', discount: 100, minOrder: 250, desc: 'Special Rural & Senior Citizen discount ₹100' }
];
