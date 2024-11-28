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
/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options setting sfor afova, optional
 */
export declare function createAfova(options?: AfovaSettings): {
    /**
     * Will remove the settings that have been made by afova when call init.
     */
    clear: () => void;
    /**
    * Trigger the validation. This is in most cases not required, as afova will trigger
     the validation automatically when submitting a form.
    */
    validate: () => void;
    /**
     * Verify if any of forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => boolean;
};
