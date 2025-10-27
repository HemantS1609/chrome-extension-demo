function addCustomButton() {
  // Prevent adding multiple buttons
  if (document.getElementById("my-extension-btn")) return;

  // Find the target section by class name
  const section = document.querySelector(".section");
  if (!section) {
    console.warn("Target section not found!");
    return;
  }

  const btn = document.createElement("button");
  btn.id = "my-extension-btn";
  btn.innerText = "Add Details";

  // Dark theme styling
  btn.style.padding = "10px 16px";
  btn.style.background = "rgb(37,46,73)";
  btn.style.color = "#fff";
  btn.style.border = "none";
  btn.style.borderRadius = "6px";
  btn.style.cursor = "pointer";
  btn.style.fontSize = "14px";
  btn.style.marginTop = "10px"; // spacing inside section
  btn.style.boxShadow = "0 3px 8px rgba(0,0,0,0.2)";

  // Hover effect
  btn.addEventListener("mouseenter", () => {
    btn.style.background = "#00eaff";
    btn.style.color = "#000";
  });
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "rgb(37,46,73)";
    btn.style.color = "#fff";
  });

  section.appendChild(btn);
}
