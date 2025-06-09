document.addEventListener("DOMContentLoaded", () => {
  const counters = [
    { id: "counter1", end: 200 },
    { id: "counter2", end: 8300 },
    { id: "counter3", end: 50 },
  ];

  const options = {
    threshold: 0.5,
  };

  const runCounter = (id, endValue) => {
    let count = 0;
    const element = document.getElementById(id);
    const increment = Math.ceil(endValue / 100);

    const updateCounter = () => {
      count += increment;
      if (count < endValue) {
        element.innerText = count;
        requestAnimationFrame(updateCounter);
      } else {
        element.innerText = endValue;
      }
    };

    updateCounter();
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => runCounter(c.id, c.end));
        obs.disconnect(); // Run only once
      }
    });
  }, options);

  observer.observe(document.querySelector(".counters"));
});
// Hero text color changing
document.addEventListener("DOMContentLoaded", () => {
  const text = document.getElementById("changing-text");
  const colors = ["#ff0000", "#ff7f00", "#ffc107", "#28a745", "#007bff", "#6f42c1"]; // red, orange, yellow, green, blue, purple
  let index = 0;

  setInterval(() => {
    text.style.color = colors[index];
    index = (index + 1) % colors.length;
  }, 1000); // Change color every 1 second
});
