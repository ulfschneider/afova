import { nanoid } from "nanoid";
import constraint_violation_messages_en from "./locale/en.json";
import constraint_violation_messages_de from "./locale/de.json";

export interface AfovaSettings {
  selector?: string;
  validateOnChange?: boolean;
  focusOnFirstError?: boolean;
}

const INPUT_TYPES = [
  "text",
  "email",
  "datetime-local",
  "file",
  "image",
  "month",
  "number",
  "password",
  "range",
  "search",
  "tel",
  "time",
  "url",
  "week",
] as const;

const CONSTRAINTS = [
  "required",
  "pattern",
  "max",
  "min",
  "step",
  "maxlength",
  "minlength",
  "type",
] as const;

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
  "valueMissing",
] as const;

export type InputType = (typeof INPUT_TYPES)[number];

export type Constraint = (typeof CONSTRAINTS)[number];

export type ConstraintViolation = (typeof CONSTRAINT_VIOLATIONS)[number];

export interface ConstraintViolationMessage extends Record<InputType, string> {
  message: string;
  constraint?: Constraint;
}

export type AfovaConstraintViolationMessages = Record<
  ConstraintViolation,
  ConstraintViolationMessage
>;

export interface AfovaI18NConstraintViolationMessages {
  [key: string]: AfovaConstraintViolationMessages;
}

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

const I18N_CONSTRAINTS: AfovaI18NConstraintViolationMessages = {
  en: constraint_violation_messages_en as unknown as AfovaConstraintViolationMessages,
  de: constraint_violation_messages_de as unknown as AfovaConstraintViolationMessages,
};

const IGNORE_CONTROL_TYPES = ["submit", "reset", "button"];

function getConstraints(): AfovaConstraintViolationMessages {
  let locale = navigator.language;
  let constraints = I18N_CONSTRAINTS[locale];
  if (constraints) {
    console.log(`afova is using locale=[${locale}]`);
    return constraints;
  }

  //extract language
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

/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export function afova(options?: AfovaSettings): AfovaObject {
  let constraintViolationMessages: AfovaConstraintViolationMessages =
    getConstraints();

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
    violation: ConstraintViolation,
    control: HTMLObjectElement,
  ): string {
    if (violation != "customError") {
      let defaultMessage = constraintViolationMessages[violation];

      if (defaultMessage) {
        let constraint = defaultMessage.constraint;

        let message =
          //a message defined for the control has highest prio
          control.dataset[constraint || violation] ||
          //a default message specific for the input type has second hightest prio
          constraintViolationMessages[violation][control.type as InputType] ||
          //a default message has last prio
          defaultMessage.message;

        const constraintValue = control.getAttribute(constraint || "");
        if (constraintValue) {
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
    messageContainer.appendChild(messageElement);

    for (const violation of CONSTRAINT_VIOLATIONS) {
      if ((validity as any)[violation]) {
        //there is an error of type constraint
        let message = _deriveMessageText(
          violation as ConstraintViolation,
          control,
        );
        if (message) {
          messageElement.innerHTML = message;
        }
        break;
      }
    }

    if (!messageElement.innerHTML) {
      messageElement.innerHTML =
        control.dataset.errorInvalid ||
        constraintViolationMessages.badInput.message;
    }
  }

  function _clearControlMessages(control: HTMLObjectElement): void {
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

  function _setControlMessage(
    control: HTMLObjectElement,
    focus?: boolean,
  ): void {
    const context = _getContext(control);
    if (context) {
      context.classList.add("afova-active");
    }
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

  function _prepareControl(control: HTMLObjectElement): void {
    _ensureId(control);
    _getContext(control);
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
   * Find the wrapping afova context for a form control by searching the parents.
   * The context must be a label or a container with tje CSS class afova-context assigned.
   * @param control the form control to start from
   * @returns the wrapping context or null
   */
  function _getContext(control: HTMLElement): Element | null {
    let context = control.closest(".afova-context");

    if (!context) {
      context = control.closest("label");
    }

    if (context) {
      context.classList.add("afova-context");
      if (
        context.tagName == "LABEL" &&
        !(context as HTMLLabelElement).htmlFor
      ) {
        (context as HTMLLabelElement).htmlFor = control.id;
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
    isInvalid: () => _isInvalid(),
  };
}
