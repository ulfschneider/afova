export interface AfovaSettings {
    /**
     * The selector that is used during construction to identify the forms to validate. Default is form.
     */
    selector?: string;
    /**
     * The optional selector that is used during construction for the form messages container. Default is .afova-form-message-container
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
     * It must return a promise.
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
/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export declare function afova(options?: AfovaSettings): AfovaObject;
