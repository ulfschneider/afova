var afova=function(){"use strict";var t=Object.defineProperty,e=(e,s,r)=>((e,s,r)=>s in e?t(e,s,{enumerable:!0,configurable:!0,writable:!0,value:r}):e[s]=r)(e,"symbol"!=typeof s?s+"":s,r);const s={selector:"form",validateOnChange:!1,focusOnFirstError:!0},r=["submit","reset","button"];class n{constructor(){e(this,"settings",s),e(this,"constraints",{badInput:{message:"The input cannot be processed",constraintAttr:void 0},customError:{message:""},patternMismatch:{message:"The value does not match the required pattern of {{constraint}}",constraintAttr:"pattern"},rangeOverflow:{message:"The value is too big. It cannot be bigger than {{constraint}}.",constraintAttr:"max"},rangeUnderflow:{message:"The value is too small. It must be at least {{constraint}}.",constraintAttr:"min"},stepMismatch:{message:"The value is not in within the correct step interval of {{constraint}}",constraintAttr:"step"},tooLong:{message:"The value is too long. It cannot be longer than {{constraint}} characters.",constraintAttr:"maxlength"},tooShort:{message:"The value is too short. It must be at least {{constraint}} characters long.",constraintAttr:"minlength"},typeMismatch:{message:"The value must be of type {{constraint}}",constraintAttr:"type"},"typeMismatch[email]":{message:"The value must be an email in the format mickey@mouse.com",constraintAttr:"type"},"typeMismatch[url]":{message:"The value must be a URL in the format http://url.com",constraintAttr:"type"},"typeMismatch[tel]":{message:"The value must be a phone number",constraintAttr:"type"},valid:{message:""},valueMissing:{message:"Please provide a value",constraintAttr:"required"}})}setOptions(t){t&&(this.settings=Object.assign(this.settings,t))}ensureId(t){t.id||(t.id=`afova-${((t=21)=>{let e="",s=crypto.getRandomValues(new Uint8Array(t));for(;t--;)e+="useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict"[63&s[t]];return e})()}`)}findMessageContainer(t){return document.querySelector(`#${t.id}-afova-message-container`)}ensureAndGetMessageContainer(t){var e;let s=this.findMessageContainer(t);return s||(s=document.createElement("ul"),null==(e=t.parentNode)||e.insertBefore(s,t),s.id=`${t.id}-afova-message-container`,s.classList.add("afova-message-container"),t.setAttribute("aria-errormessage",s.id)),s}deriveMessageText(t,e){if("customError"!=t){let s=this.constraints[t];if(s){let r=s.message,n=s.constraintAttr;const a=e.getAttribute(n||"");if(r=e.dataset[n||t]||r,a){s=this.constraints[`${t}[${t.toLowerCase()}]`],s&&(r=e.dataset[t]||s.message);const n=new RegExp("{{\\s*constraint\\s*}}","ig");r=r.replace(n,a)}return r}}return e.validationMessage}putMessage(t){const e=this.ensureAndGetMessageContainer(t),s=t.validity,r=document.createElement("li");r.classList.add("afova-message"),r.classList.add("derived"),e.appendChild(r);for(const n of Object.keys(this.constraints))if(s[n]){let e=this.deriveMessageText(n,t);e&&(r.innerHTML=e);break}r.innerHTML||(r.innerHTML=t.dataset.errorInvalid||"The value is not correct")}clearControlMessages(t){t.classList.remove("afova-active"),t.classList.remove("afova-control"),t.removeAttribute("aria-invalid"),t.removeAttribute("aria-errormessage");const e=this.findMessageContainer(t);e&&e.remove();let s=this.getContext(t);s&&s.classList.remove("afova-active")}setControlMessage(t,e){const s=this.getContext(t);s&&s.classList.add("afova-active"),t.classList.add("afova-active"),t.setAttribute("aria-invalid","true"),this.putMessage(t),e&&t.focus()}validateControl(t,e){return this.clearControlMessages(t),t.validity.valid||this.setControlMessage(t,e),t.validity.valid}getFormElements(t){const e=[];for(const s of t.elements)r.includes(s.type)||e.push(s);return e}validateForm(t,e){let s;for(const r of this.getFormElements(t)){const t=this.validateControl(r);s||t||(s=r)}s&&(null==e||e.preventDefault(),this.settings.focusOnFirstError&&s.focus())}resetForm(t){for(let e of this.getFormElements(t))this.clearControlMessages(e)}prepareForms(){const t=document.querySelectorAll(this.settings.selector||"form");for(const e of t){e.setAttribute("novalidate",""),this.ensureId(e),e.addEventListener("submit",this.formSubmitListener.bind(this)),e.addEventListener("reset",this.formResetListener.bind(this));for(const t of this.getFormElements(e))this.prepareControl(t)}}formSubmitListener(t){this.validateForm(t.target,t)}formResetListener(t){this.resetForm(t.target)}unprepareForms(){const t=document.querySelectorAll(this.settings.selector||"form");for(const e of t){e.removeAttribute("novalidate"),e.removeEventListener("submit",this.formSubmitListener),e.removeEventListener("reset",this.formResetListener);for(const t of this.getFormElements(e))this.unprepareControl(t)}}prepareControl(t){this.ensureId(t),t.classList.add("afova-control"),this.settings.validateOnChange&&t.addEventListener("change",this.controlChangeListener.bind(this))}controlChangeListener(t){this.validateControl(t.target,!0)}unprepareControl(t){t.classList.remove("afova-control"),t.removeEventListener("change",this.controlChangeListener)}getContext(t){let e=t.closest(".afova-context");return e||(e=t.closest("label"),e&&!e.htmlFor&&(e.htmlFor=t.id)),e}init(t){this.setOptions(t),this.prepareForms()}clear(){this.unprepareForms()}validate(){const t=document.querySelectorAll(this.settings.selector||"form");for(const e of t)this.validateForm(e)}isInvalid(){let t="form";this.settings.selector&&(t=this.settings.selector);const e=document.querySelectorAll(t);for(const s of e)if(!s.checkValidity())return!0;return!1}}return function(){const t=new n;return{init:e=>t.init(e),clear:()=>t.clear(),validate:()=>t.validate(),isInvalid:()=>t.isInvalid()}}()}();
