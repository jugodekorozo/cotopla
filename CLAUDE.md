# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static web project ("Saturday Creative Post") organized as a VS Code multi-root workspace (`css.code-workspace`). The workspace references asset folders from an external project at `~/Downloads/Saturday-creative-post.-main/`.

## Workspace Structure

The VS Code workspace (`css.code-workspace`) organizes the project into separate root folders:
- `css/` — Stylesheets
- `js/` — JavaScript files
- `svg/` — SVG assets
- `imagenes/` — Image assets
- `fonts/` — Font files

> Note: The source project is located at `~/Downloads/Saturday-creative-post.-main/` relative to this workspace file. If that path doesn't exist, the workspace folders will be broken.

## Development

This is a static site with no build system or package manager. Open files directly in a browser or use a local static server:

```bash
# Serve with Python
python3 -m http.server 8080 --directory ~/Downloads/Saturday-creative-post.-main

# Or with Node (if npx available)
npx serve ~/Downloads/Saturday-creative-post.-main
```
