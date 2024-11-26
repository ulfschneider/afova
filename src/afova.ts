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

enum ConstraintAttributes {
  min = "min",
  max = "max",
  step = "step",
  minlength = "minlength",
  maxlength = "maxlength",
  pattern = "pattern",
  type = "type",
}

const DEFAULT_SETTINGS: AfovaSettings = {
  selector: "",
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

  private setOptions(options?: AfovaSettings) {
    this.settings = Object.assign(this.settings, options);
  }

  /**
   * Ensure the given element has an id
   * @param element
   */
  private ensureId(element: Element) {
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
        message = control.dataset[constraint] || message;
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

  private putMessage(control: HTMLObjectElement) {
    const messageContainer = this.ensureAndGetMessageContainer(control);

    const validity = control.validity;
    const messageElement = document.createElement("li");
    messageElement.classList.add("afova-derived-message");
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

  private clearControlMessages(control: HTMLObjectElement) {
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
      context.classList.remove("afova-active");
    }
  }

  private setControlMessage(control: HTMLObjectElement, focus?: boolean) {
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

  private validateForm(form: HTMLFormElement, event?: Event) {
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

  private resetForm(form: HTMLFormElement) {
    for (let control of this.getFormElements(form)) {
      this.clearControlMessages(control);
    }
  }

  /**
   * Will prepare all forms by ensuring the forms each have an id asssigned and
   * the attribute novalidate assigned to it. Will also prepare all controls contained in each form.
   */
  private prepareForms() {
    let selector = "form";
    if (this.settings.selector) {
      selector = `form${this.settings.selector}, ${this.settings.selector} form`;
    }

    const forms = document.querySelectorAll(selector);
    for (const form of forms) {
      //switch off default browser form validation
      form.setAttribute("novalidate", "");

      this.ensureId(form);

      form.addEventListener("submit", (event: Event) => {
        if (event.target) {
          this.validateForm(event.target as HTMLFormElement, event);
        }
      });
      form.addEventListener("reset", (event: Event) => {
        if (event.target) {
          this.resetForm(event.target as HTMLFormElement);
        }
      });
      for (const control of this.getFormElements(form as HTMLFormElement)) {
        this.prepareControl(control);
      }
    }
  }

  /**
   * Prepare the form control by ensuring an id and assigning the CSS class afova-control.
   * Will adjust textual descriptions within the control´s afova context and assign an event handler
   * in case the afova settings have set validateOnChange to true
   * @param control the control to prepare
   */
  private prepareControl(control: HTMLObjectElement) {
    this.ensureId(control);
    control.classList.add("afova-control");
    if (this.settings.validateOnChange) {
      control.addEventListener("change", (event: Event) => {
        // validate the field on change and focus on the field if it is invalid
        this.validateControl(event.target as HTMLObjectElement, true);
      });
    }

    const context = this.getContext(control);
    if (context) {
      //additional descriptions that can stand anywhere in the contextg
      //will get trimmed to contain the concrete constraint value
      //e.g., the following text anywhere placed in the context:  <div class="description">The text must be at least {{ minlength }} characters of length</div>
      //will be transformed into <div class="description">The text must be at least 3 characters of length</div>
      //if the associated input constraint is defined as <input type="text" minlength="3">
      for (const constraint in ConstraintAttributes) {
        const constraintValue = control.getAttribute(constraint);
        if (constraintValue) {
          const regex = new RegExp(`\{\{\\s*${constraint}\\s*\}\}`, "ig");
          context.innerHTML = context.innerHTML.replace(regex, constraintValue);
        }
      }
    }
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
      }
    }

    return context;
  }

  /**
   * Prepare afova to be ready to validate
   */
  prepare(options?: AfovaSettings) {
    this.setOptions(options);
    this.prepareForms();
  }
}

export default (function () {
  const afova = new Afova();
  return {
    prepare: (options?: AfovaSettings) => afova.prepare(options),
  };
})();
