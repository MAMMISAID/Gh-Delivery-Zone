# MkDocs Doc Guardian Memory

## Draw.io Plugin Syntax

The project uses `mkdocs-drawio` plugin for embedding diagrams.

**Correct syntax:**
```markdown
![descriptive alt text](path/to/file.drawio)
```

**Common mistake:**
- Do NOT use `![Page-1](path)` - the page name should not be in the alt text
- To reference a specific page, use: `![](path/to/file.drawio#Page-1)`
- Alt text should be descriptive for accessibility, not the page name

**Files using draw.io:**
- `docs/architecture/mental-model.md` - contains 4-layer architecture diagram

## Accessibility Pattern

Diagrams use descriptive alt text in the image markdown syntax, followed by a `<details>` block with full text description:
```markdown
![Brief description of diagram](../path/to/diagram.drawio)

<details>
<summary>Text description of architecture diagram</summary>

Full detailed text description here...

</details>
```

This pattern ensures accessibility for screen readers and should be preserved for all diagrams.
