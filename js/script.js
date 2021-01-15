const nameInput = document.getElementById("name");
const title = document.getElementById("title");
const otherJobRole = document.getElementById("other-job-role");
const shirtDesign = document.getElementById("design");
const shirtColor = document.getElementById("color");
const activities = document.getElementById("activities");

/**
 * this IIFE provides the beginning page state
 */
(() => {
  nameInput.focus();
  toggleDisplay(otherJobRole, false);
  shirtColor.setAttribute("disabled", "true");
})();

function toggleDisplay(element, condition) {
  element.style.display = condition ? "inherit" : "none";
}

title.addEventListener("change", () => {
  toggleDisplay(otherJobRole, title.value === "other");
});

shirtDesign.addEventListener("change", (e) => {
  shirtColor.removeAttribute("disabled");
  [...shirtColor.children].filter((option) => {
    option.selected = false;
    const validation = option.getAttribute("data-theme") === e.target.value;
    option.hidden = !validation;
    return validation;
  })[0].selected = true;
});

activities.addEventListener("change", (e) => {
  const cost = +e.target.getAttribute("data-cost");
  let activitiesCost = document.getElementById("activities-cost");
  const total = +activitiesCost.textContent.replace(/\D+(\d+)$/, "$1");
  activitiesCost.textContent = `Total: $${
    e.target.checked ? total + cost : total - cost
  }`;
});
