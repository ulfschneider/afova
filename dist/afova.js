const G = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let P = (o = 21) => {
  let c = "", l = crypto.getRandomValues(new Uint8Array(o));
  for (; o--; )
    c += G[l[o] & 63];
  return c;
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
}, ae = {
  message: "Der Eingabewert {{input}} ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, se = {
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
  rangeUnderflow: ae,
  stepMismatch: se,
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
], A = "form", I = ".afova-form-message-container", fe = {
  selector: A,
  formMessageSelector: I,
  validateOnChange: !1,
  focusOnFirstError: !0
}, v = {
  en: Q,
  de: le
}, me = ["submit", "reset", "button", "fieldset"];
function de() {
  let o = navigator.language, c = v[o];
  if (c)
    return console.log(`afova is using locale=[${o}]`), c;
  const l = o.indexOf("-");
  return l && (o = o.substring(0, l), o && (c = v[o])), c ? (console.log(`afova is using language=[${o}]`), c) : (console.log("afova is using language=[en]"), v.en);
}
function ge(o) {
  let c = de();
  function l(e) {
    e.id || (e.id = `afova-${P()}`);
  }
  function d(e) {
    const t = S(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function g(e) {
    b(e) ? e.style.display = "none" : e.style.display = "";
  }
  function h(e) {
    const t = e.closest("form");
    if (t) {
      const n = t.getAttribute("afova-form-message-container-id");
      if (n)
        return document.querySelector(`#${n}`);
    }
    return null;
  }
  function b(e) {
    return e.children.length == 0;
  }
  function x(e) {
    var n;
    let t = d(e);
    if (!t) {
      const a = S(e) || e;
      t = document.createElement("ul"), (n = a.parentNode) == null || n.insertBefore(
        t,
        a
      ), t.id = `${a.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function w(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), n = d(e);
      if (n) {
        for (let a of t)
          if (n.querySelector(`[afova-message-for="${a.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function D(e, t) {
    if (e != "customError") {
      let n = c[e];
      if (n) {
        let a = n.constraint, s = (
          //a message defined for the control has highest prio
          t.dataset[a || e] || //a default message specific for the input type has second hightest prio
          c[e][t.type] || //a default message has last prio
          n.message
        );
        const i = t.getAttribute(a || "");
        if (i) {
          let B = new RegExp("{{\\s*constraint\\s*}}", "ig");
          s = s.replace(B, i);
        }
        let u = new RegExp("{{\\s*input\\s*}}", "ig");
        return s = s.replace(
          u,
          t.value
        ), s;
      }
    }
    return t.validationMessage;
  }
  function O(e) {
    var n, a;
    const t = m(e);
    if (t) {
      let s = t.querySelector(".afova-label");
      if (!s && t.tagName != "LABEL" && (s = t.querySelector("label")), s || (s = t), s) {
        let i = "";
        for (const u of s.childNodes)
          u.nodeType == Node.TEXT_NODE && (i && ((n = u.textContent) != null && n.trim()) && (i += " "), (a = u.textContent) != null && a.trim() && (i += u.textContent.trim()));
        return i;
      }
    }
    return "";
  }
  function E(e, t) {
    const n = h(e);
    if (n) {
      let a;
      n.tagName == "UL" || n.tagName == "OL" ? a = document.createElement("LI") : a = document.createElement("DIV"), a.setAttribute("afova-message-for", e.id), a.classList.add("afova-collected-message");
      const s = O(e);
      if (s) {
        const u = document.createElement("DIV");
        u.innerText = s, u.classList.add("afova-message-label"), a.appendChild(u);
      }
      const i = document.createElement("DIV");
      i.innerText = t, i.classList.add("afova-message"), a.appendChild(i), n.appendChild(a), g(n);
    }
  }
  function N(e) {
    const t = x(e), n = e.validity;
    let a;
    t.tagName == "UL" || t.tagName == "OL" ? a = document.createElement("LI") : a = document.createElement("DIV"), a.classList.add("afova-message"), a.setAttribute("afova-message-for", e.id), t.appendChild(a);
    for (const s of ue)
      if (n[s]) {
        let i = D(
          s,
          e
        );
        i && (a.innerHTML = i, E(e, i));
        break;
      }
    a.innerHTML || (a.innerHTML = e.dataset.errorInvalid || c.badInput.message, E(
      e,
      e.dataset.errorInvalid || c.badInput.message
    ));
  }
  function L(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const i of t)
      i.remove();
    const n = d(e);
    n && b(n) && n.remove();
    let a = m(e);
    a && document.querySelectorAll(
      `#${a.id} [aria-invalid].afova-control`
    ).length == 0 && a.classList.remove("afova-active");
    const s = h(e);
    s && g(s);
  }
  function R(e, t) {
    const n = m(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), w(e) || (N(e), t && e.focus());
  }
  function _(e, t) {
    return L(e), e.validity.valid || R(e, t), e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const n of e.elements)
      me.includes(n.type) || t.push(n);
    return t;
  }
  function y(e) {
    if (e)
      return e.checkValidity();
    {
      const t = document.querySelectorAll(r.selector || "form");
      for (const n of t)
        if (!n.checkValidity())
          return !1;
      return !0;
    }
  }
  function p(e, t) {
    let n, a = !0;
    for (const s of f(e))
      _(s) || (a = !1, n || (n = s));
    return n && (t == null || t.preventDefault(), r.focusOnFirstError && n.focus()), a;
  }
  function V(e) {
    if (e)
      return p(e);
    {
      let t = !0;
      const n = document.querySelectorAll(r.selector || "form");
      for (const a of n)
        p(a) || (t = !1);
      return t;
    }
  }
  function F(e) {
    for (let t of f(e))
      L(t);
  }
  function $() {
    const e = document.querySelectorAll(
      r.selector || A
    );
    for (const t of e) {
      l(t), t.addEventListener("submit", M), t.addEventListener("reset", T);
      for (const a of f(t))
        U(a);
      t.setAttribute("novalidate", "");
      const n = t.querySelector(
        r.formMessageSelector || I
      );
      n && (l(n), g(n), t.setAttribute(
        "afova-form-message-container-id",
        n.id
      ), n.classList.add("afova-form-message-container"));
    }
  }
  function M(e) {
    e.preventDefault(), p(e.target, e), e.target.checkValidity() ? (r.onValid && r.onValid(e), r.onSubmit && r.onSubmit(e)) : r.onInvalid && r.onInvalid(e);
  }
  function T(e) {
    F(e.target), r.onReset && r.onReset(e);
  }
  function q() {
    const e = document.querySelectorAll(r.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", M), t.removeEventListener("reset", T);
      for (const n of f(t))
        k(n);
    }
  }
  function U(e) {
    l(e), m(e), e.classList.add("afova-control"), r.validateOnChange && e.addEventListener("change", C);
  }
  function C(e) {
    _(e.target, !0);
  }
  function k(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", C);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (l(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function S(e) {
    const t = e.closest(".afova-group");
    return t && l(t), t;
  }
  let r = Object.assign({}, fe, o);
  return $(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => q(),
    /**
     * check the validity of the given form
     * @param form to get the valid state for. When the form is not provided it is checked if all of the forms addressed by the selector are valid.
     * @returns true if the form is (or all forms are) valid
     */
    isValid: (e) => y(e),
    /**
     * check the validity of the given form
     * @param form to get the invalid state for. When the form is not provided it is checked if any of the forms addressed by the selector is invalid.
     * @returns true if the form is (or any form) invalid
     */
    isInvalid: (e) => !y(e),
    /**
     * Do the afova form validation and return whether the form is valid
     * @param form to check. When the form is not provided, all forms addressed by the selector are validated.
     * @returns true if the form is (or all forms are) valid
     */
    validate: (e) => V(e)
  };
}
export {
  ge as afova
};
