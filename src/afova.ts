import { nanoid } from "nanoid";

export interface AfovaSettings {
  selector?: string;
  validateOnChange?: boolean;
  focusOnFirstError?: boolean;
}

export interface AfovaConstraintMessages {
  [key: string]: {
    message: string;
    constraintAttr?: string;
  };
}
[];

export interface AfovaObject {
  clear: () => void;
  isInvalid: () => boolean;
  validate: () => void;
}

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: "form",
  validateOnChange: false,
  focusOnFirstError: true,
};

const IGNORE_CONTROL_TYPES = ["submit", "reset", "button"];

/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export function afova(options?: AfovaSettings): AfovaObject {
  let constraints: AfovaConstraintMessages = {
    badInput: {
      message: "The input cannot be processed",
      constraintAttr: undefined,
    },
    customError: { message: "" },
    patternMismatch: {
      message:
        "The value does not match the required pattern of {{constraint}}",
      constraintAttr: "pattern",
    },
    rangeOverflow: {
      message: "The value is too big. It cannot be bigger than {{constraint}}.",
      constraintAttr: "max",
    },
    rangeUnderflow: {
      message: "The value is too small. It must be at least {{constraint}}.",
      constraintAttr: "min",
    },
    stepMismatch: {
      message:
        "The value is not in within the correct step interval of {{constraint}}",
      constraintAttr: "step",
    },
    tooLong: {
      message:
        "The value is too long. It cannot be longer than {{constraint}} characters.",
      constraintAttr: "maxlength",
    },
    tooShort: {
      message:
        "The value is too short. It must be at least {{constraint}} characters long.",
      constraintAttr: "minlength",
    },
    typeMismatch: {
      message: "The value must be of type {{constraint}}",
      constraintAttr: "type",
    },
    "typeMismatch[email]": {
      message: "The value must be an email in the format mickey@mouse.com",
      constraintAttr: "type",
    },
    "typeMismatch[url]": {
      message: "The value must be a URL in the format http://url.com",
      constraintAttr: "type",
    },
    "typeMismatch[tel]": {
      message: "The value must be a phone number",
      constraintAttr: "type",
    },
    valid: { message: "" },
    valueMissing: {
      message: "Please provide a value",
      constraintAttr: "required",
    },
  };

  /**
   * Ensure the given element has an id
   * @param element
   */
  function _ensureId(element: Element): void {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }

  function _findMessageContainer(control: HTMLObjectElement): Element | null {
    const messageContainer = document.querySelector(
      `#${control.id}-afova-message-container`,
    );
    return messageContainer;
  }

  function _ensureAndGetMessageContainer(control: HTMLObjectElement): Element {
    let messageContainer = _findMessageContainer(control);
    if (!messageContainer) {
      messageContainer = document.createElement("ul");
      control.parentNode?.insertBefore(messageContainer, control);
      messageContainer.id = `${control.id}-afova-message-container`;
      messageContainer.classList.add("afova-message-container");
      control.setAttribute("aria-errormessage", messageContainer.id);
    }

    return messageContainer;
  }

  function _deriveMessageText(
    constraint: string,
    control: HTMLObjectElement,
  ): string {
    if (constraint != "customError") {
      let derivedMessage = constraints[constraint];
      if (derivedMessage) {
        let message = derivedMessage.message;
        let constraintAttr = derivedMessage.constraintAttr;
        const constraintValue = control.getAttribute(constraintAttr || "");

        message = control.dataset[constraintAttr || constraint] || message;
        if (constraintValue) {
          derivedMessage =
            constraints[`${constraint}[${constraint.toLowerCase()}]`];
          if (derivedMessage) {
            message = control.dataset[constraint] || derivedMessage.message;
          }
          const regex = new RegExp(`\{\{\\s*constraint\\s*\}\}`, "ig");
          message = message.replace(regex, constraintValue);
        }

        return message;
      }
    }
    return control.validationMessage;
  }

  function _putMessage(control: HTMLObjectElement): void {
    const messageContainer = _ensureAndGetMessageContainer(control);

    const validity = control.validity;
    const messageElement = document.createElement("li");
    messageElement.classList.add("afova-message");
    messageElement.classList.add("afova-derived");
    messageContainer.appendChild(messageElement);

    for (const constraint of Object.keys(constraints)) {
      if ((validity as any)[constraint]) {
        //there is an error of type constraint
        let message = _deriveMessageText(constraint, control);
        if (message) {
          messageElement.innerHTML = message;
        }
        break;
      }
    }

    if (!messageElement.innerHTML) {
      messageElement.innerHTML =
        control.dataset.errorInvalid || "The value is not correct";
    }
  }

  function _clearControlMessages(control: HTMLObjectElement): void {
    control.classList.remove("afova-active");
    control.classList.remove("afova-control");
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");

    const messageContainer = _findMessageContainer(control);
    if (messageContainer) {
      messageContainer.remove();
    }

    let context = _getContext(control);
    if (context) {
      context.classList.remove("afova-context");
      context.classList.remove("afova-active");
    }
  }

  function _setControlMessage(
    control: HTMLObjectElement,
    focus?: boolean,
  ): void {
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

  function _validateControl(
    control: HTMLObjectElement,
    focus?: boolean,
  ): boolean {
    _clearControlMessages(control);
    if (!control.validity.valid) {
      _setControlMessage(control, focus);
    }
    return control.validity.valid;
  }

  function _getFormElements(form: HTMLFormElement): HTMLObjectElement[] {
    const result: HTMLObjectElement[] = [];
    for (const control of form.elements) {
      if (!IGNORE_CONTROL_TYPES.includes((control as HTMLObjectElement).type)) {
        result.push(control as HTMLObjectElement);
      }
    }
    return result;
  }

  function _validateForm(form: HTMLFormElement, event?: Event): void {
    let firstError: HTMLObjectElement | undefined;
    for (const control of _getFormElements(form)) {
      const valid = _validateControl(control);
      if (!firstError && !valid) {
        firstError = control;
      }
    }
    if (firstError) {
      event?.preventDefault();
      if (settings.focusOnFirstError) {
        firstError.focus();
      }
    }
  }

  function _resetForm(form: HTMLFormElement): void {
    for (let control of _getFormElements(form)) {
      _clearControlMessages(control);
    }
  }

  /**
   * Will prepare all forms by ensuring the forms each have an id asssigned and
   * the attribute novalidate assigned to it. Will also prepare all controls contained in each form.
   */
  function _prepareForms(): void {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      //switch off default browser form validation
      form.setAttribute("novalidate", "");

      _ensureId(form);

      form.addEventListener("submit", _formSubmitListener);
      form.addEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form as HTMLFormElement)) {
        _prepareControl(control);
      }
    }
  }

  function _formSubmitListener(event: Event): void {
    _validateForm(event.target as HTMLFormElement, event);
  }

  function _formResetListener(event: Event): void {
    _resetForm(event.target as HTMLFormElement);
  }

  function _unprepareForms(): void {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      form.removeAttribute("novalidate");
      form.removeEventListener("submit", _formSubmitListener);
      form.removeEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form as HTMLFormElement)) {
        _unprepareControl(control);
      }
    }
  }

  /**
   * Prepare the form control by ensuring an id and assigning the CSS class afova-control.
   * Will adjust textual descriptions within the control´s afova context and assign an event handler
   * in case the afova settings have set validateOnChange to true
   * @param control the control to prepare
   */
  function _prepareControl(control: HTMLObjectElement): void {
    _ensureId(control);
    control.classList.add("afova-control");
    if (settings.validateOnChange) {
      control.addEventListener("change", _controlChangeListener);
    }
  }

  function _controlChangeListener(event: Event): void {
    _validateControl(event.target as HTMLObjectElement, true);
  }

  function _unprepareControl(control: HTMLObjectElement): void {
    control.classList.remove("afova-control");
    control.removeEventListener("change", _controlChangeListener);
  }

  /**
   * Find the wrapping afova context for a form control by searching the parents
   * The context must be a label or a container with CSS class afova-context assigned
   * @param control the form control to start from
   * @returns the wrapping context or null
   */
  function _getContext(control: HTMLElement): Element | null {
    let context = control.closest(".afova-context");

    if (!context) {
      context = control.closest("label");
      if (context) {
        context.classList.add("afova-context");
        if (!(context as HTMLLabelElement).htmlFor) {
          (context as HTMLLabelElement).htmlFor = control.id;
        }
      }
    }

    return context;
  }

  function _validate(): void {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      _validateForm(form as HTMLFormElement);
    }
  }

  function _isInvalid(): boolean {
    const forms = document.querySelectorAll(settings.selector || "form");
    for (const form of forms) {
      if (!(form as HTMLFormElement).checkValidity()) {
        //form has invalid controls
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
     * take away the adjustments afova has introduced into the html.
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
    isInvalid: () => _isInvalid(),
  };
}
