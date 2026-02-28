# ADR 0001: Documentation Stack

## Status

**Accepted**

## Context

The GitHub Enterprise Delivery Zone framework needs a documentation platform that meets the following requirements:

- **Version-controlled** — documentation must live alongside code in Git, with pull request reviews and change history
- **Developer-friendly** — contributors should write in Markdown, not a proprietary format or WYSIWYG editor
- **Static site output** — the documentation must be deployable as a static site to GitHub Pages with no server-side runtime
- **Diagram support** — architecture and process flows must be expressible as code (Mermaid), not as image files that cannot be diffed
- **Low maintenance** — the toolchain should be lightweight, with minimal dependencies and no SaaS accounts to manage
- **Professional appearance** — the site must look polished and provide navigation, search, and mobile responsiveness out of the box

The documentation serves multiple audiences: platform engineers, security teams, enterprise architects, and product developers. It must be easy to contribute to and easy to consume.

## Decision

Use **MkDocs** with the **Material for MkDocs** theme, deployed as a static site to **GitHub Pages**.

The stack:

- **MkDocs 1.6.x** — static site generator for project documentation
- **Material for MkDocs 9.5.x** — feature-rich theme with navigation, search, and admonitions
- **pymdownx.superfences** — enables Mermaid diagram rendering as fenced code blocks
- **Python 3.13** — runtime for MkDocs and extensions
- **GitHub Pages** — hosting for the built static site

All dependencies are pinned in `requirements-docs.txt` and installed with `pip install -r requirements-docs.txt`.

## Rationale

**Markdown-based authoring.** Every contributor already knows Markdown. There is no learning curve for content creation. Diffs are readable in pull requests, and reviews follow the same workflow as code.

**Python ecosystem.** MkDocs is a single `pip install` away. It has no complex build toolchain, no Node.js dependency tree, and no bundler configuration. The local development server starts in under two seconds.

**Material theme.** Material for MkDocs provides a professional, responsive design with built-in features that would otherwise require custom development: full-text search, navigation tabs, table of contents, admonitions, code highlighting, and content tabs. It is the most widely adopted MkDocs theme with active maintenance.

**Mermaid diagram support.** Architecture diagrams, process flows, and decision trees are written as code inside fenced blocks. They render automatically, are version-controlled, and require no external diagramming tool. The `pymdownx.superfences` extension handles rendering natively.

**Static output.** The `mkdocs build` command produces a directory of HTML, CSS, and JavaScript files. No server-side processing is required. GitHub Pages serves the output directly, with no infrastructure to manage, no containers to run, and no uptime to monitor.

**Version-controlled alongside code.** Documentation lives in the same repository as the framework itself. Changes to documentation go through the same pull request process as code changes. There is a single source of truth, and documentation never drifts from the implementation it describes.

## Alternatives considered

**Docusaurus** — React-based static site generator from Meta. It is feature-rich and supports MDX (Markdown with JSX). However, it requires a Node.js toolchain, has a significantly larger dependency tree, and introduces frontend build complexity that is unnecessary for a documentation-only site. The Python-based MkDocs stack is lighter and better aligned with the infrastructure-as-code tooling already in use.

**GitBook** — Hosted documentation platform with a WYSIWYG editor and Git sync. It provides a polished experience but introduces a SaaS dependency. Content is stored on GitBook's platform, which conflicts with the requirement for full version control in Git. The free tier has limitations, and the paid tier adds ongoing cost with no clear benefit over a self-hosted static site.

**Confluence** — Enterprise wiki widely used in corporate environments. It is not version-controlled, does not support Markdown natively, and cannot be deployed as a static site. Content is locked in Atlassian's platform, making migration difficult. It does not align with the developer-first, Git-native workflow that the Delivery Zone framework promotes.

**Plain GitHub wiki** — Built into every GitHub repository. It supports Markdown and is version-controlled (as a separate Git repo). However, it lacks theming, navigation structure, search, admonitions, diagram rendering, and any form of build validation. It is insufficient for a multi-section documentation site with cross-references and structured navigation.

## Consequences

This decision has the following implications:

- **All documentation is written in Markdown.** Contributors must follow Markdown syntax and MkDocs conventions (front matter, admonitions, navigation structure in `mkdocs.yml`).
- **Contributors need basic MkDocs knowledge.** Running `python -m mkdocs serve` locally and understanding the `nav` structure in `mkdocs.yml` are minimum requirements for anyone modifying documentation structure.
- **Theme is constrained to Material for MkDocs <9.6.** Versions 9.6 and above introduce MkDocs 2.0 compatibility warnings. The theme must stay on 9.5.x until MkDocs 2.0 is fully supported.
- **MkDocs must stay below version 2.** MkDocs 2.0 introduces breaking changes that are not yet compatible with the current Material theme version. Upgrading requires coordinated testing of all extensions and theme features.
- **Diagrams are code, not images.** Mermaid diagrams are maintainable and diffable, but they have rendering limitations compared to dedicated diagramming tools. Complex diagrams may need to be simplified or split into multiple smaller diagrams.
- **Build validation is possible.** The `mkdocs build --strict` command catches broken links, missing pages, and configuration errors at build time. This can be integrated into CI to prevent documentation regressions.

---
