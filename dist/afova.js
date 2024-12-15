const V = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let k = (o = 21) => {
  let i = "", c = crypto.getRandomValues(new Uint8Array(o));
  for (; o--; )
    i += V[c[o] & 63];
  return i;
};
const B = {
  message: "The input cannot be processed"
}, G = {
  message: "The value does not match the required pattern of {{constraint}}",
  constraint: "pattern"
}, W = {
  message: "The value is too big. It cannot be bigger than {{constraint}}.",
  constraint: "max"
}, z = {
  message: "The value is too small. It must be at least {{constraint}}.",
  constraint: "min"
}, H = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, P = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, Z = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, j = {
  message: "The value must be of type {{constraint}}",
  constraint: "type",
  email: "The value must be an email address",
  url: "The value must be a URL in the format http://url.com",
  tel: "The value must be a phone number"
}, X = {
  message: "Please provide a value",
  constraint: "required"
}, Y = {
  badInput: B,
  patternMismatch: G,
  rangeOverflow: W,
  rangeUnderflow: z,
  stepMismatch: H,
  tooLong: P,
  tooShort: Z,
  typeMismatch: j,
  valueMissing: X
}, J = {
  message: "Die Eingabe kann nicht verarbeitet werden"
}, K = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, Q = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, ee = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, te = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, ne = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, se = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, ae = {
  message: "Der Eingabewert muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert muss eine E-Mail Adresse sein",
  tel: "Der Eingabewert muss eine Telefonnummer sein",
  url: "Der Eingabewert muss eine URL im Format http://url.com sein"
}, oe = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, re = {
  badInput: J,
  patternMismatch: K,
  rangeOverflow: Q,
  rangeUnderflow: ee,
  stepMismatch: te,
  tooLong: ne,
  tooShort: se,
  typeMismatch: ae,
  valueMissing: oe
}, ie = [
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
], M = "form", C = ".afova-message-collector", ce = {
  selector: M,
  collectSelector: C,
  validateOnChange: !1,
  focusOnFirstError: !0
}, g = {
  en: Y,
  de: re
}, le = ["submit", "reset", "button", "fieldset"];
function me() {
  let o = navigator.language, i = g[o];
  if (i)
    return console.log(`afova is using locale=[${o}]`), i;
  const c = o.indexOf("-");
  return c && (o = o.substring(0, c), o && (i = g[o])), i ? (console.log(`afova is using language=[${o}]`), i) : (console.log("afova is using language=[en]"), g.en);
}
function fe(o) {
  let i = me();
  function c(e) {
    e.id || (e.id = `afova-${k()}`);
  }
  function d(e) {
    const t = _(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function y(e) {
    const t = e.closest("form");
    if (t) {
      const n = t.getAttribute("afova-message-collector-id");
      if (n)
        return document.querySelector(`#${n}`);
    }
    return null;
  }
  function A(e) {
    return e.children.length == 0;
  }
  function I(e) {
    var n;
    let t = d(e);
    if (!t) {
      const s = _(e) || e;
      t = document.createElement("ul"), (n = s.parentNode) == null || n.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function S(e, t) {
    if (e != "customError") {
      let n = i[e];
      if (n) {
        let s = n.constraint, a = (
          //a message defined for the control has highest prio
          t.dataset[s || e] || //a default message specific for the input type has second hightest prio
          i[e][t.type] || //a default message has last prio
          n.message
        );
        const r = t.getAttribute(s || "");
        if (r) {
          const l = new RegExp("{{\\s*constraint\\s*}}", "ig");
          a = a.replace(l, r);
        }
        return a;
      }
    }
    return t.validationMessage;
  }
  function x(e) {
    var n, s;
    const t = u(e);
    if (t) {
      let a = t.querySelector(".afova-label");
      if (a)
        return a.innerText;
      if (t.tagName != "LABEL" ? a = t.querySelector("label") : a = t, a) {
        let r = "";
        for (const l of a.childNodes)
          l.nodeType == Node.TEXT_NODE && (r && ((n = l.textContent) != null && n.trim()) && (r += " "), (s = l.textContent) != null && s.trim() && (r += l.textContent.trim()));
        return r;
      }
    }
    return "";
  }
  function v(e, t) {
    const n = y(e);
    if (n) {
      let s;
      n.tagName == "UL" || n.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.setAttribute("afova-message-for", e.id), s.classList.add("afova-message");
      const a = x(e);
      if (a) {
        const l = document.createElement("DIV");
        l.innerText = a, s.appendChild(l);
      }
      const r = document.createElement("DIV");
      r.innerText = t, s.appendChild(r), n.appendChild(s);
    }
  }
  function w(e) {
    const t = I(e), n = e.validity;
    let s;
    t.tagName == "UL" || t.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), t.appendChild(s);
    for (const a of ie)
      if (n[a]) {
        let r = S(
          a,
          e
        );
        r && (s.innerHTML = r, v(e, r));
        break;
      }
    s.innerHTML || (s.innerHTML = e.dataset.errorInvalid || i.badInput.message, v(
      e,
      e.dataset.errorInvalid || i.badInput.message
    ));
  }
  function h(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const a of t)
      a.remove();
    const n = d(e);
    n && A(n) && n.remove();
    let s = u(e);
    s && document.querySelectorAll(
      `#${s.id} [aria-invalid].afova-control`
    ).length == 0 && s.classList.remove("afova-active");
  }
  function D(e, t) {
    const n = u(e);
    n && n.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), w(e), t && e.focus();
  }
  function p(e, t) {
    return h(e), e.validity.valid || D(e, t), e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const n of e.elements)
      le.includes(n.type) || t.push(n);
    return t;
  }
  function b(e, t) {
    let n;
    for (const s of f(e)) {
      const a = p(s);
      !n && !a && (n = s);
    }
    n && (t == null || t.preventDefault(), m.focusOnFirstError && n.focus());
  }
  function O(e) {
    for (let t of f(e))
      h(t);
  }
  function N() {
    const e = document.querySelectorAll(
      m.selector || M
    );
    for (const t of e) {
      t.setAttribute("novalidate", ""), c(t), t.addEventListener("submit", E), t.addEventListener("reset", L);
      for (const s of f(t))
        q(s);
      const n = t.querySelector(
        m.collectSelector || C
      );
      n && (c(n), t.setAttribute("afova-message-collector-id", n.id), n.classList.add("afova-message-collector"));
    }
  }
  function E(e) {
    e.preventDefault(), b(e.target, e);
  }
  function L(e) {
    O(e.target);
  }
  function $() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", E), t.removeEventListener("reset", L);
      for (const n of f(t))
        F(n);
    }
  }
  function q(e) {
    c(e), u(e), e.classList.add("afova-control"), m.validateOnChange && e.addEventListener("change", T);
  }
  function T(e) {
    p(e.target, !0);
  }
  function F(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", T);
  }
  function u(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function _(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t;
  }
  function U() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e)
      b(t);
  }
  function R() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e)
      if (!t.checkValidity())
        return !0;
    return !1;
  }
  let m = Object.assign({}, ce, o);
  return N(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => $(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => U(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => R()
  };
}
export {
  fe as afova
};
