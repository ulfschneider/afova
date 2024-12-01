declare const _default: {
  "badInput": {
    "message": "The input cannot be processed"
  },
  "patternMismatch": {
    "message": "The value does not match the required pattern of {{constraint}}",
    "constraint": "pattern"
  },
  "rangeOverflow": {
    "message": "The value is too big. It cannot be bigger than {{constraint}}.",
    "constraint": "max"
  },
  "rangeUnderflow": {
    "message": "The value is too small. It must be at least {{constraint}}.",
    "constraint": "min"
  },
  "stepMismatch": {
    "message": "The value is not in within the correct step interval of {{constraint}}",
    "constraint": "step"
  },
  "tooLong": {
    "message": "The value is too long. It cannot be longer than {{constraint}} characters.",
    "constraint": "maxlength"
  },
  "tooShort": {
    "message": "The value is too short. It must be at least {{constraint}} characters long.",
    "constraint": "minlength"
  },
  "typeMismatch": {
    "message": "The value must be of type {{constraint}}",
    "constraint": "type",
    "email": "The value must be an email address",
    "url": "The value must be a URL in the format http://url.com",
    "tel": "The value must be a phone number"
  },
  "valueMissing": {
    "message": "Please provide a value",
    "constraint": "required"
  }
}
;

export default _default;
