import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      // Nav
      home: "Home",
      about: "About",
      features: "Features",
      pricing: "Pricing",
      contact: "Contact",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
      // Hero
      hero_title: "Discover Your Destiny Through",
      hero_title_highlight: "AI Palm Reading",
      hero_subtitle: "Advanced AI-powered palmistry combining ancient wisdom with modern technology",
      hero_cta: "Start Free Palm Reading",
      hero_cta_secondary: "Watch How It Works",
      // Features
      features_title: "What Bhawishya Dwar Reveals",
      life_reading: "Life Reading",
      love_reading: "Love & Relationships",
      career_reading: "Career & Finance",
      personality: "Personality Analysis",
      astrology: "Astrology",
      // Dashboard
      new_scan: "New Palm Scan",
      scan_history: "Scan History",
      my_reports: "My Reports",
      ai_chat: "AI Astrologer Chat",
      profile: "Profile Settings",
      subscription: "Subscription",
      // Scan
      scan_title: "Palm Scanner",
      position_hand: "Position your palm inside the frame",
      detecting: "Detecting hand...",
      capture: "Capture",
      analyzing: "Analyzing your palm...",
      // Common
      loading: "Loading...",
      error: "Something went wrong",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      view: "View",
      download: "Download",
      back: "Back",
      next: "Next",
      submit: "Submit",
      // Auth
      email: "Email",
      password: "Password",
      name: "Full Name",
      forgot_password: "Forgot Password?",
      no_account: "Don't have an account?",
      have_account: "Already have an account?",
      // Disclaimer
      disclaimer: "Bhawishya Dwar by SAVITRAM Foundation provides traditional palmistry interpretations for entertainment and self-reflection purposes only. Not a substitute for professional advice.",
    },
  },
  hi: {
    translation: {
      // Nav
      home: "होम",
      about: "हमारे बारे में",
      features: "विशेषताएं",
      pricing: "मूल्य निर्धारण",
      contact: "संपर्क",
      login: "लॉगिन",
      register: "रजिस्टर",
      dashboard: "डैशबोर्ड",
      logout: "लॉगआउट",
      // Hero
      hero_title: "अपनी नियति जानें",
      hero_title_highlight: "AI हस्तरेखा विश्लेषण से",
      hero_subtitle: "प्राचीन ज्ञान और आधुनिक तकनीक का संगम — AI द्वारा संचालित हस्तरेखा शास्त्र",
      hero_cta: "मुफ्त हस्तरेखा पढ़ाई शुरू करें",
      hero_cta_secondary: "देखें कैसे काम करता है",
      // Features
      features_title: "Bhawishya Dwar क्या बताता है",
      life_reading: "जीवन रेखा",
      love_reading: "प्रेम और रिश्ते",
      career_reading: "करियर और वित्त",
      personality: "व्यक्तित्व विश्लेषण",
      astrology: "ज्योतिष",
      // Dashboard
      new_scan: "नया हस्त स्कैन",
      scan_history: "स्कैन इतिहास",
      my_reports: "मेरी रिपोर्ट",
      ai_chat: "AI ज्योतिषी चैट",
      profile: "प्रोफाइल सेटिंग",
      subscription: "सदस्यता",
      // Scan
      scan_title: "हस्त स्कैनर",
      position_hand: "अपनी हथेली फ्रेम के अंदर रखें",
      detecting: "हाथ पहचाना जा रहा है...",
      capture: "कैप्चर करें",
      analyzing: "आपकी हथेली का विश्लेषण हो रहा है...",
      // Common
      loading: "लोड हो रहा है...",
      error: "कुछ गलत हो गया",
      save: "सहेजें",
      cancel: "रद्द करें",
      delete: "हटाएं",
      view: "देखें",
      download: "डाउनलोड",
      back: "वापस",
      next: "आगे",
      submit: "जमा करें",
      // Auth
      email: "ईमेल",
      password: "पासवर्ड",
      name: "पूरा नाम",
      forgot_password: "पासवर्ड भूल गए?",
      no_account: "खाता नहीं है?",
      have_account: "पहले से खाता है?",
      // Disclaimer
      disclaimer: "Bhawishya Dwar (SAVITRAM Foundation) केवल मनोरंजन और आत्म-चिंतन के लिए पारंपरिक हस्तरेखा व्याख्या प्रदान करता है। यह पेशेवर सलाह का विकल्प नहीं है।",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("savitram_lang") || "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
