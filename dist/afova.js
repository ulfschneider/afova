const k = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let Y = (i = 21) => {
  let c = "", d = crypto.getRandomValues(new Uint8Array(i));
  for (; i--; )
    c += k[d[i] & 63];
  return c;
};
var w = /* @__PURE__ */ ((i) => (i.badInput = "badInput", i.customError = "customError", i.patternMismatch = "patternMismatch", i.rangeOverflow = "rangeOverflow", i.rangeUnderflow = "rangeUnderflow", i.stepMismatch = "stepMismatch", i.tooLong = "tooLong", i.tooShort = "tooShort", i.typeMismatch = "typeMismatch", i.valueMissing = "valueMissing", i))(w || {}), I = /* @__PURE__ */ ((i) => (i.pattern = "pattern", i.max = "max", i.min = "min", i.step = "step", i.maxlength = "maxlength", i.minlength = "minlength", i.type = "type", i.required = "required", i))(I || {});
const j = {
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
function H(i) {
  return j[i];
}
const K = {
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
function W(i) {
  return K[i];
}
const X = {
  badInput: "The input {{input}} is not a valid {{type}}",
  customError: "The input {{input}} is not valid",
  patternMismatch: "The value {{input}} does not match the required pattern of {{constraint}}",
  rangeOverflow: "The value {{input}} is too big. It cannot be bigger than {{constraint}}.",
  rangeUnderflow: "The value {{input}} is too small. It must be at least {{constraint}}.",
  stepMismatch: "The value {{input}} is not in within the correct step interval of {{constraint}}",
  tooLong: "The value {{input}} is too long. It cannot be longer than {{constraint}} characters.",
  tooShort: "The value {{input}} is too short. It must be at least {{constraint}} characters long.",
  typeMismatch: "The value {{input}} must be a {{constraint}}",
  valueMissing: "Please provide the {{type}} value"
}, S = "form", x = ".afova-form-message-container", J = {
  selector: S,
  formMessageSelector: x,
  validateOnChange: !1,
  focusOnFirstError: !0
}, Q = [
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
], Z = ["submit", "reset", "button", "fieldset", "image"], m = /* @__PURE__ */ new Set();
function z(i) {
  function c(e) {
    e.id || (e.id = `afova-${Y()}`);
  }
  function d(e) {
    const t = T(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    ) || void 0;
  }
  function g(e) {
    const t = h(e);
    y(t) ? (t.remove(), e.style.display = "none") : e.style.display = "";
  }
  function p(e) {
    const t = e.closest("form");
    if (t) {
      const a = t.getAttribute("afova-form-message-container-id");
      if (a)
        return document.querySelector(`#${a}`) || void 0;
    }
  }
  function h(e) {
    let t = e.querySelector(".afova-message-list");
    return t || (t = document.createElement("UL"), t.classList.add("afova-message-list"), e.appendChild(t)), t;
  }
  function y(e) {
    return e.children.length == 0;
  }
  function F(e) {
    var a;
    let t = d(e);
    if (!t) {
      const s = T(e) || e;
      t = document.createElement("DIV"), (a = s.parentNode) == null || a.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function V(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), a = d(e);
      if (a) {
        for (let s of t)
          if (a.querySelector(`[afova-message-for="${s.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function O(e, t) {
    if (e != "customError") {
      let a = H(e), s = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        X[e]
      );
      const o = t.getAttribute(a || "");
      if (o) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        s = s.replace(l, o);
      }
      let r = new RegExp("{{\\s*input\\s*}}", "ig");
      return s = s.replace(r, t.value), r = new RegExp("{{\\s*type\\s*}}", "ig"), s = s.replace(r, t.type), s;
    }
    return t.validationMessage;
  }
  function N(e) {
    var a, s;
    const t = u(e);
    if (t) {
      let o = t.querySelector(".afova-label");
      if (!o && t.tagName != "LABEL" && (o = t.querySelector("label")), o || (o = t), o) {
        let r = "";
        for (const l of o.childNodes)
          l.nodeType == Node.TEXT_NODE && (r && ((a = l.textContent) != null && a.trim()) && (r += " "), (s = l.textContent) != null && s.trim() && (r += l.textContent.trim()));
        return r;
      }
    }
    return "";
  }
  function $(e, t) {
    const a = p(e);
    if (a) {
      const s = h(a), o = document.createElement("LI");
      o.setAttribute("afova-message-for", e.id), o.classList.add("afova-collected-message");
      const r = N(e);
      if (r) {
        const v = document.createElement("DIV");
        v.innerText = r, v.classList.add("afova-message-label"), o.appendChild(v);
      }
      const l = document.createElement("A");
      l.innerText = t, l.href = `#${e.id}`, l.classList.add("afova-message"), o.appendChild(l), s.appendChild(o), g(a);
    }
  }
  function b(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage"), e.setCustomValidity("");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const r of t)
      r.remove();
    const a = d(e);
    a && y(a) && a.remove();
    const s = p(e);
    s && g(s);
    let o = u(e);
    o && document.querySelectorAll(
      `#${o.id} [aria-invalid].afova-control`
    ).length == 0 && o.classList.remove("afova-active");
  }
  function A(e) {
    for (const t of f(e))
      b(t);
  }
  function L(e) {
    if (!e.validity.valid && !V(e)) {
      const t = u(e);
      t && t.classList.add("afova-active"), e.setAttribute("aria-invalid", "true");
      const a = F(e);
      let s;
      a.tagName == "UL" || a.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), a.appendChild(s);
      for (const o in w)
        if (e.validity[o]) {
          let r = O(o, e);
          r && (s.innerHTML = r, $(e, r));
          break;
        }
    }
  }
  async function E(e, t = !0) {
    try {
      b(e), n.onBeforeValidateControl && n.onBeforeValidateControl(e), n.onAsyncBeforeValidateControl && await n.onAsyncBeforeValidateControl(e), e.validity.valid && (n.onValidateControl && n.onValidateControl(e), n.onAsyncValidateControl && await n.onAsyncValidateControl(e)), t && L(e);
    } catch (a) {
      if (n.onValidateControlError)
        n.onValidateControlError(e, a);
      else
        throw a;
    }
    return e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const a of e.elements)
      Z.includes(a.type) || t.push(a);
    return t;
  }
  async function q(e) {
    A(e), n.onBeforeValidateForm && n.onBeforeValidateForm(e), n.onAsyncBeforeValidateForm && n.onAsyncBeforeValidateForm(e);
    for (const a of f(e))
      await E(a, !1);
    e.checkValidity() && (n.onValidateForm && n.onValidateForm(e), n.onAsyncValidateForm && await n.onAsyncValidateForm(e));
    let t;
    for (const a of f(e))
      L(a), n.focusOnFirstError && !a.validity.valid && !t && (t = a, t.focus());
    return e.checkValidity();
  }
  function R(e) {
    A(e);
  }
  function U() {
    const e = document.querySelectorAll(
      n.selector || S
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", _), t.addEventListener("reset", C);
      for (const s of f(t))
        P(s);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        n.formMessageSelector || x
      );
      a && (c(a), g(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  async function _(e) {
    e.preventDefault();
    const t = e.target;
    try {
      if (m.has(t.id))
        return;
      if (m.add(t.id), !await q(t)) {
        n.onInvalid && n.onInvalid(e), m.delete(t.id);
        return;
      }
      n.onValid && n.onValid(e), n.onSubmit ? n.onSubmit(e) : t.submit(), m.delete(t.id);
    } catch (a) {
      if (m.delete(t.id), n.onValidateFormError)
        n.onValidateFormError(t, a);
      else
        throw a;
    }
  }
  function C(e) {
    R(e.target), n.onReset && n.onReset(e);
  }
  function B() {
    const e = document.querySelectorAll(n.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", _), t.removeEventListener("reset", C);
      for (const a of f(t))
        D(a);
    }
  }
  function G(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in I)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${W(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && Q.includes(e.type))) {
        const s = e.getAttribute("name");
        console.warn(
          s ? `afova: Missing attribute [data-${a}] for the control with [name="${s}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function P(e) {
    c(e), u(e), e.classList.add("afova-control"), n.validateOnChange && e.addEventListener("change", M), G(e);
  }
  async function M(e) {
    const t = e.target;
    await E(t) || t.focus();
  }
  function D(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", M);
  }
  function u(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t || void 0;
  }
  function T(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t || void 0;
  }
  let n = Object.assign({}, J, i);
  return U(), {
    clear: () => B()
  };
}
export {
  z as afova
};
