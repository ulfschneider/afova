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
   * The hook is called when the submit event of the form fired and the form is successfully validated.
   * When this hook is provided the default form submit behaviour is prevented and the submit needs to be
   * implemented inside of the hook.
   * @param event the SubmitEvent
   */
  onSubmit?: (event: SubmitEvent) => void;

  /**
   * The hook is called when the form is resetted
   * @param event the reset event of the form
   */
  onReset?: (event: Event) => void;

  /**
   * The hook is called when the submit event of the form fired but the form is invalid.
   * The form will not be submitted in that case.
   * @param event the SubmitEvent
   */
  onInvalid?: (event: SubmitEvent) => void;

  /**
   * The hook is called when the submit event of the form fired and the form is valid.
   * Will be called right before the onSubmit hook.
   * @param event the SubmitEvent
   */
  onValid?: (event: SubmitEvent) => void;

  /**
   * The hook is called for each input element during form validation.
   * The hook can be used to invalidate the input element by setting a custom validation message with control.setCustomValidity().
   * Will only be called after the successful validation of all constraints for the input element.
   * @param control the input element that is validated
   */
  onValidateControl?: (control: HTMLInputElement) => void;

  /**
   * The async hook is called for each input element during form validation and must return a promise.
   * The hook can be used to invalidate the input element by setting a custom validation message with control.setCustomValidity().
   * Will only be called after the successful validation of all constraints for the input element and after the onValidateControl hook.
   * @param control the input element that is validated
   */
  onAsyncValidateControl?: (control: HTMLInputElement) => Promise<void>;

  /**
   * The hook is called after successful validation of all input elements of the form.
   * The hook can be used to validate input elements in relation to each other.
   * @param form the form that is validated
   */
  onValidateForm?: (form: HTMLFormElement) => void;

  /**
   * The async hook is called after successful validation of all input elements of the form and after the onValidateForm hook.
   * Must return a promise.
   * The hook can be used to validate input elements in relation to each other.
   * @param form the form that is validated
   */
  onAsyncValidateForm?: (form: HTMLFormElement) => Promise<void>;
}

export interface AfovaObject {
  /**
   * Will remove all event listeners that have been added by afova and
   * will clear all afova messages.
   */
  clear: () => void;
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
  badInput: "The input {{input}} is not a valid {{type}}",
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
  typeMismatch: "The value {{input}} must be a {{constraint}}",
  valueMissing: "Please provide the {{type}} value",
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
  function _ensureId(element: HTMLElement): void {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }

  function _findMessageContainer(
    control: HTMLInputElement,
  ): HTMLElement | undefined {
    const messageContainerAnchor = _findAndPrepareGroup(control) || control;
    return (
      (document.querySelector(
        `#${messageContainerAnchor.id}-afova-message-container`,
      ) as HTMLElement) || undefined
    );
  }

  function _setFormMessageContainerVisibility(container: HTMLElement): void {
    if (_isEmpty(container)) {
      container.style.display = "none";
    } else {
      container.style.display = "";
    }
  }

  function _findFormMessageContainer(
    container: HTMLElement,
  ): HTMLElement | undefined {
    const form = container.closest("form");
    if (form) {
      const containerId = form.getAttribute("afova-form-message-container-id");
      if (containerId) {
        return (
          (document.querySelector(`#${containerId}`) as HTMLElement) ||
          undefined
        );
      }
    }
  }

  function _isEmpty(element: HTMLElement): boolean {
    return element.children.length == 0;
  }

  function _ensureAndGetMessageContainer(
    control: HTMLInputElement,
  ): HTMLElement {
    let messageContainer = _findMessageContainer(control);
    if (!messageContainer) {
      const messageContainerAnchor = _findAndPrepareGroup(control) || control;

      messageContainer = document.createElement("DIV");
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

  function _isValidatedRadioGroup(control: HTMLInputElement): boolean {
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
    control: HTMLInputElement,
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
      message = message.replace(regex, control.value);

      //show the type
      regex = new RegExp(`\{\{\\s*type\\s*\}\}`, "ig");
      message = message.replace(regex, control.type);

      return message;
    }

    return control.validationMessage;
  }

  function _findLabelText(control: HTMLInputElement): string {
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

  function _setFormMessage(control: HTMLInputElement, message: string) {
    const messageContainer = _findFormMessageContainer(control);

    if (messageContainer) {
      let collectedMessageElement: HTMLElement;
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
      const messageElement = document.createElement("DIV") as HTMLElement;

      messageElement.innerText = message;

      messageElement.classList.add("afova-message");
      collectedMessageElement.appendChild(messageElement);

      messageContainer.appendChild(collectedMessageElement);

      _setFormMessageContainerVisibility(messageContainer);
    }
  }

  function _clearMessages(control: HTMLInputElement): void {
    control.removeAttribute("aria-invalid");
    control.removeAttribute("aria-errormessage");
    control.setCustomValidity("");

    //clear all messages for the control, no matter if they are
    //in the controls message container or in the form message container
    const messages = document.querySelectorAll(
      `[afova-message-for="${control.id}"]`,
    );
    for (const message of messages) {
      message.remove();
    }

    //clean up the control message container
    const messageContainer = _findMessageContainer(control);
    if (messageContainer && _isEmpty(messageContainer)) {
      messageContainer.remove();
    }

    //clean up the form message container
    const formMessageContainer = _findFormMessageContainer(control);
    if (formMessageContainer) {
      _setFormMessageContainerVisibility(formMessageContainer);
    }

    //clean up the context
    let context = _findAndPrepareContext(control);
    if (context) {
      const invalidControls = document.querySelectorAll(
        `#${context.id} [aria-invalid].afova-control`,
      );
      if (invalidControls.length == 0) {
        context.classList.remove("afova-active");
      }
    }
  }

  function _setMessage(control: HTMLInputElement): void {
    if (!control.validity.valid && !_isValidatedRadioGroup(control)) {
      //a message will only be set for an invalid input element
      //and a group of radio controls should only be validated once
      const context = _findAndPrepareContext(control);
      if (context) {
        context.classList.add("afova-active");
      }
      control.setAttribute("aria-invalid", "true");

      const messageContainer = _ensureAndGetMessageContainer(control);

      let messageElement: Element;
      if (
        messageContainer.tagName == "UL" ||
        messageContainer.tagName == "OL"
      ) {
        messageElement = document.createElement("LI");
      } else {
        messageElement = document.createElement("DIV");
      }
      messageElement.classList.add("afova-message");
      messageElement.setAttribute("afova-message-for", control.id);
      messageContainer.appendChild(messageElement);

      for (const violation in Violation) {
        if ((control.validity as any)[violation]) {
          //there is an error of type constraint
          let message = _deriveMessageText(violation as Violation, control);
          if (message) {
            messageElement.innerHTML = message;
            _setFormMessage(control, message);
          }
          break;
        }
      }
    }
  }

  async function _validateControl(
    control: HTMLInputElement,
    indicateMessage = true,
  ): Promise<boolean> {
    _clearMessages(control);

    if (control.validity.valid) {
      //call the validation hooks only for  valid input elements
      if (settings.onValidateControl) {
        settings.onValidateControl(control);
      }
      if (settings.onAsyncValidateControl) {
        await settings.onAsyncValidateControl(control);
      }
    }

    if (indicateMessage) {
      _setMessage(control);
    }

    return control.validity.valid;
  }

  function _getFormElements(form: HTMLFormElement): HTMLInputElement[] {
    const result: HTMLInputElement[] = [];
    for (const control of form.elements) {
      if (!IGNORE_INPUT_TYPES.includes((control as HTMLInputElement).type)) {
        result.push(control as HTMLInputElement);
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

  async function _validateForm(form: HTMLFormElement): Promise<boolean> {
    for (const control of _getFormElements(form)) {
      //do not show the validation message
      await _validateControl(control, false);
    }

    if (form.checkValidity()) {
      //call the form validation hooks only for valid forms
      if (settings.onValidateForm) {
        settings.onValidateForm(form);
      }
      if (settings.onAsyncValidateForm) {
        await settings.onAsyncValidateForm(form);
      }
    }

    let firstError: HTMLInputElement | undefined;
    for (const control of _getFormElements(form)) {
      _setMessage(control);
      if (
        settings.focusOnFirstError &&
        !control.validity.valid &&
        !firstError
      ) {
        firstError = control;
        firstError.focus();
      }
    }

    return form.checkValidity();
  }

  function _resetForm(form: HTMLFormElement): void {
    for (let control of _getFormElements(form)) {
      _clearMessages(control);
    }
  }

  function _prepareForms(): void {
    const forms = document.querySelectorAll(
      settings.selector || DEFAULT_SELECTOR,
    );
    for (const form of forms) {
      _ensureId(form as HTMLFormElement);

      form.addEventListener("submit", _formSubmitListener);
      form.addEventListener("reset", _formResetListener);
      for (const control of _getFormElements(form as HTMLFormElement)) {
        _prepareControl(control);
      }

      //switch off default browser form validation, afova will take over
      form.setAttribute("novalidate", "");

      const formMessageContainer = form.querySelector(
        settings.formMessageSelector || DEFAULT_FORM_CONTAINER_SELECTOR,
      ) as HTMLElement;

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

  async function _formSubmitListener(event: Event): Promise<void> {
    event.preventDefault();
    const formIsValid = await _validateForm(event.target as HTMLFormElement);

    if (!formIsValid) {
      if (settings.onInvalid) {
        settings.onInvalid(event as SubmitEvent);
      }
      return;
    }

    //form is valid
    if (settings.onValid) {
      settings.onValid(event as SubmitEvent);
    }

    if (!settings.onSubmit) {
      //a submit hook is not defined and the form is valid
      //therefore we send the form to the server
      (event.target as HTMLFormElement).submit();
    } else {
      settings.onSubmit(event as SubmitEvent);
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

  function _warnMissingMessage(control: HTMLInputElement): void {
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
            `afova: Missing attribute [data-${constraint}] for the control with [name="${name}"]. Therefore only a fallback message will be used in case of a [${constraint}] constraint violation. It is recommended to define the violation message with the [data-${constraint}] attribute.`,
          );
        } else {
          console.warn(
            `afova: Missing attribute [data-${constraint}] for the control with [id="${control.id}"]. Therefore only a fallback message will be used in case of a [${constraint}] constraint violation. It is recommended to define the violation message with the [data-${constraint}] attribute.`,
          );
        }
      }
    }
  }

  function _prepareControl(control: HTMLInputElement): void {
    _ensureId(control);
    _findAndPrepareContext(control);
    control.classList.add("afova-control");
    if (settings.validateOnChange) {
      control.addEventListener("change", _controlChangeListener);
    }
    _warnMissingMessage(control as HTMLInputElement);
  }

  async function _controlChangeListener(event: Event): Promise<void> {
    const valid = await _validateControl(event.target as HTMLInputElement);
    if (!valid) {
      (event.target as HTMLInputElement).focus();
    }
  }

  function _unprepareControl(control: HTMLInputElement): void {
    control.classList.remove("afova-control");
    control.removeEventListener("change", _controlChangeListener);
  }

  /**
   * Find the wrapping afova context for a form control by searching the parents.
   * The context must be a label or a container with the CSS class afova-context assigned.
   * @param control the form control to start from
   * @returns the wrapping context or undefined
   */
  function _findAndPrepareContext(
    control: HTMLInputElement,
  ): HTMLElement | undefined {
    let context = control.closest(".afova-context") as HTMLElement;

    if (!context) {
      context = control.closest("label") as HTMLElement;
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

    return context || undefined;
  }

  /**
   * Multiple controls might be wrapped into an afova group,
   * which must have the afova-group CSS class assigned.
   * The constraint messages of all wrapped controls will be shown
   * directly before the group. A group can be useful when controls are
   * part of a fieldset. E.g., in such a case the afova-group CSS class
   * can be assigned to the fieldset element.
   * @param control
   * @returns the element that is wrapping the controls or undefined, if none exists
   */
  function _findAndPrepareGroup(
    control: HTMLInputElement,
  ): HTMLElement | undefined {
    const group = control.closest(".afova-group") as HTMLElement;
    if (group) {
      _ensureId(group);
    }
    return group || undefined;
  }

  let settings = Object.assign({}, DEFAULT_SETTINGS, options);
  _prepareForms();

  return {
    clear: () => _unprepareForms(),
  };
}
