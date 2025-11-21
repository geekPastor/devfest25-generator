const templatePath = "template.png"; // ton visuel de base
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const generateBtn = document.getElementById("generateBtn");

const previewContainer = document.getElementById("previewContainer");
const downloadBtn = document.getElementById("downloadBtn");

// 🆕 MODAL
const previewModal = document.getElementById("previewModal");
const closeModalBtn = document.getElementById("closeModalBtn");


// 🆕 ===== LOADER FUNCTIONS =====
function showLoader() {
  generateBtn.disabled = true;
  generateBtn.innerHTML = `
    <svg class="animate-spin h-5 w-5 text-white inline-block mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
    </svg>
    Génération…
  `;
}

function hideLoader() {
  generateBtn.disabled = false;
  generateBtn.innerHTML = "Générer mon visuel";
}


// 🖼️ ===== GÉNÉRATION DU VISUEL =====
async function generateVisual(photoFile, fullName) {
  const template = await loadImage(templatePath);
  const photo = await loadImage(URL.createObjectURL(photoFile));

  // === CONFIG GÉNÉRALE ===
  const width = 768;
  const height = 768;
  ctx.clearRect(0, 0, width, height);

  // === 1️⃣ Arrière-plan photo (sans étirement) ===
  const imgRatio = photo.width / photo.height;
  const canvasRatio = width / height;

  let drawWidth, drawHeight, offsetX, offsetY;

  if (imgRatio > canvasRatio) {
    drawHeight = height;
    drawWidth = height * imgRatio;
    offsetX = (width - drawWidth) / 2;
    offsetY = 0;
  } else {
    drawWidth = width;
    drawHeight = width / imgRatio;
    offsetX = 0;
    offsetY = (height - drawHeight) / 2;
  }

  ctx.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);

  // === 2️⃣ Template officiel ===
  ctx.drawImage(template, 0, 0, width, height);

  // === 3️⃣ Texte (nom + "Je serai là") ===
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";

  ctx.font = "500 30px 'Google Sans'";
  ctx.fillText(fullName, 345, 635);

  ctx.font = "700 24px 'Google Sans'";
  ctx.fillText("Je serai là", 345, 675);

  ctx.font = "300 18px 'Google Sans'";
  ctx.fillText("20.12.2025", 590, 593);

  // === 4️⃣ Bouton de téléchargement + ouverture popup ===
  downloadBtn.href = canvas.toDataURL("image/png");

  previewContainer.classList.remove("hidden");

  previewModal.classList.remove("hidden");
}


// 📥 ===== IMAGE LOADER =====
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


// 🎛️ ===== CLICK SUR LE BOUTON GÉNÉRER =====
generateBtn.addEventListener("click", async () => {
  const photoFile = photoInput.files[0];
  const fullName = nameInput.value.trim();

  if (!photoFile || !fullName) {
    alert("⚠️ Merci d’ajouter ta photo et ton nom avant de continuer !");
    return;
  }

  showLoader(); // 🟦 Loader ACTIVÉ

  try {
    await generateVisual(photoFile, fullName);
  } catch (err) {
    alert("Erreur lors de la génération de l'image");
    console.error(err);
  }

  hideLoader(); // 🟩 Loader DÉSACTIVÉ
});


// 🆕 Fermeture de la popup sur clic du bouton ✕
closeModalBtn.addEventListener("click", () => {
  previewModal.classList.add("hidden");
});

// 🆕 Optionnel : fermer en cliquant sur le fond noir
previewModal.addEventListener("click", (e) => {
  if (e.target === previewModal) {
    previewModal.classList.add("hidden");
  }
});