// Smart search utility for Doorlyn services & categories
import { servicesData } from '../data/servicesData';

// Synonyms and related terms map for high search recall
const searchSynonyms = {
  'repair': ['repairs', 'fix', 'fixing', 'maintenance', 'electrician', 'plumber', 'carpenter', 'appliance', 'wiring', 'tap', 'leakage', 'ac', 'painting'],
  'repairs': ['repair', 'fix', 'fixing', 'maintenance', 'electrician', 'plumber', 'carpenter', 'appliance'],
  'home': ['house', 'flat', 'apartment', 'doorstep', 'residential', 'room'],
  'home repair': ['repairs', 'electrician', 'plumber', 'carpenter', 'appliance', 'ac repair', 'fan repair', 'leakage', 'painting'],
  'home repairs': ['repairs', 'electrician', 'plumber', 'carpenter', 'appliance', 'ac repair', 'fan repair', 'leakage', 'painting'],
  'house repair': ['repairs', 'electrician', 'plumber', 'carpenter', 'appliance', 'painting'],
  'doctor': ['health', 'healthcare', 'blood test', 'cbc', 'sugar', 'checkup', 'lab', 'diagnostics', 'teleconsult'],
  'health': ['healthcare', 'blood', 'cbc', 'sugar', 'thyroid', 'doctor', 'lab', 'checkup', 'pcod', 'antenatal'],
  'blood': ['cbc', 'sugar', 'thyroid', 'blood test', 'lab', 'sample', 'phlebotomist'],
  'test': ['blood test', 'cbc', 'sugar', 'thyroid', 'checkup', 'lab', 'screening'],
  'electric': ['electrician', 'wiring', 'fan', 'switchboard', 'inverter', 'fuse', 'mcb', 'light'],
  'electricity': ['electrician', 'wiring', 'fan', 'switchboard', 'inverter', 'fuse', 'mcb', 'light'],
  'plumb': ['plumber', 'plumbing', 'pipe', 'tap', 'leak', 'drainage', 'sink', 'tank', 'washbasin'],
  'plumbing': ['plumber', 'pipe', 'tap', 'leak', 'drainage', 'sink', 'tank'],
  'carpentry': ['carpenter', 'door', 'lock', 'furniture', 'cabinet', 'wood', 'bed'],
  'carpent': ['carpenter', 'door', 'lock', 'furniture', 'cabinet', 'wood'],
  'ac': ['air conditioner', 'ac service', 'gas refill', 'cooling', 'coil wash'],
  'shift': ['shifting', 'packers', 'movers', 'relocation', 'truck', 'tata ace', 'tempo', 'house shifting'],
  'shifting': ['packers', 'movers', 'relocation', 'truck', 'tata ace', 'tempo', 'house shifting'],
  'move': ['shifting', 'packers', 'movers', 'relocation', 'truck'],
  'courier': ['parcel', 'pickup', 'drop', 'delivery', 'express', 'package'],
  'delivery': ['parcel', 'pickup', 'drop', 'courier', 'grocery', 'express'],
  'grocery': ['groceries', 'vegetables', 'milk', 'rice', 'dal', 'oil', 'food', 'fruits', 'essentials'],
  'food': ['groceries', 'catering', 'cook', 'chef', 'meal', 'biryani', 'plates'],
  'cook': ['catering', 'chef', 'party food', 'event catering', 'kitchen', 'wedding'],
  'cooking': ['catering', 'cook', 'chef', 'food'],
  'tutor': ['tuition', 'teacher', 'maths', 'science', 'exam', 'online tutor', 'home tutor', 'class 10', 'student', 'coaching'],
  'tuition': ['tutor', 'teacher', 'maths', 'science', 'exam', 'student'],
  'clean': ['cleaning', 'deep cleaning', 'maid', 'house cleaning', 'washroom', 'sofa'],
  'cleaning': ['clean', 'deep cleaning', 'maid', 'house cleaning', 'washroom'],
  'worker': ['labor', 'mestri', 'mason', 'construction', 'daily wage', 'helper'],
  'labor': ['worker', 'mestri', 'mason', 'construction', 'daily wage', 'helper'],
  'mason': ['mestri', 'worker', 'construction', 'brick', 'cement']
};

/**
 * Searches through all services and categories with tokenization & synonym expansion.
 * @param {string} rawQuery - The user's input search query
 * @param {function} t - Translation function for category titles/subtitles
 * @returns {{ matchedServices: Array, matchedCategories: Array }}
 */
export const searchDoorlynServices = (rawQuery, t = (k) => k) => {
  const query = (rawQuery || '').trim().toLowerCase();
  if (!query) {
    return {
      matchedServices: [],
      matchedCategories: servicesData
    };
  }

  // Split query into words
  const queryWords = query.split(/\s+/).filter(Boolean);

  // Expand query words with synonyms
  const expandedTerms = new Set([query]);
  queryWords.forEach(word => {
    expandedTerms.add(word);
    if (searchSynonyms[word]) {
      searchSynonyms[word].forEach(syn => expandedTerms.add(syn.toLowerCase()));
    }
  });

  // Check multi-word phrase synonyms (e.g. "home repair", "home repairs")
  if (searchSynonyms[query]) {
    searchSynonyms[query].forEach(syn => expandedTerms.add(syn.toLowerCase()));
  }

  const termsArray = Array.from(expandedTerms);

  const matchedServices = [];
  const matchedCategoryIds = new Set();

  servicesData.forEach(category => {
    const catTitle = (t(category.titleKey) || '').toLowerCase();
    const catSub = (t(category.subtitleKey) || '').toLowerCase();
    const catId = (category.id || '').toLowerCase();
    const catBadge = (category.badge || '').toLowerCase();

    // Category-level text pool
    const catSearchText = `${catTitle} ${catSub} ${catId} ${catBadge}`;

    let categoryMatched = false;

    // Check if category directly matches full query or words or synonyms
    if (
      catSearchText.includes(query) ||
      queryWords.every(w => catSearchText.includes(w)) ||
      termsArray.some(term => catSearchText.includes(term))
    ) {
      categoryMatched = true;
      matchedCategoryIds.add(category.id);
    }

    category.items.forEach(item => {
      const itemName = (item.name || '').toLowerCase();
      const itemTag = (item.tag || '').toLowerCase();
      const itemIncludes = (item.includes || []).map(inc => inc.toLowerCase()).join(' ');
      const subServicesText = (item.subServices || []).map(s => `${s.name} ${s.desc || ''}`).join(' ').toLowerCase();
      const subFeaturesText = (item.subFeatures || []).map(sf => `${sf.title} ${sf.desc || ''}`).join(' ').toLowerCase();

      // Combined searchable string for the service
      const combinedServiceText = `${itemName} ${itemTag} ${catTitle} ${catSub} ${catId} ${itemIncludes} ${subServicesText} ${subFeaturesText}`;

      let matchScore = 0;
      let matchReason = '';

      // 1. Exact full query match in service name
      if (itemName.includes(query)) {
        matchScore += 100;
        matchReason = 'Service Name';
      } 
      // 2. Exact full query match in category title
      else if (catTitle.includes(query)) {
        matchScore += 80;
        matchReason = 'Category Match';
      }
      // 3. Exact full query match in sub-services / inclusions
      else if (subServicesText.includes(query) || itemIncludes.includes(query)) {
        matchScore += 70;
        matchReason = 'Sub-Package / Included Item';
      }
      // 4. All words in query are present in combined text
      else if (queryWords.every(word => combinedServiceText.includes(word))) {
        matchScore += 60;
        matchReason = 'Keyword Match';
      }
      // 5. Query matches category and this service is in that category
      else if (categoryMatched) {
        matchScore += 50;
        matchReason = `${t(category.titleKey)} Service`;
      }
      // 6. Any synonym / expanded term matches service name or sub-services
      else if (termsArray.some(term => itemName.includes(term) || subServicesText.includes(term))) {
        matchScore += 40;
        matchReason = 'Related Service';
      }
      // 7. Any single query word matches
      else if (queryWords.some(w => w.length > 2 && (itemName.includes(w) || subServicesText.includes(w)))) {
        matchScore += 20;
        matchReason = 'Partial Match';
      }

      if (matchScore > 0) {
        matchedCategoryIds.add(category.id);
        matchedServices.push({
          ...item,
          category,
          categoryTitle: t(category.titleKey),
          matchScore,
          matchReason
        });
      }
    });
  });

  // Sort matched services by score (highest relevance first)
  matchedServices.sort((a, b) => b.matchScore - a.matchScore);

  // Filter matched categories
  const matchedCategories = servicesData.filter(cat => matchedCategoryIds.has(cat.id));

  return {
    matchedServices,
    matchedCategories: matchedCategories.length > 0 ? matchedCategories : servicesData
  };
};
