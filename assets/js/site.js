document.documentElement.classList.add("js");

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const siteHeader = document.querySelector("[data-site-header]");
const navigationLinks = navigation
  ? Array.from(navigation.querySelectorAll('a[href^="#"]'))
  : [];

const closeMenu = (returnFocus = false) => {
  if (!menuToggle || !navigation) {
    return;
  }

  navigation.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");

  if (returnFocus) {
    menuToggle.focus();
  }
};

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const willOpen = menuToggle.getAttribute("aria-expanded") !== "true";
    menuToggle.setAttribute("aria-expanded", String(willOpen));
    navigation.classList.toggle("is-open", willOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      closeMenu();
    }
  });

  document.addEventListener("click", (event) => {
    if (
      navigation.classList.contains("is-open") &&
      !navigation.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && navigation.classList.contains("is-open")) {
      closeMenu(true);
    }
  });

  window
    .matchMedia("(min-width: 55.01rem)")
    .addEventListener("change", (event) => {
      if (event.matches) {
        closeMenu();
      }
    });
}

const updateHeaderState = () => {
  if (siteHeader) {
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 12);
  }
};

updateHeaderState();
window.addEventListener("scroll", updateHeaderState, { passive: true });

const sections = navigationLinks
  .map((link) => {
    const target = document.querySelector(link.getAttribute("href"));
    return target ? { link, target } : null;
  })
  .filter(Boolean);

if ("IntersectionObserver" in window && sections.length > 0) {
  const activeSectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((first, second) => second.intersectionRatio - first.intersectionRatio)[0];

      if (!visibleEntry) {
        return;
      }

      navigationLinks.forEach((link) => link.removeAttribute("aria-current"));
      const activeItem = sections.find(
        ({ target }) => target === visibleEntry.target
      );

      if (activeItem) {
        activeItem.link.setAttribute("aria-current", "true");
      }
    },
    {
      rootMargin: "-25% 0px -60% 0px",
      threshold: [0.05, 0.25, 0.5]
    }
  );

  sections.forEach(({ target }) => activeSectionObserver.observe(target));
}

