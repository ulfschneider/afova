import { nanoid } from "nanoid";
import constraint_violation_messages_en from "./locale/en.json";
import constraint_violation_messages_de from "./locale/de.json";

export interface AfovaSettings {
  selector?: string;
  collectSelector?: string;
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

const DEFAULT_SELECTOR = "form";
const DEFAULT_COLLECT_SELECTOR = ".afova-message-collector";

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: DEFAULT_SELECTOR,
  collectSelector: DEFAULT_COLLECT_SELECTOR,
  validateOnChange: false,
  focusOnFirstError: true,
};

const I18N_CONSTRAINTS: AfovaI18NConstraintViolationMessages = {
  en: constraint_violation_messages_en as unknown as AfovaConstraintViolationMessages,
  de: constraint_violation_messages_de as unknown as AfovaConstraintViolationMessages,
};

const IGNORE_CONTROL_TYPES = ["submit", "reset", "button", "fieldset"];

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

  function _findMessageContainer(control: Element): Element | null {
    const messageContainerAnchor = _getGroup(control) || control;
    return document.querySelector(
      `#${messageContainerAnchor.id}-afova-message-container`,
    );
  }

  function _findMessageCollector(control: Element): Element | null {
    const form = control.closest("form");
    if (form) {
      const collectorId = form.getAttribute("afova-message-collector-id");
      if (collectorId) {
        return document.querySelector(`#${collectorId}`);
      }
    }
    return null;
  }

  function _isEmpty(element: Element): boolean {
    return element.children.length == 0;
  }

  function _ensureAndGetMessageContainer(control: Element): Element {
    let messageContainer = _findMessageContainer(control);
    if (!messageContainer) {
      const messageContainerAnchor = _getGroup(control) || control;

      messageContainer = document.createElement("ul");
      messageContainerAnchor.parentNode?.insertBefore(
        messageContainer,
        messageContainerAnchor,
      );
      messageContainer.id = `${messageContainerAnchor.id}-afova-message-container`;
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

  function _findLabelText(control: Element): string {
    const context = _findContext(control);
    if (context) {
      let label = context.querySelector(".afova-label");
      if (label) {
        return (label as HTMLElement).innerText;
      }

      if (context.tagName != "LABEL") {
        label = context.querySelector("label");
      } else {
        label = context;
      }

      if (label) {
        let labelText = "";
        for (const node of label.childNodes) {
          if (node.nodeType == Node.TEXT_NODE) {
            if (labelText && node.textContent?.trim()) {
              labelText += " ";
            }
            if (node.textContent?.trim()) {
              labelText += node.textContent.trim();
            }
          }
        }
        return labelText;
      }
    }
    return "";
  }

  function _collectMessage(control: Element, message: string) {
    const messageCollector = _findMessageCollector(control);
    if (messageCollector) {
      let collectedMessageElement: Element;
      if (
        messageCollector.tagName == "UL" ||
        messageCollector.tagName == "OL"
      ) {
        collectedMessageElement = document.createElement("LI");
      } else {
        collectedMessageElement = document.createElement("DIV");
      }
      collectedMessageElement.setAttribute("afova-message-for", control.id);
      collectedMessageElement.classList.add("afova-message");

      const labelText = _findLabelText(control);
      if (labelText) {
        const labelElement = document.createElement("DIV");
        labelElement.innerText = labelText;
        collectedMessageElement.appendChild(labelElement);
      }
      const messageElement = document.createElement("DIV");
      messageElement.innerText = message;
      collectedMessageElement.appendChild(messageElement);

      messageCollector.appendChild(collectedMessageElement);
    }
  }

  function _putMessage(control: HTMLObjectElement): void {
    const messageContainer = _ensureAndGetMessageContainer(control);

    const validity = control.validity;
    let messageElement: Element;
    if (messageContainer.tagName == "UL" || messageContainer.tagName == "OL") {
      messageElement = document.createElement("LI");
    } else {
      messageElement = document.createElement("DIV");
    }
    messageElement.classList.add("afova-message");
    messageElement.setAttribute("afova-message-for", control.id);
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
          _collectMessage(control, message);
        }
        break;
      }
    }

    if (!messageElement.innerHTML) {
      messageElement.innerHTML =
        control.dataset.errorInvalid ||
        constraintViolationMessages.badInput.message;
      _collectMessage(
        control,
        control.dataset.errorInvalid ||
          constraintViolationMessages.badInput.message,
      );
    }
  }

  function _clearControlMessages(control: Element): void {
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");

    const messages = document.querySelectorAll(
      `[afova-message-for="${control.id}"]`,
    );
    for (const message of messages) {
      message.remove();
    }

    const messageContainer = _findMessageContainer(control);

    if (messageContainer && _isEmpty(messageContainer)) {
      messageContainer.remove();
    }

    let context = _findContext(control);
    if (context) {
      const invalidControls = document.querySelectorAll(
        `#${context.id} [aria-invalid].afova-control`,
      );
      if (invalidControls.length == 0) {
        context.classList.remove("afova-active");
      }
    }
  }

  function _setControlMessage(
    control: HTMLObjectElement,
    focus?: boolean,
  ): void {
    const context = _findContext(control);
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
    const forms = document.querySelectorAll(
      settings.selector || DEFAULT_SELECTOR,
    );
    for (const form of forms) {
      //switch off default browser form validation
      form.setAttribute("novalidate", "");

      _ensureId(form);

      form.addEventListener("submit", _formSubmitListener);
      form.addEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form as HTMLFormElement)) {
        _prepareControl(control);
      }

      const collector = form.querySelector(
        settings.collectSelector || DEFAULT_COLLECT_SELECTOR,
      );

      if (collector) {
        _ensureId(collector);
        form.setAttribute("afova-message-collector-id", collector.id);
        collector.classList.add("afova-message-collector");
      }
    }
  }

  function _formSubmitListener(event: Event): void {
    event.preventDefault();
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

  function _prepareControl(control: Element): void {
    _ensureId(control);
    _findContext(control); //prepare the context, we will not use it here
    control.classList.add("afova-control");
    if (settings.validateOnChange) {
      control.addEventListener("change", _controlChangeListener);
    }
  }

  function _controlChangeListener(event: Event): void {
    _validateControl(event.target as HTMLObjectElement, true);
  }

  function _unprepareControl(control: Element): void {
    control.classList.remove("afova-control");
    control.removeEventListener("change", _controlChangeListener);
  }

  /**
   * Find the wrapping afova context for a form control by searching the parents.
   * The context must be a label or a container with tje CSS class afova-context assigned.
   * @param control the form control to start from
   * @returns the wrapping context or null
   */
  function _findContext(control: Element): Element | null {
    let context = control.closest(".afova-context");

    if (!context) {
      context = control.closest("label");
    }

    if (context) {
      _ensureId(context);
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

  /**
   * Multiple controls might be wrapped into an afova group,
   * which must have the afova-group CSS class assigned.
   * The constraint messages of all wrapped controls will be shown
   * directly before the group. A group can be useful when controls are
   * part of a fieldset. E.g., in such a case the afova-group CSS class
   * can be assigned to the fieldset element.
   * @param control
   * @returns the element that is wrapping the controls or null, if none exists
   */
  function _getGroup(control: Element): Element | null {
    const group = control.closest(".afova-group");
    if (group) {
      _ensureId(group);
    }
    return group;
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
