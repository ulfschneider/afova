declare const _default: {
  "badInput": {
    "message": "Die Eingabe {{input}} kann nicht verarbeitet werden"
  },
  "patternMismatch": {
    "message": "Der Eingabewert {{input}} entspricht nicht dem erforderlichen Format {{constraint}}",
    "constraint": "pattern"
  },
  "rangeOverflow": {
    "message": "Der Eingabewert {{input}} ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
    "constraint": "max"
  },
  "rangeUnderflow": {
    "message": "Der Eingabewert {{input}} ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
    "constraint": "min"
  },
  "stepMismatch": {
    "message": "Der Eingabewert {{input}} ist nicht in der richtigen Schrittfolge von {{constraint}}",
    "constraint": "step"
  },
  "tooLong": {
    "message": "Der Eingabewert {{input}} ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
    "constraint": "maxlength"
  },
  "tooShort": {
    "message": "Der Eingabewert {{input}} ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
    "constraint": "minlength"
  },
  "typeMismatch": {
    "message": "Der Eingabewert {{input}} muss vom Typ {{constraint}} sein",
    "constraint": "type",
    "email": "Der Eingabewert {{input}} ist keine E-Mail Adresse. Bitte geben Sie eine E-Mail Adresse ein.",
    "tel": "Der Eingabewert {{input}} ist keine Telefonnummer. Bitte geben Sie eine Telefonnummer ein.",
    "url": "Der Eingabewert {{input}} ist kein URL. Bitte geben Sie eine URL im Format http://url.com ein."
  },
  "valueMissing": {
    "message": "Bitte machen Sie eine Eingabe",
    "constraint": "required"
  }
}
;

export default _default;
