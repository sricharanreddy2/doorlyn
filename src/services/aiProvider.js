import { processAIIntent, AnuvadiniVoiceEngine, speakDoorlynResponse, stopDoorlynSpeech } from '../utils/anuvadiniAI.js';
import { generateDoorlynAIResponse } from './aiKnowledgeService.js';
import { DoorlynTools } from './doorlynTools.js';

export class BaseAIProvider {
  async understand(_userText, _language, _history) {
    throw new Error('understand() must be implemented by provider');
  }

  async generateResponse(_userText, _language, _history, _state) {
    throw new Error('generateResponse() must be implemented by provider');
  }

  async transcribe(_languageCode, _onResult, _onError, _onEnd) {
    throw new Error('transcribe() must be implemented by provider');
  }

  async synthesizeSpeech(_text, _languageCode, _onStart, _onEnd, _onError) {
    throw new Error('synthesizeSpeech() must be implemented by provider');
  }
}

export class DoorlynAIProvider extends BaseAIProvider {
  constructor() {
    super();
    this.voiceEngine = new AnuvadiniVoiceEngine();
  }

  /**
   * Understand user intent and extract entities from text
   */
  async understand(userText, language = 'EN', history = []) {
    const text = (userText || '').trim();
    const lower = text.toLowerCase();

    // 1. Language Detection & Explicit Switching
    let detectedLang = language;
    if (lower.includes('తెలుగులో మాట్లాడండి') || lower.includes('తెలుగు') || lower.includes('telugu')) {
      detectedLang = 'TE';
    } else if (lower.includes('हिंदी में बात करो') || lower.includes('हिंदी में') || lower.includes('हिंदी') || lower.includes('hindi')) {
      detectedLang = 'HI';
    } else if (lower.includes('speak in english') || lower.includes('english') || lower.includes('inglish')) {
      detectedLang = 'EN';
    }

    // 2. Entity Extraction
    const entities = {
      service: null,
      category: null,
      problem: null,
      location: null,
      date: null,
      time: null,
      provider: null,
      bookingId: null,
      address: null,
      price: null
    };

    // Extract Service
    if (lower.includes('plumber') || lower.includes('tap') || lower.includes('leak') || lower.includes('pipe') || lower.includes('నల్లా') || lower.includes('ప్లంబర్') || lower.includes('नल') || lower.includes('प्लंबर')) {
      entities.service = 'plumber-services';
      entities.category = 'Home Repairs';
      entities.price = 199;
    } else if (lower.includes('electrician') || lower.includes('fan') || lower.includes('wiring') || lower.includes('short circuit') || lower.includes('ఎలక్ట్రీషియన్') || lower.includes('ఫ్యాన్') || lower.includes('इलेक्ट्रीशियन') || lower.includes('पंखा')) {
      entities.service = 'electrician-services';
      entities.category = 'Home Repairs';
      entities.price = 249;
    } else if (lower.includes('cbc') || lower.includes('blood') || lower.includes('sugar') || lower.includes('thyroid') || lower.includes('full body') || lower.includes('రక్త') || lower.includes('హెల్త్') || lower.includes('खून') || lower.includes('सीबीसी')) {
      entities.service = lower.includes('sugar') ? 'blood-sugar' : lower.includes('full body') ? 'full-body' : 'cbc-test';
      entities.category = 'Healthcare & Diagnostic';
      entities.price = lower.includes('full body') ? 999 : 349;
    } else if (lower.includes('tutor') || lower.includes('tuition') || lower.includes('teacher') || lower.includes('ట్యూటర్') || lower.includes('ట్యూషన్') || lower.includes('ट्यूटर') || lower.includes('ट्यूशन')) {
      entities.service = 'home-tutor';
      entities.category = 'Student Tutors & Services';
      entities.price = 299;
    } else if (lower.includes('parcel') || lower.includes('pickup') || lower.includes('drop') || lower.includes('courier') || lower.includes('పార్శిల్') || lower.includes('పికప్') || lower.includes('पार्सल')) {
      entities.service = 'small-parcel';
      entities.category = 'Pickup & Drop';
      entities.price = 69;
    } else if (lower.includes('shift') || lower.includes('truck') || lower.includes('relocation') || lower.includes('షిఫ్టింగ్') || lower.includes('శిఫ్టింగ్') || lower.includes('शिफ्टिंग')) {
      entities.service = 'house-shifting';
      entities.category = 'Logistics & Shifting';
      entities.price = 2499;
    } else if (lower.includes('cater') || lower.includes('buffet') || lower.includes('biryani') || lower.includes('కేటరింగ్') || lower.includes('केटरिंग')) {
      entities.service = 'wedding-catering';
      entities.category = 'Food & Catering Services';
      entities.price = 299;
    } else if (lower.includes('worker') || lower.includes('labor') || lower.includes('mason') || lower.includes('mestri') || lower.includes('కూలీ') || lower.includes('మేస్త్రీ') || lower.includes('मजदूर')) {
      entities.service = 'daily-wage-worker';
      entities.category = 'Worker Marketplace';
      entities.price = 600;
    }

    // Extract Date
    if (lower.includes('tomorrow') || lower.includes('రేపు') || lower.includes('कल')) {
      entities.date = 'tomorrow';
    } else if (lower.includes('today') || lower.includes('ఈరోజు') || lower.includes('आज')) {
      entities.date = 'today';
    }

    // Extract Time
    const timeMatch = lower.match(/(\d{1,2})\s*(am|pm|మాస|గంట|बजे)/i);
    if (timeMatch) {
      entities.time = timeMatch[0];
    } else if (lower.includes('morning') || lower.includes('ઉદયમ') || lower.includes('ఉదయం') || lower.includes('सुबह')) {
      entities.time = '10:00 AM';
    } else if (lower.includes('evening') || lower.includes('సాయంత్రం') || lower.includes('शाम')) {
      entities.time = '05:00 PM';
    }

    // Extract Booking ID
    const bookingMatch = text.match(/DLN-\d{5}/i);
    if (bookingMatch) {
      entities.bookingId = bookingMatch[0].toUpperCase();
    }

    return {
      text,
      language: detectedLang,
      entities
    };
  }

  /**
   * Generate grounded AI response by integrating Intent Classifier, Knowledge Base, and Doorlyn Tools
   */
  async generateResponse(userText, language = 'EN', history = [], conversationState = {}) {
    const analysis = await this.understand(userText, language, history);
    const effectiveLang = analysis.language || language;

    // 1. Search public.ai_knowledge in Supabase
    const knowledgeResult = await generateDoorlynAIResponse(userText, effectiveLang, history);

    // 2. Controlled Tool Execution based on intent/entities
    let toolResult = null;
    let action = null;

    if (analysis.entities.bookingId) {
      toolResult = await DoorlynTools.getBookingDetails({ bookingId: analysis.entities.bookingId });
    } else if (analysis.entities.service && userText.toLowerCase().includes('provider')) {
      toolResult = await DoorlynTools.searchProviders({ serviceId: analysis.entities.service });
    }

    // 3. Fallback intent processing if knowledge search was generic
    const fallbackIntent = processAIIntent(userText, effectiveLang, history);

    let replyText = knowledgeResult.knowledge ? knowledgeResult.reply : fallbackIntent.reply;
    let options = knowledgeResult.options || fallbackIntent.options || ['Book Now', 'Main Menu'];

    if (knowledgeResult.suggestedAction) {
      action = knowledgeResult.suggestedAction;
    } else if (fallbackIntent.action) {
      action = fallbackIntent.action;
    }

    return {
      success: true,
      reply: replyText,
      language: effectiveLang,
      entities: analysis.entities,
      knowledgeMatch: knowledgeResult.knowledge || null,
      toolResult,
      options,
      action
    };
  }

  /**
   * Transcribe user speech to text via SpeechRecognition
   */
  transcribe(languageCode = 'EN', onResult, onError, onEnd) {
    this.voiceEngine.startListening(languageCode, onResult, onError, onEnd);
  }

  /**
   * Synthesize text response into spoken voice audio
   */
  synthesizeSpeech(text, languageCode = 'EN', onStart, onEnd, onError) {
    speakDoorlynResponse(text, languageCode, onStart, onEnd, onError);
  }

  stopListening() {
    this.voiceEngine.stopListening();
  }

  stopSpeaking() {
    stopDoorlynSpeech();
    this.voiceEngine.stopSpeaking();
  }
}

export const doorlynAIProvider = new DoorlynAIProvider();
