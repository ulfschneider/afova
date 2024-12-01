const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const badInput$1 = {
  message: "The input cannot be processed"
};
const customError$1 = {
  message: ""
};
const patternMismatch$1 = {
  message: "The value does not match the required pattern of {{constraint}}",
  constraint: "pattern"
};
const rangeOverflow$1 = {
  message: "The value is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
};
const rangeUnderflow$1 = {
  message: "The value is too small. It must be at least {{constraint}}.",
  constraint: "min"
};
const stepMismatch$1 = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
};
const tooLong$1 = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
};
const tooShort$1 = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
};
const typeMismatch$1 = {
  message: "The value must be of type {{constraint}}",
  constraint: "type",
  email: "The value must be an email address",
  url: "The value must be a URL in the format http://url.com",
  tel: "The value must be a phone number"
};
const valueMissing$1 = {
  message: "Please provide a value",
  constraint: "required"
};
const constraint_violation_messages_en = {
  badInput: badInput$1,
  customError: customError$1,
  patternMismatch: patternMismatch$1,
  rangeOverflow: rangeOverflow$1,
  rangeUnderflow: rangeUnderflow$1,
  stepMismatch: stepMismatch$1,
  tooLong: tooLong$1,
  tooShort: tooShort$1,
  typeMismatch: typeMismatch$1,
  valueMissing: valueMissing$1
};
const badInput = {
  message: "Die Eingabe kann nicht verarbeitet werden"
};
const customError = {
  message: ""
};
const patternMismatch = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
};
const rangeOverflow = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
};
const rangeUnderflow = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
};
const stepMismatch = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
};
const tooLong = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
};
const tooShort = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
};
const typeMismatch = {
  message: "Der Eingabewert muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert muss eine E-Mail Adresse sein",
  tel: "Der Eingabewert muss eine Telefonnummer sein",
  url: "Der Eingabewert muss eine URL im Format http://url.com sein"
};
const valueMissing = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
};
const constraint_violation_messages_de = {
  badInput,
  customError,
  patternMismatch,
  rangeOverflow,
  rangeUnderflow,
  stepMismatch,
  tooLong,
  tooShort,
  typeMismatch,
  valueMissing
};
const CONSTRAINT_VIOLATIONS = [
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing"
];
const DEFAULT_SETTINGS = {
  selector: "form",
  validateOnChange: false,
  focusOnFirstError: true
};
const I18N_CONSTRAINTS = {
  en: constraint_violation_messages_en,
  de: constraint_violation_messages_de
};
const IGNORE_CONTROL_TYPES = ["submit", "reset", "button"];
function getConstraints() {
  let locale = navigator.language;
  let constraints = I18N_CONSTRAINTS[locale];
  if (constraints) {
    console.log(`afova is using locale=[${locale}]`);
    return constraints;
  }
  const idx = locale.indexOf("-");
  if (idx) {
    locale = locale.substring(0, idx);
    if (locale) {
      constraints = I18N_CONSTRAINTS[locale];
    }
  }
  if (constraints) {
    console.log(`afova is using language=[${locale}]`);
    return constraints;
  } else {
    console.log(`afova is using language=[en]`);
    return I18N_CONSTRAINTS.en;
  }
}
function afova(options) {
  let constraintViolationMessages = getConstraints();
  function _ensureId(element) {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }
  function _findMessageContainer(control) {
    const messageContainer = document.querySelector(
      `#${control.id}-afova-message-container`
    );
    return messageContainer;
  }
  function _ensureAndGetMessageContainer(control) {
    var _a;
    let messageContainer = _findMessageContainer(control);
    if (!messageContainer) {
      messageContainer = document.createElement("ul");
      (_a = control.parentNode) == null ? void 0 : _a.insertBefore(messageContainer, control);
      messageContainer.id = `${control.id}-afova-message-container`;
      messageContainer.classList.add("afova-message-container");
      control.setAttribute("aria-errormessage", messageContainer.id);
    }
    return messageContainer;
  }
  function _deriveMessageText(violation, control) {
    if (violation != "customError") {
      let defaultMessage = constraintViolationMessages[violation];
      if (defaultMessage) {
        let constraint = defaultMessage.constraint;
        let message = (
          //a message defined for the control has highest prio
          control.dataset[constraint || violation] || //a default message specific for the input type has second hightest prio
          constraintViolationMessages[violation][control.type] || //a default message has last prio
          defaultMessage.message
        );
        const constraintValue = control.getAttribute(constraint || "");
        if (constraintValue) {
          const regex = new RegExp(`{{\\s*constraint\\s*}}`, "ig");
          message = message.replace(regex, constraintValue);
        }
        return message;
      }
    }
    return control.validationMessage;
  }
  function _putMessage(control) {
    const messageContainer = _ensureAndGetMessageContainer(control);
    const validity = control.validity;
    const messageElement = document.createElement("li");
    messageElement.classList.add("afova-message");
    messageElement.classList.add("afova-derived");
    messageContainer.appendChild(messageElement);
    for (const violation of CONSTRAINT_VIOLATIONS) {
      if (validity[violation]) {
        let message = _deriveMessageText(
          violation,
          control
        );
        if (message) {
          messageElement.innerHTML = message;
        }
        break;
      }
    }
    if (!messageElement.innerHTML) {
      messageElement.innerHTML = control.dataset.errorInvalid || constraintViolationMessages.badInput.message;
    }
  }
  function _clearControlMessages(control) {
    control.classList.remove("afova-active");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");
    const messageContainer = _findMessageContainer(control);
    if (messageContainer) {
      messageContainer.remove();
    }
    let context = _getContext(control);
    if (context) {
      context.classList.remove("afova-active");
    }
  }
  function _setControlMessage(control, focus) {
    const context = _getContext(control);
    if (context) {
      context.classList.add("afova-active");
    }
    control.classList.add("afova-active");
    control.setAttribute("aria-invalid", "true");
    _putMessage(control);
    if (focus) {
      control.focus();
    }
  }
  function _validateControl(control, focus) {
    _clearControlMessages(control);
    if (!control.validity.valid) {
      _setControlMessage(control, focus);
    }
    return control.validity.valid;
  }
  function _getFormElements(form) {
    const result = [];
    for (const control of form.elements) {
      if (!IGNORE_CONTROL_TYPES.includes(control.type)) {
        result.push(control);
      }
    }
    return result;
  }
  function _validateForm(form, event) {
    let firstError;
    for (const control of _getFormElements(form)) {
      const valid = _validateControl(control);
      if (!firstError && !valid) {
        firstError = control;
      }
    }
    if (firstError) {
      event == null ? void 0 : event.preventDefault();
      if (settings.focusOnFirstError) {
        firstError.focus();
      }
    }
  }
  function _resetForm(form) {
    for (let control of _getFormElements(form)) {
      _clearControlMessages(control);
    }
  }
  function _prepareForms() {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      form.setAttribute("novalidate", "");
      _ensureId(form);
      form.addEventListener("submit", _formSubmitListener);
      form.addEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form)) {
        _prepareControl(control);
      }
    }
  }
  function _formSubmitListener(event) {
    _validateForm(event.target, event);
  }
  function _formResetListener(event) {
    _resetForm(event.target);
  }
  function _unprepareForms() {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      form.removeAttribute("novalidate");
      form.removeEventListener("submit", _formSubmitListener);
      form.removeEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form)) {
        _unprepareControl(control);
      }
    }
  }
  function _prepareControl(control) {
    _ensureId(control);
    control.classList.add("afova-control");
    if (settings.validateOnChange) {
      control.addEventListener("change", _controlChangeListener);
    }
  }
  function _controlChangeListener(event) {
    _validateControl(event.target, true);
  }
  function _unprepareControl(control) {
    control.classList.remove("afova-control");
    control.removeEventListener("change", _controlChangeListener);
  }
  function _getContext(control) {
    let context = control.closest(".afova-context");
    if (!context) {
      context = control.closest("label");
      if (context) {
        context.classList.add("afova-context");
        if (!context.htmlFor) {
          context.htmlFor = control.id;
        }
      }
    }
    return context;
  }
  function _validate() {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      _validateForm(form);
    }
  }
  function _isInvalid() {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      if (!form.checkValidity()) {
        return true;
      }
    }
    return false;
  }
  let settings = Object.assign({}, DEFAULT_SETTINGS, options);
  _prepareForms();
  return {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => _unprepareForms(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => _validate(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => _isInvalid()
  };
}
export {
  afova
};
//# sourceMappingURL=afova.js.map
