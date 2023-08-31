const resources = {
  en: {
    translation: {
      chooseMode: 'Choose Mode',
      distanceCalculator: 'Distance Calculator',
      fillUpCalculator: 'Fill-Up Calculator',
    },
  },
  no: {
    translation: {
      chooseMode: 'Velg modus',
      distanceCalculator: 'Avstandskalkulator',
      fillUpCalculator: 'Fyll-Opp kalkulator',
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
