const B = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let P = (r = 21) => {
  let o = "", c = crypto.getRandomValues(new Uint8Array(r));
  for (; r--; )
    o += B[c[r] & 63];
  return o;
};
const G = {
  message: "The input cannot be processed"
}, W = {
  message: "The value does not match the required pattern of {{constraint}}",
  constraint: "pattern"
}, z = {
  message: "The value is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
}, H = {
  message: "The value is too small. It must be at least {{constraint}}.",
  constraint: "min"
}, Z = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, j = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, X = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, Y = {
  message: "The value {{input}} must be of type {{constraint}}",
  constraint: "type",
  email: "The value {{input}} is not a valid email address. Please provide an email address.",
  url: "The value {{inptu}} is not a valid URL. Please provide a URL in the format http://url.com.",
  tel: "The value {{input}} is not a valid phone number. Please provide a phone number."
}, J = {
  message: "Please provide a value",
  constraint: "required"
}, K = {
  badInput: G,
  patternMismatch: W,
  rangeOverflow: z,
  rangeUnderflow: H,
  stepMismatch: Z,
  tooLong: j,
  tooShort: X,
  typeMismatch: Y,
  valueMissing: J
}, Q = {
  message: "Die Eingabe kann nicht verarbeitet werden"
}, ee = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, te = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, ne = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, se = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, ae = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, ie = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, re = {
  message: "Der Eingabewert {{input}} muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert {{input}} ist keine E-Mail Adresse. Bitte geben Sie eine E-Mail Adresse ein.",
  tel: "Der Eingabewert {{input}} ist keine Telefonnummer. Bitte geben Sie eine Telefonnummer ein.",
  url: "Der Eingabewert {{input}} ist kein URL. Bitte geben Sie eine URL im Format http://url.com ein."
}, oe = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, ce = {
  badInput: Q,
  patternMismatch: ee,
  rangeOverflow: te,
  rangeUnderflow: ne,
  stepMismatch: se,
  tooLong: ae,
  tooShort: ie,
  typeMismatch: re,
  valueMissing: oe
}, le = [
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
], A = "form", S = ".afova-form-message-container", me = {
  selector: A,
  formMessageSelector: S,
  validateOnChange: !1,
  focusOnFirstError: !0
}, d = {
  en: K,
  de: ce
}, fe = ["submit", "reset", "button", "fieldset"];
function ue() {
  let r = navigator.language, o = d[r];
  if (o)
    return console.log(`afova is using locale=[${r}]`), o;
  const c = r.indexOf("-");
  return c && (r = r.substring(0, c), r && (o = d[r])), o ? (console.log(`afova is using language=[${r}]`), o) : (console.log("afova is using language=[en]"), d.en);
}
function ge(r) {
  let o = ue();
  function c(e) {
    e.id || (e.id = `afova-${P()}`);
  }
  function v(e) {
    const t = C(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function g(e) {
    h(e) ? e.style.display = "none" : e.style.display = "";
  }
  function p(e) {
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
    let t = v(e);
    if (!t) {
      const s = C(e) || e;
      t = document.createElement("ul"), (n = s.parentNode) == null || n.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function x(e, t) {
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
          let k = new RegExp("{{\\s*constraint\\s*}}", "ig");
          a = a.replace(k, i);
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
  function w(e) {
    var n, s;
    const t = u(e);
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
    const n = p(e);
    if (n) {
      let s;
      n.tagName == "UL" || n.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.setAttribute("afova-message-for", e.id), s.classList.add("afova-collected-message");
      const a = w(e);
      if (a) {
        const l = document.createElement("DIV");
        l.innerText = a, l.classList.add("afova-message-label"), s.appendChild(l);
      }
      const i = document.createElement("DIV");
      i.innerText = t, i.classList.add("afova-message"), s.appendChild(i), n.appendChild(s), g(n);
    }
  }
  function D(e) {
    const t = I(e), n = e.validity;
    let s;
    t.tagName == "UL" || t.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), t.appendChild(s);
    for (const a of le)
      if (n[a]) {
        let i = x(
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
    const n = v(e);
    n && h(n) && n.remove();
    let s = u(e);
    s && document.querySelectorAll(
      `#${s.id} [aria-invalid].afova-control`
    ).length == 0 && s.classList.remove("afova-active");
    const a = p(e);
    a && g(a);
  }
  function O(e, t) {
    const n = u(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), D(e), t && e.focus();
  }
  function L(e, t) {
    return E(e), e.validity.valid || O(e, t), e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const n of e.elements)
      fe.includes(n.type) || t.push(n);
    return t;
  }
  function _(e, t) {
    let n;
    for (const s of f(e)) {
      const a = L(s);
      !n && !a && (n = s);
    }
    n && (t == null || t.preventDefault(), m.focusOnFirstError && n.focus());
  }
  function N(e) {
    for (let t of f(e))
      E(t);
  }
  function F() {
    const e = document.querySelectorAll(
      m.selector || A
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", M), t.addEventListener("reset", T);
      for (const s of f(t))
        $(s);
      t.setAttribute("novalidate", "");
      const n = t.querySelector(
        m.formMessageSelector || S
      );
      n && (c(n), g(n), t.setAttribute(
        "afova-form-message-container-id",
        n.id
      ), n.classList.add("afova-form-message-container"));
    }
  }
  function M(e) {
    e.preventDefault(), _(e.target, e);
  }
  function T(e) {
    N(e.target);
  }
  function R() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", M), t.removeEventListener("reset", T);
      for (const n of f(t))
        U(n);
    }
  }
  function $(e) {
    c(e), u(e), e.classList.add("afova-control"), m.validateOnChange && e.addEventListener("change", y);
  }
  function y(e) {
    L(e.target, !0);
  }
  function U(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", y);
  }
  function u(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function C(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t;
  }
  function q() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e)
      _(t);
  }
  function V() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e)
      if (!t.checkValidity())
        return !0;
    return !1;
  }
  let m = Object.assign({}, me, r);
  return F(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => R(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => q(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => V()
  };
}
export {
  ge as afova
};
