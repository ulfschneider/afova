# afova

afova (Accessible Form Validation) is leveraging the Constraint Validation API to do client-side form validation. Please refer to:

-   [https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation]
-   [https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation]

## Usage

Put the script into your HTML page and initialize afova.

```html
<script type="module">
    import afova from "afova.js";
    afova.prepare({ //default options, you can omit the options object
     focusOnFirstError: true,
     validateOnChange: false,
     });
</script>
```

The script will iterate through all forms on a web page and deactivate browser validation
in favor of afova. The afova form validation will occur on submit of a form and on change of a field
(if you´ve set `validateOnChange`to `true` in your settings ).
All errors that can be checked with the Constraint Validation API are validated by afova.
If the default error messages from afova shouldn´t be used, you can define custom error messages
as `data` attributes for each field. For example:

```html
<div class="afova-group">
    <label for="custom-pattern-input">A pattern input with custom failure message
    <div class="description">Please provide a string that contains any mix of A-Z or a-z and has a length of 3 charactes.</div>
    <input id="custom-pattern-input" type="text"
    pattern="[A-Za-z]{3}"
    data-pattern-mismatch="The value is not in the correct format. Correct formats are AbC or xyz, for example.">
    </label>
 </div>
```

The following attributes are available to define validation error messages:


data-bad-input
: The browser is unable to handle the input value

data-pattern-mismatch
: The value of a field doesn´t comply to the pattern of the `pattern` attribute

data-range-overflow
: The number value of a field is bigger than the value of the `max` attribute

data-range-underflow
: The number value of a field is smaller than the value of the `min` attribute

data-step-mismatch
: The number value of field is not evenly divisable by the value of the `step` attribute

data-too-long
. The value of a field has more characters than defined by the attribute `maxlength`

data-too-short
: The value of a field has less characters than defined by the attribute `minlength`

data-type-mismatch
: The value of a field dosn´t comply to the `type` attribute

data-value-missing
: A value of a field that is required due to the `required` attribute is missing

Messages that can be derived from the HTML data attributes, like above, will have the CSS class `afova-derived-message` assigned to them.
