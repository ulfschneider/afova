import { nanoid } from "nanoid";
import constraint_violation_messages_en from "./locale/en.json";
import constraint_violation_messages_de from "./locale/de.json";

export interface AfovaSettings {
  /**
   * The selector to identify the forms to validate. Default is form
   */
  selector?: string;
  /**
   * The optional selector for the form messages container. Default is .afova-form-message-container
   */
  formMessageSelector?: string;
  /**
   * Indicate whether or not to validate single fields on field change. Default is false.
   */
  validateOnChange?: boolean;
  /**
   * Whether or not to bring the focus to the first invalid field during form validation. Default is true.
   */
  focusOnFirstError?: boolean;
  /**
   * Callback for submitting the form after successful validation.
   * @param event the SubmitEvent
   */
  onSubmit?: (event: SubmitEvent) => void;
  /**
   * Callback for resetting the form
   * @param event the SubmitEvent
   */
  onReset?: (event: Event) => void;
  /**
   * Callback when trying to submit an invalid form.
   * @param event the SubmitEvent
   */
  onInvalid?: (event: SubmitEvent) => void;
  /**
   * Callback for a valid form during submit. Will be called before the onSubmit callback.
   * @param event the SubmitEvent
   */
  onValid?: (event: SubmitEvent) => void;
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
  isValid: (form?: HTMLFormElement) => boolean;
  isInvalid: (form?: HTMLFormElement) => boolean;
  validate: (form?: HTMLFormElement) => boolean;
}

const DEFAULT_SELECTOR = "form";
const DEFAULT_FORM_CONTAINER_SELECTOR = ".afova-form-message-container";

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: DEFAULT_SELECTOR,
  formMessageSelector: DEFAULT_FORM_CONTAINER_SELECTOR,
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

  function _setFormMessageContainerVisibility(container: Element): void {
    if (_isEmpty(container)) {
      (container as HTMLElement).style.display = "none";
    } else {
      (container as HTMLElement).style.display = "";
    }
  }

  function _findFormMessageContainer(container: Element): Element | null {
    const form = container.closest("form");
    if (form) {
      const containerId = form.getAttribute("afova-form-message-container-id");
      if (containerId) {
        return document.querySelector(`#${containerId}`);
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

  function _isValidatedRadioGroup(control: HTMLObjectElement): boolean {
    if (control.type == "radio" && control.name) {
      const radioGroup = document.querySelectorAll(
        `input[name="${control.name}"][type="radio"]`,
      );
      const messageContainer = _findMessageContainer(control);
      if (messageContainer) {
        for (let radio of radioGroup) {
          if (
            messageContainer.querySelector(`[afova-message-for="${radio.id}"]`)
          ) {
            //there is already a message for one of the radio controls
            return true;
          }
        }
      }
    }
    return false;
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

        //show the constraint
        const constraintValue = control.getAttribute(constraint || "");
        if (constraintValue) {
          let regex = new RegExp(`\{\{\\s*constraint\\s*\}\}`, "ig");
          message = message.replace(regex, constraintValue);
        }

        //show the input value
        let regex = new RegExp(`\{\{\\s*input\\s*\}\}`, "ig");
        message = message.replace(
          regex,
          (control as unknown as HTMLInputElement).value,
        );

        return message;
      }
    }
    return control.validationMessage;
  }

  function _findLabelText(control: Element): string {
    const context = _findContext(control);
    if (context) {
      let label = context.querySelector(".afova-label");
      if (!label && context.tagName != "LABEL") {
        label = context.querySelector("label");
      }
      if (!label) {
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

  function _putFormMessage(control: Element, message: string) {
    const messageContainer = _findFormMessageContainer(control);

    if (messageContainer) {
      let collectedMessageElement: Element;
      if (
        messageContainer.tagName == "UL" ||
        messageContainer.tagName == "OL"
      ) {
        collectedMessageElement = document.createElement("LI");
      } else {
        collectedMessageElement = document.createElement("DIV");
      }
      collectedMessageElement.setAttribute("afova-message-for", control.id);
      collectedMessageElement.classList.add("afova-collected-message");

      const labelText = _findLabelText(control);
      if (labelText) {
        const labelElement = document.createElement("DIV");
        labelElement.innerText = labelText;
        labelElement.classList.add("afova-message-label");
        collectedMessageElement.appendChild(labelElement);
      }
      const messageElement = document.createElement("DIV");
      messageElement.innerText = message;
      messageElement.classList.add("afova-message");
      collectedMessageElement.appendChild(messageElement);

      messageContainer.appendChild(collectedMessageElement);

      _setFormMessageContainerVisibility(messageContainer);
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
          _putFormMessage(control, message);
        }
        break;
      }
    }

    if (!messageElement.innerHTML) {
      messageElement.innerHTML =
        control.dataset.errorInvalid ||
        constraintViolationMessages.badInput.message;
      _putFormMessage(
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

    const messageCollector = _findFormMessageContainer(control);
    if (messageCollector) {
      _setFormMessageContainerVisibility(messageCollector);
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

    if (!_isValidatedRadioGroup(control)) {
      //a group of radio controls should only be validated once

      _putMessage(control);

      if (focus) {
        control.focus();
      }
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

  function _isValid(form?: HTMLFormElement): boolean {
    if (form) {
      return form.checkValidity();
    } else {
      const forms = document.querySelectorAll(settings.selector || "form");
      for (const form of forms) {
        if (!(form as HTMLFormElement).checkValidity()) {
          //form has invalid controls
          return false;
        }
      }

      return true;
    }
  }

  function _validateForm(form: HTMLFormElement, event?: Event): boolean {
    let firstError: HTMLObjectElement | undefined;
    let formIsValid = true;

    for (const control of _getFormElements(form)) {
      const valid = _validateControl(control);
      if (!valid) {
        formIsValid = false;

        if (!firstError) {
          firstError = control;
        }
      }
    }
    if (firstError) {
      event?.preventDefault();
      if (settings.focusOnFirstError) {
        firstError.focus();
      }
    }
    return formIsValid;
  }

  function _validate(form?: HTMLFormElement): boolean {
    if (form) {
      return _validateForm(form);
    } else {
      let formsAreValid = true;
      const forms = document.querySelectorAll(settings.selector || "form");
      for (const form of forms) {
        if (!_validateForm(form as HTMLFormElement)) {
          formsAreValid = false;
        }
      }
      return formsAreValid;
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
      _ensureId(form);

      form.addEventListener("submit", _formSubmitListener);
      form.addEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form as HTMLFormElement)) {
        _prepareControl(control);
      }

      //switch off default browser form validation
      form.setAttribute("novalidate", "");

      const formMessageContainer = form.querySelector(
        settings.formMessageSelector || DEFAULT_FORM_CONTAINER_SELECTOR,
      );

      if (formMessageContainer) {
        _ensureId(formMessageContainer);
        _setFormMessageContainerVisibility(formMessageContainer);
        form.setAttribute(
          "afova-form-message-container-id",
          formMessageContainer.id,
        );
        formMessageContainer.classList.add("afova-form-message-container");
      }
    }
  }

  function _formSubmitListener(event: Event): void {
    event.preventDefault();

    _validateForm(event.target as HTMLFormElement, event);

    if ((event.target as HTMLFormElement).checkValidity()) {
      if (settings.onValid) {
        settings.onValid(event as SubmitEvent);
      }
      if (settings.onSubmit) {
        settings.onSubmit(event as SubmitEvent);
      }
    } else if (settings.onInvalid) {
      settings.onInvalid(event as SubmitEvent);
    }
  }

  function _formResetListener(event: Event): void {
    _resetForm(event.target as HTMLFormElement);
    if (settings.onReset) {
      settings.onReset(event);
    }
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
   * The context must be a label or a container with the CSS class afova-context assigned.
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

  let settings = Object.assign({}, DEFAULT_SETTINGS, options);
  _prepareForms();

  return {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => _unprepareForms(),

    /**
     * check the validity of the given form
     * @param form to get the valid state for. When the form is not provided it is checked if all of the forms addressed by the selector are valid.
     * @returns true if the form is (or all forms are) valid
     */
    isValid: (form?: HTMLFormElement) => _isValid(form),

    /**
     * check the validity of the given form
     * @param form to get the invalid state for. When the form is not provided it is checked if any of the forms addressed by the selector is invalid.
     * @returns true if the form is (or any form) invalid
     */
    isInvalid: (form?: HTMLFormElement) => !_isValid(form),

    /**
     * Do the afova form validation and return whether the form is valid
     * @param form to check. When the form is not provided, all forms addressed by the selector are validated.
     * @returns true if the form is (or all forms are) valid
     */
    validate: (form?: HTMLFormElement) => {
      return _validate(form);
    },
  };
}
