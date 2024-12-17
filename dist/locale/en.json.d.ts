declare const _default: {
  "badInput": {
    "message": "The input {{input}} cannot be processed"
  },
  "patternMismatch": {
    "message": "The value {{input}} does not match the required pattern of {{constraint}}",
    "constraint": "pattern"
  },
  "rangeOverflow": {
    "message": "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
    "constraint": "max"
  },
  "rangeUnderflow": {
    "message": "The value {{input}} is too small. It must be at least {{constraint}}.",
    "constraint": "min"
  },
  "stepMismatch": {
    "message": "The value {{input}} is not in within the correct step interval of {{constraint}}",
    "constraint": "step"
  },
  "tooLong": {
    "message": "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
    "constraint": "maxlength"
  },
  "tooShort": {
    "message": "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
    "constraint": "minlength"
  },
  "typeMismatch": {
    "message": "The value {{input}} must be of type {{constraint}}",
    "constraint": "type",
    "email": "The value {{input}} is not a valid email address. Please provide an email address.",
    "url": "The value {{inptu}} is not a valid URL. Please provide a URL in the format http://url.com.",
    "tel": "The value {{input}} is not a valid phone number. Please provide a phone number."
  },
  "valueMissing": {
    "message": "Please provide a value",
    "constraint": "required"
  }
}
;

export default _default;
