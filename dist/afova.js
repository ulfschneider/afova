const G = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let P = (r = 21) => {
  let o = "", c = crypto.getRandomValues(new Uint8Array(r));
  for (; r--; )
    o += G[c[r] & 63];
  return o;
};
const W = {
  message: "The input {{input}} cannot be processed"
}, z = {
  message: "The value {{input}} does not match the required pattern of {{constraint}}",
  constraint: "pattern"
}, H = {
  message: "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
}, Z = {
  message: "The value {{input}} is too small. It must be at least {{constraint}}.",
  constraint: "min"
}, j = {
  message: "The value {{input}} is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, X = {
  message: "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, Y = {
  message: "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, J = {
  message: "The value {{input}} must be of type {{constraint}}",
  constraint: "type",
  email: "The value {{input}} is not a valid email address. Please provide an email address.",
  url: "The value {{inptu}} is not a valid URL. Please provide a URL in the format http://url.com.",
  tel: "The value {{input}} is not a valid phone number. Please provide a phone number."
}, K = {
  message: "Please provide a value",
  constraint: "required"
}, Q = {
  badInput: W,
  patternMismatch: z,
  rangeOverflow: H,
  rangeUnderflow: Z,
  stepMismatch: j,
  tooLong: X,
  tooShort: Y,
  typeMismatch: J,
  valueMissing: K
}, ee = {
  message: "Die Eingabe {{input}} kann nicht verarbeitet werden"
}, te = {
  message: "Der Eingabewert {{input}} entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, ne = {
  message: "Der Eingabewert {{input}} ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, se = {
  message: "Der Eingabewert {{input}} ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, ae = {
  message: "Der Eingabewert {{input}} ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, ie = {
  message: "Der Eingabewert {{input}} ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, re = {
  message: "Der Eingabewert {{input}} ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, oe = {
  message: "Der Eingabewert {{input}} muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert {{input}} ist keine E-Mail Adresse. Bitte geben Sie eine E-Mail Adresse ein.",
  tel: "Der Eingabewert {{input}} ist keine Telefonnummer. Bitte geben Sie eine Telefonnummer ein.",
  url: "Der Eingabewert {{input}} ist kein URL. Bitte geben Sie eine URL im Format http://url.com ein."
}, ce = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, le = {
  badInput: ee,
  patternMismatch: te,
  rangeOverflow: ne,
  rangeUnderflow: se,
  stepMismatch: ae,
  tooLong: ie,
  tooShort: re,
  typeMismatch: oe,
  valueMissing: ce
}, ue = [
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
], S = "form", A = ".afova-form-message-container", fe = {
  selector: S,
  formMessageSelector: A,
  validateOnChange: !1,
  focusOnFirstError: !0
}, p = {
  en: Q,
  de: le
}, me = ["submit", "reset", "button", "fieldset"];
function ge() {
  let r = navigator.language, o = p[r];
  if (o)
    return console.log(`afova is using locale=[${r}]`), o;
  const c = r.indexOf("-");
  return c && (r = r.substring(0, c), r && (o = p[r])), o ? (console.log(`afova is using language=[${r}]`), o) : (console.log("afova is using language=[en]"), p.en);
}
function de(r) {
  let o = ge();
  function c(e) {
    e.id || (e.id = `afova-${P()}`);
  }
  function g(e) {
    const t = C(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function d(e) {
    h(e) ? e.style.display = "none" : e.style.display = "";
  }
  function v(e) {
    const t = e.closest("form");
    if (t) {
      const n = t.getAttribute("afova-form-message-container-id");
      if (n)
        return document.querySelector(`#${n}`);
    }
    return null;
  }
  function h(e) {
    return e.children.length == 0;
  }
  function I(e) {
    var n;
    let t = g(e);
    if (!t) {
      const s = C(e) || e;
      t = document.createElement("ul"), (n = s.parentNode) == null || n.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function x(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), n = g(e);
      if (n) {
        for (let s of t)
          if (n.querySelector(`[afova-message-for="${s.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function w(e, t) {
    if (e != "customError") {
      let n = o[e];
      if (n) {
        let s = n.constraint, a = (
          //a message defined for the control has highest prio
          t.dataset[s || e] || //a default message specific for the input type has second hightest prio
          o[e][t.type] || //a default message has last prio
          n.message
        );
        const i = t.getAttribute(s || "");
        if (i) {
          let B = new RegExp("{{\\s*constraint\\s*}}", "ig");
          a = a.replace(B, i);
        }
        let l = new RegExp("{{\\s*input\\s*}}", "ig");
        return a = a.replace(
          l,
          t.value
        ), a;
      }
    }
    return t.validationMessage;
  }
  function D(e) {
    var n, s;
    const t = m(e);
    if (t) {
      let a = t.querySelector(".afova-label");
      if (!a && t.tagName != "LABEL" && (a = t.querySelector("label")), a || (a = t), a) {
        let i = "";
        for (const l of a.childNodes)
          l.nodeType == Node.TEXT_NODE && (i && ((n = l.textContent) != null && n.trim()) && (i += " "), (s = l.textContent) != null && s.trim() && (i += l.textContent.trim()));
        return i;
      }
    }
    return "";
  }
  function b(e, t) {
    const n = v(e);
    if (n) {
      let s;
      n.tagName == "UL" || n.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.setAttribute("afova-message-for", e.id), s.classList.add("afova-collected-message");
      const a = D(e);
      if (a) {
        const l = document.createElement("DIV");
        l.innerText = a, l.classList.add("afova-message-label"), s.appendChild(l);
      }
      const i = document.createElement("DIV");
      i.innerText = t, i.classList.add("afova-message"), s.appendChild(i), n.appendChild(s), d(n);
    }
  }
  function O(e) {
    if (x(e))
      return;
    const t = I(e), n = e.validity;
    let s;
    t.tagName == "UL" || t.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), t.appendChild(s);
    for (const a of ue)
      if (n[a]) {
        let i = w(
          a,
          e
        );
        i && (s.innerHTML = i, b(e, i));
        break;
      }
    s.innerHTML || (s.innerHTML = e.dataset.errorInvalid || o.badInput.message, b(
      e,
      e.dataset.errorInvalid || o.badInput.message
    ));
  }
  function E(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const i of t)
      i.remove();
    const n = g(e);
    n && h(n) && n.remove();
    let s = m(e);
    s && document.querySelectorAll(
      `#${s.id} [aria-invalid].afova-control`
    ).length == 0 && s.classList.remove("afova-active");
    const a = v(e);
    a && d(a);
  }
  function N(e, t) {
    const n = m(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), O(e), t && e.focus();
  }
  function L(e, t) {
    return E(e), e.validity.valid || N(e, t), e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const n of e.elements)
      me.includes(n.type) || t.push(n);
    return t;
  }
  function _(e, t) {
    let n;
    for (const s of f(e)) {
      const a = L(s);
      !n && !a && (n = s);
    }
    n && (t == null || t.preventDefault(), u.focusOnFirstError && n.focus());
  }
  function F(e) {
    for (let t of f(e))
      E(t);
  }
  function $() {
    const e = document.querySelectorAll(
      u.selector || S
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", M), t.addEventListener("reset", y);
      for (const s of f(t))
        q(s);
      t.setAttribute("novalidate", "");
      const n = t.querySelector(
        u.formMessageSelector || A
      );
      n && (c(n), d(n), t.setAttribute(
        "afova-form-message-container-id",
        n.id
      ), n.classList.add("afova-form-message-container"));
    }
  }
  function M(e) {
    e.preventDefault(), _(e.target, e);
  }
  function y(e) {
    F(e.target);
  }
  function R() {
    const e = document.querySelectorAll(u.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", M), t.removeEventListener("reset", y);
      for (const n of f(t))
        U(n);
    }
  }
  function q(e) {
    c(e), m(e), e.classList.add("afova-control"), u.validateOnChange && e.addEventListener("change", T);
  }
  function T(e) {
    L(e.target, !0);
  }
  function U(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", T);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function C(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t;
  }
  function V() {
    const e = document.querySelectorAll(u.selector || "form");
    for (const t of e)
      _(t);
  }
  function k() {
    const e = document.querySelectorAll(u.selector || "form");
    for (const t of e)
      if (!t.checkValidity())
        return !0;
    return !1;
  }
  let u = Object.assign({}, fe, r);
  return $(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => R(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => V(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => k()
  };
}
export {
  de as afova
};
