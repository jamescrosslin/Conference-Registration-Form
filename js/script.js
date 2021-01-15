const nameInput = document.getElementById("name");
const title = document.getElementById("title");
const otherJobRole = document.getElementById("other-job-role");
const shirtDesign = document.getElementById("design");
const shirtColor = document.getElementById("color");

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

shirtDesign.addEventListener("change", (e) => {
  shirtColor.removeAttribute("disabled");
  [...shirtColor.children].filter((option) => {
    option.selected = false;
    const validation = option.getAttribute("data-theme") === e.target.value;
    option.hidden = !validation;
    return validation;
  })[0].selected = true;
});

title.addEventListener("change", () => {
  toggleDisplay(otherJobRole, title.value === "other");
});
