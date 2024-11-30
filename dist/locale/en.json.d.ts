declare const _default: {
  "badInput": {
    "message": "The input cannot be processed"
  },
  "customError": { "message": "" },
  "patternMismatch": {
    "message": "The value does not match the required pattern of {{constraint}}",
    "constraintAttr": "pattern"
  },
  "rangeOverflow": {
    "message": "The value is too big. It cannot be bigger than {{constraint}}.",
    "constraintAttr": "max"
  },
  "rangeUnderflow": {
    "message": "The value is too small. It must be at least {{constraint}}.",
    "constraintAttr": "min"
  },
  "stepMismatch": {
    "message": "The value is not in within the correct step interval of {{constraint}}",
    "constraintAttr": "step"
  },
  "tooLong": {
    "message": "The value is too long. It cannot be longer than {{constraint}} characters.",
    "constraintAttr": "maxlength"
  },
  "tooShort": {
    "message": "The value is too short. It must be at least {{constraint}} characters long.",
    "constraintAttr": "minlength"
  },
  "typeMismatch": {
    "message": "The value must be of type {{constraint}}",
    "constraintAttr": "type"
  },
  "typeMismatch[email]": {
    "message": "The value must be an email in the format mickey@mouse.com",
    "constraintAttr": "type"
  },
  "typeMismatch[url]": {
    "message": "The value must be a URL in the format http://url.com",
    "constraintAttr": "type"
  },
  "typeMismatch[tel]": {
    "message": "The value must be a phone number",
    "constraintAttr": "type"
  },
  "valid": { "message": "" },
  "valueMissing": {
    "message": "Please provide a value",
    "constraintAttr": "required"
  }
}
;

export default _default;