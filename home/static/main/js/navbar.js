const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

// Hamburger toggle for mobile menu
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// Mobile dropdown toggle
document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
  toggle.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = toggle.parentElement;
      parent.classList.toggle('active');
    }
  });
});