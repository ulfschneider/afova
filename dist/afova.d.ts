export interface AfovaSettings {
    selector?: string;
    validateOnChange?: boolean;
    focusOnFirstError?: boolean;
}
export interface AfovaConstraintMessages {
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
export declare function afova(options?: AfovaSettings): {
    /**
     * Will remove all event listeners that have been added by afova and
     * take away the adjustments afova has introduced into the html.
     */
    clear: () => void;
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => void;
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => boolean;
};
