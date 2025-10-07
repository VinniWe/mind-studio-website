# CMS Setup Instructions

## ⚠️ Important: GitHub Pages Limitation

GitHub Pages only serves static files (HTML, CSS, JS) and **does not support PHP**. 

To use the CMS, you have **three options**:

---

## Option 1: Run CMS Locally (Recommended for Quick Setup)

### Step 1: Install Local PHP Server

**For Mac:**
```bash
# Install MAMP (free version)
# Download from: https://www.mamp.info/en/downloads/

# Or use built-in PHP:
cd /Users/vincentwendler/Desktop/mind-studio/mind-studio-website
php -S localhost:8000
```

**For Windows:**
```bash
# Install XAMPP
# Download from: https://www.apachefriends.org/
```

### Step 2: Access CMS

1. Open your browser
2. Go to: `http://localhost:8000/backend/`
3. Login with:
   - Username: `admin`
   - Password: `mindstudio2024`

### Step 3: Edit Content

1. Manage slider content
2. Upload images
3. Edit text
4. Click "Save"

### Step 4: Deploy Changes

```bash
cd /Users/vincentwendler/Desktop/mind-studio/mind-studio-website
git add data/content.json uploads/
git commit -m "Update content via CMS"
git push
```

---

## Option 2: Deploy to Netlify (Best for Production)

Netlify provides free hosting with built-in CMS support.

### Step 1: Sign Up for Netlify
1. Go to https://www.netlify.com/
2. Sign up with your GitHub account

### Step 2: Connect Repository
1. Click "New site from Git"
2. Choose GitHub
3. Select `mind-studio-website` repository
4. Click "Deploy site"

### Step 3: Access Your Site
Your site will be at: `https://your-site-name.netlify.app`

### Step 4: Add Custom Domain (Optional)
1. In Netlify dashboard, go to "Domain settings"
2. Add your custom domain (e.g., `mind-studio.me`)
3. Update DNS records as instructed

### Benefits of Netlify:
- ✅ Supports server-side functions (for PHP/Node.js backend)
- ✅ Built-in CMS (Netlify CMS)
- ✅ Automatic deployments on git push
- ✅ Free SSL certificates
- ✅ Form handling
- ✅ Better than GitHub Pages for dynamic sites

---

## Option 3: Use Netlify CMS (Git-Based CMS)

Netlify CMS is a single-page app that runs in your browser and commits directly to Git.

### Features:
- No backend server needed
- Works with GitHub Pages
- Edit content in browser
- Automatic git commits
- Image uploads
- User-friendly interface

### Would you like me to set this up?

---

## Current Setup Status

✅ **PHP Backend Created**: Full-featured CMS with login, slider management, image upload
✅ **JSON Storage**: All content in `data/content.json`
✅ **API Endpoints**: Ready for frontend integration
✅ **Admin Interface**: Beautiful, responsive design
✅ **Security**: Password protection, file validation

❌ **GitHub Pages**: Doesn't support PHP backends

---

## Recommended Next Steps

### For Quick Testing (Today):
```bash
# Run locally
cd /Users/vincentwendler/Desktop/mind-studio/mind-studio-website
php -S localhost:8000

# Then open: http://localhost:8000/backend/
```

### For Production (This Week):
1. Deploy to Netlify
2. Set up custom domain
3. Use the CMS to manage content
4. Automatic deployments on changes

---

## Questions?

**Q: Can I use the current PHP CMS?**
A: Yes, but only locally. You can edit content locally and push changes to GitHub.

**Q: What's the best long-term solution?**
A: Netlify or Vercel - they're free and support backend functionality.

**Q: Can I keep using GitHub Pages?**
A: Yes, but you'll need to use Netlify CMS (browser-based) or edit JSON files directly.

**Q: How do I switch to Netlify?**
A: It's easy! Just sign up, connect your repo, and it auto-deploys. Takes 5 minutes.

---

## Quick Command Reference

```bash
# Start local server
php -S localhost:8000

# Access CMS
open http://localhost:8000/backend/

# Commit content changes
git add data/ uploads/
git commit -m "Update content"
git push
```

---

Would you like me to:
1. ✅ Help you set up the local PHP server?
2. ✅ Create Netlify CMS configuration?
3. ✅ Set up deployment to Netlify?

Let me know which option works best for you!
