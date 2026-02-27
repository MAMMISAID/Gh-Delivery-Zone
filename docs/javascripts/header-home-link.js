(() => {
  const HOME_PATH = "/";

  const bindHeaderTitleHomeLink = () => {
    const titleBlock = document.querySelector('[data-md-component="header-title"]');
    if (!titleBlock || titleBlock.dataset.homeLinkBound === "1") return;

    const goHome = () => {
      window.location.assign(HOME_PATH);
    };

    titleBlock.dataset.homeLinkBound = "1";
    titleBlock.style.cursor = "pointer";
    titleBlock.setAttribute("role", "link");
    titleBlock.setAttribute("tabindex", "0");

    titleBlock.addEventListener("click", (event) => {
      if (event.target instanceof Element && event.target.closest("a, button, input, textarea, select")) {
        return;
      }
      goHome();
    });

    titleBlock.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        goHome();
      }
    });
  };

  if (typeof document$ !== "undefined") {
    document$.subscribe(bindHeaderTitleHomeLink);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindHeaderTitleHomeLink, { once: true });
  } else {
    bindHeaderTitleHomeLink();
  }
})();
