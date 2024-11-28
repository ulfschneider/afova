import { nanoid } from "nanoid";

export interface AfovaSettings {
  selector?: string;
  validateOnChange?: boolean;
  focusOnFirstError?: boolean;
}

export interface ConstraintMessages {
  [key: string]: {
    message: string;
    constraintAttr?: string;
  };
}
[];

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: "form",
  validateOnChange: false,
  focusOnFirstError: true,
};

const IGNORE_CONTROL_TYPES = ["submit", "reset", "button"];

class Afova {
  private settings: AfovaSettings = DEFAULT_SETTINGS;

  //the keys of the constraints correspond to the property names of the validity object
  private constraints: ConstraintMessages = {
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

  private setOptions(options?: AfovaSettings): void {
    if (options) {
      this.settings = Object.assign(this.settings, options);
    }
  }

  /**
   * Ensure the given element has an id
   * @param element
   */
  private ensureId(element: Element): void {
    if (!element.id) {
      element.id = `afova-${nanoid()}`;
    }
  }

  private findMessageContainer(control: HTMLObjectElement): Element | null {
    const messageContainer = document.querySelector(
      `#${control.id}-afova-message-container`,
    );
    return messageContainer;
  }

  private ensureAndGetMessageContainer(control: HTMLObjectElement): Element {
    let messageContainer = this.findMessageContainer(control);
    if (!messageContainer) {
      messageContainer = document.createElement("ul");
      control.parentNode?.insertBefore(messageContainer, control);
      messageContainer.id = `${control.id}-afova-message-container`;
      messageContainer.classList.add("afova-message-container");
      control.setAttribute("aria-errormessage", messageContainer.id);
    }

    return messageContainer;
  }

  deriveMessageText(constraint: string, control: HTMLObjectElement): string {
    if (constraint != "customError") {
      let derivedMessage = this.constraints[constraint];
      if (derivedMessage) {
        let message = derivedMessage.message;
        let constraintAttr = derivedMessage.constraintAttr;
        const constraintValue = control.getAttribute(constraintAttr || "");

        message = control.dataset[constraintAttr || constraint] || message;
        if (constraintValue) {
          derivedMessage =
            this.constraints[`${constraint}[${constraint.toLowerCase()}]`];
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

  private putMessage(control: HTMLObjectElement): void {
    const messageContainer = this.ensureAndGetMessageContainer(control);

    const validity = control.validity;
    const messageElement = document.createElement("li");
    messageElement.classList.add("afova-message");
    messageElement.classList.add("derived");
    messageContainer.appendChild(messageElement);

    for (const constraint of Object.keys(this.constraints)) {
      if ((validity as any)[constraint]) {
        //there is an error of type constraint
        let message = this.deriveMessageText(constraint, control);
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

  private clearControlMessages(control: HTMLObjectElement): void {
    control.classList.remove("active");
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
      context.classList.remove("active");
    }
  }

  private setControlMessage(control: HTMLObjectElement, focus?: boolean): void {
    const context = this.getContext(control);
    if (context) {
      context.classList.add("active");
    }
    control.classList.add("active");
    control.setAttribute("aria-invalid", "true");

    this.putMessage(control);

    if (focus) {
      control.focus();
    }
  }

  private validateControl(
    control: HTMLObjectElement,
    focus?: boolean,
  ): boolean {
    this.clearControlMessages(control);
    if (!control.validity.valid) {
      this.setControlMessage(control, focus);
    }
    return control.validity.valid;
  }

  private getFormElements(form: HTMLFormElement): HTMLObjectElement[] {
    const result: HTMLObjectElement[] = [];
    for (const control of form.elements) {
      if (!IGNORE_CONTROL_TYPES.includes((control as HTMLObjectElement).type)) {
        result.push(control as HTMLObjectElement);
      }
    }
    return result;
  }

  private validateForm(form: HTMLFormElement, event?: Event): void {
    let firstError: HTMLObjectElement | undefined;
    for (const control of this.getFormElements(form)) {
      const valid = this.validateControl(control);
      if (!firstError && !valid) {
        firstError = control;
      }
    }
    if (firstError) {
      event?.preventDefault();
      if (this.settings.focusOnFirstError) {
        firstError.focus();
      }
    }
  }

  private resetForm(form: HTMLFormElement): void {
    for (let control of this.getFormElements(form)) {
      this.clearControlMessages(control);
    }
  }

  /**
   * Will prepare all forms by ensuring the forms each have an id asssigned and
   * the attribute novalidate assigned to it. Will also prepare all controls contained in each form.
   */
  private prepareForms(): void {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      //switch off default browser form validation
      form.setAttribute("novalidate", "");

      this.ensureId(form);

      form.addEventListener("submit", this.formSubmitListener.bind(this));
      form.addEventListener("reset", this.formResetListener.bind(this));
      for (const control of this.getFormElements(form as HTMLFormElement)) {
        this.prepareControl(control);
      }
    }
  }

  private formSubmitListener(event: Event): void {
    this.validateForm(event.target as HTMLFormElement, event);
  }

  private formResetListener(event: Event): void {
    this.resetForm(event.target as HTMLFormElement);
  }

  private unprepareForms(): void {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      form.removeAttribute("novalidate");
      form.removeEventListener("submit", this.formSubmitListener);
      form.removeEventListener("reset", this.formResetListener);
      for (const control of this.getFormElements(form as HTMLFormElement)) {
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
  private prepareControl(control: HTMLObjectElement): void {
    this.ensureId(control);
    control.classList.add("afova-control");
    if (this.settings.validateOnChange) {
      control.addEventListener("change", this.controlChangeListener.bind(this));
    }
  }

  private controlChangeListener(event: Event): void {
    this.validateControl(event.target as HTMLObjectElement, true);
  }

  private unprepareControl(control: HTMLObjectElement): void {
    control.classList.remove("afova-control");
    control.removeEventListener("change", this.controlChangeListener);
  }

  /**
   * Find the wrapping afova context for a form control by searching the parents
   * The context must be a label or a container with CSS class afova-context assigned
   * @param control the form control to start from
   * @returns the wrapping context or null
   */
  private getContext(control: HTMLElement): Element | null {
    let context = control.closest(".afova-context");

    if (!context) {
      context = control.closest("label");
      if (context && !(context as HTMLLabelElement).htmlFor) {
        (context as HTMLLabelElement).htmlFor = control.id;
        context.classList.add("afova-context");
      }
    }

    return context;
  }

  init(options?: AfovaSettings): void {
    this.setOptions(options);
    this.prepareForms();
  }

  clear(): void {
    this.unprepareForms();
  }

  validate(): void {
    const forms = document.querySelectorAll(this.settings.selector || "form");
    for (const form of forms) {
      this.validateForm(form as HTMLFormElement);
    }
  }

  isInvalid(): boolean {
    let selector = "form";
    if (this.settings.selector) {
      selector = this.settings.selector;
    }
    const forms = document.querySelectorAll(selector);
    for (const form of forms) {
      if (!(form as HTMLFormElement).checkValidity()) {
        //form has invalid controls
        return true;
      }
    }

    return false;
  }
}

export default (function () {
  const afova = new Afova();
  return {
    /**
     * Initialize afova for forms that are identified by the selector given in the options.
     * Will register event listeners on the form and the input controls of the form.
     * @param options setting sfor afova, optional
     */
    init: (options?: AfovaSettings) => afova.init(options),

    /**
     * Will remove the settings that have been made by afova when call init.
     */
    clear: () => afova.clear(),

    /**
    * Trigger the validation. This is in most cases not required, as afova will trigger
     the validation automatically when submitting a form.
    */
    validate: () => afova.validate(),

    /**
     * Verify if any of forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => afova.isInvalid(),
  };
})();
