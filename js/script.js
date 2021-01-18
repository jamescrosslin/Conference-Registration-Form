const nameInput = document.getElementById("name");
const title = document.getElementById("title");
const otherJobRole = document.getElementById("other-job-role");
const shirtDesign = document.getElementById("design");
const shirtColor = document.getElementById("color");
const paySelect = document.getElementById("payment");
const inputs = document.querySelectorAll("input");
const checkboxes = document.querySelectorAll("input[type='checkbox']");

function getById(id) {
  return document.getElementById(id);
}

const payMethods = {
  ccField: getById("credit-card"),
  paypal: getById("paypal"),
  bitcoin: getById("bitcoin"),
};

function validateInput(element) {
  const container = element.parentElement;
  const hint = container.lastElementChild;
  const regex = {
    name: /^\w+$/,
    email: /^[^@]+@[^@.]+\.[a-z]+$/i,
    cc: /^\d{13,16}$/,
    zip: /^\d{5}$/,
    cvv: /^\d{3}$/,
  };

  const id = element.id.replace(/^([a-z]+)-?.*$/, "$1");
  if (regex[id]) {
    const isInvalid = showOrHideElement(hint, !regex[id].test(element.value));
    container.classList.add(isInvalid ? "not-valid" : "valid");
    container.classList.remove(isInvalid ? "valid" : "not-valid");
  }
}

function updateCost(activity) {
  const cost = +activity.getAttribute("data-cost");
  const activitiesCost = getById("activities-cost");
  const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, "$1");
  activitiesCost.textContent = `Total: $${
    activity.checked ? total + cost : total - cost
  }`;
}

function checkActivitySelection() {
  return showOrHideElement(
    getById("activities-hint"),
    [...checkboxes].filter((checkbox) => {
      return checkbox.checked;
    }).length === 0
  );
}

function updateSchedule(activity) {
  [...checkboxes]
    .filter((checkbox) => {
      return (
        checkbox.getAttribute("data-day-and-time") ===
          activity.getAttribute("data-day-and-time") &&
        checkbox.name !== activity.name
      );
    })
    .forEach((conflict) => {
      conflict.disabled = !conflict.disabled;
      conflict.parentElement.classList.toggle("disabled");
    });
}

function activityHandler(e) {
  updateCost(e.target);
  checkActivitySelection();
  updateSchedule(e.target);
}

/**
 * @description IIFE sets up the beginning page state
 */
(() => {
  nameInput.focus();
  showOrHideElement(otherJobRole, false);
  shirtColor.disabled = true;
  paySelect.removeChild(paySelect.firstElementChild);
  showOrHideElement(payMethods.paypal, false);
  showOrHideElement(payMethods.bitcoin, false);

  /**
   * @method forEach
   * @description attaches event listeners to all inputs except the other job role input
   */
  inputs.forEach((input) => {
    if (
      input.id !== "other-job-role" &&
      (input.type === "text" || input.type === "email")
    ) {
      input.addEventListener("keyup", (e) => validateInput(e.target));
    }
  });

  /**
   * @listens checkboxes the only checkboxes exist within the "Register for
   * Activites" container
   * @description on activity checkbox change, adds or subracts the
   * price of activity from the total
   */
  checkboxes.forEach((input) => {
    const label = input.parentNode;
    input.addEventListener("change", activityHandler);
    input.addEventListener("focus", (e) => label.classList.add("focus"));
    input.addEventListener("blur", (e) => label.classList.remove("focus"));
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
function showOrHideElement(element, condition) {
  element.style.display = condition ? "inherit" : "none";
  return condition;
}

title.addEventListener("change", () => {
  showOrHideElement(otherJobRole, title.value === "other");
  otherJobRole.focus();
});

/**
 * @listens shirtDesign
 * @description on design selection, displays only applicable
 * color selections and auto-selects first available
 */
shirtDesign.addEventListener("change", (e) => {
  shirtColor.disabled = false;
  const colors = [...shirtColor.children];
  colors.forEach((option) => (option.selected = false));
  colors.filter((option) =>
    showOrHideElement(
      option,
      option.getAttribute("data-theme") === e.target.value
    )
  )[0].selected = true;
});

paySelect.addEventListener("change", (e) => {
  for (const method of Object.values(payMethods)) {
    showOrHideElement(method, e.target.value === method.id);
  }
});

function validateForm(e) {
  checkActivitySelection();
  inputs.forEach((input) => validateInput(input));
  document.querySelectorAll(".hint").forEach((hint) => {
    if (hint.style.display === "inherit") e.preventDefault();
  });
}

document.querySelector("form").addEventListener("submit", validateForm);

// // SHARED RESOURCES
// const inputs = document.querySelectorAll("input");

// function showOrHideElement(element, condition) {
//   element.style.display = condition ? "inherit" : "none";
//   return condition;
// }

// // BASIC INFO

// const nameInput = document.getElementById("name");
// const title = document.getElementById("title");
// const otherJobRole = document.getElementById("other-job-role");

// nameInput.addEventListener("");

// // T-SHIRTS
// const shirtDesign = document.getElementById("design");
// const shirtColor = document.getElementById("color");

// function shirtHandler(e) {
//   shirtColor.disabled = false;
//   const colors = [...shirtColor.children];
//   colors.forEach((option) => (option.selected = false));
//   colors.filter((option) =>
//     showOrHideElement(
//       option,
//       option.getAttribute("data-theme") === e.target.value
//     )
//   )[0].selected = true;
// }

// shirtDesign.addEventListener("change", shirtHandler);

// // ACTIVITIES
// const checkboxes = document.querySelectorAll("input[type='checkbox']");

// checkboxes.forEach((input) => {
//   const label = input.parentNode;
//   input.addEventListener("change", activityHandler);
//   input.addEventListener("focus", (e) => label.classList.add("focus"));
//   input.addEventListener("blur", (e) => label.classList.remove("focus"));
// });

// // PAYMENTS
// const paySelect = document.getElementById("payment");
