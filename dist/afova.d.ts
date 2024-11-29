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
export interface AfovaObject {
    clear: () => void;
    isInvalid: () => boolean;
    validate: () => void;
}
/**
 * Create an afova object and initialize it for forms that are identified by the selector given in the options.
 * Will register event listeners on the form and the input controls of the form.
 * @param options settings for afova, optional
 */
export declare function afova(options?: AfovaSettings): AfovaObject;
