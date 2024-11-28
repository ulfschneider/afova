# afova – experimental

afova (Accessible Form Validation) is leveraging the Constraint Validation API to do client-side form validation. Please refer to:

-   [https://developer.mozilla.org/en-US/docs/Web/API/Constraint_validation]
-   [https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Constraint_validation]

## Usage

Put the script into your HTML page and initialize afova.

```html
<script type="module">
    import afova from "afova.js";

    //initialize
    //default options, you can omit the options object
    afova.init({
     selector: "form",
     focusOnFirstError: true,
     validateOnChange: false,
     });


    //clear the script and remove all event listeners with
    afova.clear()
</script>
```



The script will iterate through all forms on a web page and deactivate browser validation
in favor of afova. The afova form validation will occur on submit of a form and on change of a field
(if you´ve set `validateOnChange`to `true` in your settings ).
All errors that can be checked with the Constraint Validation API are validated by afova.
If the default error messages from afova shouldn´t be used, you can define custom error messages
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

The following attributes are available to define validation error messages:


data-bad-input
: The browser is unable to handle the input value

data-pattern
: The value of a field doesn´t comply to the pattern of the `pattern` attribute

data-max
: The number value of a field is bigger than the value of the `max` attribute

data-min
: The number value of a field is smaller than the value of the `min` attribute

data-step
: The number value of field is not evenly divisable by the value of the `step` attribute

data-maxlength
. The value of a field has more characters than defined by the attribute `maxlength`

data-minlength
: The value of a field has less characters than defined by the attribute `minlength`

data-type
: The value of a field dosn´t comply to the `type` attribute

data-required
: A value of a field that is required due to the `required` attribute is missing

Messages that can be derived from the HTML data attributes, like in the above example, will have the CSS classes `afova-message derived` assigned to them.
