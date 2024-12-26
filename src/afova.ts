import { nanoid } from "nanoid";

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

export interface AfovaObject {
  clear: () => void;
  isValid: (form?: HTMLFormElement) => boolean;
  isInvalid: (form?: HTMLFormElement) => boolean;
  validate: (form?: HTMLFormElement) => boolean;
}

enum Violation {
  badInput = "badInput",
  customError = "customError",
  patternMismatch = "patternMismatch",
  rangeOverflow = "rangeOverflow",
  rangeUnderflow = "rangeUnderflow",
  stepMismatch = "stepMismatch",
  tooLong = "tooLong",
  tooShort = "tooShort",
  typeMismatch = "typeMismatch",
  valueMissing = "valueMissing",
}

enum Constraint {
  pattern = "pattern",
  max = "max",
  min = "min",
  step = "step",
  maxlength = "maxlength",
  minlength = "minlength",
  type = "type",
  required = "required",
}

const VIOLATION_TO_CONSTRAINT_MAP: Record<Violation, Constraint | undefined> = {
  badInput: undefined,
  customError: undefined,
  patternMismatch: Constraint.pattern,
  rangeOverflow: Constraint.max,
  rangeUnderflow: Constraint.min,
  stepMismatch: Constraint.step,
  tooLong: Constraint.maxlength,
  tooShort: Constraint.minlength,
  typeMismatch: Constraint.type,
  valueMissing: Constraint.required,
};

function _mapViolationToConstraint(
  violation: Violation,
): Constraint | undefined {
  return VIOLATION_TO_CONSTRAINT_MAP[violation];
}

const CONSTRAINT_TO_VIOLATION_MAP: Record<Constraint, Violation> = {
  pattern: Violation.patternMismatch,
  max: Violation.rangeOverflow,
  min: Violation.rangeUnderflow,
  step: Violation.stepMismatch,
  maxlength: Violation.tooLong,
  minlength: Violation.tooShort,
  type: Violation.typeMismatch,
  required: Violation.valueMissing,
};

function _mapConstraintToViolation(constraint: Constraint): Violation {
  return CONSTRAINT_TO_VIOLATION_MAP[constraint];
}

const VIOLATION_FALLBACK_MESSAGES: Record<Violation, string> = {
  badInput: "The input {{input}} is not valid",
  customError: "The input {{input}} is not valid",
  patternMismatch:
    "The value {{input}} does not match the required pattern of {{constraint}}",
  rangeOverflow:
    "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  rangeUnderflow:
    "The value {{input}} is too small. It must be at least {{constraint}}.",
  stepMismatch:
    "The value {{input}} is not in within the correct step interval of {{constraint}}",
  tooLong:
    "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  tooShort:
    "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  typeMismatch: "The value {{input}} must be of type {{constraint}}",
  valueMissing: "Please provide a value",
};

const DEFAULT_SELECTOR = "form";
const DEFAULT_FORM_CONTAINER_SELECTOR = ".afova-form-message-container";

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: DEFAULT_SELECTOR,
  formMessageSelector: DEFAULT_FORM_CONTAINER_SELECTOR,
  validateOnChange: false,
  focusOnFirstError: true,
};

const INPUT_TYPE_WARNINGS = [
  "color",
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "range",
  "tel",
  "time",
  "url",
  "week",
];

const IGNORE_INPUT_TYPES = ["submit", "reset", "button", "fieldset", "image"];

/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export function afova(options?: AfovaSettings): AfovaObject {
  function _ensureId(element: Element): void {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }

  function _findMessageContainer(control: Element): Element | null {
    const messageContainerAnchor = _findAndPrepareGroup(control) || control;
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
      const messageContainerAnchor = _findAndPrepareGroup(control) || control;

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
    violation: Violation,
    control: HTMLObjectElement,
  ): string {
    if (violation != "customError") {
      let constraint = _mapViolationToConstraint(violation);

      let message =
        //a message defined for the control has highest prio
        control.dataset[constraint || violation.toLowerCase()] ||
        control.dataset[violation.toLowerCase()] ||
        // fallback message has last prio
        VIOLATION_FALLBACK_MESSAGES[violation];

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

    return control.validationMessage;
  }

  function _findLabelText(control: Element): string {
    const context = _findAndPrepareContext(control);
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

    for (const violation in Violation) {
      if ((validity as any)[violation]) {
        //there is an error of type constraint
        let message = _deriveMessageText(violation as Violation, control);
        if (message) {
          messageElement.innerHTML = message;
          _putFormMessage(control, message);
        }
        break;
      }
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

    let context = _findAndPrepareContext(control);
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
    const context = _findAndPrepareContext(control);
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
      if (!IGNORE_INPUT_TYPES.includes((control as HTMLObjectElement).type)) {
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

  function _warnMissingMessage(control: HTMLObjectElement): void {
    //indicate in the console log the missing constraint violation message
    const attributeNames = control
      .getAttributeNames()
      .map((attribute) => attribute.toLowerCase());
    for (const constraint in Constraint) {
      if (
        attributeNames.includes(constraint) &&
        !control.getAttribute(`data-${constraint}`) &&
        !control.getAttribute(
          `data-${_mapConstraintToViolation(constraint as Constraint).toLowerCase()}`,
        ) &&
        (constraint != "type" ||
          (constraint == "type" && INPUT_TYPE_WARNINGS.includes(control.type)))
      ) {
        const name = control.getAttribute("name");
        if (name) {
          console.warn(
            `afova: Missing attribute [data-${constraint}] for the control with [name="${name}"]. Therefore only a fallback message will be used in case of a [${constraint}] constraint violation. It´s strongly recommended to define the violation message with the [data-${constraint}] attribute.`,
          );
        } else {
          console.warn(
            `afova: Missing attribute [data-${constraint}] for the control with [id="${control.id}"]. Therefore only a fallback message will be used in case of a [${constraint}] constraint violation. It´s strongly recommended to define the violation message with the [data-${constraint}] attribute.`,
          );
        }
      }
    }
  }

  function _prepareControl(control: Element): void {
    _ensureId(control);
    _findAndPrepareContext(control);
    control.classList.add("afova-control");
    if (settings.validateOnChange) {
      control.addEventListener("change", _controlChangeListener);
    }
    _warnMissingMessage(control as HTMLObjectElement);
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
  function _findAndPrepareContext(control: Element): Element | null {
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
  function _findAndPrepareGroup(control: Element): Element | null {
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
