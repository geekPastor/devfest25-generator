const templatePath = "template.png"; // ton visuel de base
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const photoInput = document.getElementById("photoInput");
const nameInput = document.getElementById("nameInput");
const generateBtn = document.getElementById("generateBtn");
const previewContainer = document.getElementById("previewContainer");
const downloadBtn = document.getElementById("downloadBtn");

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
  // L’image est plus large que le carré → on rogne les côtés
  drawHeight = height;
  drawWidth = height * imgRatio;
  offsetX = (width - drawWidth) / 2;
  offsetY = 0;
} else {
  // L’image est plus haute que le carré → on rogne le haut et le bas
  drawWidth = width;
  drawHeight = width / imgRatio;
  offsetX = 0;
  offsetY = (height - drawHeight) / 2;
}

// On dessine l’image centrée et recadrée
ctx.drawImage(photo, offsetX, offsetY, drawWidth, drawHeight);

// === 2️⃣ Template officiel ===
ctx.drawImage(template, 0, 0, width, height);


  // === 3️⃣ Texte (nom + "Je serai là") ===
  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";

  // Nom (dans le rectangle jaune)
  ctx.font = "500 30px 'Google Sans'";
  ctx.fillText(fullName, 335, 635);

  // Sous-texte "Je serai là"
  ctx.font = "700 24px 'Google Sans'";
  ctx.fillText("Je serai là", 335, 675);

  // === 4️⃣ Bouton de téléchargement ===
  previewContainer.classList.remove("hidden");
  downloadBtn.href = canvas.toDataURL("image/png");
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

generateBtn.addEventListener("click", () => {
  const photoFile = photoInput.files[0];
  const fullName = nameInput.value.trim();

  if (!photoFile || !fullName) {
    alert("⚠️ Merci d’ajouter ta photo et ton nom avant de continuer !");
    return;
  }

  generateVisual(photoFile, fullName);
});
