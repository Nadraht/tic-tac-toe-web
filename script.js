document.addEventListener("DOMContentLoaded", () => {

  // Animate the title (the main <h1>)
  const title = document.querySelector("h1");
  if (title) {
    title.style.opacity = 0;
    title.style.transform = "translateY(-20px)";
    setTimeout(() => {
      title.style.transition = "all 1s ease";
      title.style.opacity = 1;
      title.style.transform = "translateY(0)";
    }, 300);
  }

  // Select all difficulty links
  const links = document.querySelectorAll(".level a");

  // Add smooth transition on click
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.getAttribute("href");
      }, 300);
    });
  });

  // Add click animation for buttons
  links.forEach(link => {
    link.addEventListener("click", () => {
      link.classList.add("clicked");
      setTimeout(() => link.classList.remove("clicked"), 200);
    });
  });

});
