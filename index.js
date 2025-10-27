// Cached DOM Elements (popup scope)
const addBtn = document.getElementById("addBtn");
const removeBtn = document.getElementById("removeBtn");
const viewBtn = document.getElementById("viewBtn");
const openFormBtn = document.getElementById("openFormBtn");
const closeFormBtn = document.getElementById("closeFormBtn");
const themeToggle = document.getElementById("themeToggle");
const themeIcon = document.getElementById("themeIcon");
const body = document.body;
const tableContainerId = "detailsTableContainer";

// Constants (popup scope)
const DARK_BG = "rgb(37,46,73)";
const ACCENT = "#00eaff";
const STORAGE_KEY = "extensionDetails";
const THEME_KEY = "themePreference";

// Utility: Execute on Active Tab (pass args to injected func)
async function executeOnActiveTab(func, args = []) {
  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    if (!tab?.id) {
      console.error("No active tab found.");
      return;
    }

    //Chrome automatically spreads those args into that function’s parameters.
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func,
      args, // <-- pass constants/values here
    });
  } catch (err) {
    console.error("Error executing on active tab:", err);
  }
}

// Utility: Render stored data in popup
function showDetailsTable(injectedDarkBg, injectedAccent, injectedStorageKey) {
  try {
    // Remove any existing modal or backdrop first
    document.getElementById("details-modal")?.remove();
    document.getElementById("details-backdrop")?.remove();

    // Create backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "details-backdrop";
    Object.assign(backdrop.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(4px)",
      zIndex: 9998,
    });

    // Modal container
    const modal = document.createElement("div");
    modal.id = "details-modal";
    Object.assign(modal.style, {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      background: injectedDarkBg,
      color: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      maxWidth: "750px",
      width: "90%",
      maxHeight: "80vh",
      overflowY: "auto",
      fontFamily: "Poppins, sans-serif",
      zIndex: 9999,
      border: `1px solid ${injectedAccent}`,
    });

    // Header with close icon
    const header = document.createElement("div");
    Object.assign(header.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "10px",
    });
    header.innerHTML = `
      <h3 style="margin:0;color:${injectedAccent};text-shadow:0 0 10px ${injectedAccent}55;">Saved Details</h3>
      <span id="closeDetails" style="cursor:pointer;font-size:22px;font-weight:bold;">&times;</span>
    `;

    // Close handlers
    const closeModal = () => {
      modal.remove();
      backdrop.remove();
    };
    header.querySelector("#closeDetails").onclick = closeModal;
    backdrop.onclick = closeModal;

    modal.appendChild(header);

    // Load data
    chrome.storage.local.get(injectedStorageKey, (result) => {
      const data = result[injectedStorageKey] || [];

      if (!data.length) {
        const emptyMsg = document.createElement("p");
        emptyMsg.textContent = "No details saved yet.";
        emptyMsg.style.color = "#bbb";
        modal.appendChild(emptyMsg);
        document.body.append(backdrop, modal);
        return;
      }

      // Table setup
      const table = document.createElement("table");
      Object.assign(table.style, {
        width: "100%",
        borderCollapse: "collapse",
        fontSize: "14px",
        marginTop: "10px",
      });

      const headers = [
        "First Name",
        "Last Name",
        "Email",
        "Mobile",
        "Country",
        "Degree",
        "Actions",
      ];
      const thead = document.createElement("thead");
      thead.innerHTML = `<tr>${headers
        .map(
          (h) =>
            `<th style="text-align:left;padding:8px;border-bottom:1px solid ${injectedAccent};color:${injectedAccent};">${h}</th>`
        )
        .join("")}</tr>`;

      const tbody = document.createElement("tbody");

      data.forEach((item, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.firstName || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.lastName || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.email || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.mobile || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.country || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">${
            item.degree || "-"
          }</td>
          <td style="padding:8px;border-bottom:1px solid rgba(255,255,255,0.1);">
            <span class="edit-icon" title="Edit" style="cursor:pointer;color:${injectedAccent};font-size:16px;margin-right:10px;">✏️</span>
            <span class="delete-icon" title="Delete" style="cursor:pointer;color:#ff5252;font-size:16px;">🗑️</span>
          </td>
        `;

        const editBtn = row.querySelector(".edit-icon");
        const deleteBtn = row.querySelector(".delete-icon");

        // 🟢 Edit
        editBtn.addEventListener("click", () => {
          const formData = data[index];
          const editModal = document.createElement("div");
          Object.assign(editModal.style, {
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: injectedDarkBg,
            padding: "16px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
            zIndex: 10000,
            color: "#fff",
            width: "300px",
          });
          editModal.innerHTML = `
            <h4 style="margin-top:0;color:${injectedAccent};">Edit Details</h4>
            ${Object.keys(formData)
              .map(
                (key) => `
                <input name="${key}" value="${
                  formData[key] || ""
                }" placeholder="${key}" style="
                  width:95%;margin:6px 0;padding:6px 8px;border-radius:6px;
                  border:1px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.05);
                  color:#fff;"
                />
              `
              )
              .join("")}
            <div style="margin-top:10px;text-align:right;">
              <button id="saveEdit" style="background:${injectedAccent};color:#000;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">Save</button>
              <button id="cancelEdit" style="background:rgba(255,255,255,0.1);color:#fff;border:none;padding:6px 10px;border-radius:6px;cursor:pointer;">Cancel</button>
            </div>
          `;
          document.body.appendChild(editModal);

          editModal.querySelector("#cancelEdit").onclick = () =>
            editModal.remove();
          editModal.querySelector("#saveEdit").onclick = () => {
            const updated = {};
            editModal.querySelectorAll("input").forEach((input) => {
              updated[input.name] = input.value.trim();
            });
            data[index] = updated;
            chrome.storage.local.set({ [injectedStorageKey]: data }, () => {
              editModal.remove();
              modal.remove();
              backdrop.remove();
              showDetailsTable(
                injectedDarkBg,
                injectedAccent,
                injectedStorageKey
              );
            });
          };
        });

        // 🔴 Delete
        deleteBtn.addEventListener("click", () => {
          if (!confirm("Delete this entry?")) return;
          data.splice(index, 1);
          chrome.storage.local.set({ [injectedStorageKey]: data }, () => {
            modal.remove();
            backdrop.remove();
            showDetailsTable(
              injectedDarkBg,
              injectedAccent,
              injectedStorageKey
            );
          });
        });

        tbody.appendChild(row);
      });

      table.append(thead, tbody);
      modal.appendChild(table);
      document.body.append(backdrop, modal);
    });
  } catch (err) {
    console.error("Error showing details table:", err);
  }
}

// Theme (popup only) - unchanged
function applyTheme(theme) {
  body.classList.remove("light", "dark");
  body.classList.add(theme);
  themeIcon.src =
    theme === "dark"
      ? "https://img.icons8.com/ios-filled/50/ffffff/sun.png"
      : "https://img.icons8.com/ios-filled/50/000adf/sun.png";
}
async function initTheme() {
  try {
    const data = await chrome.storage.local.get(THEME_KEY);
    const savedTheme = data[THEME_KEY];
    applyTheme(savedTheme || "dark");
  } catch (err) {
    console.error("Error loading theme:", err);
    applyTheme("dark");
  }
}
themeToggle.addEventListener("click", async () => {
  const isDark = body.classList.toggle("dark");
  const newTheme = isDark ? "dark" : "light";
  body.classList.toggle("light", !isDark);
  applyTheme(newTheme);
  await chrome.storage.local.set({ [THEME_KEY]: newTheme });
});
initTheme();

// Injected functions (run inside page context)
// Each accepts args that are passed from the popup above

// 1) injectAddButton(DARK_BG, ACCENT)
function injectAddButton(injectedDarkBg, injectedAccent) {
  try {
    if (document.getElementById("my-extension-btn")) return;

    const section = document.querySelector(".section");
    if (!section) return;

    const btn = document.createElement("button");
    btn.id = "my-extension-btn";
    btn.innerText = "Add Details";
    Object.assign(btn.style, {
      padding: "10px 16px",
      background: injectedDarkBg,
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "10px",
      boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
      transition: "all 0.2s ease",
    });

    btn.addEventListener("mouseenter", () => {
      btn.style.background = injectedAccent;
      btn.style.color = "#000";
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.background = injectedDarkBg;
      btn.style.color = "#fff";
    });

    section.appendChild(btn);
  } catch (err) {
    console.error("Error injecting Add Button:", err);
  }
}

// 2) removeElements()
function removeElements() {
  try {
    document.getElementById("my-extension-btn")?.remove();
    document.getElementById("my-extension-modal")?.remove();
    document.getElementById("my-extension-modal-backdrop")?.remove();
  } catch (err) {
    console.error("Error removing elements:", err);
  }
}

// 3) openModal(DARK_BG, ACCENT, STORAGE_KEY)
function openModal(injectedDarkBg, injectedAccent, injectedStorageKey) {
  try {
    if (document.getElementById("my-extension-modal")) return;

    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.id = "my-extension-modal-backdrop";
    Object.assign(backdrop.style, {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      zIndex: 9998,
    });

    // Modal
    const modal = document.createElement("div");
    modal.id = "my-extension-modal";
    Object.assign(modal.style, {
      background: injectedDarkBg,
      color: "#fff",
      padding: "20px",
      borderRadius: "10px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
      maxWidth: "500px",
      width: "90%",
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      zIndex: 9999,
      fontFamily: "Poppins, sans-serif",
    });

    modal.innerHTML = `
      <span id="modalClose" style="position:absolute; top:10px; right:15px; cursor:pointer; font-weight:bold; font-size:20px;">&times;</span>
      <h3 style="margin-top:0; color:${injectedAccent}; text-shadow:0 0 10px ${injectedAccent}66;">Enter Details</h3>
      <form id="modalForm">
        <input name="firstName" placeholder="First Name" required />
        <input name="lastName" placeholder="Last Name" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="tel" name="mobile" placeholder="Mobile Number" required />
        <input name="country" placeholder="Country" required />
        <input name="degree" placeholder="Degree" required />
        <div style="margin-top:12px; display:flex; justify-content:flex-end; gap:10px;">
          <button type="submit" id="saveBtn">Save</button>
          <button type="button" id="closeForm">Close</button>
        </div>
      </form>
    `;

    document.body.append(backdrop, modal);

    // Style Inputs
    modal.querySelectorAll("input").forEach((input) => {
      Object.assign(input.style, {
        width: "96%",
        margin: "6px 0",
        padding: "8px 10px",
        borderRadius: "6px",
        border: "1px solid rgba(255,255,255,0.2)",
        background: "rgba(255,255,255,0.05)",
        color: "#fff",
        outline: "none",
        transition: "all 0.2s ease",
      });

      input.addEventListener("focus", () => {
        input.style.border = `1px solid ${injectedAccent}`;
        input.style.boxShadow = `0 0 6px ${injectedAccent}66`;
      });
      input.addEventListener("blur", () => {
        input.style.border = "1px solid rgba(255,255,255,0.2)";
        input.style.boxShadow = "none";
      });
    });

    // Buttons
    const saveBtn = modal.querySelector("#saveBtn");
    const closeBtn = modal.querySelector("#closeForm");
    [saveBtn, closeBtn].forEach((btn) => {
      Object.assign(btn.style, {
        padding: "6px 12px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        transition: "all 0.2s ease",
      });
    });

    Object.assign(saveBtn.style, { background: injectedAccent, color: "#000" });
    saveBtn.onmouseenter = () => (saveBtn.style.background = "#00c4e0");
    saveBtn.onmouseleave = () => (saveBtn.style.background = injectedAccent);

    Object.assign(closeBtn.style, {
      background: "rgba(255,255,255,0.1)",
      color: "#fff",
    });
    closeBtn.onmouseenter = () =>
      (closeBtn.style.background = "rgba(255,255,255,0.2)");
    closeBtn.onmouseleave = () =>
      (closeBtn.style.background = "rgba(255,255,255,0.1)");

    // Close modal handler
    const removeModal = () => {
      modal.remove();
      backdrop.remove();
    };
    backdrop.onclick = removeModal;
    modal.querySelector("#modalClose").onclick = removeModal;
    closeBtn.onclick = removeModal;

    // Save form data using chrome.storage.local
    modal.querySelector("#modalForm").onsubmit = (e) => {
      e.preventDefault();
      const data = Object.fromEntries(new FormData(e.target).entries());
      chrome.storage.local.get(injectedStorageKey, (result) => {
        const saved = result[injectedStorageKey] || [];
        chrome.storage.local.set(
          { [injectedStorageKey]: [...saved, data] },
          () => {
            try {
              alert("Details saved successfully!");
            } catch (err) {
              // some pages restrict alert; ignore gracefully
              console.log("Saved (no alert):", data);
            }
            removeModal();
          }
        );
      });
    };
  } catch (err) {
    console.error("Error opening modal:", err);
  }
}

// 4) closeModal()
function closeModal() {
  try {
    document.getElementById("my-extension-modal")?.remove();
    document.getElementById("my-extension-modal-backdrop")?.remove();
  } catch (err) {
    console.error("Error closing modal:", err);
  }
}

// Hook up popup event listeners and pass constants via args
addBtn.addEventListener("click", () =>
  executeOnActiveTab(injectAddButton, [DARK_BG, ACCENT])
);
removeBtn.addEventListener("click", () => executeOnActiveTab(removeElements)); // no args needed

// Event listener for View Details
viewBtn.addEventListener("click", () =>
  executeOnActiveTab(showDetailsTable, [DARK_BG, ACCENT, STORAGE_KEY])
);
openFormBtn.addEventListener("click", () =>
  executeOnActiveTab(openModal, [DARK_BG, ACCENT, STORAGE_KEY])
);
closeFormBtn.addEventListener("click", () => executeOnActiveTab(closeModal));
