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
/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export declare function afova(options?: AfovaSettings): AfovaObject;
