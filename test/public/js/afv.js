/**
 * Accessible Form Validation (AFV)
 * 
 * AFV is leveraging the Constraint Validation API to do client-side form validation. Please refer to:
 * 
 * - https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
 * - https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 * 
 * 
 * ## Usage
 * 
 * Put the script afv.min.js into your HTML page head:
 * ```html
 * <head>
 * …
 * <script defer src="/js/afv.min.js"</script>
 * …
 * </head>
 * ```
 * 
 * Initialize AFV
 * ```html
 * <script>
 * addEventListener('DOMContentLoaded', () => AFV.init());;
 * </script>
 * ```
 * 
 * AFV offers the following methods:
 */
AFV = (function () {
    'use strict';
    let settings;
    let idCounter = 0;
    let messageContainerTemplate, messageTemplate;


    //they keys of this map correspond to the property names the validity object
    let messages = new Map([
        ['badInput', { message: 'The input cannot be processed' }],
        ['customError', { message: '' }],
        ['patternMismatch', { message: 'The value does not match the required pattern of {{constraint}}', constraintAttr: 'pattern' }],
        ['rangeOverflow', { message: 'The number is too big. It cannot be bigger than {{constraint}}.', constraintAttr: 'max' }],
        ['rangeUnderflow', { message: 'The number is too small. It must be at least {{constraint}}.', constraintAttr: 'min' }],
        ['stepMismatch', { message: 'The number is not evenly divisible by {{constraint}}', constraintAttr: 'step' }],
        ['stepMismatch[1]', { message: 'The number must be an integer', constraintAttr: 'step' }],
        ['tooLong', { message: 'The text is too long. It cannot be longer than {{constraint}} characters.', constraintAttr: 'maxlength' }],
        ['tooShort', { message: 'The text is too short. It must me at least {{constraint}} characters long.', constraintAttr: 'minlength' }],
        ['typeMismatch', { message: 'The value must be of type {{constraint}}', constraintAttr: 'type' }],
        ['typeMismatch[email]', { message: 'The value must be an email in the format mickey@mouse.com', constraintAttr: 'type' }],
        ['typeMismatch[url]', { message: 'The value must be a URL in the format http://url.com', constraintAttr: 'type' }],
        ['typeMismatch[tel]', { message: 'The value must be a phone number', constraintAttr: 'type' }],
        ['valid', { message: '', }],
        ['valueMissing', { message: 'Please provide a value', constraintAttr: 'required' }]
    ]);

    function prepareTemplates() {
        messageContainerTemplate = document.createElement('div');
        messageContainerTemplate.classList.add('afv-message-container');
        messageTemplate = document.createElement('div');
        messageTemplate.classList.add('afv-message');
    }

    function getValidationMessage(messageType, field) {
        if (messageType != 'customError') {
            let defaultMessage = messages.get(messageType);

            if (defaultMessage) {
                let message = defaultMessage.message;
                let constraintAttr = defaultMessage.constraintAttr;

                if (field) {
                    let constraint = field.getAttribute(constraintAttr);
                    message = field.dataset[messageType] || message;
                    if (constraint) {
                        defaultMessage = messages.get(`${messageType}[${constraint.toLowerCase()}]`)
                        if (defaultMessage) {
                            message = field.dataset[messageType] || defaultMessage.message;
                        }
                        message = message.replaceAll('{{constraint}}', constraint)
                    }
                }
                return message;
            }
        } else if (field) {
            return field.validationMessage;
        } else {
            throw Error('No field defined to determine customError message');
        }
    }

    function getMessageTypes() {
        return messages.keys();
    }

    function extractSettings(options = { focusOnFirstError: true, validateOnChange: false }) {
        settings = Object.assign({}, options);
        console.log(`afv settings \n${JSON.stringify(settings, null, 4)}`);
    }

    function ensureId(identifier) {
        if (identifier && !identifier.id) {
            identifier.id = `afv-${idCounter++}`;
        }
        return identifier;
    }

    function getField(identifier) {
        if (typeof identifier === 'string' || identifier instanceof String) {
            //assume field describes an id
            let element = document.querySelector(`${identifier}`);
            if (!element) {
                throw Error(`The field with identifier=${identifier} could not be found`);
            }
            identifier = element;
        }

        return ensureId(identifier);
    }

    function cloneMessageContainerTemplate(field) {
        let innerGroup = getInnerGroup(field);
        let container = messageContainerTemplate.cloneNode(true);
        container.id = `${innerGroup ? innerGroup.id : field.id}:afv`;
        return container;
    }

    function cloneMessageTemplate(field, id) {
        let innerGroup = getInnerGroup(field);
        let container = document.querySelector(`#${innerGroup ? innerGroup.id : field.id}\\:afv`);
        let message = messageTemplate.cloneNode(true);
        message.id = id ? id : `${field.id}:afv-${container ? container.childElementCount : 0}`;
        message.dataset.fieldId = field.id;
        return message;
    }

    function putMessage(field, message) {

        //innerGroup is useful for radio groups (radio inputs with all the same name)
        //and display the message above all of them
        let innerGroup = getInnerGroup(field);
        let parent = innerGroup ? innerGroup.parentNode : field.parentNode;
        let newContainer = false;

        let container = document.querySelector(`#${innerGroup ? innerGroup.id : field.id}\\:afv`);
        if (!container) {
            newContainer = true;
            container = cloneMessageContainerTemplate(field);
        }

        let firstInjectedMessage = container.querySelector('.injected');
        if (message.classList.contains('injected') || !firstInjectedMessage) {
            //add injected messages to the bottom of the message list
            //if no injected message exist, add the derived message also 
            //to the bottom of the message list
            container.appendChild(message);
        } else {
            //insert derived messages before the first injected message
            container.insertBefore(message, firstInjectedMessage);
        }

        if (newContainer) {
            parent.insertBefore(container, innerGroup || field);
        }

        return container.id;
    }

    function hasMessage(parent) {
        return parent.querySelectorAll('.afv-message').length;
    }

    function getInnerGroup(field) {
        let innerGroup = field.closest('.afv-inner-group');
        return ensureId(innerGroup);
    }

    function getGroup(field) {
        let group = field.closest('.afv-group');
        return ensureId(group);
    }

    function isValidatedRadioGroup(field) {
        let name = field.name;
        let container = field.form || document;
        let type = field.type;

        if (type == 'radio' && name) {
            let group = container.querySelectorAll(`input[name="${name}"][type="radio"]`);
            for (let radio of group) {
                if (radio.id != field.id) {
                    //that means the radio group is already been validated
                    return true;
                } else {
                    //that means the radio group needs to be validated
                    return false;
                }
            }
        }
        return false;
    }

    function clearIfNoMessage(field) {
        let innerGroup = getInnerGroup(field);
        let parent = innerGroup ? innerGroup.parentNode : field.parentNode;
        let group = getGroup(field);

        if (!hasMessage(parent)) {
            if (group) {
                group.classList.remove('afv-active');
            }
            field.classList.remove('afv-field', 'afv-active');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-errormessage');
            let messageContainer = parent.querySelector(`#${innerGroup ? innerGroup.id : field.id}\\:afv`);
            if (messageContainer) {
                messageContainer.remove();
            }
        }
    }

    function clearValidationMessage(identifier, injected) {
        let field = getField(identifier);

        let fieldId = field.dataset.fieldId;
        if (fieldId && field.classList.contains('afv-active')) {
            //field indicates an error message element
            //therefore that single error message will be removed
            field.remove();
            field = getField(fieldId); //now we have a field and not a message
        } else {
            //field really indicates a field
            let innerGroup = getInnerGroup(field);
            let parent = innerGroup ? innerGroup.parentNode : field.parentNode;
            //remove error messages
            //depending on the value of the injected parameter
            //choose to remove only injected or only derived messages
            parent.querySelectorAll(`[id^=${field.id}\\:afv]${injected ? '.injected' : '.derived'}`)
                .forEach(function (element) {
                    element.remove();
                });
        }

        //if no message is left, remove all error message indications
        clearIfNoMessage(field);
    }

    function createInjectMessageElement(field, message, messageId) {
        let messageElement = cloneMessageTemplate(field, messageId);
        messageElement.classList.add('injected');
        messageelement.innerHTML = message;
        return messageElement;
    }

    function createDeriveMessageElement(field) {
        let validity = field.validity;
        let messageElement = cloneMessageTemplate(field);
        messageElement.classList.add('derived');

        if (validity.valueMissing && isValidatedRadioGroup(field)) {
            //the radio group has already been validated
            //in this case no errormessage is created
            return;
        }

        for (let messageType of getMessageTypes()) {
            if (validity[messageType]) {
                //there is an error of type messageType                  
                let message = getValidationMessage(messageType, field);
                if (message) {
                    messageElement.innerHTML = message;
                }
            }
        }
        if (!messageElement.innerHTML) {
            messageElement.innerHTML = field.dataset.errorInvalid || 'The value is not correct';
        }
        return messageElement;
    }

    function prepareValidationMessage(field, options = { message: undefined, messageId: undefined }) {
        if (options.message) {
            return createInjectMessageElement(field, options.message, options.messageId);
        } else {
            return createDeriveMessageElement(field);
        }
    }


    function setValidationMessage(identifier, options = { message: undefined, messageId: undefined, focus: false }) {
        let field = getField(identifier);
        let group = getGroup(field);

        if (group) {
            group.classList.add('afv-active');
        }
        field.classList.add('afv-field', 'afv-active');

        let messageElement = prepareValidationMessage(field, options);
        if (messageElement) {
            //the container holds all error messages for the field
            let containerId = putMessage(field, messageElement);

            field.setAttribute('aria-errormessage', containerId);
            field.setAttribute('aria-invalid', 'true');

            if (options.focus) {
                field.focus();
            }

            //messageElement.id is the id of the message that has been created
            return messageElement.id;
        }
    }

    function validateField(field, focus) {
        focus = focus || false;

        clearValidationMessage(field);
        if (!field.validity.valid) {
            setValidationMessage(field, { focus: focus });
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
            if (settings.focusOnFirstError) {
                firstError.focus();
            }
        }
    }

    function adjustForms() {
        let forms = document.querySelectorAll('form');

        forms.forEach(function (form) {
            form.setAttribute('novalidate', '');
            form.addEventListener('submit', validateForm);
            if (settings.validateOnChange) {
                for (let field of form.elements) {
                    field.addEventListener('change', function (event) {
                        validateField(event.target, true); // validate the field on change and focus if invalid
                    });
                }
            }
        });
    }

    return {
        /**
         * Initialize AFV. Sample call:
         * ```js
         * AFV.init({focusOnFirstError: true, validateOnChange: false});
         * ```
         * The script will iterate through all forms on a web page and deactivate browser validation 
         * in favor of AFV. The form validation will occur on submit of a form and on change of a field.
         * All errors that can be checked with the Constraint Validation API are validated by AFV. 
         * If the default error messages from AFV shouldn´t be used, custom error messages 
         * can be defined as `data` attributes for each field. For example:
         * ```html
         * <div class="afv-group">
         *     <label for="custom-pattern-input">A pattern input with custom failure message</label>
         *     <div>Please provide a string that contains any mix of A-Z or a-z and has a length of 3 charactes.</div>
         *     <input id="custom-pattern-input" type="text" 
         *     pattern="[A-Za-z]{3}" 
         *     data-pattern-mismatch="The value is not in the correct format. Correct formats are AbC or xyz for example.">
         *  </div>
         * ```
         * The following attributes are available to define validation error messages:
         * <dl>
         * <dt>data-bad-input</dt>
         * <dd>The browser is unable to handle the input value</dd>
         * 
         * <dt>data-pattern-mismatch</dt>
         * <dd>The value of a field doesn´t comply to the pattern of the <code>pattern</code> attribute</dd>
         * 
         * <dt>data-range-overflow</dt>
         * <dd>The value of a field is bigger than the value of the <code>max</code> attribute</dd>
         * 
         * <dt>data-range-underflow</dt>
         * <dd>The value of a field is smaller than the value of the <code>min</code> attribute</dd>
         * 
         * <dt>data-step-mismatch</dt>
         * <dd>The value of field is not evenly divisable by the value of the <code>step</code> attribute</dd>
         * 
         * <dt>data-too-long</dt>
         * <dd>The value of a field has more characters than defined by the attribute <code>maxlength</code></dd>
         * 
         * <dt>data-too-short</dt>
         * <dd>The value of a field has less characters than defined by the attribute <code>minlength</code></dd>
         * 
         * <dt>data-type-mismatch</dt>
         * <dd>The value of a field dosn´t comply to the type of the <code>type</code> attribute</dd>
         * 
         * <dt>data-value-missing</dd>
         * <dd>A value of a field that is required due to the <code>required</code> attribute is missing</dd>
         * </dl>
         * 
         * Messages that can be derived from the HTML data attributes, like above, will have the CSS class `derived` assigned to them.
         *  
         * @param {Object} [options] - The settings for AFV
         * @param {boolean} [options.focusOnFirstError] - If true, the first errored field will be focused. If false, the first errored field will not receive focus. 
         * @param {boolean} [options.validateOnChange] - If true, each field will be validate on its change without waiting for a form submit. If false the validation will only occurr on submit of the form.
         */
        init: function (options = { focusOnFirstError: true, validateOnChange: false }) {
            prepareTemplates();
            extractSettings(options);
            adjustForms();
        },
        /**
         * Inject a message and bind it to a form element. Injected messages will have the CSS class `injected` assigned to them.
         * Typically it shouldn´t be necessary to inject a message for anything that can be solved with the derived messages (see the init() method above).
         * Sample call:
         * ```js
         * AFV.injectMessage('requiredInput', 'You provided a value but the value is not correct'); 
         * ```
         * 
         * @param {Element|string} identifier - Identify the form element for which the error message should be set. If the parameter is a string, it will be interpreted as the id of the form element.
         * @param {string} message - The message to set.
         * @param {Object} options
         * @param {string} [options.messageId] - The id for the message. If this id is not provided, a new id will be generated.
         * @param {boolean} [options.focus] - If true the focus will be set to the field.
         * @returns {string} - The id of the injected message and undefined if no message was set.
         */
        injectMessage: function (identifier, message, options = { messageId: undefined, focus: false }) {
            options.message = message;
            return setValidationMessage(identifier, options);
        },
        /**
         * Remove all injected messages that are linked to a form element, or remove a message that is identified by its id.
         * Sample call:
         * ```js
         * AFV.clearMessage('requiredInput check3');
         * //will clear all injected messages for the form elements that have the id´s requiredInput and check3
         * 
         * AFV.clearMessage('requiredInput', 'check3');
         * //this call is equivalent to the previous one
         * ```
         * @param {...Element|string} identifier <ul><li>If identifier is a form element, all injected error messages of that form element will be removed.</li>
         * <li>If identifier is a string that contains the id of a form element, all injected error messages of that form element will be removed.</li>
         * <li>If identifier is a string that contains the id of a message, that message will be removed.</li>
         * <li>If identifier is a string that contains a list of id´s, separated by space or comma, messages will be cleared for those id´s by applying the same rules as for a single id</li>
         * <li>You might also provide a comma-separated list of identifiers (spread/rest operator ...)</li>
         * </ul>
         */
        clearMessage: function (...identifier) {
            for (let ident of identifier) {
                if (typeof ident === 'string' || ident instanceof String) {
                    let idList = ident.split(/[ ,]+/);
                    for (let id of idList) {
                        clearValidationMessage(id, true);
                    }
                } else {
                    clearValidationMessage(ident, true);
                }
            }
        },
        getMessage: function (messageType, identifier) {
            return getValidationMessage(messageType, getField(identifier));
        }
    }
})();

