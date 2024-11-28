var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let nanoid = (size = 21) => {
  let id = "";
  let bytes = crypto.getRandomValues(new Uint8Array(size));
  while (size--) {
    id += urlAlphabet[bytes[size] & 63];
  }
  return id;
};
const DEFAULT_SETTINGS = {
  selector: "form",
  validateOnChange: false,
  focusOnFirstError: true
};
const IGNORE_CONTROL_TYPES = ["submit", "reset", "button"];
class Afova {
  constructor() {
    __publicField(this, "settings", DEFAULT_SETTINGS);
    //the keys of the constraints correspond to the property names of the validity object
    __publicField(this, "constraints", {
      badInput: {
        message: "The input cannot be processed",
        constraintAttr: void 0
      },
      customError: { message: "" },
      patternMismatch: {
        message: "The value does not match the required pattern of {{constraint}}",
        constraintAttr: "pattern"
      },
      rangeOverflow: {
        message: "The value is too big. It cannot be bigger than {{constraint}}.",
        constraintAttr: "max"
      },
      rangeUnderflow: {
        message: "The value is too small. It must be at least {{constraint}}.",
        constraintAttr: "min"
      },
      stepMismatch: {
        message: "The value is not in within the correct step interval of {{constraint}}",
        constraintAttr: "step"
      },
      tooLong: {
        message: "The value is too long. It cannot be longer than {{constraint}} characters.",
        constraintAttr: "maxlength"
      },
      tooShort: {
        message: "The value is too short. It must be at least {{constraint}} characters long.",
        constraintAttr: "minlength"
      },
      typeMismatch: {
        message: "The value must be of type {{constraint}}",
        constraintAttr: "type"
      },
      "typeMismatch[email]": {
        message: "The value must be an email in the format mickey@mouse.com",
        constraintAttr: "type"
      },
      "typeMismatch[url]": {
        message: "The value must be a URL in the format http://url.com",
        constraintAttr: "type"
      },
      "typeMismatch[tel]": {
        message: "The value must be a phone number",
        constraintAttr: "type"
      },
      valid: { message: "" },
      valueMissing: {
        message: "Please provide a value",
        constraintAttr: "required"
      }
    });
  }
  setOptions(options) {
    if (options) {
      this.settings = Object.assign(this.settings, options);
    }
  }
  /**
   * Ensure the given element has an id
   * @param element
   */
  ensureId(element) {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }
  findMessageContainer(control) {
    const messageContainer = document.querySelector(
      `#${control.id}-afova-message-container`
    );
    return messageContainer;
  }
  ensureAndGetMessageContainer(control) {
    var _a;
    let messageContainer = this.findMessageContainer(control);
    if (!messageContainer) {
      messageContainer = document.createElement("ul");
      (_a = control.parentNode) == null ? void 0 : _a.insertBefore(messageContainer, control);
      messageContainer.id = `${control.id}-afova-message-container`;
      messageContainer.classList.add("afova-message-container");
      control.setAttribute("aria-errormessage", messageContainer.id);
    }
    return messageContainer;
  }
  deriveMessageText(constraint, control) {
    if (constraint != "customError") {
      let derivedMessage = this.constraints[constraint];
      if (derivedMessage) {
        let message = derivedMessage.message;
        let constraintAttr = derivedMessage.constraintAttr;
        const constraintValue = control.getAttribute(constraintAttr || "");
        message = control.dataset[constraintAttr || constraint] || message;
        if (constraintValue) {
          derivedMessage = this.constraints[`${constraint}[${constraint.toLowerCase()}]`];
          if (derivedMessage) {
            message = control.dataset[constraint] || derivedMessage.message;
          }
          const regex = new RegExp(`{{\\s*constraint\\s*}}`, "ig");
          message = message.replace(regex, constraintValue);
        }
        return message;
      }
    }
    return control.validationMessage;
  }
  putMessage(control) {
    const messageContainer = this.ensureAndGetMessageContainer(control);
    const validity = control.validity;
    const messageElement = document.createElement("li");
    messageElement.classList.add("afova-message");
    messageElement.classList.add("afova-derived");
    messageContainer.appendChild(messageElement);
    for (const constraint of Object.keys(this.constraints)) {
      if (validity[constraint]) {
        let message = this.deriveMessageText(constraint, control);
        if (message) {
          messageElement.innerHTML = message;
        }
        break;
      }
    }
    if (!messageElement.innerHTML) {
      messageElement.innerHTML = control.dataset.errorInvalid || "The value is not correct";
    }
  }
  clearControlMessages(control) {
    control.classList.remove("afova-active");
    control.classList.remove("afova-control");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");
    const messageContainer = this.findMessageContainer(control);
    if (messageContainer) {
      messageContainer.remove();
    }
    let context = this.getContext(control);
    if (context) {
      context.classList.remove("afova-context");
      context.classList.remove("afova-active");
    }
  }
  setControlMessage(control, focus) {
    const context = this.getContext(control);
    if (context) {
      context.classList.add("afova-active");
    }
    control.classList.add("afova-active");
    control.setAttribute("aria-invalid", "true");
    this.putMessage(control);
    if (focus) {
      control.focus();
    }
  }
  validateControl(control, focus) {
    this.clearControlMessages(control);
    if (!control.validity.valid) {
      this.setControlMessage(control, focus);
    }
    return control.validity.valid;
  }
  getFormElements(form) {
    const result = [];
    for (const control of form.elements) {
      if (!IGNORE_CONTROL_TYPES.includes(control.type)) {
        result.push(control);
      }
    }
    return result;
  }
  validateForm(form, event) {
    let firstError;
    for (const control of this.getFormElements(form)) {
      const valid = this.validateControl(control);
      if (!firstError && !valid) {
        firstError = control;
      }
    }
    if (firstError) {
      event == null ? void 0 : event.preventDefault();
      if (this.settings.focusOnFirstError) {
        firstError.focus();
      }
    }
  }
  resetForm(form) {
    for (let control of this.getFormElements(form)) {
      this.clearControlMessages(control);
    }
  }
  /**
   * Will prepare all forms by ensuring the forms each have an id asssigned and
   * the attribute novalidate assigned to it. Will also prepare all controls contained in each form.
   */
  prepareForms() {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      form.setAttribute("novalidate", "");
      this.ensureId(form);
      form.addEventListener("submit", this.formSubmitListener.bind(this));
      form.addEventListener("reset", this.formResetListener.bind(this));
      for (const control of this.getFormElements(form)) {
        this.prepareControl(control);
      }
    }
  }
  formSubmitListener(event) {
    this.validateForm(event.target, event);
  }
  formResetListener(event) {
    this.resetForm(event.target);
  }
  unprepareForms() {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      form.removeAttribute("novalidate");
      form.removeEventListener("submit", this.formSubmitListener);
      form.removeEventListener("reset", this.formResetListener);
      for (const control of this.getFormElements(form)) {
        this.unprepareControl(control);
      }
    }
  }
  /**
   * Prepare the form control by ensuring an id and assigning the CSS class afova-control.
   * Will adjust textual descriptions within the control´s afova context and assign an event handler
   * in case the afova settings have set validateOnChange to true
   * @param control the control to prepare
   */
  prepareControl(control) {
    this.ensureId(control);
    control.classList.add("afova-control");
    if (this.settings.validateOnChange) {
      control.addEventListener("change", this.controlChangeListener.bind(this));
    }
  }
  controlChangeListener(event) {
    this.validateControl(event.target, true);
  }
  unprepareControl(control) {
    control.classList.remove("afova-control");
    control.removeEventListener("change", this.controlChangeListener);
  }
  /**
   * Find the wrapping afova context for a form control by searching the parents
   * The context must be a label or a container with CSS class afova-context assigned
   * @param control the form control to start from
   * @returns the wrapping context or null
   */
  getContext(control) {
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
  init(options) {
    this.setOptions(options);
    this.prepareForms();
  }
  clear() {
    this.unprepareForms();
  }
  validate() {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      this.validateForm(form);
    }
  }
  isInvalid() {
    let selector = "form";
    if (this.settings.selector) {
      selector = this.settings.selector;
    }
    const forms = document.querySelectorAll(selector);
    for (const form of forms) {
      if (!form.checkValidity()) {
        return true;
      }
    }
    return false;
  }
}
const afova = function() {
  const afova2 = new Afova();
  return {
    /**
     * Initialize afova for forms that are identified by the selector given in the options.
     * Will register event listeners on the form and the input controls of the form.
     * @param options setting sfor afova, optional
     */
    init: (options) => afova2.init(options),
    /**
     * Will remove the settings that have been made by afova when call init.
     */
    clear: () => afova2.clear(),
    /**
    * Trigger the validation. This is in most cases not required, as afova will trigger
     the validation automatically when submitting a form.
    */
    validate: () => afova2.validate(),
    /**
     * Verify if any of forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => afova2.isInvalid()
  };
}();
export {
  afova as default
};
