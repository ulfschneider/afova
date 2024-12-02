# Afova

Afova (Accessible Form Validation) is leveraging the Constraint Validation API for client-side form validation. Please refer to:

- [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/HTML/Constraint_validation)
- [Client-side form valication](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation) https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation

## Usage

Put the ESM script into your HTML page and initialize afova.

```html
<script type="module">
    import { afova } from "afova.js";

    //initialize by creating an afova object
    //shown are the default options, you can omit the options object
    afv = afova({
     selector: "form",
     focusOnFirstError: true,
     validateOnChange: false,
     });

    //clear the script and remove all event listeners
    //introduced by afova
    //when validation is completed
    afv.clear()
</script>
```

When creating the afova object by calling `afova()`, all forms described by the selector are traversed
and the default browser validation of those forms is deactivated.
Afova will take over form validation for those forms during form submit.

The `clear()` is required in situations where you have to clear event listeners and CSS class assignments introduced by afova.

## Settings

The settings are optional.

`selector`
: The default value is `form`, which will make afova search for *all* forms on a web page and take over validation control.

`focusOnFirstError`
: The default value is `true`, which leads to focusing the first input control with a constraint violation when a form is validated during submit.

`validateOnChange`
: The default is `false`. When set to `true`, constraint violations are checked whenever the contents of an input control change, and not only during form submit.

All constraint violations that can be checked with the Constraint Validation API are validated by afova.
In case the default violation messages of afova shouldn´t be used, you can define custom error messages
as `data` attributes for each field. For example:

```html
<label for="custom-pattern-input">A pattern input with custom failure message
  <div class="description">Please provide a string that contains any mix of A-Z or a-z and has a length of 3 charactes.</div>
  <input
    id="custom-pattern-input"
    type="text"
    pattern="[A-Za-z]{3}"
    data-pattern="The value is not in the correct format. Correct formats are AbC or xyz, for example.">
</label>
```

The following attributes are available to define your own constraint violation messages:

`data-bad-input`
: The browser is unable to handle the input value

`data-pattern`
: The value of a field doesn´t comply to the pattern of the `pattern` attribute

`data-max`
: The number value of a field is bigger than the value of the `max` attribute

`data-min`
: The number value of a field is smaller than the value of the `min` attribute

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

Assigning your custom violation messages is a good way to have internationalized messages. In case you do not use your own messages, afova will apply German and English default validation messages, according to the web browsers locale setting.

## Styling

Afova does not come with any CSS styles. The following CSS class names are assigned during validation processing:

`.afova-context`
: Afova searches for a context for every validated input control.
: By default this is the `label` element wrapping the control. Afova assigns the CSS class `afova-context` to the context element.
: You can decide to use a different wrapping context by assigning the `afova-context` class yourself.

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


## Accessibility

`id`
: Every input control observed by afova will get an `id` assigned if it doesn´t have one.

`for`
: When a wrapping label of an input control does not have the `for` attribute pointing to the `id` of the control, the `for` attribute will be assigned by afova.

`aria-invalid`
: An invalid control has the attribute `aria-invalid` assigned to it.

`aria-errormessage`
: An invalid control has the attribute `aria-errormessage` pointing to the `id` of the associated message container.
