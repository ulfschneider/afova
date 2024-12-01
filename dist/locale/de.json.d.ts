declare const _default: {
  "badInput": {
    "message": "Die Eingabe kann nicht verarbeitet werden"
  },
  "customError": { "message": "" },
  "patternMismatch": {
    "message": "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
    "constraint": "pattern"
  },
  "rangeOverflow": {
    "message": "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
    "constraint": "max"
  },
  "rangeUnderflow": {
    "message": "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
    "constraint": "min"
  },
  "stepMismatch": {
    "message": "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
    "constraint": "step"
  },
  "tooLong": {
    "message": "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
    "constraint": "maxlength"
  },
  "tooShort": {
    "message": "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
    "constraint": "minlength"
  },
  "typeMismatch": {
    "message": "Der Eingabewert muss vom Typ {{constraint}} sein",
    "constraint": "type",
    "email": "Der Eingabewert muss eine E-Mail Adresse sein",
    "tel": "Der Eingabewert muss eine Telefonnummer sein",
    "url": "Der Eingabewert muss eine URL im Format http://url.com sein"
  },
  "valueMissing": {
    "message": "Bitte machen Sie eine Eingabe",
    "constraint": "required"
  }
}
;

export default _default;
