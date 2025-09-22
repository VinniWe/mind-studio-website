## Mind Studio – Static Website

Simple static site (HTML/CSS + minimal JS) suitable for instant deployment.

### Structure
- `index.html` – German homepage
- `leistungen-einzel.html`, `leistungen-organisationen.html` – services
- `ansatz.html` – approach
- `kontakt.html` – contact with mailto form
- `impressum.html`, `datenschutz.html` – legal
- `en/index.html` – minimal English landing
- `assets/css/styles.css` – brand styles
- `assets/img/favicon.svg` – favicon
- `sitemap.xml`, `robots.txt`

### Option A: Netlify (recommended)
1. Push this folder to a Git provider (GitHub, GitLab, Bitbucket).
2. In Netlify, New site from Git → select your repo.
3. Build settings: Build command: `none`; Publish directory: `/` (repo root).
4. Deploy. Set custom domain `mind-studio.me` if available and configure DNS per Netlify.

### Option B: GitHub Pages
1. Create a new GitHub repository and push this folder.
2. In repo Settings → Pages → Branch: `main` (or `master`), Folder: `/root`.
3. Save. Your site will be available at `https://<user>.github.io/<repo>/`.
4. For custom domain, set it in Pages settings and create DNS `CNAME` to GitHub Pages.
Notes:
- This repo includes a `.nojekyll` file so GitHub Pages serves files as-is.
- Update `sitemap.xml` and `robots.txt` if domain changes.
- For contact form handling beyond `mailto:`, use Netlify Forms or a serverless function.


