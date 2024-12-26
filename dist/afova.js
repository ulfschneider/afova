const G = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let P = (f = 21) => {
  let l = "", c = crypto.getRandomValues(new Uint8Array(f));
  for (; f--; )
    l += G[c[f] & 63];
  return l;
};
const v = {
  badInput: void 0,
  customError: void 0,
  patternMismatch: "pattern",
  rangeOverflow: "max",
  rangeUnderflow: "min",
  stepMismatch: "step",
  tooLong: "maxlength",
  tooShort: "minlength",
  typeMismatch: "type",
  valueMissing: "required"
}, B = Object.values(v).filter(
  (f) => f != null
), j = {
  badInput: "The input {{input}} is not valid",
  customError: void 0,
  patternMismatch: "The value {{input}} does not match the required pattern of {{constraint}}",
  rangeOverflow: "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  rangeUnderflow: "The value {{input}} is too small. It must be at least {{constraint}}.",
  stepMismatch: "The value {{input}} is not in within the correct step interval of {{constraint}}",
  tooLong: "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  tooShort: "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  typeMismatch: "The value {{input}} must be of type {{constraint}}",
  valueMissing: "Please provide a value"
}, C = "form", I = ".afova-form-message-container", Y = {
  selector: C,
  formMessageSelector: I,
  validateOnChange: !1,
  focusOnFirstError: !0
}, H = [
  "color",
  "date",
  "datetime-local",
  "email",
  "month",
  "number",
  "range",
  "tel",
  "time",
  "url",
  "week"
], K = ["submit", "reset", "button", "fieldset", "image"];
function W(f) {
  function l(e) {
    e.id || (e.id = `afova-${P()}`);
  }
  function c(e) {
    const t = T(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function m(e) {
    h(e) ? e.style.display = "none" : e.style.display = "";
  }
  function p(e) {
    const t = e.closest("form");
    if (t) {
      const a = t.getAttribute("afova-form-message-container-id");
      if (a)
        return document.querySelector(`#${a}`);
    }
    return null;
  }
  function h(e) {
    return e.children.length == 0;
  }
  function S(e) {
    var a;
    let t = c(e);
    if (!t) {
      const n = T(e) || e;
      t = document.createElement("ul"), (a = n.parentNode) == null || a.insertBefore(
        t,
        n
      ), t.id = `${n.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function M(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), a = c(e);
      if (a) {
        for (let n of t)
          if (a.querySelector(`[afova-message-for="${n.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function N(e, t) {
    if (e != "customError") {
      let a = v[e], n = (
        //a message defined for the control has highest prio
        t.dataset[a || e] || // fallback message has last prio
        j[e]
      );
      const s = t.getAttribute(a || "");
      if (s) {
        let r = new RegExp("{{\\s*constraint\\s*}}", "ig");
        n = n.replace(r, s);
      }
      let i = new RegExp("{{\\s*input\\s*}}", "ig");
      return n = n.replace(
        i,
        t.value
      ), n;
    }
    return t.validationMessage;
  }
  function O(e) {
    var a, n;
    const t = d(e);
    if (t) {
      let s = t.querySelector(".afova-label");
      if (!s && t.tagName != "LABEL" && (s = t.querySelector("label")), s || (s = t), s) {
        let i = "";
        for (const r of s.childNodes)
          r.nodeType == Node.TEXT_NODE && (i && ((a = r.textContent) != null && a.trim()) && (i += " "), (n = r.textContent) != null && n.trim() && (i += r.textContent.trim()));
        return i;
      }
    }
    return "";
  }
  function x(e, t) {
    const a = p(e);
    if (a) {
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.setAttribute("afova-message-for", e.id), n.classList.add("afova-collected-message");
      const s = O(e);
      if (s) {
        const r = document.createElement("DIV");
        r.innerText = s, r.classList.add("afova-message-label"), n.appendChild(r);
      }
      const i = document.createElement("DIV");
      i.innerText = t, i.classList.add("afova-message"), n.appendChild(i), a.appendChild(n), m(a);
    }
  }
  function w(e) {
    const t = S(e), a = e.validity;
    let n;
    t.tagName == "UL" || t.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), t.appendChild(n);
    for (const s of Object.keys(v))
      if (a[s]) {
        let i = N(
          s,
          e
        );
        i && (n.innerHTML = i, x(e, i));
        break;
      }
  }
  function b(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const i of t)
      i.remove();
    const a = c(e);
    a && h(a) && a.remove();
    let n = d(e);
    n && document.querySelectorAll(
      `#${n.id} [aria-invalid].afova-control`
    ).length == 0 && n.classList.remove("afova-active");
    const s = p(e);
    s && m(s);
  }
  function V(e, t) {
    const a = d(e);
    a && a.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), M(e) || (w(e), t && e.focus());
  }
  function y(e, t) {
    return b(e), e.validity.valid || V(e, t), e.validity.valid;
  }
  function u(e) {
    const t = [];
    for (const a of e.elements)
      K.includes(a.type) || t.push(a);
    return t;
  }
  function E(e) {
    if (e)
      return e.checkValidity();
    {
      const t = document.querySelectorAll(o.selector || "form");
      for (const a of t)
        if (!a.checkValidity())
          return !1;
      return !0;
    }
  }
  function g(e, t) {
    let a, n = !0;
    for (const s of u(e))
      y(s) || (n = !1, a || (a = s));
    return a && (t == null || t.preventDefault(), o.focusOnFirstError && a.focus()), n;
  }
  function F(e) {
    if (e)
      return g(e);
    {
      let t = !0;
      const a = document.querySelectorAll(o.selector || "form");
      for (const n of a)
        g(n) || (t = !1);
      return t;
    }
  }
  function $(e) {
    for (let t of u(e))
      b(t);
  }
  function q() {
    const e = document.querySelectorAll(
      o.selector || C
    );
    for (const t of e) {
      l(t), t.addEventListener("submit", A), t.addEventListener("reset", L);
      for (const n of u(t))
        U(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        o.formMessageSelector || I
      );
      a && (l(a), m(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  function A(e) {
    e.preventDefault(), g(e.target, e), e.target.checkValidity() ? (o.onValid && o.onValid(e), o.onSubmit && o.onSubmit(e)) : o.onInvalid && o.onInvalid(e);
  }
  function L(e) {
    $(e.target), o.onReset && o.onReset(e);
  }
  function R() {
    const e = document.querySelectorAll(o.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", A), t.removeEventListener("reset", L);
      for (const a of u(t))
        k(a);
    }
  }
  function D(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a of B)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && (a != "type" || a == "type" && H.includes(e.type))) {
        const n = e.getAttribute("name");
        console.warn(
          n ? `afova: Missing attribute [data-${a}] for the control with [name="${n}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It´s strongly recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It´s strongly recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function U(e) {
    l(e), d(e), e.classList.add("afova-control"), o.validateOnChange && e.addEventListener("change", _), D(e);
  }
  function _(e) {
    y(e.target, !0);
  }
  function k(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", _);
  }
  function d(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (l(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function T(e) {
    const t = e.closest(".afova-group");
    return t && l(t), t;
  }
  let o = Object.assign({}, Y, f);
  return q(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => R(),
    /**
     * check the validity of the given form
     * @param form to get the valid state for. When the form is not provided it is checked if all of the forms addressed by the selector are valid.
     * @returns true if the form is (or all forms are) valid
     */
    isValid: (e) => E(e),
    /**
     * check the validity of the given form
     * @param form to get the invalid state for. When the form is not provided it is checked if any of the forms addressed by the selector is invalid.
     * @returns true if the form is (or any form) invalid
     */
    isInvalid: (e) => !E(e),
    /**
     * Do the afova form validation and return whether the form is valid
     * @param form to check. When the form is not provided, all forms addressed by the selector are validated.
     * @returns true if the form is (or all forms are) valid
     */
    validate: (e) => F(e)
  };
}
export {
  W as afova
};
