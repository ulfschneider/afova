/**
 * Accessible Form Validation (AFV)
 * https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
 * https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 */
AFV = (function () {
    'use strict';
    let idCounter = 0;
    let focusOnFirstError = true; //if true the first error will be focused
    let errorMessageTemplate = document.createElement('div');
    errorMessageTemplate.className = 'afv-error-message';

    //they keys of this map correspond to the property names the validity object
    let defaultErrorMessages = new Map([
        ['badInput', { message: 'The browser is unable to handle that value' }],
        ['customError', { message: ':-(' }],
        ['patternMismatch', { message: 'The value does not match the required pattern of {{constraint}}', constraintAttr: 'pattern' }],
        ['rangeOverflow', { message: 'The number is too big. It cannot be bigger than {{constraint}}.', constraintAttr: 'max' }],
        ['rangeUnderflow', { message: 'The number is too small. It must be at least {{constraint}}.', constraintAttr: 'min' }],
        ['stepMismatch', { message: 'The number is not evenly divisible by {{constraint}}', constraintAttr: 'step' }],
        ['tooLong', { message: 'The text is too long. It cannot be longer than {{constraint}} characters.', constraintAttr: 'maxlength' }],
        ['tooShort', { message: 'The text is too short. It must me at least {{constraint}} characters long.', constraintAttr: 'minlength' }],
        ['typeMismatch', { message: 'The value must be a {{constraint}}', constraintAttr: 'type' }],
        ['valid', { message: ':-)', }],
        ['valueMissing', { message: 'Please provide a value', constraintAttr: 'required' }]
    ]);

    function getDefaultErrorMessage(errorType) {
        return defaultErrorMessages.get(errorType);
    }

    function getErrorTypes() {
        return defaultErrorMessages.keys();
    }

    function getGroup(field) {
        let parent = field.parentNode;
        while (parent) {
            if (parent.classList && parent.classList.contains('afv-group')) {
                return parent;
            }
            parent = parent.parentNode;
        }
    }

    function clearErrorMessage(field) {
        let parent = field.parentNode;
        let group = getGroup(field);

        if (group) {
            group.classList.remove('afv-error-group');
        }
        field.classList.remove('afv-error-field');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-errormessage');

        parent.querySelectorAll(`#${field.id}-afv-error`)
            .forEach(function (element) {        
                parent.removeChild(element);
            });
    }

    function defineErrorMessage(field) {
        let validity = field.validity;
        let errorMessage = errorMessageTemplate.cloneNode(true);
        let errorMessageId = `${field.id}-afv-error`;
        errorMessage.id = errorMessageId;

        for (let errorType of getErrorTypes()) {
            if (validity[errorType]) { //there is an error of type errorType
                let defaultMessage = getDefaultErrorMessage(errorType);

                errorMessage.innerText = field.dataset[errorType] || defaultMessage.message;

                if (defaultMessage.constraintAttr) {
                    let constraint = field.getAttribute(defaultMessage.constraintAttr);
                    if (constraint) {
                        errorMessage.innerText = errorMessage.innerText.replaceAll('{{constraint}}', constraint);
                    }
                }
            }
        }

        if (!errorMessage.innerText) {
            errorMessage.innerText = field.dataset.errorInvalid || 'The value is not correct';
        }
        return errorMessage;
    }

    function setErrorMessage(field, refocus) {
        let parent = field.parentNode;
        let group = getGroup(field);


        if (group) {
            group.classList.add('afv-error-group');
        }
        field.classList.add('afv-error-field');

        let errorMessage = defineErrorMessage(field);

        parent.insertBefore(errorMessage, field);

        field.setAttribute('aria-errormessage', errorMessage.id);
        field.setAttribute('aria-invalid', 'true');

        if (refocus) {
            field.focus();
        }
    }

    function validateField(field, refocus) {
        refocus = refocus || false;

        if (!field.id) {
            field.id = `afv-${idCounter++}`;
        }

        clearErrorMessage(field);
        if (!field.validity.valid) {
            setErrorMessage(field, refocus);
        }

        return field.validity.valid;
    }

    function validateForm(event) {
        let form = event.target;
        let firstError;
        for (let field of form.elements) {
            let valid = validateField(field, false);
            if (!firstError && !valid) {
                firstError = field;
            }
        }
        if (firstError) {
            event.preventDefault();
            if (focusOnFirstError) {
                firstError.focus();
            }
        }
    }

    function adjustForms() {
        let forms = document.querySelectorAll('form');

        forms.forEach(function (form) {
            form.setAttribute('novalidate', '');
            form.addEventListener('submit', validateForm);
            for (let field of form.elements) {
                field.addEventListener('change', function (event) {
                    validateField(event.target, true); // validate the field on change and refocus if invalid
                })
            }
        });
    }

    return {
        /**
         * Initialize afv.
         * The script will iterate through all forms on a web page and deactivate browser validation 
         * in favor of afv. The form validation will occur on submit of a form and on change of a field.
         * All errors that can be checked with the Constraint Validation API are validated by afv. 
         * If the default error messages from afv shouldn´t be used, custom error messages 
         * can be defined as <code>data</code> attributes for each field. For example:
         * <pre><code>
         * <div class="group">
         *     <label for="customPatternInput">A pattern input with custom failure message</label>
         *     <div>Please provide a string that contains any mix of A-Z or a-z and has a length of 3 charactes.</div>
         *     <input id="customPatternInput" type="text" 
         *     pattern="[A-Za-z]{3}" 
         *     data-pattern-mismatch="The value is not in the correct format. Correct formats are AbC or xyz for example.">
         *  </div>
         * </code></pre>
         * The following <code>data</code> attribute are available to define custom validation error messages:
         * <dl>
         * <dt>data-bad-input</dt>
         * <dd>The browser is unable to handle the input value</dd>
         * <dt>data-pattern-mismatch</dt>
         * <dd>The value of a field doesn´t comply to the pattern of the <code>pattern</code> attribute</dd>
         * <dt>data-range-overflow</dt>
         * <dd>The value of a field is bigger than the value of the <code>max</code> attribute</dd>
         * <dt>data-range-underflow</dt>
         * <dd>The value of a field is smaller than the value of the <code>min</code> attribute</dd>
         * <dt>data-step-mismatch</dt>
         * <dd></dd>
         * <dt>data-too-long</dt>
         * <dd>The value of a field has more characters than defined by the attribute <code>maxlength</code></dd>
         * <dt>data-too-short</dt>
         * <dd>The value of a field has less characters than defined by the attribute <code>minlength</code></dd>
         * <dt>data-type-mismatch</dt>
         * <dd>The value of a field dosn´t comply to the type of the <code>type</code> attribute</dd>
         * <dt>data-value-missing</dt>
         * <dd>A value of a field that is required due to the <code>required</code> attribute is missing</dd>
         * </dl>
         *  
         * @param {boolean} focus - optional: If false, the first errored field will not be focused. If true, the first errored field will receive focus. Default is true.
         */
        init: function (focus = true) {
            focusOnFirstError = focus;
            adjustForms();
        }
    }

})();