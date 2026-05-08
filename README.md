# Campbell & Co. LeeWay Governed Storefront

Campbell & Co. is a React/Vite luxury jewelry storefront governed by LeeWay Standards. The repository uses LeeWay file identity headers, 5WH metadata, compliance scripts, and a local concierge service.

## Run Locally

**Prerequisites:** Node.js 18 or newer.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Start the storefront:

   ```bash
   npm run dev
   ```

3. Validate LeeWay governance:

   ```bash
   npm run leeway:compliance
   npm run lint
   npm run build
   ```

## Client Demo URLs

Local development exposes both entry points:

- Storefront: `http://localhost:3000/`
- Admin: `http://localhost:3000/admin.html`

If port `3000` is busy, Vite will print the next available port.

## GitHub Pages

This repo is prepared for GitHub Pages through `.github/workflows/pages.yml`.

1. Push the project to GitHub on `main` or `master`.
2. In GitHub, open **Settings → Pages**.
3. Set the source to **GitHub Actions**.
4. Run the **Deploy GitHub Pages** workflow or push a commit.

The workflow runs LeeWay compliance, TypeScript validation, a production build, and creates `dist/404.html` so client-side routes such as `/shop`, `/about`, and `/product/...` survive refreshes on GitHub Pages.

For a custom domain hosted at the root path, change the workflow build step from:

```bash
npm run build -- --base="$BASE_PATH"
```

to:

```bash
npm run build -- --base="/"
```

## LeeWay Governance

Source files are expected to include:

- `LEEWAY HEADER`
- `REGION`
- `TAG`
- `DISCOVERY_PIPELINE`
- Complete 5WH metadata

Use `npm run leeway:headers` after adding governed source files.
