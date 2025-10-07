document.addEventListener("DOMContentLoaded", () => {
  // Animate the title
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

  // Smooth transitions for difficulty links
  const links = document.querySelectorAll(".level a");
  links.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      link.classList.add("clicked");
      document.body.classList.add("fade-out");
      setTimeout(() => {
        window.location.href = link.getAttribute("href");
      }, 300);
      setTimeout(() => link.classList.remove("clicked"), 200);
    });
  });
});
