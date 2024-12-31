const B = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let Y = (s = 21) => {
  let c = "", d = crypto.getRandomValues(new Uint8Array(s));
  for (; s--; )
    c += B[d[s] & 63];
  return c;
};
var w = /* @__PURE__ */ ((s) => (s.badInput = "badInput", s.customError = "customError", s.patternMismatch = "patternMismatch", s.rangeOverflow = "rangeOverflow", s.rangeUnderflow = "rangeUnderflow", s.stepMismatch = "stepMismatch", s.tooLong = "tooLong", s.tooShort = "tooShort", s.typeMismatch = "typeMismatch", s.valueMissing = "valueMissing", s))(w || {}), I = /* @__PURE__ */ ((s) => (s.pattern = "pattern", s.max = "max", s.min = "min", s.step = "step", s.maxlength = "maxlength", s.minlength = "minlength", s.type = "type", s.required = "required", s))(I || {});
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
function H(s) {
  return j[s];
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
function W(s) {
  return K[s];
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
function z(s) {
  function c(e) {
    e.id || (e.id = `afova-${Y()}`);
  }
  function d(e) {
    const t = C(e) || e;
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
      const n = C(e) || e;
      t = document.createElement("DIV"), (a = n.parentNode) == null || a.insertBefore(
        t,
        n
      ), t.id = `${n.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function O(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), a = d(e);
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
      let a = H(e), n = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        X[e]
      );
      const o = t.getAttribute(a || "");
      if (o) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        n = n.replace(l, o);
      }
      let r = new RegExp("{{\\s*input\\s*}}", "ig");
      return n = n.replace(r, t.value), r = new RegExp("{{\\s*type\\s*}}", "ig"), n = n.replace(r, t.type), n;
    }
    return t.validationMessage;
  }
  function V(e) {
    var a, n;
    const t = u(e);
    if (t) {
      let o = t.querySelector(".afova-label");
      if (!o && t.tagName != "LABEL" && (o = t.querySelector("label")), o || (o = t), o) {
        let r = "";
        for (const l of o.childNodes)
          l.nodeType == Node.TEXT_NODE && (r && ((a = l.textContent) != null && a.trim()) && (r += " "), (n = l.textContent) != null && n.trim() && (r += l.textContent.trim()));
        return r;
      }
    }
    return "";
  }
  function $(e, t) {
    const a = p(e);
    if (a) {
      const n = h(a), o = document.createElement("LI");
      o.setAttribute("afova-message-for", e.id), o.classList.add("afova-collected-message");
      const r = V(e);
      if (r) {
        const v = document.createElement("DIV");
        v.innerText = r, v.classList.add("afova-message-label"), o.appendChild(v);
      }
      const l = document.createElement("A");
      l.innerText = t, l.href = `#${e.id}`, l.classList.add("afova-message"), o.appendChild(l), n.appendChild(o), g(a);
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
    const n = p(e);
    n && g(n);
    let o = u(e);
    o && document.querySelectorAll(
      `#${o.id} [aria-invalid].afova-control`
    ).length == 0 && o.classList.remove("afova-active");
  }
  function L(e) {
    for (const t of f(e))
      b(t);
  }
  function E(e) {
    if (!e.validity.valid && !O(e)) {
      const t = u(e);
      t && t.classList.add("afova-active"), e.setAttribute("aria-invalid", "true");
      const a = F(e);
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), a.appendChild(n);
      for (const o in w)
        if (e.validity[o]) {
          let r = N(o, e);
          r && (n.innerHTML = r, $(e, r));
          break;
        }
    }
  }
  async function A(e, t = !0) {
    try {
      b(e), e.validity.valid && (i.onValidateControl && i.onValidateControl(e), i.onAsyncValidateControl && await i.onAsyncValidateControl(e)), t && E(e);
    } catch (a) {
      if (i.onValidateControlError)
        i.onValidateControlError(e, a);
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
    L(e), i.onBeforeValidateForm && i.onBeforeValidateForm(e);
    for (const a of f(e))
      await A(a, !1);
    e.checkValidity() && (i.onValidateForm && i.onValidateForm(e), i.onAsyncValidateForm && await i.onAsyncValidateForm(e));
    let t;
    for (const a of f(e))
      E(a), i.focusOnFirstError && !a.validity.valid && !t && (t = a, t.focus());
    return e.checkValidity();
  }
  function R(e) {
    L(e);
  }
  function U() {
    const e = document.querySelectorAll(
      i.selector || S
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", _), t.addEventListener("reset", M);
      for (const n of f(t))
        D(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        i.formMessageSelector || x
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
        i.onInvalid && i.onInvalid(e), m.delete(t.id);
        return;
      }
      i.onValid && i.onValid(e), i.onSubmit ? i.onSubmit(e) : t.submit(), m.delete(t.id);
    } catch (a) {
      if (m.delete(t.id), i.onValidateFormError)
        i.onValidateFormError(t, a);
      else
        throw a;
    }
  }
  function M(e) {
    R(e.target), i.onReset && i.onReset(e);
  }
  function G() {
    const e = document.querySelectorAll(i.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", _), t.removeEventListener("reset", M);
      for (const a of f(t))
        k(a);
    }
  }
  function P(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in I)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${W(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && Q.includes(e.type))) {
        const n = e.getAttribute("name");
        console.warn(
          n ? `afova: Missing attribute [data-${a}] for the control with [name="${n}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function D(e) {
    c(e), u(e), e.classList.add("afova-control"), i.validateOnChange && e.addEventListener("change", T), P(e);
  }
  async function T(e) {
    const t = e.target;
    await A(t) || t.focus();
  }
  function k(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", T);
  }
  function u(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t || void 0;
  }
  function C(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t || void 0;
  }
  let i = Object.assign({}, J, s);
  return U(), {
    clear: () => G()
  };
}
export {
  z as afova
};
