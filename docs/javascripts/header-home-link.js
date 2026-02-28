(() => {
  const HOME_PATH = "/";

  const addSkipLink = () => {
    if (document.querySelector(".skip-link")) return;

    const skipLink = document.createElement("a");
    skipLink.href = "#main-content";
    skipLink.className = "skip-link";
    skipLink.textContent = "Skip to main content";
    document.body.insertBefore(skipLink, document.body.firstChild);

    const main = document.querySelector(".md-content");
    if (main && !main.id) {
      main.id = "main-content";
    }
  };

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
    titleBlock.setAttribute("aria-label", "Return to home page");

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

  const addMermaidA11y = () => {
    document.querySelectorAll(".mermaid").forEach((diagram) => {
      if (diagram.getAttribute("role")) return;
      diagram.setAttribute("role", "img");
      const details = diagram.parentElement &&
        diagram.parentElement.nextElementSibling;
      if (details && details.tagName === "DETAILS") {
        diagram.setAttribute("aria-label", "Diagram — see text description below");
      }
    });
  };

  if (typeof document$ !== "undefined") {
    document$.subscribe(() => {
      addSkipLink();
      bindHeaderTitleHomeLink();
      addMermaidA11y();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      addSkipLink();
      bindHeaderTitleHomeLink();
      addMermaidA11y();
    }, { once: true });
  } else {
    addSkipLink();
    bindHeaderTitleHomeLink();
    addMermaidA11y();
  }
})();
