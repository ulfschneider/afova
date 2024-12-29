const k = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let B = (s = 21) => {
  let c = "", d = crypto.getRandomValues(new Uint8Array(s));
  for (; s--; )
    c += k[d[s] & 63];
  return c;
};
var C = /* @__PURE__ */ ((s) => (s.badInput = "badInput", s.customError = "customError", s.patternMismatch = "patternMismatch", s.rangeOverflow = "rangeOverflow", s.rangeUnderflow = "rangeUnderflow", s.stepMismatch = "stepMismatch", s.tooLong = "tooLong", s.tooShort = "tooShort", s.typeMismatch = "typeMismatch", s.valueMissing = "valueMissing", s))(C || {}), w = /* @__PURE__ */ ((s) => (s.pattern = "pattern", s.max = "max", s.min = "min", s.step = "step", s.maxlength = "maxlength", s.minlength = "minlength", s.type = "type", s.required = "required", s))(w || {});
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
  typeMismatch: "The value {{input}} must be a {{constraint}}",
  valueMissing: "Please provide the {{type}} value"
}, I = "form", S = ".afova-form-message-container", X = {
  selector: I,
  formMessageSelector: S,
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
], Q = ["submit", "reset", "button", "fieldset", "image"], m = /* @__PURE__ */ new Set();
function Z(s) {
  function c(e) {
    e.id || (e.id = `afova-${B()}`);
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
  function x(e) {
    var a;
    let t = d(e);
    if (!t) {
      const n = T(e) || e;
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
      let a = j(e), n = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        W[e]
      );
      const i = t.getAttribute(a || "");
      if (i) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        n = n.replace(l, i);
      }
      let r = new RegExp("{{\\s*input\\s*}}", "ig");
      return n = n.replace(r, t.value), r = new RegExp("{{\\s*type\\s*}}", "ig"), n = n.replace(r, t.type), n;
    }
    return t.validationMessage;
  }
  function F(e) {
    var a, n;
    const t = u(e);
    if (t) {
      let i = t.querySelector(".afova-label");
      if (!i && t.tagName != "LABEL" && (i = t.querySelector("label")), i || (i = t), i) {
        let r = "";
        for (const l of i.childNodes)
          l.nodeType == Node.TEXT_NODE && (r && ((a = l.textContent) != null && a.trim()) && (r += " "), (n = l.textContent) != null && n.trim() && (r += l.textContent.trim()));
        return r;
      }
    }
    return "";
  }
  function V(e, t) {
    const a = p(e);
    if (a) {
      const n = h(a), i = document.createElement("LI");
      i.setAttribute("afova-message-for", e.id), i.classList.add("afova-collected-message");
      const r = F(e);
      if (r) {
        const v = document.createElement("DIV");
        v.innerText = r, v.classList.add("afova-message-label"), i.appendChild(v);
      }
      const l = document.createElement("A");
      l.innerText = t, l.href = `#${e.id}`, l.classList.add("afova-message"), i.appendChild(l), n.appendChild(i), g(a);
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
    let i = u(e);
    i && document.querySelectorAll(
      `#${i.id} [aria-invalid].afova-control`
    ).length == 0 && i.classList.remove("afova-active");
  }
  function L(e) {
    if (!e.validity.valid && !O(e)) {
      const t = u(e);
      t && t.classList.add("afova-active"), e.setAttribute("aria-invalid", "true");
      const a = x(e);
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), a.appendChild(n);
      for (const i in C)
        if (e.validity[i]) {
          let r = N(i, e);
          r && (n.innerHTML = r, V(e, r));
          break;
        }
    }
  }
  async function A(e, t = !0) {
    return b(e), e.validity.valid && (o.onValidateControl && o.onValidateControl(e), o.onAsyncValidateControl && await o.onAsyncValidateControl(e)), t && L(e), e.validity.valid;
  }
  function f(e) {
    const t = [];
    for (const a of e.elements)
      Q.includes(a.type) || t.push(a);
    return t;
  }
  async function $(e) {
    for (const a of f(e))
      await A(a, !1);
    e.checkValidity() && (o.onValidateForm && o.onValidateForm(e), o.onAsyncValidateForm && await o.onAsyncValidateForm(e));
    let t;
    for (const a of f(e))
      L(a), o.focusOnFirstError && !a.validity.valid && !t && (t = a, t.focus());
    return e.checkValidity();
  }
  function q(e) {
    for (let t of f(e))
      b(t);
  }
  function R() {
    const e = document.querySelectorAll(
      o.selector || I
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", E), t.addEventListener("reset", _);
      for (const n of f(t))
        P(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        o.formMessageSelector || S
      );
      a && (c(a), g(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  async function E(e) {
    e.preventDefault();
    const t = e.target;
    try {
      if (m.has(t.id))
        return;
      if (m.add(t.id), !await $(t)) {
        o.onInvalid && o.onInvalid(e), m.delete(t.id);
        return;
      }
      o.onValid && o.onValid(e), o.onSubmit ? o.onSubmit(e) : t.submit(), m.delete(t.id);
    } catch (a) {
      throw m.delete(t.id), a;
    }
  }
  function _(e) {
    q(e.target), o.onReset && o.onReset(e);
  }
  function U() {
    const e = document.querySelectorAll(o.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", E), t.removeEventListener("reset", _);
      for (const a of f(t))
        D(a);
    }
  }
  function G(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in w)
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
    c(e), u(e), e.classList.add("afova-control"), o.validateOnChange && e.addEventListener("change", M), G(e);
  }
  async function M(e) {
    await A(e.target) || e.target.focus();
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
  let o = Object.assign({}, X, s);
  return R(), {
    clear: () => U()
  };
}
export {
  Z as afova
};
