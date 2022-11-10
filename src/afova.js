/**
 * Accessible Form Validation (afova)
 * 
 * afova is leveraging the Constraint Validation API to do client-side form validation. Please refer to:
 * 
 * - https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation
 * - https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation
 * 
 * 
 * ## Usage
 * 
 * Put the script afova.min.js into your HTML page head:
 * ```html
 * <head>
 * …
 * <script defer src="/js/afova.min.js"</script>
 * …
 * </head>
 * ```
 * 
 * Initialize afova
 * ```html
 * <script>
 * addEventListener('DOMContentLoaded', () => afova.init());;
 * </script>
 * ```
 * 
 * afova offers the following methods:
 */
afova = (function () {
    'use strict';
    let settings;
    let idCounter = 0;
    let duplicateFieldIds = new Set();
    let messageContainerTemplate, messageTemplate;
    const CONSTRAINT_ATTRIBUTES = ['min', 'max', 'step', 'minlength', 'maxlength', 'pattern', 'type'];


    //they keys of this map correspond to the property names the validity object
    let messages = new Map([
        ['badInput', { message: 'The input cannot be processed' }],
        ['customError', { message: '' }],
        ['patternMismatch', { message: 'The value does not match the required pattern of {{constraint}}', constraintAttr: 'pattern' }],
        ['rangeOverflow', { message: 'The value is too big. It cannot be bigger than {{constraint}}.', constraintAttr: 'max' }],
        ['rangeUnderflow', { message: 'The value is too small. It must be at least {{constraint}}.', constraintAttr: 'min' }],
        ['stepMismatch', { message: 'The value is not in within the correct step interval of {{constraint}}', constraintAttr: 'step' }],
        ['tooLong', { message: 'The value is too long. It cannot be longer than {{constraint}} characters.', constraintAttr: 'maxlength' }],
        ['tooShort', { message: 'The value is too short. It must be at least {{constraint}} characters long.', constraintAttr: 'minlength' }],
        ['typeMismatch', { message: 'The value must be of type {{constraint}}', constraintAttr: 'type' }],
        ['typeMismatch[email]', { message: 'The value must be an email in the format mickey@mouse.com', constraintAttr: 'type' }],
        ['typeMismatch[url]', { message: 'The value must be a URL in the format http://url.com', constraintAttr: 'type' }],
        ['typeMismatch[tel]', { message: 'The value must be a phone number', constraintAttr: 'type' }],
        ['valid', { message: '', }],
        ['valueMissing', { message: 'Please provide a value', constraintAttr: 'required' }]
    ]);

    function actionForIdentifiers(action, identifiers) {
        for (let ident of identifiers) {
            if (typeof ident === 'string' || ident instanceof String) {
                let idList = ident.split(/[ ,]+/);
                for (let id of idList) {
                    action(id);
                }
            } else {
                action(ident);
            }
        }
    }

    function prepareTemplates() {
        messageContainerTemplate = document.createElement('div');
        messageContainerTemplate.classList.add('afova-message-container');
        messageTemplate = document.createElement('div');
        messageTemplate.classList.add('afova-message');
    }

    function getValidationMessageTypes() {
        return [...messages.keys()];
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
                        message = message.replace(/\{\{constraint\}\}/ig, constraint)
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

    function extractSettings(options = { focusOnFirstError: true, validateOnChange: false }) {
        settings = Object.assign({}, options);
        console.log(`afova settings \n${JSON.stringify(settings, null, 4)}`);
    }

    function ensureId(identifier) {
        if (identifier && !identifier.id) {
            identifier.id = `afova-${idCounter++}`;
        }
        return identifier;
    }

    function getElement(identifier) {
        if (typeof identifier === 'string' || identifier instanceof String) {
            //assume identifier describes an id

            let transformedIdentifier = identifier.startsWith('#') ? identifier : `#${identifier}`;
            let element = document.querySelector(transformedIdentifier);
            if (!element) {
                throw Error(`The element with identifier=${transformedIdentifier} could not be found`);
            }
            identifier = element;
        }
        return identifier;
    }

    function getField(identifier) {
        let field = getElement(identifier);
        return ensureId(field);
    }

    function cloneMessageContainerTemplate(field) {
        let innerGroup = getInnerGroup(field);
        let messageContainer = messageContainerTemplate.cloneNode(true);
        messageContainer.id = `${innerGroup ? innerGroup.id : field.id}:afova`;
        return messageContainer;
    }

    function cloneMessageTemplate(field, id) {
        let innerGroup = getInnerGroup(field);
        let messageContainer = document.querySelector(`#${innerGroup ? innerGroup.id : field.id}\\:afova`);
        let message = messageTemplate.cloneNode(true);
        message.id = id ? id : `${field.id}:afova-${messageContainer ? messageContainer.childElementCount : 0}`;
        message.dataset.fieldId = field.id;
        return message;
    }

    function replaceConstraintAttributes(field) {
        let group = getGroup(field);
        field.classList.add('afova-field');
        if (group) {
            let constraintValues = new Map();
            for (let constraint of CONSTRAINT_ATTRIBUTES) {
                let constraintValue = field.getAttribute(constraint);
                if (constraintValue) {
                    constraintValues.set(constraint, constraintValue);
                }
            }
            let html = group.innerHTML;
            for (let constraint of constraintValues.entries()) {
                let regex = new RegExp(`\{\{${constraint[0]}\}\}`, 'ig');
                html = html.replaceAll(regex, constraint[1]);
            }
            group.innerHTML = html;
        }
    }

    function putMessage(field, message) {

        //innerGroup is useful for radio groups (radio inputs with all the same name)
        //and display the message above all of them
        let innerGroup = getInnerGroup(field);
        let parent = innerGroup ? innerGroup.parentNode : field.parentNode;
        let newContainer = false;

        let messageContainer = document.querySelector(`#${innerGroup ? innerGroup.id : field.id}\\:afova`);
        if (!messageContainer) {
            newContainer = true;
            messageContainer = cloneMessageContainerTemplate(field);
        }

        let firstInjectedMessage = messageContainer.querySelector('.injected');
        if (message.classList.contains('injected') || !firstInjectedMessage) {
            //add injected messages to the bottom of the message list
            //if no injected message exist, add the derived message also 
            //to the bottom of the message list
            messageContainer.appendChild(message);
        } else {
            //insert derived messages before the first injected message
            messageContainer.insertBefore(message, firstInjectedMessage);
        }

        if (newContainer) {
            parent.insertBefore(messageContainer, innerGroup || field);
        }

        return messageContainer.id;
    }

    function hasMessage(parent) {
        return parent && parent.querySelectorAll('.afova-message').length;
    }

    function getInnerGroup(field) {
        let innerGroup = field.closest('.afova-inner-group');
        return ensureId(innerGroup);
    }

    function getMessageContainer(field) {
        return document.querySelector(`#${field.id}\\:afova`);
    }


    function getGroup(field) {
        let group = field.closest('.afova-group');

        if (!group) {
            group = field.closest('label');
        }
        if (group) {
            group.classList.add('afova-group');
        }
        return group;
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

        let messageContainer = getMessageContainer(field);
        let group = getGroup(field);

        if (!hasMessage(messageContainer)) {
            if (group) {
                group.classList.remove('afova-active');
            }
            field.classList.remove('afova-active');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-errormessage');

            if (messageContainer) {
                messageContainer.remove();
            }
        }
    }

    function clearAllMessages(field) {
        let messageContainer = getMessageContainer(field);
        let group = getGroup(field);

        if (group) {
            group.classList.remove('afova-active');
        }
        field.classList.remove('afova-active');
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-errormessage');

        if (messageContainer) {
            messageContainer.remove();
        }
    }

    function clearValidationMessage(identifier, injected) {
        let field = getField(identifier);

        let fieldId = field.dataset.fieldId;
        if (fieldId && field.classList.contains('afova-active')) {
            //field indicates an error message element
            //therefore that single error message will be removed
            field.remove();
            field = getField(fieldId); //now we have a field and not a message
        } else {
            //field really indicates a field
            let messageContainer = getMessageContainer(field);
            if (messageContainer) {
                //remove error messages
                //depending on the value of the injected parameter
                //choose to remove only injected or only derived messages
                messageContainer.querySelectorAll(`[id^=${field.id}\\:afova]${injected ? '.injected' : '.derived'}`)
                    .forEach(function (element) {
                        element.remove();
                    });
            }
        }

        //if no message is left, remove all error message indications
        clearIfNoMessage(field);
    }

    function createInjectMessageElement(field, message, messageId) {
        let messageElement = cloneMessageTemplate(field, messageId);
        messageElement.classList.add('injected');
        messageElement.innerHTML = message;
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

        for (let messageType of getValidationMessageTypes()) {
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
            group.classList.add('afova-active');
        }
        field.classList.add('afova-active');

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
        if (duplicateFieldIds.has(field.id)) {
            console.error(`Cannot validate field with duplicate id [${field.id}]. The field will be ignored by afova.\n${field.outerHTML}`);
            return true;
        }
        focus = focus || false;

        clearValidationMessage(field);
        if (!field.validity.valid) {
            setValidationMessage(field, { focus: focus });
        }

        return field.validity.valid;
    }

    function validateForm(form, event = undefined) {
        form = getElement(form);
        let firstError;

        for (let field of form.elements) {
            let valid = validateField(field, false);
            if (!firstError && !valid) {
                firstError = field;
            }
        }
        if (firstError) {
            if (event) {
                event.preventDefault();
            }
            if (settings.focusOnFirstError) {
                firstError.focus();
            }
        }
    }

    function resetForm(form, event = undefined) {
        form = getElement(form);
        for (let field of form.elements) {
            clearAllMessages(field);
        }
    }

    function adjustForms() {
        let forms = document.querySelectorAll('form');
        let fieldIds = new Set();
        duplicateFieldIds.clear();

        forms.forEach(function (form) {

            for (let field of form.elements) {
                if (field.id && fieldIds.has(field.id)) {
                    console.error(`Duplicate field id [${field.id}]. Fields with that id will be ignored by afova.\n${field.outerHTML}`);
                    duplicateFieldIds.add(field.id);
                } else if (field.id) {
                    fieldIds.add(field.id);
                }
                replaceConstraintAttributes(field);
            }

            form.setAttribute('novalidate', '');
            form.addEventListener('submit', function (event) { validateForm(event.target, event) });
            form.addEventListener('reset', function (event) { resetForm(event.target) });

            if (settings.validateOnChange) {
                for (let field of form.elements) {
                    field.addEventListener('change', function (event) {
                        // validate the field on change and focus on the field if it is invalid
                        validateField(event.target, true);
                    });
                }
            }
        });
    }

    return {
        /**
         * Initialize afova. Sample call:
         * ```js
         * afova.init({ //default options, you can omit the options object
         *  focusOnFirstError: true,
         *  validateOnChange: false,
         *  });
         * ```
         * The script will iterate through all forms on a web page and deactivate browser validation 
         * in favor of afova. The afova form validation will occur on submit of a form and on change of a field 
         * (if you´ve set `validateOnChange`to `true` in your settings ).
         * All errors that can be checked with the Constraint Validation API are validated by afova. 
         * If the default error messages from afova shouldn´t be used, you can define custom validation error messages 
         * with `data-…` attributes for each field. For example:
         * ```html
         *   <label for="custom-pattern-input">A pattern input with custom failure message
         *     <div class="description">Please provide a string that contains any mix of A-Z or a-z and has a length of 3 characters.</div>
         *     <input id="custom-pattern-input" name="patternInput" type="text" pattern="[A-Za-z]{3}" 
         *     data-pattern-mismatch="The value is not in the correct format. Correct formats are AbC or xyz, for example.">
         *   </label>
         * ```
         * 
         * If you don´t have a need for the custom validation error messages and just want to use what 
         * afova has built in, the above code could be written as follows:
         * 
         * ```html
         *   <label for="pattern-input">A pattern input with custom failure message
         *     <div class="description">Please provide a string that contains any mix of A-Z or a-z and has a length of 3 characters.</div>
         *     <input id="pattern-input" name="patternInput" type="text" pattern="[A-Za-z]{3}">
         *   </label>
         * ```
         * 
         * The following attributes can be used alone or in combination to define custom validation error messages:
         * <dl>
         * <dt>data-bad-input</dt>
         * <dd>The browser is unable to handle the input value</dd>
         * 
         * <dt>data-pattern-mismatch</dt>
         * <dd>The value of a field doesn´t comply to the pattern of the <code>pattern</code> attribute</dd>
         * 
         * <dt>data-range-overflow</dt>
         * <dd>The number value of a field is bigger than the value of the <code>max</code> attribute</dd>
         * 
         * <dt>data-range-underflow</dt>
         * <dd>The number value of a field is smaller than the value of the <code>min</code> attribute</dd>
         * 
         * <dt>data-step-mismatch</dt>
         * <dd>The number value of field is not evenly divisable by the value of the <code>step</code> attribute</dd>
         * 
         * <dt>data-too-long</dt>
         * <dd>The value of a field has more characters than defined by the attribute <code>maxlength</code></dd>
         * 
         * <dt>data-too-short</dt>
         * <dd>The value of a field has less characters than defined by the attribute <code>minlength</code></dd>
         * 
         * <dt>data-type-mismatch</dt>
         * <dd>The value of a field dosn´t comply to the <code>type</code> attribute</dd>
         * 
         * <dt>data-value-missing</dd>
         * <dd>A value of a field that is required due to the <code>required</code> attribute is missing</dd>
         * </dl>
         * 
         * Messages that can be derived from the HTML data attributes, like above, will have the CSS class `derived` assigned to them.
         *  
         * @param {Object} [options] - The settings for afova
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
         * afova.injectMessage('requiredInput', 'You provided a value but the value is not correct'); 
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
         * afova.clearMessage('requiredInput check3');
         * //will clear all injected messages for the form elements that have the id´s requiredInput and check3
         * 
         * afova.clearMessage('requiredInput', 'check3');
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
            actionForIdentifiers(function (id) {
                clearValidationMessage(id, true);
            }, identifier);
        },
        clearForm: function (...identifier) {
            actionForIdentifiers(resetForm, identifier);
        },
        /**
         * 
         * @param {string} messageType Describes the messageType to get a message for. For allowed values @see {@link getMessageTypes}.
         * @param {Element|string} identifier Identify the form element for which the error message should be determined. If the parameter is a string, it will be interpreted as the id of the form element. If the identifier is not provided, the default message for the given messageType will be returned.
         * @returns The message text for the given message type. If identifier refers to a field, the actual message of the field for the given messageType is returned.
         */
        getMessage: function (messageType, identifier = undefined) {
            return getValidationMessage(messageType, getElement(identifier));
        },
        /**
         * @returns An array of all supported message types.
         */
        getMessageTypes: function () {
            return getValidationMessageTypes();
        }
    }
})();

