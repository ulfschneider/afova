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
     * Callback for submitting the form after successful validation. When this callback is defined, the default form submit behaviour is prevented.
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
    /**
     * Will be called during validation for each input element and can be used to set custom messages with control.setCustomValidity().
     * Will only be called when all constraints of the inpout element are fulfilled.
     * @param control the input element that is validated
     */
    onValidateControl?: (control: HTMLInputElement) => void;
}
export interface AfovaObject {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => void;
    /**
     * check the validity of the given form
     * @param form the form to get the valid state for. When the form is not provided it is checked if all of the forms addressed by the selector are valid.
     * @returns true if the form is (or all forms are) valid
     */
    isValid: (form?: HTMLFormElement) => boolean;
    /**
     * check the validity of the given form
     * @param form the form to get the invalid state for. When the form is not provided it is checked if any of the forms addressed by the selector is invalid.
     * @returns true if the form is (or any form) invalid
     */
    isInvalid: (form?: HTMLFormElement) => boolean;
    /**
     * Do the afova form validation and return whether the form is valid
     * @param form the form to check. When the form is not provided, all forms addressed by the selector are validated.
     * @returns true if the form is (or all forms are) valid
     */
    validate: (form?: HTMLFormElement) => boolean;
}
/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export declare function afova(options?: AfovaSettings): AfovaObject;
