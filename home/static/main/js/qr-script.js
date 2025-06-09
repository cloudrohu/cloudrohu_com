const generateBtn = document.getElementById("generateBtn");
const urlInput = document.getElementById("urlInput");
const qrContainer = document.getElementById("qrContainer");
const downloadLink = document.getElementById("downloadLink");

generateBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  qrContainer.innerHTML = "";
  downloadLink.style.display = "none";

  if (!url) {
    alert("Please enter a valid URL");
    return;
  }

  QRCode.toCanvas(url, { width: 200 }, (err, canvas) => {
    if (err) {
      console.error(err);
      return;
    }

    qrContainer.appendChild(canvas);

    // Convert canvas to image URL for downloading
    const imageURL = canvas.toDataURL("image/png");
    downloadLink.href = imageURL;
    downloadLink.style.display = "inline-block";
  });
});
