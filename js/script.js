const nameInput = document.getElementById("name");
const title = document.getElementById("title");
const otherJobRole = document.getElementById("other-job-role");
const shirtDesign = document.getElementById("design");
const shirtColor = document.getElementById("color");
const activities = document.getElementById("activities");
const ccField = document.getElementById("credit-card");

/**
 * @description IIFE alters the beginning page state
 */
(() => {
  nameInput.focus();
  toggleDisplay(otherJobRole, false);
  shirtColor.setAttribute("disabled", "true");
  toggleDisplay(ccField.nextElementSibling, false);
  toggleDisplay(ccField.nextElementSibling.nextElementSibling, false);
})();

/**
 * @function toggleDisplay
 * @param {element} element
 * @param {boolean} condition
 * @description shows or hides an element based on a condition
 */
function toggleDisplay(element, condition) {
  element.style.display = condition ? "inherit" : "none";
}

title.addEventListener("change", () => {
  toggleDisplay(otherJobRole, title.value === "other");
});

/**
 * @listens shirtDesign
 * @description on design selection, displays only applicable
 * color selections and auto-selects first available
 */
shirtDesign.addEventListener("change", (e) => {
  shirtColor.removeAttribute("disabled");
  [...shirtColor.children].filter((option) => {
    option.selected = false;
    const validation = option.getAttribute("data-theme") === e.target.value;
    option.hidden = !validation;
    return validation;
  })[0].selected = true;
});

/**
 * @listens activities the "Register for Activities" container
 * @description on activity checkbox change, adds or subracts the
 * price of activity from the total
 */
activities.addEventListener("change", (e) => {
  const cost = +e.target.getAttribute("data-cost");
  let activitiesCost = document.getElementById("activities-cost");
  const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, "$1");
  activitiesCost.textContent = `Total: $${
    e.target.checked ? total + cost : total - cost
  }`;
});
