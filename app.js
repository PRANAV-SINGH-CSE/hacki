import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  update,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-database.js";

/*
  Fill this with your Firebase Web App config from:
  Firebase Console -> Project settings -> General -> Your apps (Web)
*/
const firebaseConfig = {
  apiKey: "AIzaSyCKwcXJ7OBd6qqr8G1a9Q8n4XjC1Eb_s6s",
  authDomain: "hackiware-12fe3.firebaseapp.com",
  databaseURL: "https://hackiware-12fe3-default-rtdb.firebaseio.com",
  projectId: "hackiware-12fe3",
  storageBucket: "hackiware-12fe3.firebasestorage.app",
  messagingSenderId: "770711495689",
  appId: "1:770711495689:web:71b7bbc6468567987904d8",
  measurementId: "G-PWKBWYDJYL",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const sheetBody = document.getElementById("sheetBody");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const statusEl = document.getElementById("status");
const PASTE_FIELDS = [
  "rank",
  "name",
  "studentsEducated",
  "schoolsEducated",
  "sessionsConducted",
  "score",
];

function hasPlaceholderConfig(config) {
  return Object.values(config).some(
    (value) => typeof value === "string" && value.includes("YOUR_")
  );
}

function toFriendlyFirebaseError(error) {
  const code = error?.code ?? "";

  if (code === "PERMISSION_DENIED" || code === "permission-denied") {
    return "Permission denied. Check Realtime Database/Storage rules.";
  }

  if (code === "app/no-app") {
    return "Firebase app not initialized correctly.";
  }

  return error?.message ?? "Unknown Firebase error.";
}

function setStatus(message, isError = false) {
  statusEl.textContent = message;
  statusEl.className = `status ${isError ? "bad" : "ok"}`;
}

function createRows() {
  const fragment = document.createDocumentFragment();

  for (let i = 1; i <= 10; i += 1) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><input type="number" min="1" max="10" value="${i}" data-field="rank" /></td>
      <td><input type="text" data-field="name" /></td>
      <td><input type="text" data-field="studentsEducated" /></td>
      <td><input type="text" data-field="schoolsEducated" /></td>
      <td><input type="text" data-field="sessionsConducted" /></td>
      <td><input type="text" data-field="score" /></td>
      <td><input type="file" accept="image/*" data-field="imageFile" /></td>
      <td>
        <div class="thumb">
          <img class="preview" data-field="preview" alt="profile" />
          <span class="preview-empty" data-field="previewEmpty">No Img</span>
        </div>
      </td>
    `;

    const fileInput = tr.querySelector('input[data-field="imageFile"]');
    const preview = tr.querySelector('img[data-field="preview"]');
    const previewEmpty = tr.querySelector('span[data-field="previewEmpty"]');

    fileInput.addEventListener("change", () => {
      const file = fileInput.files?.[0];
      if (!file) {
        preview.removeAttribute("src");
        preview.classList.remove("has-image");
        previewEmpty.style.display = "block";
        return;
      }

      preview.src = URL.createObjectURL(file);
      preview.classList.add("has-image");
      previewEmpty.style.display = "none";
    });

    fragment.appendChild(tr);
  }

  sheetBody.appendChild(fragment);
}

function parseClipboardTable(text) {
  return text
    .replace(/\r/g, "")
    .trimEnd()
    .split("\n")
    .filter((line) => line.length > 0)
    .map((line) => line.split("\t"));
}

function isValidRankCell(value) {
  if (value === "") return true;
  const rank = Number(value);
  return Number.isFinite(rank) && rank >= 1 && rank <= 10;
}

function shouldTreatFirstColumnAsRank(matrix) {
  const firstColumn = matrix.map((row) => (row[0] ?? "").trim());
  const filled = firstColumn.filter((value) => value !== "");
  if (filled.length === 0) return false;
  return filled.every(isValidRankCell);
}

function getRowIndex(rowEl) {
  return [...sheetBody.querySelectorAll("tr")].indexOf(rowEl);
}

function handleGridPaste(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) return;

  const clipboardText = event.clipboardData?.getData("text/plain") ?? "";
  const isMultiCellPaste = /\t|\n/.test(clipboardText);
  if (!isMultiCellPaste) return;

  const field = target.dataset.field;
  if (!field || !PASTE_FIELDS.includes(field)) return;

  const matrix = parseClipboardTable(clipboardText);
  if (matrix.length === 0) return;

  event.preventDefault();

  const startRowEl = target.closest("tr");
  if (!startRowEl) return;

  const startRow = getRowIndex(startRowEl);
  if (startRow < 0) return;

  let startCol = PASTE_FIELDS.indexOf(field);

  if (field === "rank" && !shouldTreatFirstColumnAsRank(matrix)) {
    startCol = 1;
  }

  const rows = [...sheetBody.querySelectorAll("tr")];
  let updatedCells = 0;

  matrix.forEach((cols, rowOffset) => {
    const row = rows[startRow + rowOffset];
    if (!row) return;

    cols.forEach((value, colOffset) => {
      const fieldName = PASTE_FIELDS[startCol + colOffset];
      if (!fieldName) return;

      const input = row.querySelector(`input[data-field="${fieldName}"]`);
      if (!input) return;

      input.value = value;
      updatedCells += 1;
    });
  });

  setStatus(`Pasted ${updatedCells} cells from Excel text.`);
}

function rowToPayload(row) {
  const rankInput = row.querySelector('input[data-field="rank"]');
  const nameInput = row.querySelector('input[data-field="name"]');
  const studentsInput = row.querySelector('input[data-field="studentsEducated"]');
  const schoolsInput = row.querySelector('input[data-field="schoolsEducated"]');
  const sessionsInput = row.querySelector('input[data-field="sessionsConducted"]');
  const scoreInput = row.querySelector('input[data-field="score"]');
  const fileInput = row.querySelector('input[data-field="imageFile"]');
  const preview = row.querySelector('img[data-field="preview"]');

  const rankRaw = Number(rankInput.value);
  const rank = Math.min(10, Math.max(1, Number.isNaN(rankRaw) ? 1 : rankRaw));
  const existingImageUrl = preview.classList.contains("has-image")
    ? preview.src
    : "";

  return {
    rank,
    name: nameInput.value ?? "",
    studentsEducated: studentsInput.value ?? "",
    schoolsEducated: schoolsInput.value ?? "",
    sessionsConducted: sessionsInput.value ?? "",
    score: scoreInput.value ?? "",
    imageFile: fileInput.files?.[0] ?? null,
    existingImageUrl,
  };
}

async function uploadImageIfPresent(rank, imageFile) {
  if (!imageFile) return "";

  // Store image directly in Realtime Database as a data URL.
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(typeof reader.result === "string" ? reader.result : "");
    reader.onerror = () => reject(new Error("Could not read selected image file."));
    reader.readAsDataURL(imageFile);
  });
}

async function loadExistingData() {
  try {
    const snapshot = await get(ref(db, "leaderboard"));
    if (!snapshot.exists()) return;

    const data = snapshot.val();
    const rows = [...sheetBody.querySelectorAll("tr")];

    rows.forEach((row, index) => {
      const rank = String(index + 1);
      const item = data[rank];
      if (!item) return;

      row.querySelector('input[data-field="rank"]').value = rank;
      row.querySelector('input[data-field="name"]').value = item.name ?? "";
      row.querySelector('input[data-field="studentsEducated"]').value =
        item.studentsEducated ?? item.students ?? item.class ?? "";
      row.querySelector('input[data-field="schoolsEducated"]').value =
        item.schoolsEducated ?? item.schools ?? item.school ?? item.team ?? "";
      row.querySelector('input[data-field="sessionsConducted"]').value =
        item.sessionsConducted ?? item.sessions ?? item.sessionConducted ?? "";
      row.querySelector('input[data-field="score"]').value = item.score ?? "";

      const preview = row.querySelector('img[data-field="preview"]');
      const previewEmpty = row.querySelector('span[data-field="previewEmpty"]');
      if (item.imageUrl) {
        preview.src = item.imageUrl;
        preview.classList.add("has-image");
        previewEmpty.style.display = "none";
      }
    });

    setStatus("Existing leaderboard loaded.");
  } catch (error) {
    setStatus(`Load failed: ${error.message}`, true);
  }
}

function clearForm() {
  const rows = [...sheetBody.querySelectorAll("tr")];

  rows.forEach((row, index) => {
    row.querySelector('input[data-field="rank"]').value = index + 1;
    row.querySelector('input[data-field="name"]').value = "";
    row.querySelector('input[data-field="studentsEducated"]').value = "";
    row.querySelector('input[data-field="schoolsEducated"]').value = "";
    row.querySelector('input[data-field="sessionsConducted"]').value = "";
    row.querySelector('input[data-field="score"]').value = "";
    row.querySelector('input[data-field="imageFile"]').value = "";
    const preview = row.querySelector('img[data-field="preview"]');
    const previewEmpty = row.querySelector('span[data-field="previewEmpty"]');
    preview.removeAttribute("src");
    preview.classList.remove("has-image");
    previewEmpty.style.display = "block";
  });
}

async function submitLeaderboard() {
  try {
    if (hasPlaceholderConfig(firebaseConfig)) {
      setStatus(
        "Firebase Web config is incomplete in app.js. Fill apiKey, messagingSenderId, and appId first.",
        true
      );
      return;
    }

    setStatus("Uploading leaderboard...");
    saveBtn.disabled = true;

    const rows = [...sheetBody.querySelectorAll("tr")];
    const updates = {};
    const warnings = [];

    for (const row of rows) {
      const payload = rowToPayload(row);
      let imageUrl = payload.existingImageUrl;

      if (payload.imageFile) {
        try {
          imageUrl = await uploadImageIfPresent(payload.rank, payload.imageFile);
        } catch (error) {
          imageUrl = "";
          warnings.push(`Rank ${payload.rank}: image skipped (${toFriendlyFirebaseError(error)})`);
        }
      }

      updates[`leaderboard/${payload.rank}`] = {
        rank: payload.rank,
        name: payload.name,
        studentsEducated: payload.studentsEducated,
        schoolsEducated: payload.schoolsEducated,
        sessionsConducted: payload.sessionsConducted,
        score: payload.score,
        imageUrl,
        updatedAt: Date.now(),
      };
    }

    await update(ref(db), updates);
    clearForm();
    if (warnings.length > 0) {
      setStatus(
        `Leaderboard submitted with ${warnings.length} image warning(s). Text data saved successfully.`
      );
      console.warn("Submit warnings:", warnings);
    } else {
      setStatus("Leaderboard submitted. Existing ranks were overwritten.");
    }
  } catch (error) {
    setStatus(`Submit failed: ${toFriendlyFirebaseError(error)}`, true);
  } finally {
    saveBtn.disabled = false;
  }
}

createRows();
loadExistingData();
saveBtn.addEventListener("click", submitLeaderboard);
clearBtn.addEventListener("click", clearForm);
sheetBody.addEventListener("paste", handleGridPaste);

if (hasPlaceholderConfig(firebaseConfig)) {
  setStatus(
    "Setup required: complete Firebase Web config in app.js before submit.",
    true
  );
}
