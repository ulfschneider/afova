const k = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let B = (r = 21) => {
  let f = "", c = crypto.getRandomValues(new Uint8Array(r));
  for (; r--; )
    f += k[c[r] & 63];
  return f;
};
var T = /* @__PURE__ */ ((r) => (r.badInput = "badInput", r.customError = "customError", r.patternMismatch = "patternMismatch", r.rangeOverflow = "rangeOverflow", r.rangeUnderflow = "rangeUnderflow", r.stepMismatch = "stepMismatch", r.tooLong = "tooLong", r.tooShort = "tooShort", r.typeMismatch = "typeMismatch", r.valueMissing = "valueMissing", r))(T || {}), M = /* @__PURE__ */ ((r) => (r.pattern = "pattern", r.max = "max", r.min = "min", r.step = "step", r.maxlength = "maxlength", r.minlength = "minlength", r.type = "type", r.required = "required", r))(M || {});
const Y = {
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
  /* required */
};
function j(r) {
  return Y[r];
}
const H = {
  pattern: "patternMismatch",
  max: "rangeOverflow",
  min: "rangeUnderflow",
  step: "stepMismatch",
  maxlength: "tooLong",
  minlength: "tooShort",
  type: "typeMismatch",
  required: "valueMissing"
  /* valueMissing */
};
function K(r) {
  return H[r];
}
const W = {
  badInput: "The input {{input}} is not valid",
  customError: "The input {{input}} is not valid",
  patternMismatch: "The value {{input}} does not match the required pattern of {{constraint}}",
  rangeOverflow: "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  rangeUnderflow: "The value {{input}} is too small. It must be at least {{constraint}}.",
  stepMismatch: "The value {{input}} is not in within the correct step interval of {{constraint}}",
  tooLong: "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  tooShort: "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  typeMismatch: "The value {{input}} must be of type {{constraint}}",
  valueMissing: "Please provide a value"
}, C = "form", I = ".afova-form-message-container", X = {
  selector: C,
  formMessageSelector: I,
  validateOnChange: !1,
  focusOnFirstError: !0
}, J = [
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
], Q = ["submit", "reset", "button", "fieldset", "image"];
function Z(r) {
  function f(e) {
    e.id || (e.id = `afova-${B()}`);
  }
  function c(e) {
    const t = E(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    );
  }
  function d(e) {
    v(e) ? e.style.display = "none" : e.style.display = "";
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
  function v(e) {
    return e.children.length == 0;
  }
  function S(e) {
    var a;
    let t = c(e);
    if (!t) {
      const n = E(e) || e;
      t = document.createElement("ul"), (a = n.parentNode) == null || a.insertBefore(
        t,
        n
      ), t.id = `${n.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function w(e) {
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
  function x(e, t) {
    if (e != "customError") {
      let a = j(e), n = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        W[e]
      );
      const s = t.getAttribute(a || "");
      if (s) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        n = n.replace(l, s);
      }
      let o = new RegExp("{{\\s*input\\s*}}", "ig");
      return n = n.replace(
        o,
        t.value
      ), n;
    }
    return t.validationMessage;
  }
  function O(e) {
    var a, n;
    const t = m(e);
    if (t) {
      let s = t.querySelector(".afova-label");
      if (!s && t.tagName != "LABEL" && (s = t.querySelector("label")), s || (s = t), s) {
        let o = "";
        for (const l of s.childNodes)
          l.nodeType == Node.TEXT_NODE && (o && ((a = l.textContent) != null && a.trim()) && (o += " "), (n = l.textContent) != null && n.trim() && (o += l.textContent.trim()));
        return o;
      }
    }
    return "";
  }
  function N(e, t) {
    const a = p(e);
    if (a) {
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.setAttribute("afova-message-for", e.id), n.classList.add("afova-collected-message");
      const s = O(e);
      if (s) {
        const l = document.createElement("DIV");
        l.innerText = s, l.classList.add("afova-message-label"), n.appendChild(l);
      }
      const o = document.createElement("DIV");
      o.innerText = t, o.classList.add("afova-message"), n.appendChild(o), a.appendChild(n), d(a);
    }
  }
  function q(e) {
    const t = S(e), a = e.validity;
    let n;
    t.tagName == "UL" || t.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), t.appendChild(n);
    for (const s in T)
      if (a[s]) {
        let o = x(s, e);
        o && (n.innerHTML = o, N(e, o));
        break;
      }
  }
  function h(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const o of t)
      o.remove();
    const a = c(e);
    a && v(a) && a.remove();
    let n = m(e);
    n && document.querySelectorAll(
      `#${n.id} [aria-invalid].afova-control`
    ).length == 0 && n.classList.remove("afova-active");
    const s = p(e);
    s && d(s);
  }
  function F(e, t) {
    const a = m(e);
    a && a.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), w(e) || (q(e), t && e.focus());
  }
  function b(e, t) {
    return h(e), e.validity.valid || F(e, t), e.validity.valid;
  }
  function u(e) {
    const t = [];
    for (const a of e.elements)
      Q.includes(a.type) || t.push(a);
    return t;
  }
  function L(e) {
    if (e)
      return e.checkValidity();
    {
      const t = document.querySelectorAll(i.selector || "form");
      for (const a of t)
        if (!a.checkValidity())
          return !1;
      return !0;
    }
  }
  function g(e, t) {
    let a, n = !0;
    for (const s of u(e))
      b(s) || (n = !1, a || (a = s));
    return a && (t == null || t.preventDefault(), i.focusOnFirstError && a.focus()), n;
  }
  function $(e) {
    if (e)
      return g(e);
    {
      let t = !0;
      const a = document.querySelectorAll(i.selector || "form");
      for (const n of a)
        g(n) || (t = !1);
      return t;
    }
  }
  function R(e) {
    for (let t of u(e))
      h(t);
  }
  function U() {
    const e = document.querySelectorAll(
      i.selector || C
    );
    for (const t of e) {
      f(t), t.addEventListener("submit", y), t.addEventListener("reset", _);
      for (const n of u(t))
        P(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        i.formMessageSelector || I
      );
      a && (f(a), d(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  function y(e) {
    e.preventDefault(), g(e.target, e), e.target.checkValidity() ? (i.onValid && i.onValid(e), i.onSubmit && i.onSubmit(e)) : i.onInvalid && i.onInvalid(e);
  }
  function _(e) {
    R(e.target), i.onReset && i.onReset(e);
  }
  function V() {
    const e = document.querySelectorAll(i.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", y), t.removeEventListener("reset", _);
      for (const a of u(t))
        G(a);
    }
  }
  function D(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in M)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${K(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && J.includes(e.type))) {
        const n = e.getAttribute("name");
        console.warn(
          n ? `afova: Missing attribute [data-${a}] for the control with [name="${n}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It´s strongly recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It´s strongly recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function P(e) {
    f(e), m(e), e.classList.add("afova-control"), i.validateOnChange && e.addEventListener("change", A), D(e);
  }
  function A(e) {
    b(e.target, !0);
  }
  function G(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", A);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (f(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t;
  }
  function E(e) {
    const t = e.closest(".afova-group");
    return t && f(t), t;
  }
  let i = Object.assign({}, X, r);
  return U(), {
    /**
     * Will remove all event listeners that have been added by afova and
     * will clear all afova messages.
     */
    clear: () => V(),
    /**
     * check the validity of the given form
     * @param form to get the valid state for. When the form is not provided it is checked if all of the forms addressed by the selector are valid.
     * @returns true if the form is (or all forms are) valid
     */
    isValid: (e) => L(e),
    /**
     * check the validity of the given form
     * @param form to get the invalid state for. When the form is not provided it is checked if any of the forms addressed by the selector is invalid.
     * @returns true if the form is (or any form) invalid
     */
    isInvalid: (e) => !L(e),
    /**
     * Do the afova form validation and return whether the form is valid
     * @param form to check. When the form is not provided, all forms addressed by the selector are validated.
     * @returns true if the form is (or all forms are) valid
     */
    validate: (e) => $(e)
  };
}
export {
  Z as afova
};
