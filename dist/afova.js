const D = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
let P = (i = 21) => {
  let c = "", f = crypto.getRandomValues(new Uint8Array(i));
  for (; i--; )
    c += D[f[i] & 63];
  return c;
};
var _ = /* @__PURE__ */ ((i) => (i.badInput = "badInput", i.customError = "customError", i.patternMismatch = "patternMismatch", i.rangeOverflow = "rangeOverflow", i.rangeUnderflow = "rangeUnderflow", i.stepMismatch = "stepMismatch", i.tooLong = "tooLong", i.tooShort = "tooShort", i.typeMismatch = "typeMismatch", i.valueMissing = "valueMissing", i))(_ || {}), T = /* @__PURE__ */ ((i) => (i.pattern = "pattern", i.max = "max", i.min = "min", i.step = "step", i.maxlength = "maxlength", i.minlength = "minlength", i.type = "type", i.required = "required", i))(T || {});
const G = {
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
function k(i) {
  return G[i];
}
const B = {
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
function Y(i) {
  return B[i];
}
const j = {
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
}, M = "form", C = ".afova-form-message-container", H = {
  selector: M,
  formMessageSelector: C,
  validateOnChange: !1,
  focusOnFirstError: !0
}, K = [
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
], W = ["submit", "reset", "button", "fieldset", "image"];
function X(i) {
  function c(e) {
    e.id || (e.id = `afova-${P()}`);
  }
  function f(e) {
    const t = E(e) || e;
    return document.querySelector(
      `#${t.id}-afova-message-container`
    ) || void 0;
  }
  function u(e) {
    p(e) ? e.style.display = "none" : e.style.display = "";
  }
  function g(e) {
    const t = e.closest("form");
    if (t) {
      const a = t.getAttribute("afova-form-message-container-id");
      if (a)
        return document.querySelector(`#${a}`) || void 0;
    }
  }
  function p(e) {
    return e.children.length == 0;
  }
  function I(e) {
    var a;
    let t = f(e);
    if (!t) {
      const n = E(e) || e;
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
      ), a = f(e);
      if (a) {
        for (let n of t)
          if (a.querySelector(`[afova-message-for="${n.id}"]`))
            return !0;
      }
    }
    return !1;
  }
  function S(e, t) {
    if (e != "customError") {
      let a = k(e), n = (
        //a message defined for the control has highest prio
        t.dataset[a || e.toLowerCase()] || t.dataset[e.toLowerCase()] || // fallback message has last prio
        j[e]
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
  function x(e) {
    var a, n;
    const t = m(e);
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
  function O(e, t) {
    const a = g(e);
    if (a) {
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.setAttribute("afova-message-for", e.id), n.classList.add("afova-collected-message");
      const o = x(e);
      if (o) {
        const l = document.createElement("DIV");
        l.innerText = o, l.classList.add("afova-message-label"), n.appendChild(l);
      }
      const r = document.createElement("DIV");
      r.innerText = t, r.classList.add("afova-message"), n.appendChild(r), a.appendChild(n), u(a);
    }
  }
  function v(e) {
    e.removeAttribute("aria-invalid"), e.removeAttribute("aria-errormessage"), e.setCustomValidity("");
    const t = document.querySelectorAll(
      `[afova-message-for="${e.id}"]`
    );
    for (const r of t)
      r.remove();
    const a = f(e);
    a && p(a) && a.remove();
    const n = g(e);
    n && u(n);
    let o = m(e);
    o && document.querySelectorAll(
      `#${o.id} [aria-invalid].afova-control`
    ).length == 0 && o.classList.remove("afova-active");
  }
  function h(e) {
    if (!e.validity.valid && !w(e)) {
      const t = m(e);
      t && t.classList.add("afova-active"), e.setAttribute("aria-invalid", "true");
      const a = I(e);
      let n;
      a.tagName == "UL" || a.tagName == "OL" ? n = document.createElement("LI") : n = document.createElement("DIV"), n.classList.add("afova-message"), n.setAttribute("afova-message-for", e.id), a.appendChild(n);
      for (const o in _)
        if (e.validity[o]) {
          let r = S(o, e);
          r && (n.innerHTML = r, O(e, r));
          break;
        }
    }
  }
  async function b(e, t = !0) {
    return v(e), e.validity.valid && (s.onValidateControl && s.onValidateControl(e), s.onAsyncValidateControl && await s.onAsyncValidateControl(e)), t && h(e), e.validity.valid;
  }
  function d(e) {
    const t = [];
    for (const a of e.elements)
      W.includes(a.type) || t.push(a);
    return t;
  }
  async function N(e) {
    for (const a of d(e))
      await b(a, !1);
    e.checkValidity() && (s.onValidateForm && s.onValidateForm(e), s.onAsyncValidateForm && await s.onAsyncValidateForm(e));
    let t;
    for (const a of d(e))
      h(a), s.focusOnFirstError && !a.validity.valid && !t && (t = a, t.focus());
    return e.checkValidity();
  }
  function F(e) {
    for (let t of d(e))
      v(t);
  }
  function V() {
    const e = document.querySelectorAll(
      s.selector || M
    );
    for (const t of e) {
      c(t), t.addEventListener("submit", y), t.addEventListener("reset", L);
      for (const n of d(t))
        R(n);
      t.setAttribute("novalidate", "");
      const a = t.querySelector(
        s.formMessageSelector || C
      );
      a && (c(a), u(a), t.setAttribute(
        "afova-form-message-container-id",
        a.id
      ), a.classList.add("afova-form-message-container"));
    }
  }
  async function y(e) {
    if (e.preventDefault(), !await N(e.target)) {
      s.onInvalid && s.onInvalid(e);
      return;
    }
    s.onValid && s.onValid(e), s.onSubmit ? s.onSubmit(e) : e.target.submit();
  }
  function L(e) {
    F(e.target), s.onReset && s.onReset(e);
  }
  function $() {
    const e = document.querySelectorAll(s.selector || "form");
    for (const t of e) {
      t.removeAttribute("novalidate"), t.removeEventListener("submit", y), t.removeEventListener("reset", L);
      for (const a of d(t))
        U(a);
    }
  }
  function q(e) {
    const t = e.getAttributeNames().map((a) => a.toLowerCase());
    for (const a in T)
      if (t.includes(a) && !e.getAttribute(`data-${a}`) && !e.getAttribute(
        `data-${Y(a).toLowerCase()}`
      ) && (a != "type" || a == "type" && K.includes(e.type))) {
        const n = e.getAttribute("name");
        console.warn(
          n ? `afova: Missing attribute [data-${a}] for the control with [name="${n}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.` : `afova: Missing attribute [data-${a}] for the control with [id="${e.id}"]. Therefore only a fallback message will be used in case of a [${a}] constraint violation. It is recommended to define the violation message with the [data-${a}] attribute.`
        );
      }
  }
  function R(e) {
    c(e), m(e), e.classList.add("afova-control"), s.validateOnChange && e.addEventListener("change", A), q(e);
  }
  async function A(e) {
    await b(e.target) || e.target.focus();
  }
  function U(e) {
    e.classList.remove("afova-control"), e.removeEventListener("change", A);
  }
  function m(e) {
    let t = e.closest(".afova-context");
    return t || (t = e.closest("label")), t && (c(t), t.classList.add("afova-context"), t.tagName == "LABEL" && !t.htmlFor && (t.htmlFor = e.id)), t || void 0;
  }
  function E(e) {
    const t = e.closest(".afova-group");
    return t && c(t), t || void 0;
  }
  let s = Object.assign({}, H, i);
  return V(), {
    clear: () => $()
  };
}
export {
  X as afova
};
