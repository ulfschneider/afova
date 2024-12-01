export interface AfovaSettings {
    selector?: string;
    validateOnChange?: boolean;
    focusOnFirstError?: boolean;
}
declare const INPUT_TYPES: readonly ["text", "email", "datetime-local", "file", "image", "month", "number", "password", "range", "search", "tel", "time", "url", "week"];
declare const CONSTRAINTS: readonly ["required", "pattern", "max", "min", "step", "maxlength", "minlength", "type"];
declare const CONSTRAINT_VIOLATIONS: readonly ["badInput", "customError", "patternMismatch", "rangeOverflow", "rangeUnderflow", "stepMismatch", "tooLong", "tooShort", "typeMismatch", "valueMissing"];
export type InputType = (typeof INPUT_TYPES)[number];
export type Constraint = (typeof CONSTRAINTS)[number];
export type ConstraintViolation = (typeof CONSTRAINT_VIOLATIONS)[number];
export interface ConstraintViolationMessage extends Record<InputType, string> {
    message: string;
    constraint?: Constraint;
}
export type AfovaConstraintViolationMessages = Record<ConstraintViolation, ConstraintViolationMessage>;
export interface AfovaI18NConstraintViolationMessages {
    [key: string]: AfovaConstraintViolationMessages;
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
export {};
