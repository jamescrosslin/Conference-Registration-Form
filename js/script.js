//SHARED RESOURCES
function getById(id) {
  return document.getElementById(id);
}

function showOrHideElement(element, condition) {
  element.style.display = condition ? "inherit" : "none";
  return condition;
}

function isValid(element, condition) {
  return !showOrHideElement(element, condition);
}

const pattern = {
  "name": /^[^\d]+$/,
  "email": /^[^@]+@[^@.]+\.[a-z]+$/i,
  "cc-num": /^\d{13,16}$/,
  "zip": /^\d{5}$/,
  "cvv": /^\d{3}$/,
};

/**
 * @function validationHandler
 * @param {element} element
 * @returns {boolean} indicates if there is an error
 * @description takes in an element handles stages of testing
 * that element's value
 */
function validationHandler(element) {
  const id = element.id;
  const text = element.value;
  const tip = element.nextElementSibling;
  const patternTip = tip?.nextElementSibling;
  const container = element.parentElement;

  // we test if the input empty text or is an unselected credit card select element
  // and activate our standard empty field tool tip
  let valid = isValid(
    tip,
    text === "" ||
      (id === "exp-month" && text === "Select Date") ||
      (id === "exp-year" && text === "Select Year")
  );

  //only certain elements have a pattern to match, so we check here
  if (patternTip) {
    showOrHideElement(patternTip, false);

    // if the input is not empty, we test its pattern here
    if (valid) {
      valid = isValid(patternTip, !pattern[id].test(text));
    }
  }

  container.classList.toggle("valid", valid);
  container.classList.toggle("not-valid", !valid);
  return valid;
}

/**
 * createListener
 * @param {event} e
 * @description placing my callback like this allows me give validationHandler
 * an element as an argument, increasing its modularity in later code
 */
function createListener(e) {
  return validationHandler(e.target);
}

// BASIC INFO

const info = {
  name: getById("name"),
  email: getById("email"),
  title: getById("title"),
  other: getById("other-job-role"),
};

info.email.addEventListener("keyup", createListener);
info.title.addEventListener("change", () => {
  showOrHideElement(info.other, title.value === "other");
  info.other.focus();
});

// T-SHIRTS
const shirtColor = getById("color");

function shirtHandler(e) {
  const colors = [...shirtColor.children];

  shirtColor.disabled = false;
  colors.forEach((option) => (option.selected = false));
  colors.filter((option) =>
    showOrHideElement(
      option,
      option.getAttribute("data-theme") === e.target.value
    )
  )[0].selected = true;
}

getById("design").addEventListener("change", shirtHandler);

// ACTIVITIES
const checkboxes = document.querySelectorAll("input[type='checkbox']");

function checkActivitySelection() {
  const container = getById("activities").firstElementChild;
  const valid = !showOrHideElement(
    getById("activities-hint"),
    [...checkboxes].every((checkbox) => !checkbox.checked)
  );
  container.classList.toggle("valid", valid);
  container.classList.toggle("not-valid", !valid);
  return valid;
}

function updateCost(activity) {
  const cost = +activity.getAttribute("data-cost");
  const activitiesCost = getById("activities-cost");
  const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, "$1");
  activitiesCost.textContent = `Total: $${
    activity.checked ? total + cost : total - cost
  }`;
}

function updateSchedule(activity) {
  [...checkboxes].forEach((checkbox) => {
    if (
      checkbox.getAttribute("data-day-and-time") ===
        activity.getAttribute("data-day-and-time") &&
      checkbox.name !== activity.name
    ) {
      checkbox.disabled = !checkbox.disabled;
      checkbox.parentElement.classList.toggle("disabled");
    }
  });
}

function activityHandler(e) {
  checkActivitySelection();
  updateCost(e.target);
  updateSchedule(e.target);
}

// PAYMENTS
const paySelect = getById("payment");
const payMethods = {
  creditCard: getById("credit-card"),
  paypal: getById("paypal"),
  bitcoin: getById("bitcoin"),
};

const ccInputs = {
  month: getById("exp-month"),
  year: getById("exp-year"),
  cardNum: getById("cc-num"),
  zip: getById("zip"),
  cvv: getById("cvv"),
};

paySelect.addEventListener("change", (e) => {
  for (const method of Object.values(payMethods)) {
    showOrHideElement(method, e.target.value === method.id);
  }
});

// FORM VALIDATION
function massValidate(e, ...inputs) {
  inputs.forEach((input) => {
    if (!validationHandler(input)) e.preventDefault();
  });
}

function validateForm(e) {
  if (!checkActivitySelection()) {
    e.preventDefault();
  }
  massValidate(e, info.name, info.email);
  if (paySelect.value === "credit-card")
    massValidate(e, ...Object.values(ccInputs));
}

document.querySelector("form").addEventListener("submit", validateForm);

// Beginning page state
info.name.focus();
info.name.nextElementSibling.insertAdjacentHTML(
  "afterend",
  `<span class="hint">Name field cannot contain numbers</span>`
);
showOrHideElement(info.other, false);
shirtColor.disabled = true;
paySelect.removeChild(paySelect.firstElementChild);
showOrHideElement(payMethods.paypal, false);
showOrHideElement(payMethods.bitcoin, false);

[info.email, ...Object.values(ccInputs)].forEach((input) => {
  input.insertAdjacentHTML(
    "afterend",
    `<span class="hint">Field cannot be blank</span>`
  );
});

[info.name, info.email, ...Object.values(ccInputs)].forEach((input) => {
  input.addEventListener("keyup", createListener);
  input.addEventListener("blur", createListener);
  input.addEventListener("change", createListener);
});

checkboxes.forEach((input) => {
  const label = input.parentNode;
  input.addEventListener("change", activityHandler);
  input.addEventListener("focus", (e) => label.classList.add("focus"));
  input.addEventListener("blur", (e) => label.classList.remove("focus"));
});
