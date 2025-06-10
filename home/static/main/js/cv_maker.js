function generateCV() {
const name = document.getElementById('name').value;
const title = document.getElementById('title').value;
const email = document.getElementById('email').value;
const phone = document.getElementById('phone').value;
const summary = document.getElementById('summary').value;
const skills = document.getElementById('skills').value;
const experience = document.getElementById('experience').value;
const education = document.getElementById('education').value;
const languages = document.getElementById('languages').value;
const imageFile = document.getElementById('profileImage').files[0];

const renderCV = (imageData = '') => {
  const imageTag = imageData ? `<img src="${imageData}" class="w-24 h-24 object-cover rounded-full absolute top-6 right-6 border" />` : '';

  const cvHTML = `
    <div class="relative bg-white p-6">
      ${imageTag}
      <h2 class="text-2xl font-bold">${name}</h2>
      <p class="text-gray-600">${title}</p>
      <p class="text-gray-500 mt-1">${email} | ${phone}</p>

      <div class="mt-4">
        <h3 class="font-semibold text-lg">Summary</h3>
        <p class="text-gray-700">${summary}</p>
      </div>

      <div class="mt-4">
        <h3 class="font-semibold text-lg">Skills</h3>
        <p>${skills}</p>
      </div>

      <div class="mt-4">
        <h3 class="font-semibold text-lg">Experience</h3>
        <p>${experience}</p>
      </div>

      <div class="mt-4">
        <h3 class="font-semibold text-lg">Education</h3>
        <p>${education}</p>
      </div>

      <div class="mt-4">
        <h3 class="font-semibold text-lg">Languages Known</h3>
        <p>${languages}</p>
      </div>
    </div>
  `;

  const resultDiv = document.getElementById('cvResult');
  resultDiv.innerHTML = cvHTML;
  resultDiv.classList.remove('hidden');
};

if (imageFile) {
  const reader = new FileReader();
  reader.onload = function (e) {
    renderCV(e.target.result);
  };
  reader.readAsDataURL(imageFile);
} else {
  renderCV(); // Without image
}
}

function downloadPDF() {
const cv = document.getElementById('cvResult');
const name = document.getElementById('name').value.trim();

if (cv.innerHTML.trim() === '') {
  alert('Please generate the CV first!');
  return;
}

const fileName = name ? `${name.replace(/\s+/g, '_')}_CV.pdf` : 'Your_CV.pdf';

html2pdf().from(cv).save(fileName);
}
