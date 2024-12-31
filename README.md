# afova

afova (accessible form validation) is a progressive enhancement of web browsers the [client-side HTML form constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation).

afova will allow you to:
- pick up any of the constraining attributes of HTML input elements (`required`, `type`, `step`, `pattern`, `min`, `max`, `minlength`, `maxlength`) and show constraint violation messages to the user,
- describe violation messages with corresponding `data` attributes (`data-required`, `data-type`, `data-step`, `data-pattern`, `data-min`, `data-max`, `data-minlength`, `data-maxlength`, `data-bad-input`),
- use placeholders within the violation messages to refer to the current user input (placeholder is `{{input}}`) and to the violated constraint setting (placeholder is `{{constraint}}`),
- style constraint violation messages with CSS,
- in addition to showing the violation messages along with the input elements, summarize all violation messages in a separate list inside of the form,
- do custom HTML input element validation (sync and async),
- do HTML form validation (sync and async) to validate input elements in relation to each other, and
- prevent multiple submits of a form that is already in an ongoing submitting process.

You can use the afova library as minified version without a bundler on your web page (it´s an ESM import) or for more complex scenarios integrate it with a bundler. Read more about that under [afova usage](#afova-usage).

Below is an example of how afova allows to define constraint violation messages:

```html
<form>
    <label
        >A min length and max length text input
        <input
            type="text"
            required
            data-required="Please provide a value"
            minlength="5"
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            maxlength="8"
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            pattern="[0-9]*"
            data-pattern="Only digits are allowed: {{constraint}}"
        />
    </label>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
</form>
```

afova will identify the constraints assigned to input elements, validate the form during submit, and report constraint violations to the user.

The above example will be transformed by afova into the following HTML:

```html
<form id="afova-sJM4xyJx_4JltktdSKg7q" novalidate="">
    <label
        id="afova-4NznJ3zynpcxg0yF1ZKXI"
        class="afova-context"
        for="afova-HS2YEDxawe9CuzVYyZVqd"
        >A min length and max length text input
        <input
            type="text"
            required=""
            data-required="Please provide a value"
            minlength="5"
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            maxlength="8"
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            pattern="[0-9]*"
            data-pattern="Only digits are allowed: {{constraint}}"
            id="afova-HS2YEDxawe9CuzVYyZVqd"
            class="afova-control"
        />
    </label>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
</form>
```

Trying to submit the form without providing a text value will violate the `required` constraint. afova will prevent the submit and instead provide a constraint violation message in the following form:

```html
<form id="afova-fpVF2baWLLZaRqSGgf9oZ" novalidate="">
    <label
        id="afova-KDJFSNnl7sJXJMiRqhgvF"
        class="afova-context afova-active"
        for="afova-HssNc_nNBlq_vchMx3AG9"
        >A min length and max length text input
        <div
            id="afova-HssNc_nNBlq_vchMx3AG9-afova-message-container"
            class="afova-message-container"
        >
            <div
                class="afova-message"
                afova-message-for="afova-HssNc_nNBlq_vchMx3AG9"
            >
                Please provide a value
            </div>
        </div>
        <input
            type="text"
            required=""
            data-required="Please provide a value"
            minlength="5"
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            maxlength="8"
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            pattern="[0-9]*"
            data-pattern="Only digits are allowed: {{constraint}}"
            id="afova-HssNc_nNBlq_vchMx3AG9"
            class="afova-control"
            aria-invalid="true"
            aria-errormessage="afova-HssNc_nNBlq_vchMx3AG9-afova-message-container"
        />
    </label>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
</form>
```

For more details about constraint validation please refer to:

- [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- [Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)


<h2 id="afova-usage">afova usage</h2>

### Bundler

When using a bundler, add afova to your project with the command:

```shell
npm i afova
```

Then import afova into your JavaScript/TypeScript setup:

```js
import { afova } from 'afova'

//initialize by creating an afova object named afv with default settings
const afv = afova();
```

### HTML page without bundler

When working without a bundler, download the ESM script <a href="https://raw.githubusercontent.com/ulfschneider/afova/refs/heads/main/dist/afova.min.js" download="afova.min.js">afova.min.js</a> and put it into the assets folder of your website (or any other folder where your script dependencies are located).

Integrate afova into your web pages as follows:

```html
<script type="module">
    import { afova } from "/assets/afova.min.js";

    //initialize by creating an afova object named afv with default settings
    var afv = afova();
</script>
```

### The afova object

When creating the afova object by calling `afova()`, all forms that are available on the web page are traversed and afova will take over form validation for those forms.

The afova object offers a `clear()` method that can be used in situations where you have to remove event listeners and CSS class assignments introduced by afova from the web page.

## Settings

### JavaScript

The afova object can be initialized with an optional settings object, that allows to hook into the form validation process:

```js
{
  selector?: string;
  formMessageSelector?: string;
  validateOnChange?: boolean;
  focusOnFirstError?: boolean;
  onSubmit?: (event: SubmitEvent) => void;
  onReset?: (event: Event) => void;
  onInvalid?: (event: SubmitEvent) => void;
  onValid?: (event: SubmitEvent) => void;
  onBeforeValidateControl?: (control: HTMLInputElement) => void
  onAsyncBeforeValidateControl?: (control HTMLInputElement) => Promise<void>
  onValidateControl?: (control: HTMLInputElement) => void
  onAsyncValidateControl?: (control: HTMLInputElement) => Promise<void>
  onValidateControlError?: (control: HTMLInputElement, error: unknown) => void
  onBeforeValidateForm?: (form: HTMLFormElement) => void
  onAsyncBeforeValidateForm?: (form: HTMLFormElement) => Promise<void>
  onValidateForm?: (form: HTMLFormElement) => void
  onAsyncValidateForm?: (form: HTMLFormElement) => Promise<void>
  onValidateFormError?: (form: HTMLFormElement, error: unknown) => void
}
```

Properties of the settings object and their meaning:

- `selector?: string` Configure the selector being used during construction of the afova object to identify the forms to validate. Default is `form`.
- `formMessageSelector?: string` Configure the selector being used during construction of the afova object to identify the form message container. To show constraint violation messages not only along with the invalid input elements of the form, but also in a list inside of the form, you can have a form message container. By default the container is identified with the CSS class `.afova-form-message-container` during construction of the afova object. afova will search for the container inside of the form and summarize all constraint violation messages there. The form message container is optional, because violation messages anyway will be displayed along with the invalid input element.
- `focusOnFirstError?: boolean` The default value is `true`. afova will focus the first invalid input element during validation of the form in that case.
- `validateOnChange?: boolean` The default is `false`. When set to `true`, afova will validate each input element of the form when the `onChange` events of the HTML input elements fire, and not only during form submit.
- `onSubmit: (event: SubmitEvent) => void` The hook is called by afova when the submit event of the form fired and the form is successfully validated. **The `SubmitEvent` is prevented when this hook is defined. The submit needs to be implemented inside of this hook in that case.**
- `onReset?: (event: Event) => void` afova will call this hook when the reset event of the form fired.
- `onInvalid?: (event: SubmitEvent) => void` afova will call this hook the submit event of the form fired but the form is invalid. The form will not be submitted in that case.
- `onValid?: (event: SubmitEvent) => void` afova will call this hook when the submit event of the form fired and the form is valid. The hok is called before the `onSubmit` hook.
- `onBeforeValidateControl?: (control: HTMLInputElement) => void` afova will call this hook before doing the custom validation of each input element.
- `onAsyncBeforeValidateControl?: (control: HTMLInputElement) => Promise<void>` afova will call this async hook before doing the custom validation of each input element and after the corresponding `onBeforeValidateControl`.
- `onValidateControl?: (control: HTMLInputElement) => void` afova will call this hook for each input element during form validation. The hook can be used to invalidate the input element by setting a custom validation message with `control.setCustomValidity()`. The hook is only called after the successful validation of all constraints of the input element, which means for the hook is not called for an already invalid input element.
- `onAsyncValidateControl?: (control: HTMLInputElement) => Promise<void>` afova will call this async hook for each input element during form validation. The hook must return a promise. The hook can be used to invalidate the input element by setting a custom validation message with `control.setCustomValidity()`. The hook will only be called after the successful validation of all constraints for the input element and after the `onValidateControl` hook.
- `onValidateControlError?: (control: HTMLInputElement, error: unknown) => void` afova will call the error handling hook when an exception occurs during input element validation. When this handler is defined, the error is catched bys afova and given to the handler. When the handler is not defined, the error is thrown by afova.
- `onBeforeValidateForm?: (form: HTMLFormElement) => void` afova will call this hook before starting to validate a form.
- `onAsynBeforeValidateForm?: (form: HTMLFormElement) => Promise<void>` afova will call this async hook before starting to validate a form and right after the corresponding `onBeforeValidateForm` hook.
- `onValidateForm?: (form: HTMLFormElement) => void` afova will call the hook after successful validation of all input elements of the form. The hook can be used to validate input elements in relation to each other.
- `onAsyncValidateForm?: (form: HTMLFormElement) => Promise<void>` afova will call this async hook after successful validation of all input elements of the form and after the `onValidateForm` hook. The hook must return a promise. The hook can be used to validate input elements in relation to each other.
- `onValidateFormError?: (form: HTMLFormElement, error: unknown) => void` afova will call this hook hook when an exception occurs during form validation. When this handler is defined, the error is catched by afovaand given to the handler. When the handler is not defined, the error is thrown by afova.

### HTML

The following attributes are available to describe constraint violation messages:

- `data-badinput` The browser is unable to handle the input value, for example when the required type of the input element is a number but the user provided a alphabetic characters.
- `data-pattern` The value of a field doesn´t comply to the pattern of the `pattern` attribute.
- `data-max` The number value of a field is greater than the value of the `max` attribute.
- `data-min` The number value of a field is less than the value of the `min` attribute.
- `data-step` The number value of field is not evenly divisable by the value of the `step` attribute.
- `data-maxlength` The value of a field has more characters than defined by the attribute `maxlength`.
- `data-minlength` The value of a field has less characters than defined by the attribute `minlength`.
- `data-type` The value of a field dosn´t comply to the `type` attribute.
- `data-required` A value of a field that is required due to the `required` attribute is missing.

Assigning your constraint violation messages is a good way to have internationalized messages and generally recommended. You can use the placeholders to refer to certain control properties within your violation messages, like:

- `{{input}}` for current user input,
- `{{constraint}}` for the violated constraint, and
- `{{type}}` for the controls value of the type attribute.

afova will apply English fallback messages in case you do not use your own constraint violation messages,

## Summarizing messages for the form

All constraint violation messages of an entire form can be summarized and listed inside of a form message container. The form message container must be inside of the validated form and is described to afova by assigning the CSS class `afova-form-message-container`.

E.g., when you defined a form message container like in the example below:

```html
<form>
    <div class="afova-form-message-container" style="display: none">
        <strong>The form has validation failures</strong>
    </div>

    <label
        >A min length and max length text input
        <input
            type="text"
            required
            data-required="Please provide a value"
            minlength="5"
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            maxlength="8"
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            pattern="[0-9]*"
            data-pattern="Only digits are allowed: {{constraint}}"
        />
    </label>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
</form>
```

When trying to submit that form without providing an input value, afova will produce the following HTML:

```html
<form
    id="afova-K9OUvdZfjcP2wW24A0ZlA"
    novalidate=""
    afova-form-message-container-id="afova-xDRp9MC3iiVLh7ZOC2IJZ"
>
    <div
        class="afova-form-message-container"
        style=""
        id="afova-xDRp9MC3iiVLh7ZOC2IJZ"
    >
        <strong>The form has validation failures</strong>
        <ul class="afova-message-list">
            <li
                afova-message-for="afova-Iiw91SPozRG0mwbemqhWz"
                class="afova-collected-message"
            >
                <div class="afova-message-label">
                    A min length and max length text input
                </div>
                <a href="#afova-Iiw91SPozRG0mwbemqhWz" class="afova-message"
                    >Please provide a value</a
                >
            </li>
        </ul>
    </div>

    <label
        id="afova-t9h439TQ-TeH4vWFOcGTi"
        class="afova-context afova-active"
        for="afova-Iiw91SPozRG0mwbemqhWz"
        >A min length and max length text input
        <div
            id="afova-Iiw91SPozRG0mwbemqhWz-afova-message-container"
            class="afova-message-container"
        >
            <div
                class="afova-message"
                afova-message-for="afova-Iiw91SPozRG0mwbemqhWz"
            >
                Please provide a value
            </div>
        </div>
        <input
            type="text"
            required=""
            data-required="Please provide a value"
            minlength="5"
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            maxlength="8"
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            pattern="[0-9]*"
            data-pattern="Only digits are allowed: {{constraint}}"
            id="afova-Iiw91SPozRG0mwbemqhWz"
            class="afova-control"
            aria-invalid="true"
            aria-errormessage="afova-Iiw91SPozRG0mwbemqhWz-afova-message-container"
        />
    </label>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
</form>
```

Notice the label text of each control is extracted and displayed along with the constraint violation message inside of the form message container. To have more control over what label information is shown in the form message container you can put a marker on the desired text in your form by assigning the CSS class `afova-label`.

## Styling and identifiying

afova does not come with any CSS styles, you have to do the styling yourself. The following CSS class names are assigned during validation processing or can be used to activate afova functionality:

- `.afova-context` afova searches for a context for every validated input element. By default this is the `label` element wrapping the control. afova assigns the CSS class `afova-context` to the context element. You can decide to use a different wrapping context by assigning the `afova-context` class yourself, which can make sense for fieldsets of radio buttons or checkboxes.
- `.afova-group` The CSS class `afova-group` can be used to bundle constraint violation messages in front of a group of input elements. A good use case are radio buttons or checkboxes that belong together. Do it wrapping the input elements into a `div` and assign the CSS class `afova-group` to the `div`.
- `.afova-active` A context with an invalid input element has the CSS class `afova-active` assigned to it. The class is removed once the control becomes valid again.
- `.afova-message-container` When an input element becomes invalid because of a constraint violation, a container for violation messages is inserted right before the control. The container will have the CSS class `afova-message-container`. Once the input element becomes valid again, the message container is removed.
- `.afova-message` Each violation message inside of the message container has the CSS class `afova-message` assigned to it.
- `.afova-control` Every input element validated by afova has the CSS class `afova-control` assigned to it.
- `.afova-form-message-container` Define a collector for summarizing all constraint violation messages of a form by assigning the CSS class `afova-form-message-container`.
- `.afova-label` The message collector will show the control´s label together with the constraint violation message. By default the complete label text will be extracted by afova. To have more control over what text is shown in the collector, assign the class `afova-label` to any text content along with the validated input element.
- `.afova-message-label` The label information inside of the message collector will have the CSS class `afova-message-label` assigned to it.


## Accessibility

- `id` Every input element and every form observed by afova will get an `id` assigned if it doesn´t have one (you can use your own ids).
- `for` When a wrapping label of an input element does not have the `for` attribute pointing to the `id` of the input element, the `for` attribute will be assigned by afova.
- `aria-invalid` An invalid input element has the attribute `aria-invalid` assigned to it.
- `aria-errormessage` An invalid input element has the attribute `aria-errormessage` pointing to the `id` of the associated message container.
