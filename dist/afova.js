const F = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let N = (a = 21) => {
  let r = "", i = crypto.getRandomValues(new Uint8Array(a));
  for (; a--; )
    r += F[i[a] & 63];
  return r;
};
const q = {
  message: "The input cannot be processed"
}, R = {
  message: "The value does not match the required pattern of {{constraint}}",
  constraint: "pattern"
}, U = {
  message: "The value is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
}, k = {
  message: "The value is too small. It must be at least {{constraint}}.",
  constraint: "min"
}, V = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, G = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, W = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, z = {
  message: "The value must be of type {{constraint}}",
  constraint: "type",
  email: "The value must be an email address",
  url: "The value must be a URL in the format http://url.com",
  tel: "The value must be a phone number"
}, B = {
  message: "Please provide a value",
  constraint: "required"
}, H = {
  badInput: q,
  patternMismatch: R,
  rangeOverflow: U,
  rangeUnderflow: k,
  stepMismatch: V,
  tooLong: G,
  tooShort: W,
  typeMismatch: z,
  valueMissing: B
}, P = {
  message: "Die Eingabe kann nicht verarbeitet werden"
}, Z = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, j = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, Y = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, J = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, K = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, Q = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, X = {
  message: "Der Eingabewert muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert muss eine E-Mail Adresse sein",
  tel: "Der Eingabewert muss eine Telefonnummer sein",
  url: "Der Eingabewert muss eine URL im Format http://url.com sein"
}, ee = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, te = {
  badInput: P,
  patternMismatch: Z,
  rangeOverflow: j,
  rangeUnderflow: Y,
  stepMismatch: J,
  tooLong: K,
  tooShort: Q,
  typeMismatch: X,
  valueMissing: ee
}, ne = [
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
], se = {
  selector: "form",
  validateOnChange: !1,
  focusOnFirstError: !0
}, f = {
  en: H,
  de: te
}, ae = ["submit", "reset", "button", "fieldset"];
function re() {
  let a = navigator.language, r = f[a];
  if (r)
    return console.log(`afova is using locale=[${a}]`), r;
  const i = a.indexOf("-");
  return i && (a = a.substring(0, i), a && (r = f[a])), r ? (console.log(`afova is using language=[${a}]`), r) : (console.log("afova is using language=[en]"), f.en);
}
function oe(a) {
  let r = re();
  function i(e) {
    e.id || (e.id = `afova-${N()}`);
  }
  function g(e) {
    const t = _(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function M(e) {
    return e.children.length > 0;
  }
  function L(e) {
    var n;
    let t = g(e);
    if (!t) {
      const s = _(e) || e;
      t = document.createElement("ul"), (n = s.parentNode) == null || n.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function y(e, t) {
    if (e != "customError") {
      let n = r[e];
      if (n) {
        let s = n.constraint, o = (
          //a message defined for the control has highest prio
          t.dataset[s || e] || //a default message specific for the input type has second hightest prio
          r[e][t.type] || //a default message has last prio
          n.message
        );
        const l = t.getAttribute(s || "");
        if (l) {
          const $ = new RegExp("{{\\s*constraint\\s*}}", "ig");
          o = o.replace($, l);
        }
        return o;
      }
    }
    return t.validationMessage;
  }
  function T(e) {
    const t = L(e), n = e.validity, s = document.createElement("li");
    s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), t.appendChild(s);
    for (const o of ne)
      if (n[o]) {
        let l = y(
          o,
          e
        );
        l && (s.innerHTML = l);
        break;
      }
    s.innerHTML || (s.innerHTML = e.dataset.errorInvalid || r.badInput.message);
  }
  function d(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const o of t)
      o.remove();
    const n = g(e);
    n && M(n) && n.remove();
    let s = m(e);
    s && document.querySelectorAll(
      `#${s.id} [aria-invalid].afova-control`
    ).length == 0 && s.classList.remove("afova-active");
  }
  function w(e, t) {
    const n = m(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), T(e), t && e.focus();
  }
  function v(e, t) {
    return d(e), e.validity.valid || w(e, t), e.validity.valid;
  }
  function u(e) {
    const t = [];
    for (const n of e.elements)
      ae.includes(n.type) || t.push(n);
    return t;
  }
  function h(e, t) {
    let n;
    for (const s of u(e)) {
      const o = v(s);
      !n && !o && (n = s);
    }
    n && (t == null || t.preventDefault(), c.focusOnFirstError && n.focus());
  }
  function A(e) {
    for (let t of u(e))
      d(t);
  }
  function C() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e) {
      t.setAttribute("novalidate", ""), i(t), t.addEventListener("submit", p), t.addEventListener("reset", b);
      for (const n of u(t))
        I(n);
    }
  }
  function p(e) {
    e.preventDefault(), h(e.target, e);
  }
  function b(e) {
    A(e.target);
  }
  function S() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", p), t.removeEventListener("reset", b);
      for (const n of u(t))
        D(n);
    }
  }
  function I(e) {
    i(e), m(e), e.classList.add("afova-control"), c.validateOnChange && e.addEventListener("change", E);
  }
  function E(e) {
    v(e.target, !0);
  }
  function D(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", E);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (i(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function _(e) {
    const t = e.closest(".afova-group");
    return t && i(t), t;
  }
  function O() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e)
      h(t);
  }
  function x() {
    const e = document.querySelectorAll(c.selector || "form");
    for (const t of e)
      if (!t.checkValidity())
        return !0;
    return !1;
  }
  let c = Object.assign({}, se, a);
  return C(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => S(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => O(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => x()
  };
}
export {
  oe as afova
};
