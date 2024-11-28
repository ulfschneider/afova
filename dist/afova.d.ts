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
    unprepare: () => void;
};
export default _default;
