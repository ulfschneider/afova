const k = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let B = (s = 21) => {
  let f = "", c = crypto.getRandomValues(new Uint8Array(s));
  for (; s--; )
    f += k[c[s] & 63];
  return f;
};
var M = /* @__PURE__ */ ((s) => (s.badInput = "badInput", s.customError = "customError", s.patternMismatch = "patternMismatch", s.rangeOverflow = "rangeOverflow", s.rangeUnderflow = "rangeUnderflow", s.stepMismatch = "stepMismatch", s.tooLong = "tooLong", s.tooShort = "tooShort", s.typeMismatch = "typeMismatch", s.valueMissing = "valueMissing", s))(M || {}), T = /* @__PURE__ */ ((s) => (s.pattern = "pattern", s.max = "max", s.min = "min", s.step = "step", s.maxlength = "maxlength", s.minlength = "minlength", s.type = "type", s.required = "required", s))(T || {});
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
function j(s) {
  return Y[s];
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
function K(s) {
  return H[s];
}
const W = {
  badInput: "The input {{input}} is not a valid {{type}}",
  customError: "The input {{input}} is not valid",
  patternMismatch: "The value {{input}} does not match the required pattern of {{constraint}}",
  rangeOverflow: "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  rangeUnderflow: "The value {{input}} is too small. It must be at least {{constraint}}.",
  stepMismatch: "The value {{input}} is not in within the correct step interval of {{constraint}}",
  tooLong: "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  tooShort: "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  typeMismatch: "The value {{input}} must be of type {{constraint}}",
  valueMissing: "Please provide the {{type}} value"
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
function Z(s) {
  function f(e) {
    e.id || (e.id = `afova-${B()}`);
  }
  function c(e) {
    const t = A(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    ) || void 0;
  }
  function d(e) {
    v(e) ? e.style.display = "none" : e.style.display = "";
  }
  function p(e) {
    const t = e.closest("form");
    if (t) {
      const a = t.getAttribute("afova-form-message-container-id");
      if (a)
        return document.querySelector(`#${a}`) || void 0;
    }
  }
  function v(e) {
    return e.children.length == 0;
  }
  function S(e) {
    var a;
    let t = c(e);
    if (!t) {
      const n = A(e) || e;
      t = document.createElement("DIV"), (a = n.parentNode) == null || a.insertBefore(
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
      const r = t.getAttribute(a || "");
      if (r) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        n = n.replace(l, r);
      }
      let i = new RegExp("{{\\s*input\\s*}}", "ig");
      return n = n.replace(i, t.value), i = new RegExp("{{\\s*type\\s*}}", "ig"), n = n.replace(i, t.type), n;
    }
    return t.validationMessage;
  }
  function O(e) {
    var a, n;
    const t = m(e);
    if (t) {
      let r = t.querySelector(".afova-label");
      if (!r && t.tagName != "LABEL" && (r = t.querySelector("label")), r || (r = t), r) {
        let i = "";
        for (const l of r.childNodes)
          l.nodeType == Node.TEXT_NODE && (i && ((a = l.textContent) != null && a.trim()) && (i += " "), (n = l.textContent) != null && n.trim() && (i += l.textContent.trim()));
        return i;
      }
    }
    return "";
  }
  function N(e, t) {
    const a = p(e);
    if (a) {
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.setAttribute("afova-message-for", e.id), n.classList.add("afova-collected-message");
      const r = O(e);
      if (r) {
        const l = document.createElement("DIV");
        l.innerText = r, l.classList.add("afova-message-label"), n.appendChild(l);
      }
      const i = document.createElement("DIV");
      i.innerText = t, i.classList.add("afova-message"), n.appendChild(i), a.appendChild(n), d(a);
    }
  }
  function q(e) {
    const t = S(e), a = e.validity;
    let n;
    t.tagName == "UL" || t.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), t.appendChild(n);
    for (const r in M)
      if (a[r]) {
        let i = x(r, e);
        i && (n.innerHTML = i, N(e, i));
        break;
      }
  }
  function h(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const i of t)
      i.remove();
    const a = c(e);
    a && v(a) && a.remove();
    let n = m(e);
    n && document.querySelectorAll(
      `#${n.id} [aria-invalid].afova-control`
    ).length == 0 && n.classList.remove("afova-active");
    const r = p(e);
    r && d(r);
  }
  function F(e, t) {
    const a = m(e);
    a && a.classList.add("afova-active"), e.setAttribute("aria-invalid", "true"), w(e) || (q(e), t && e.focus());
  }
  function b(e, t) {
    return h(e), e.validity.valid && o.onValidateControl && o.onValidateControl(e), e.validity.valid || F(e, t), e.validity.valid;
  }
  function u(e) {
    const t = [];
    for (const a of e.elements)
      Q.includes(a.type) || t.push(a);
    return t;
  }
  function y(e) {
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
    let a;
    for (const n of u(e))
      b(n) || a || (a = n);
    return a && (t == null || t.preventDefault(), o.focusOnFirstError && a.focus()), e.checkValidity();
  }
  function V(e) {
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
      h(t);
  }
  function R() {
    const e = document.querySelectorAll(
      o.selector || C
    );
    for (const t of e) {
      f(t), t.addEventListener("submit", L), t.addEventListener("reset", _);
      for (const n of u(t))
        P(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        o.formMessageSelector || I
      );
      a && (f(a), d(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  function L(e) {
    if (!g(e.target, e)) {
      e.preventDefault(), o.onInvalid && o.onInvalid(e);
      return;
    }
    o.onValid && o.onValid(e), o.onSubmit && (e.preventDefault(), o.onSubmit(e));
  }
  function _(e) {
    $(e.target), o.onReset && o.onReset(e);
  }
  function U() {
    const e = document.querySelectorAll(o.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", L), t.removeEventListener("reset", _);
      for (const a of u(t))
        G(a);
    }
  }
  function D(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in T)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${K(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && J.includes(e.type))) {
        const n = e.getAttribute("name");
        console.warn(
          n ? `afova: Missing attribute [data-${a}] for the control with [name="${n}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function P(e) {
    f(e), m(e), e.classList.add("afova-control"), o.validateOnChange && e.addEventListener("change", E), D(e);
  }
  function E(e) {
    b(e.target, !0);
  }
  function G(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", E);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (f(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t || void 0;
  }
  function A(e) {
    const t = e.closest(".afova-group");
    return t && f(t), t || void 0;
  }
  let o = Object.assign({}, X, s);
  return R(), {
    clear: () => U(),
    isValid: (e) => y(e),
    isInvalid: (e) => !y(e),
    validate: (e) => V(e)
  };
}
export {
  Z as afova
};
