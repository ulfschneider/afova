let B = (n) => crypto.getRandomValues(new Uint8Array(n)), j = (n, c, m) => {
  let d = (2 << Math.log2(n.length - 1)) - 1, u = -~(1.6 * d * c / n.length);
  return (v = c) => {
    let f = "";
    for (; ; ) {
      let b = m(u), h = u | 0;
      for (; h--; )
        if (f += n[b[h] & d] || "", f.length >= v) return f;
    }
  };
}, Y = (n, c = 21) => j(n, c | 0, B);
const H = Y("abcdefghijklmnopqrstuvwxyz", 12);
var S = /* @__PURE__ */ ((n) => (n.badInput = "badInput", n.customError = "customError", n.patternMismatch = "patternMismatch", n.rangeOverflow = "rangeOverflow", n.rangeUnderflow = "rangeUnderflow", n.stepMismatch = "stepMismatch", n.tooLong = "tooLong", n.tooShort = "tooShort", n.typeMismatch = "typeMismatch", n.valueMissing = "valueMissing", n))(S || {}), x = /* @__PURE__ */ ((n) => (n.pattern = "pattern", n.max = "max", n.min = "min", n.step = "step", n.maxlength = "maxlength", n.minlength = "minlength", n.type = "type", n.required = "required", n))(x || {});
const K = {
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
function W(n) {
  return K[n];
}
const X = {
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
function z(n) {
  return X[n];
}
const J = {
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
}, F = "form", O = ".afova-form-message-container", Q = {
  selector: F,
  formMessageSelector: O,
  validateOnChange: !1,
  focusOnFirstError: !0
}, Z = [
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
], ee = ["submit", "reset", "button", "fieldset", "image"], p = /* @__PURE__ */ new Set();
function te(n) {
  function c(e) {
    e.id || (e.id = `afova-${H()}`);
  }
  function m(e) {
    const t = I(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    ) || void 0;
  }
  function d(e) {
    const t = v(e);
    f(t) ? (t.remove(), e.style.display = "none") : e.style.display = "";
  }
  function u(e) {
    const t = e.closest("form");
    if (t) {
      const a = t.getAttribute("afova-form-message-container-id");
      if (a)
        return document.querySelector(`#${a}`) || void 0;
    }
  }
  function v(e) {
    let t = e.querySelector(".afova-message-list");
    return t || (t = document.createElement("UL"), t.classList.add("afova-message-list"), e.appendChild(t)), t;
  }
  function f(e) {
    return e.children.length == 0;
  }
  function b(e) {
    var a;
    let t = m(e);
    if (!t) {
      const s = I(e) || e;
      t = document.createElement("DIV"), (a = s.parentNode) == null || a.insertBefore(
        t,
        s
      ), t.id = `${s.id}-afova-message-container`, t.classList.add("afova-message-container"), e.setAttribute("aria-errormessage", t.id);
    }
    return t;
  }
  function h(e) {
    if (e.type == "radio" && e.name) {
      const t = document.querySelectorAll(
        `input[name="${e.name}"][type="radio"]`
      ), a = m(e);
      if (a) {
        for (let s of t)
          if (a.querySelector(`[afova-message-for="${s.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function N(e, t) {
    if (e != "customError") {
      let a = W(e), s = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        J[e]
      );
      const r = t.getAttribute(a || "");
      if (r) {
        let l = new RegExp("{{\\s*constraint\\s*}}", "ig");
        s = s.replace(l, r);
      }
      let o = new RegExp("{{\\s*input\\s*}}", "ig");
      return s = s.replace(o, t.value), o = new RegExp("{{\\s*type\\s*}}", "ig"), s = s.replace(o, t.type), s;
    }
    return t.validationMessage;
  }
  function V(e) {
    var a, s;
    const t = y(e);
    if (t) {
      let r = t.querySelector(".afova-label");
      if (!r && t.tagName != "LABEL" && (r = t.querySelector("label")), r || (r = t), r) {
        let o = "";
        for (const l of r.childNodes)
          l.nodeType == Node.TEXT_NODE && (o && ((a = l.textContent) != null && a.trim()) && (o += " "), (s = l.textContent) != null && s.trim() && (o += l.textContent.trim()));
        return o;
      }
    }
    return "";
  }
  function $(e, t) {
    const a = u(e);
    if (a) {
      const s = v(a), r = document.createElement("LI");
      r.setAttribute("afova-message-for", e.id), r.classList.add("afova-collected-message");
      const o = V(e);
      if (o) {
        const L = document.createElement("DIV");
        L.innerText = o, L.classList.add("afova-message-label"), r.appendChild(L);
      }
      const l = document.createElement("A");
      l.innerText = t, l.href = `#${e.id}`, l.classList.add("afova-message"), r.appendChild(l), s.appendChild(r), d(a);
    }
  }
  function E(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage"), e.setCustomValidity("");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const o of t)
      o.remove();
    const a = m(e);
    a && f(a) && a.remove();
    const s = u(e);
    s && d(s);
    let r = y(e);
    r && document.querySelectorAll(
      `#${r.id} [aria-invalid].afova-control`
    ).length == 0 && r.classList.remove("afova-active");
  }
  function A(e) {
    for (const t of g(e))
      E(t);
  }
  function _(e) {
    if (!e.validity.valid && !h(e)) {
      const t = y(e);
      t && t.classList.add("afova-active"), e.setAttribute("aria-invalid", "true");
      const a = b(e);
      let s;
      a.tagName == "UL" || a.tagName == "OL" ? s = document.createElement("LI") : s = document.createElement("DIV"), s.classList.add("afova-message"), s.setAttribute("afova-message-for", e.id), a.appendChild(s);
      for (const r in S)
        if (e.validity[r]) {
          let o = N(r, e);
          o && (s.innerHTML = o, $(e, o));
          break;
        }
    }
  }
  async function M(e, t = !0) {
    try {
      E(e), e.validity.valid && (i.onValidateControl && i.onValidateControl(e), i.onAsyncValidateControl && await i.onAsyncValidateControl(e)), t && _(e);
    } catch (a) {
      if (i.onValidateControlError)
        i.onValidateControlError(e, a);
      else
        throw a;
    }
    return e.validity.valid;
  }
  function g(e) {
    const t = [];
    for (const a of e.elements)
      ee.includes(a.type) || t.push(a);
    return t;
  }
  async function q(e) {
    A(e), i.onBeforeValidateForm && i.onBeforeValidateForm(e);
    for (const a of g(e))
      await M(a, !1);
    e.checkValidity() && (i.onValidateForm && i.onValidateForm(e), i.onAsyncValidateForm && await i.onAsyncValidateForm(e));
    let t;
    for (const a of g(e))
      _(a), i.focusOnFirstError && !a.validity.valid && !t && (t = a, t.focus());
    return e.checkValidity();
  }
  function R(e) {
    A(e);
  }
  function U() {
    const e = document.querySelectorAll(
      i.selector || F
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", T), t.addEventListener("reset", C);
      for (const s of g(t))
        P(s);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        i.formMessageSelector || O
      );
      a && (c(a), d(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  async function T(e) {
    e.preventDefault();
    const t = e.target;
    try {
      if (p.has(t.id))
        return;
      if (p.add(t.id), !await q(t)) {
        i.onInvalid && i.onInvalid(e), p.delete(t.id);
        return;
      }
      i.onValid && i.onValid(e), i.onSubmit ? i.onSubmit(e) : t.submit(), p.delete(t.id);
    } catch (a) {
      if (p.delete(t.id), i.onValidateFormError)
        i.onValidateFormError(t, a);
      else
        throw a;
    }
  }
  function C(e) {
    R(e.target), i.onReset && i.onReset(e);
  }
  function G() {
    const e = document.querySelectorAll(i.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", T), t.removeEventListener("reset", C);
      for (const a of g(t))
        D(a);
    }
  }
  function k(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in x)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${z(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && Z.includes(e.type))) {
        const s = e.getAttribute("name");
        console.warn(
          s ? `afova: Missing attribute [data-${a}] for the control with [name="${s}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function P(e) {
    c(e), y(e), e.classList.add("afova-control"), i.validateOnChange && e.addEventListener("change", w), k(e);
  }
  async function w(e) {
    const t = e.target;
    await M(t) || t.focus();
  }
  function D(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", w);
  }
  function y(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t || void 0;
  }
  function I(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t || void 0;
  }
  let i = Object.assign({}, Q, n);
  return U(), {
    clear: () => G()
  };
}
export {
  te as afova
};
