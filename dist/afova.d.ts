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
declare const _default: {
    prepare: (options?: AfovaSettings) => void;
    clear: () => void;
    validate: () => void;
    isInvalid: () => boolean;
};
export default _default;
