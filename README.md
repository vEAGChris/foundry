# VEAG Foundry

VEAG Foundry is the workspace for developing the VEAG Foundry web experience and its supporting design assets.

The project is organised as a lightweight static-site foundation so pages, styles, scripts, visual assets, and deliverables can evolve independently.

## Project structure

```text
.
+-- assets/
|   +-- css/       # Shared stylesheets
|   +-- data/      # Content and structured data
|   +-- img/       # Images and other visual assets
|   `-- js/        # Client-side JavaScript
+-- pages/         # Site pages and page-specific source
`-- exports/       # Generated or shareable deliverables
```

## Getting started

1. Add shared assets to the appropriate `assets/` subdirectory.
2. Create pages in `pages/` and reference shared assets using relative paths.
3. Place generated files intended for review or delivery in `exports/`.

## Conventions

- Keep reusable styles, data, images, and scripts in `assets/`.
- Keep page-specific markup and resources together in `pages/`.
- Treat `exports/` as output: avoid making it the source of record for editable work.

## Status

The repository currently contains the initial project structure and is ready for implementation.
