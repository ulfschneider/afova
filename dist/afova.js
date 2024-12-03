const x = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let $ = (s = 21) => {
  let a = "", i = crypto.getRandomValues(new Uint8Array(s));
  for (; s--; )
    a += x[i[s] & 63];
  return a;
};
const F = {
  message: "The input cannot be processed"
}, N = {
  message: "The value does not match the required pattern of {{constraint}}",
  constraint: "pattern"
}, R = {
  message: "The value is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
}, U = {
  message: "The value is too small. It must be at least {{constraint}}.",
  constraint: "min"
}, q = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, k = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, V = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, W = {
  message: "The value must be of type {{constraint}}",
  constraint: "type",
  email: "The value must be an email address",
  url: "The value must be a URL in the format http://url.com",
  tel: "The value must be a phone number"
}, z = {
  message: "Please provide a value",
  constraint: "required"
}, B = {
  badInput: F,
  patternMismatch: N,
  rangeOverflow: R,
  rangeUnderflow: U,
  stepMismatch: q,
  tooLong: k,
  tooShort: V,
  typeMismatch: W,
  valueMissing: z
}, G = {
  message: "Die Eingabe kann nicht verarbeitet werden"
}, H = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, P = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, Z = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, j = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, Y = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, J = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, K = {
  message: "Der Eingabewert muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert muss eine E-Mail Adresse sein",
  tel: "Der Eingabewert muss eine Telefonnummer sein",
  url: "Der Eingabewert muss eine URL im Format http://url.com sein"
}, Q = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, X = {
  badInput: G,
  patternMismatch: H,
  rangeOverflow: P,
  rangeUnderflow: Z,
  stepMismatch: j,
  tooLong: Y,
  tooShort: J,
  typeMismatch: K,
  valueMissing: Q
}, ee = [
  "badInput",
  "customError",
  "patternMismatch",
  "rangeOverflow",
  "rangeUnderflow",
  "stepMismatch",
  "tooLong",
  "tooShort",
  "typeMismatch",
  "valueMissing"
], te = {
  selector: "form",
  validateOnChange: !1,
  focusOnFirstError: !0
}, f = {
  en: B,
  de: X
}, ne = ["submit", "reset", "button"];
function se() {
  let s = navigator.language, a = f[s];
  if (a)
    return console.log(`afova is using locale=[${s}]`), a;
  const i = s.indexOf("-");
  return i && (s = s.substring(0, i), s && (a = f[s])), a ? (console.log(`afova is using language=[${s}]`), a) : (console.log("afova is using language=[en]"), f.en);
}
function ae(s) {
  let a = se();
  function i(e) {
    e.id || (e.id = `afova-${$()}`);
  }
  function g(e) {
    return document.querySelector(
      `#${e.id}-afova-message-container`
    );
  }
  function M(e) {
    var n;
    let t = g(e);
    return t || (t = document.createElement("ul"), (n = e.parentNode) == null || n.insertBefore(t, e), t.id = `${e.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id)), t;
  }
  function _(e, t) {
    if (e != "customError") {
      let n = a[e];
      if (n) {
        let r = n.constraint, o = (
          //a message defined for the control has highest prio
          t.dataset[r || e] || //a default message specific for the input type has second hightest prio
          a[e][t.type] || //a default message has last prio
          n.message
        );
        const l = t.getAttribute(r || "");
        if (l) {
          const D = new RegExp("{{\\s*constraint\\s*}}", "ig");
          o = o.replace(D, l);
        }
        return o;
      }
    }
    return t.validationMessage;
  }
  function L(e) {
    const t = M(e), n = e.validity, r = document.createElement("li");
    r.classList.add("afova-message"), t.appendChild(r);
    for (const o of ee)
      if (n[o]) {
        let l = _(
          o,
          e
        );
        l && (r.innerHTML = l);
        break;
      }
    r.innerHTML || (r.innerHTML = e.dataset.errorInvalid || a.badInput.message);
  }
  function d(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = g(e);
    t && t.remove();
    let n = m(e);
    n && n.classList.remove("afova-active");
  }
  function T(e, t) {
    const n = m(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), L(e), t && e.focus();
  }
  function v(e, t) {
    return d(e), e.validity.valid || T(e, t), e.validity.valid;
  }
  function u(e) {
    const t = [];
    for (const n of e.elements)
      ne.includes(n.type) || t.push(n);
    return t;
  }
  function h(e, t) {
    let n;
    for (const r of u(e)) {
      const o = v(r);
      !n && !o && (n = r);
    }
    n && (t == null || t.preventDefault(), c.focusOnFirstError && n.focus());
  }
  function w(e) {
    for (let t of u(e))
      d(t);
  }
  function y() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e) {
      t.setAttribute("novalidate", ""), i(t), t.addEventListener("submit", p), t.addEventListener("reset", b);
      for (const n of u(t))
        I(n);
    }
  }
  function p(e) {
    h(e.target, e);
  }
  function b(e) {
    w(e.target);
  }
  function C() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", p), t.removeEventListener("reset", b);
      for (const n of u(t))
        A(n);
    }
  }
  function I(e) {
    i(e), m(e), e.classList.add("afova-control"), c.validateOnChange && e.addEventListener("change", E);
  }
  function E(e) {
    v(e.target, !0);
  }
  function A(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", E);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function S() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e)
      h(t);
  }
  function O() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e)
      if (!t.checkValidity())
        return !0;
    return !1;
  }
  let c = Object.assign({}, te, s);
  return y(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => C(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => S(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => O()
  };
}
export {
  ae as afova
};
