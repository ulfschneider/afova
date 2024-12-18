# afova

afova (accessible form validation) is a progressive enhancement to the [Constraint Validation API](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation) for client-side HTML form validation.

afova will allow you to:
- pick up any of the constraining attributes of HTML input controls (`required`, `type`, `step`, `pattern`, `min`, `max`, `minlength`, and `maxlength`) and show constraint violation messages to the user,
- describe violation messages with corresponding `data` attributes (`data-required`, `data-type`, `data-step`, `data-pattern`, `data-min`, `data-max`, `data-minlength`, and `data-maxlength`, and `data-bad-input`),
- use placeholders within the violation messages to refer to the current user input (placeholder is `{{input}}`) and to the violated constraint setting (placeholder is `{{constraint}}`),
- style constraint violation messages with CSS.

Below is an example of how afova allows to define constraint violation messages:

```html
<form>
    <label for="min-max"
        >A min length and max length text input with custom failure
            message
            <div class="description">
                The text must be at least 5 characters of length and must
                not exceed 8 characters of length, and it can only contain digits.
            </div>
        <input
            id="min-max"
            type="text"
            <!-- constraints -->
            minlength="5"
            maxlength="8"
            pattern="[0-9]*"
            <!-- constraint violation messages -->
            data-minlength="Hey, {{input}} is not long enough. Your input should have at least {{constraint}} characters."
            data-maxlength="Sorry, {{input}} is too long. Please do not enter text with more than {{constraint}} characters."
            data-pattern="Only digits are allowed: {{constraint}}"
        />
    </label>
</form>
```

afova will identify the constraints assigned to input controls, validate the form during submit, and report constraint violations to the user.

For example, the following HTML form has a single *required* text input control and a constraint violation message saying "Please provide text input":

```html
<form>
    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        >A reqired text input
        <input
            type="text"
            <!-- constraint -->
            required
            <!-- constraint violation message -->
            data-required="Please provide text input"
        />
    </label>
</form>
```

That form will be transformed by afova into:

```html
<form novalidate="" id="afova-1v4dAnzsS9OjaF3F46igi">
    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        id="afova-EckT8S1xwG_CQDra0arhS"
        class="afova-context"
        for="afova-d1qB-B6gUZ-dpFYghmIgp"
        >A reqired text input
        <input
            type="text"
            required
            data-required="Please provide text input"
            id="afova-d1qB-B6gUZ-dpFYghmIgp"
            class="afova-control"
        />
    </label>
</form>
```

Trying to submit the form without providing a text value will violate the `required` constraint. afova will prevent the submit and instead provide a constraint violation message in the following form:

```html
<form novalidate="" id="afova-1v4dAnzsS9OjaF3F46igi">
    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        id="afova-EckT8S1xwG_CQDra0arhS"
        class="afova-context afova-active"
        for="afova-d1qB-B6gUZ-dpFYghmIgp"
        >A reqired text input
        <ul
            id="afova-d1qB-B6gUZ-dpFYghmIgp-afova-message-container"
            class="afova-message-container"
        >
            <li
                class="afova-message"
                afova-message-for="afova-d1qB-B6gUZ-dpFYghmIgp"
            >
                Please provide text input
            </li>
        </ul>
        <input
            type="text"
            required=""
            data-required="Please provide text input"
            id="afova-d1qB-B6gUZ-dpFYghmIgp"
            class="afova-control"
            aria-invalid="true"
            aria-errormessage="afova-d1qB-B6gUZ-dpFYghmIgp-afova-message-container"
        />
    </label>
</form>
```

For more details please about constraint validation please refer to:

- [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- [Client-side form validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)


## Usage

### Bundler

When using a bundler, add afova to your project with the command:

```shell
npm i afova
```

Then import afova into your JavaScript / TypeScript setup:

```js
import { afova } from 'afova'

//initialize by creating an afova object

const afv = afova();

//if required, clear the script and remove all event listeners
afv.clear()
```

### HTML page without bundler

When working without a bundler, download the ESM script <a href="https://raw.githubusercontent.com/ulfschneider/afova/refs/heads/main/dist/afova.min.js" download="afova.min.js">afova.min.js</a> and put it into the assets folder (for example) of your website.

Then you can integrate afova into your web pages as follows:

```html
<script type="module">
    import { afova } from "/assets/afova.min.js";

    //initialize by creating an afova object
    var afv = afova();

    //if required, clear the script and remove all event listeners
    afv.clear()
</script>
```

### The afova object

When creating the afova object by calling `afova()`, all forms are traversed and the default browser validation of those forms is deactivated.
afova will take over form validation for those forms during form submit.

The `clear()` can be used in situations where you have to remove event listeners and CSS class assignments introduced by afova.

## Settings

### JavaScript

The afova object can be initialized with an optional settings object.

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
}
```

You can provide a settings object when calling `afova()`. The settings are optional.

`selector?: string`
: The default value is `form`, which will make afova search for *all* forms on a web page and take over validation control.

`formMessageSelector?: string`
: To show constraint violation messages not only along with the invalid input controls, but also in a list along with the form, you can have a form message container. The form message container is identified with the CSS class `.afova-form-message-container`, which will let afova search for the container inside of the form and collect all constraint violation messages there. The form message container is optional, because violation messages anyway will be displayed along with the invalid input controls.

`focusOnFirstError?: boolean`
: The default value is `true`, which leads to focusing the first input control with a constraint violation when a form is validated during submit.

`validateOnChange?: boolean`
: The default is `false`. When set to `true`, constraint violations are checked whenever the contents of an input control change, and not only during form submit.

`onSubmit: (event: SubmitEvent) => void`
: A callback that is called when a form is successfully validated and can be submitted.

`onReset?: (event: Event) => void`
: A callback that is called when the form is resetted

`onInvalid?: (event: SubmitEvent) => void`
: A callback that is called after a form has been validated and is invalid

`onValid?: (event: SubmitEvent) => void`
: A callback that is called after a form has been successfully validated. Called before the `onSubmit` callback.


### HTML

The following attributes are available to describe constraint violation messages:

`data-bad-input`
: The browser is unable to handle the input value, for example when the required type of the input control is a number but the user provided a alphabetic characters

`data-pattern`
: The value of a field doesn´t comply to the pattern of the `pattern` attribute

`data-max`
: The number value of a field is greater than the value of the `max` attribute

`data-min`
: The number value of a field is less than the value of the `min` attribute

`data-step`
: The number value of field is not evenly divisable by the value of the `step` attribute

`data-maxlength`
: The value of a field has more characters than defined by the attribute `maxlength`

`data-minlength`
: The value of a field has less characters than defined by the attribute `minlength`

`data-type`
: The value of a field dosn´t comply to the `type` attribute

`data-required`
: A value of a field that is required due to the `required` attribute is missing

Assigning your constraint violation messages is a good way to have internationalized messages. In case you do not use your own messages, afova will apply German and English default validation messages, according to the web browsers locale setting. You can use the placeholder `{{input}}` to refer within your violation message to the current user input and you can use `{{constraint}}` to refer to the violated constraint.

## Collecting messages for the form

All constraint violation messages of the entire form can be collected and listed together inside of a form message container. The form message container must be inside of the validated form and is described to afova by assigning the CSS class `afova-form-message-container`. E.g., when the starting form looks like:

```html
<form>

    <ul class="afova-form-message-container"></ul>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        >A reqired text input
        <input
            type="text"
            required
            data-required="Please provide text input"
        />
    </label>
    <label
        >A min length text input
        <input
            id="min-text-length"
            type="text"
            minlength="5"
            data-minlength="The text must be at least 5 characters of length"/>
    </label>
</form>
```

It be transformed by afova into:

```html
<form
    novalidate=""
    id="afova-HZ9_7J1fJI_VMYGrfJln9"
    afova-form-message-container-id="afova-cMvV7qnlQRK07g71a_Ban"
>
    <ul
        class="afova-form-message-container"
        id="afova-cMvV7qnlQRK07g71a_Ban"
        style="display: none"
    ></ul>
    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        id="afova-vFiJd_pfspLE5JEluEX7Y"
        class="afova-context"
        for="afova-N55Wepw1mVEheG5c_NpKy"
        >A reqired text input
        <input
            type="text"
            required=""
            data-required="Please provide text input"
            id="afova-N55Wepw1mVEheG5c_NpKy"
            class="afova-control"
        />
    </label>
    <label
        id="afova-61HZ-OI0LVId9adC-mNS7"
        class="afova-context"
        for="min-text-length"
        >A min length text input
        <input
            id="min-text-length"
            type="text"
            minlength="5"
            data-minlength="The text must be at least 5 characters of length"
            class="afova-control"
        />
    </label>
</form>
```

The invalid form cannot be submitted and will be prepared by afova as follows:

```html
<form
    novalidate=""
    id="afova-ZrtiyJtHnlDlNmeTuhu-o"
    afova-form-message-container-id="afova-eBosuZX7IAKictsYD5zfD"
>
    <ul
        class="afova-form-message-container"
        id="afova-eBosuZX7IAKictsYD5zfD"
    >
        <li
            afova-message-for="afova-3EzzZt5d0vHfNFew8ylGT"
            class="afova-collected-message"
        >
            <div class="afova-message-label">A reqired text input</div>
            <div class="afova-message">Please provide text input</div>
        </li>
        <li afova-message-for="min-text-length" class="afova-collected-message">
            <div class="afova-message-label">A min length text input</div>
            <div class="afova-message">
                The text must be at least 5 characters of length
            </div>
        </li>
    </ul>

    <input type="submit" value="Submit the form" />
    <input type="reset" value="Reset the form" />
    <label
        id="afova-MAvRodIUKgsJR8ccXUQyG"
        class="afova-context afova-active"
        for="afova-3EzzZt5d0vHfNFew8ylGT"
        >A reqired text input
        <ul
            id="afova-3EzzZt5d0vHfNFew8ylGT-afova-message-container"
            class="afova-message-container"
        >
            <li
                class="afova-message"
                afova-message-for="afova-3EzzZt5d0vHfNFew8ylGT"
            >
                Please provide text input
            </li>
        </ul>
        <input
            type="text"
            required=""
            data-required="Please provide text input"
            id="afova-3EzzZt5d0vHfNFew8ylGT"
            class="afova-control"
            aria-invalid="true"
            aria-errormessage="afova-3EzzZt5d0vHfNFew8ylGT-afova-message-container"
        />
    </label>
    <label
        id="afova-rBW0jMtZXY943cO6urEn2"
        class="afova-context afova-active"
        for="min-text-length"
        >A min length text input
        <ul
            id="min-text-length-afova-message-container"
            class="afova-message-container"
        >
            <li class="afova-message" afova-message-for="min-text-length">
                The text must be at least 5 characters of length
            </li>
        </ul>
        <input
            id="min-text-length"
            type="text"
            minlength="5"
            data-minlength="The text must be at least 5 characters of length"
            class="afova-control"
            aria-invalid="true"
            aria-errormessage="min-text-length-afova-message-container"
        />
    </label>
</form>
```

Notice the label text of each control is extracted and displayed along with the constraint violation message inside of the form message container. To have more control over what label information is shown in the form message container you can put a marker on the desired text with the CSS class `afova-label`.

## Styling and identifiying

afova does not come with any CSS styles. The following CSS class names are assigned during validation processing or can be used to activate afova functionality:

`:invalid`
: Every invalid control can be styled with the `:invalid` selector.

`.afova-context`
: afova searches for a context for every validated input control.
: By default this is the `label` element wrapping the control. afova assigns the CSS class `afova-context` to the context element.
: You can decide to use a different wrapping context by assigning the `afova-context` class yourself, which can make sense for fieldsets of
: radio buttons or checkboxes.

`.afova-group`
: The CSS class `afova-group` can be used to bundle constraint violation messages in front of a group of input controls.
: A good use case are radio buttons or checkboxes that belong together. In that case the controls should be wrapped into a `div`
: with the CSS classs `afova-group` group assigned.

`.afova-active`
: A context with an invalid input control has the CSS class `afova-active` assigned to it. The class is removed once the control becomes valid again.

`.afova-message-container`
: When an input control becomes invalid because of a constraint violation, a container for violation messages is inserted right before the control.
: The container will have the CSS class `afova-message-container`.
: Once the input control becomes valid again, the message container is removed.

`.afova-message`
: Each violation message inside of the message container has the CSS class `afova-message` assigned to it.

`.afova-control`
: Every input control validated by afova has the CSS class `afova-control` assigned to it.

`.afova-form-message-container`
: Define a collector for all constraint violation messages of a form by assigning the CSS class `afova-form-message-container`.

`.afova-label`
: The message collector will show the control´s label together with the constrain violation message. By default the label text is the text content of the `label` element. To have more control over what text is shown in the collector, assign the class `afova-label` to any text content along with the validated control.

`.afova-message-label`
: The label information inside of the message collector will have the CSS class `afova-message-label` assigned to it.


## Accessibility

`id`
: Every input control observed by afova will get an `id` assigned if it doesn´t have one.

`for`
: When a wrapping label of an input control does not have the `for` attribute pointing to the `id` of the control, the `for` attribute will be assigned by afova.

`aria-invalid`
: An invalid control has the attribute `aria-invalid` assigned to it.

`aria-errormessage`
: An invalid control has the attribute `aria-errormessage` pointing to the `id` of the associated message container.
