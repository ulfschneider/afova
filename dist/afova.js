const k = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let B = (r = 21) => {
  let i = "", c = crypto.getRandomValues(new Uint8Array(r));
  for (; r--; )
    i += k[c[r] & 63];
  return i;
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
}, P = {
  message: "The value is not in within the correct step interval of {{constraint}}",
  constraint: "step"
}, Z = {
  message: "The value is too long. It cannot be longer than {{constraint}} characters.",
  constraint: "maxlength"
}, j = {
  message: "The value is too short. It must be at least {{constraint}} characters long.",
  constraint: "minlength"
}, X = {
  message: "The value must be of type {{constraint}}",
  constraint: "type",
  email: "The value must be an email address",
  url: "The value must be a URL in the format http://url.com",
  tel: "The value must be a phone number"
}, Y = {
  message: "Please provide a value",
  constraint: "required"
}, J = {
  badInput: G,
  patternMismatch: W,
  rangeOverflow: z,
  rangeUnderflow: H,
  stepMismatch: P,
  tooLong: Z,
  tooShort: j,
  typeMismatch: X,
  valueMissing: Y
}, K = {
  message: "Die Eingabe kann nicht verarbeitet werden"
}, Q = {
  message: "Der Eingabewert entspricht nicht dem erforderlichen Format {{constraint}}",
  constraint: "pattern"
}, ee = {
  message: "Der Eingabewert ist zu groß. Der Wert darf nicht größer sein als {{constraint}}.",
  constraint: "max"
}, te = {
  message: "Der Eingabewert ist zu klein. Der Wert darf nicht kleiner sein als {{constraint}}.",
  constraint: "min"
}, ne = {
  message: "Der Eingabewert ist nicht in der richtigen Schrittfolge von {{constraint}}",
  constraint: "step"
}, se = {
  message: "Der Eingabewert ist zu lang. Der Wert darf nicht mehr als {{constraint}} Zeichen haben.",
  constraint: "maxlength"
}, ae = {
  message: "Der Eingabewert ist zu kurz. Der Wert muss mindestens {{constraint}} Zeichen lang sein.",
  constraint: "minlength"
}, oe = {
  message: "Der Eingabewert muss vom Typ {{constraint}} sein",
  constraint: "type",
  email: "Der Eingabewert muss eine E-Mail Adresse sein",
  tel: "Der Eingabewert muss eine Telefonnummer sein",
  url: "Der Eingabewert muss eine URL im Format http://url.com sein"
}, re = {
  message: "Bitte machen Sie eine Eingabe",
  constraint: "required"
}, ie = {
  badInput: K,
  patternMismatch: Q,
  rangeOverflow: ee,
  rangeUnderflow: te,
  stepMismatch: ne,
  tooLong: se,
  tooShort: ae,
  typeMismatch: oe,
  valueMissing: re
}, ce = [
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
], A = "form", I = ".afova-message-collector", le = {
  selector: A,
  collectSelector: I,
  validateOnChange: !1,
  focusOnFirstError: !0
}, d = {
  en: J,
  de: ie
}, me = ["submit", "reset", "button", "fieldset"];
function fe() {
  let r = navigator.language, i = d[r];
  if (i)
    return console.log(`afova is using locale=[${r}]`), i;
  const c = r.indexOf("-");
  return c && (r = r.substring(0, c), r && (i = d[r])), i ? (console.log(`afova is using language=[${r}]`), i) : (console.log("afova is using language=[en]"), d.en);
}
function ue(r) {
  let i = fe();
  function c(e) {
    e.id || (e.id = `afova-${B()}`);
  }
  function v(e) {
    const t = M(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function g(e) {
    p(e) ? e.style.display = "none" : e.style.display = "";
  }
  function h(e) {
    const t = e.closest("form");
    if (t) {
      const n = t.getAttribute("afova-message-collector-id");
      if (n)
        return document.querySelector(`#${n}`);
    }
    return null;
  }
  function p(e) {
    return e.children.length == 0;
  }
  function S(e) {
    var n;
    let t = v(e);
    if (!t) {
      const s = M(e) || e;
      t = document.createElement("ul"), (n = s.parentNode) == null || n.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function w(e, t) {
    if (e != "customError") {
      let n = i[e];
      if (n) {
        let s = n.constraint, a = (
          //a message defined for the control has highest prio
          t.dataset[s || e] || //a default message specific for the input type has second hightest prio
          i[e][t.type] || //a default message has last prio
          n.message
        );
        const o = t.getAttribute(s || "");
        if (o) {
          const l = new RegExp("{{\\s*constraint\\s*}}", "ig");
          a = a.replace(l, o);
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
      if (!a && t.tagName != "LABEL" && (a = t.querySelector("label")), a || (a = t), a) {
        let o = "";
        for (const l of a.childNodes)
          l.nodeType == Node.TEXT_NODE && (o && ((n = l.textContent) != null && n.trim()) && (o += " "), (s = l.textContent) != null && s.trim() && (o += l.textContent.trim()));
        return o;
      }
    }
    return "";
  }
  function b(e, t) {
    const n = h(e);
    if (n) {
      let s;
      n.tagName == "UL" || n.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.setAttribute("afova-message-for", e.id), s.classList.add("afova-collected-message");
      const a = x(e);
      if (a) {
        const l = document.createElement("DIV");
        l.innerText = a, l.classList.add("afova-message-label"), s.appendChild(l);
      }
      const o = document.createElement("DIV");
      o.innerText = t, o.classList.add("afova-message"), s.appendChild(o), n.appendChild(s), g(n);
    }
  }
  function D(e) {
    const t = S(e), n = e.validity;
    let s;
    t.tagName == "UL" || t.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), t.appendChild(s);
    for (const a of ce)
      if (n[a]) {
        let o = w(
          a,
          e
        );
        o && (s.innerHTML = o, b(e, o));
        break;
      }
    s.innerHTML || (s.innerHTML = e.dataset.errorInvalid || i.badInput.message, b(
      e,
      e.dataset.errorInvalid || i.badInput.message
    ));
  }
  function E(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const o of t)
      o.remove();
    const n = v(e);
    n && p(n) && n.remove();
    let s = u(e);
    s && document.querySelectorAll(
      `#${s.id} [aria-invalid].afova-control`
    ).length == 0 && s.classList.remove("afova-active");
    const a = h(e);
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
      me.includes(n.type) || t.push(n);
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
  function $() {
    const e = document.querySelectorAll(
      m.selector || A
    );
    for (const t of e) {
      t.setAttribute("novalidate", ""), c(t), t.addEventListener("submit", T), t.addEventListener("reset", y);
      for (const s of f(t))
        F(s);
      const n = t.querySelector(
        m.collectSelector || I
      );
      n && (c(n), g(n), t.setAttribute("afova-message-collector-id", n.id), n.classList.add("afova-message-collector"));
    }
  }
  function T(e) {
    e.preventDefault(), _(e.target, e);
  }
  function y(e) {
    N(e.target);
  }
  function q() {
    const e = document.querySelectorAll(m.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", T), t.removeEventListener("reset", y);
      for (const n of f(t))
        U(n);
    }
  }
  function F(e) {
    c(e), u(e), e.classList.add("afova-control"), m.validateOnChange && e.addEventListener("change", C);
  }
  function C(e) {
    L(e.target, !0);
  }
  function U(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", C);
  }
  function u(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function M(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t;
  }
  function R() {
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
  let m = Object.assign({}, le, r);
  return $(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => q(),
    /**
    * Trigger the validation. In most cases not required, as afova will trigger
     the validation automatically when submitting any of the selected forms.
    */
    validate: () => R(),
    /**
     * Verify if any of the forms selected according to the settings object is invalid
     * @returns true if at least one form is invalid
     */
    isInvalid: () => V()
  };
}
export {
  ue as afova
};
