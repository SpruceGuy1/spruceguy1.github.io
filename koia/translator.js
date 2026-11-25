export var translator = {
  init: (translations) => {
    const result = {};

    for (const [item, languages] of Object.entries(translations)) {
      for (const [lang, text] of Object.entries(languages)) {
        if (!result[lang]) result[lang] = {};
        result[lang][item] = text;
      }
    }

    return result;
  },
};
