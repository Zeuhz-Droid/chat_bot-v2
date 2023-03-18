{
  /* <i class="fa-solid fa-moon-over-sun"></i> */
}

const themeIcon = document.querySelector(".nav-theme-icon");

themeIcon.addEventListener("click", toggletheme);

function toggletheme() {
  themeIcon.children[1].textContent =
    themeIcon.children[1].textContent == "Light mode"
      ? "Dark mode"
      : "Light mode";
  if (themeIcon.children[1].textContent == "Dark mode") {
    themeIcon.children[0].classList.remove("fa-sun");
    themeIcon.children[0].classList.add("fa-moon");
    document.documentElement.classList.add("dark");
  } else {
    themeIcon.children[0].classList.remove("fa-moon");
    themeIcon.children[0].classList.add("fa-sun");
    document.documentElement.classList.remove("dark");
  }
}
