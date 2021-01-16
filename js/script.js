const nameInput = document.getElementById("name");
const title = document.getElementById("title");
const otherJobRole = document.getElementById("other-job-role");
const shirtDesign = document.getElementById("design");
const shirtColor = document.getElementById("color");
const paySelect = document.getElementById("payment");

function getById(id) {
  return document.getElementById(id);
}

const payMethods = {
  ccField: getById("credit-card"),
  paypal: getById("paypal"),
  bitcoin: getById("bitcoin"),
};

const validate = {
  "name": (id) => shouldShowElement(getById(`${id}-hint`), true),
  "email": (id) => shouldShowElement(getById(`${id}-hint`), true),
  "other": (id) => console.log("Need to do something with this"),
  "activities": (id) => shouldShowElement(getById(`${id}-hint`), true),
  "cc": (id) => shouldShowElement(getById(`${id}-hint`), true),
  "zip": (id) => shouldShowElement(getById(`${id}-hint`), true),
  "cvv": (id) => shouldShowElement(getById(`${id}-hint`), true),
};

/**
 * @description IIFE alters the beginning page state
 */
(() => {
  nameInput.focus();
  shouldShowElement(otherJobRole, false);
  shirtColor.setAttribute("disabled", "true");
  paySelect.removeChild(paySelect.firstElementChild);
  shouldShowElement(payMethods.paypal, false);
  shouldShowElement(payMethods.bitcoin, false);

  /**
   * will create an object containing validations for different fields
   */
  [...document.querySelectorAll("input")].forEach((input) => {
    input.addEventListener("keyup", (e) => {
      const normalizedId = e.target.id.replace(/^([a-z]+)-?.*$/, "$1");
      validate[normalizedId](normalizedId);
    });
  });

  /**
   * @listens checkboxes the only checkboxes exist within the "Register for
   * Activites" container
   * @description on activity checkbox change, adds or subracts the
   * price of activity from the total
   */
  [...document.querySelectorAll('input[type="checkbox"]')].forEach((input) => {
    input.addEventListener("change", (e) => {
      const cost = +e.target.getAttribute("data-cost");
      const activitiesCost = getById("activities-cost");
      const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, "$1");
      activitiesCost.textContent = `Total: $${
        e.target.checked ? total + cost : total - cost
      }`;
    });
  });
})();

/**
 * @function shouldShowElement
 * @param {element} element
 * @param {boolean} condition
 * @returns {boolean} true if the element passes and is shown, false if it fails
 * @description element is displayed if it passes the condition and
 * hidden if it fails the condition
 */
function shouldShowElement(element, condition) {
  element.style.display = condition ? "inherit" : "none";
  return condition;
}

title.addEventListener("change", () => {
  shouldShowElement(otherJobRole, title.value === "other");
  otherJobRole.focus();
});

/**
 * @listens shirtDesign
 * @description on design selection, displays only applicable
 * color selections and auto-selects first available
 */
shirtDesign.addEventListener("change", (e) => {
  shirtColor.removeAttribute("disabled");
  const colors = [...shirtColor.children];
  colors.forEach((option) => (option.selected = false));
  colors.filter((option) =>
    shouldShowElement(
      option,
      option.getAttribute("data-theme") === e.target.value
    )
  )[0].selected = true;
});

paySelect.addEventListener("change", (e) => {
  for (const method of Object.values(payMethods)) {
    shouldShowElement(method, e.target.value === method.id);
  }
});
