# Decap CMS Setup Guide

Your Mind Studio website is now configured with **Decap CMS** (formerly Netlify CMS) - a modern, git-based content management system!

## 🎯 What is Decap CMS?

Decap CMS is an open-source content management system for static sites that:
- ✅ Stores content in your Git repository (markdown files)
- ✅ Provides a user-friendly admin interface
- ✅ Supports image uploads and media management
- ✅ Works with any static site generator
- ✅ No database required
- ✅ Free and open source

---

## 🚀 Quick Setup (15 minutes)

### Option 1: Deploy to Netlify (Recommended)

#### Step 1: Sign Up & Deploy
1. Go to https://www.netlify.com/
2. Click "Sign up" → "Sign up with GitHub"
3. Authorize Netlify
4. Click "Add new site" → "Import an existing project"
5. Choose GitHub → Select `VinniWe/mind-studio-website`
6. Click "Deploy site"

#### Step 2: Enable Identity & Git Gateway
1. In Netlify dashboard → **Site settings**
2. Click **Identity** in sidebar
3. Click **Enable Identity**
4. Scroll to **Services** → Click **Enable Git Gateway**
5. Under **Registration**, select **Invite only**

#### Step 3: Create Admin User
1. Go to **Identity** tab
2. Click **Invite users**
3. Enter your email
4. Check your email → Click invitation link
5. Set your password
6. Done! You're registered

#### Step 4: Access CMS
Your CMS is now live at:
```
https://your-site-name.netlify.app/admin/
```

Login with:
- **Method**: Netlify Identity
- **Email**: Your registered email
- **Password**: Password you set

---

### Option 2: Deploy to Other Platforms

Decap CMS works with many platforms:

#### **Vercel**
1. Import your GitHub repo to Vercel
2. Use GitHub backend in config.yml:
```yaml
backend:
  name: github
  repo: VinniWe/mind-studio-website
  branch: main
```
3. Authenticate with GitHub OAuth

#### **GitHub Pages** (with GitHub Backend)
1. Keep using GitHub Pages
2. Update `admin/config.yml`:
```yaml
backend:
  name: github
  repo: VinniWe/mind-studio-website
  branch: main
```
3. Set up GitHub OAuth application
4. Use `https://vinniwe.github.io/mind-studio-website/admin/`

#### **Cloudflare Pages**
1. Connect your GitHub repo
2. Deploy to Cloudflare Pages
3. Use Git Gateway or GitHub backend

---

## 📁 What's Configured

### Content Collections

**Slider** (`content/slider/`)
- Add, edit, delete slides
- Upload desktop & mobile images
- Reorder with drag & drop
- Set active/inactive status

**Homepage** (`content/homepage/`)
- Statistics section
- Services section
- Approach items
- Testimonials

**Pages** (`content/pages/`)
- Über Mich (About)
- Leistungen - Einzel (Individual Services)
- Leistungen - Organisationen (Organization Services)
- Ansatz (Approach)

**Settings** (`content/settings/`)
- Site title & description
- Contact information
- Social media links

### Features

✅ **Rich Text Editor** - Markdown with live preview
✅ **Image Upload** - Drag & drop or browse
✅ **Media Library** - Manage all your images
✅ **Preview Mode** - See changes before publishing
✅ **Editorial Workflow** - Draft → Review → Publish
✅ **Mobile Responsive** - Edit on any device
✅ **Version Control** - Full history in Git

---

## ✏️ Using the CMS

### Managing Slider

1. Click **Slider** in sidebar
2. See all your slides
3. Click a slide to edit
4. Or click **New Slide** to add

**Edit slide content:**
- Title, subtitle, description
- Meta text (category label)
- Desktop image (1200x600px recommended)
- Mobile image (800x600px recommended)
- CTA button text and link
- Order number (for sorting)
- Active checkbox

### Uploading Images

1. Click any image field
2. Click **Choose an image**
3. Drag & drop or **Upload**
4. Select your image
5. It's automatically added to Git

**Image tips:**
- Use WebP or JPEG for photos
- Use SVG for logos and graphics
- Keep images under 500KB
- Use descriptive filenames

### Publishing Changes

1. Make your edits
2. Click **Publish** (top right)
3. Add a commit message (optional)
4. Click **Publish now**
5. Changes committed to Git
6. Site rebuilds automatically
7. Live in 1-2 minutes!

### Draft Mode

- Click **Save** instead of **Publish**
- Keeps changes as draft
- Not published to live site
- Finish editing later

---

## 🔧 Local Development

Test the CMS on your computer:

### Install & Run

```bash
# Install Decap CMS Proxy Server
npm install -g decap-server

# Navigate to your project
cd /Users/vincentwendler/Desktop/mind-studio/mind-studio-website

# Start local backend
npx decap-server

# In another terminal, start local server
python3 -m http.server 8000
# or
php -S localhost:8000
```

Access CMS at: `http://localhost:8000/admin/`

**Note**: Make sure `local_backend: true` is in your `admin/config.yml`

---

## 🎨 Customization

### Change CMS Colors

Edit `admin/index.html`:
```css
:root {
  --primary-color: #E67E22;  /* Your brand color */
  --secondary-color: #2D1B00; /* Text color */
}
```

### Add New Content Types

Edit `admin/config.yml`:
```yaml
collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "content/blog"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Body", name: "body", widget: "markdown"}
```

### Custom Widgets

Add custom input widgets in `admin/index.html`:
```javascript
CMS.registerWidget('custom-widget', MyCustomWidget);
```

---

## 🔒 Security

### Access Control

- **Invite Only**: Only invited users can access
- **Email Verification**: All users must verify email
- **Secure Authentication**: OAuth or Identity-based
- **Git History**: Full audit trail of changes

### Best Practices

1. ✅ Use strong passwords
2. ✅ Enable two-factor authentication
3. ✅ Regularly review user access
4. ✅ Keep CMS library updated
5. ✅ Use HTTPS (automatic on Netlify)

---

## 🆘 Troubleshooting

### Can't Access /admin/

**Solution:**
1. Check that Netlify Identity is enabled
2. Verify Git Gateway is enabled
3. Clear browser cache
4. Try incognito mode
5. Check browser console for errors

### Login Fails

**Solution:**
1. Verify you've accepted email invitation
2. Check email/password is correct
3. Try password reset
4. Check Identity service status

### Changes Don't Publish

**Solution:**
1. Click **Publish**, not just **Save**
2. Check for validation errors (red text)
3. Verify all required fields filled
4. Check Git repository for commits
5. View Netlify deploy logs

### Image Upload Fails

**Solution:**
1. Check image size (keep under 5MB)
2. Verify image format (JPG, PNG, WebP, SVG)
3. Check internet connection
4. Try a different browser
5. Check media folder permissions

### Build Fails After Publish

**Solution:**
1. Check Netlify deploy logs
2. Verify markdown frontmatter syntax
3. Check for special characters
4. Validate YAML structure
5. Test locally first

---

## 🌐 GitHub Backend (Alternative)

If you prefer GitHub authentication over Netlify Identity:

### Update Configuration

Edit `admin/config.yml`:
```yaml
backend:
  name: github
  repo: VinniWe/mind-studio-website
  branch: main
```

### Create GitHub OAuth App

1. Go to GitHub → **Settings** → **Developer settings**
2. Click **OAuth Apps** → **New OAuth App**
3. Fill in:
   - **Application name**: Mind Studio CMS
   - **Homepage URL**: https://your-site.com
   - **Authorization callback URL**: https://api.netlify.com/auth/done
4. Save **Client ID** and **Client Secret**

### Configure in Netlify

1. Netlify dashboard → **Site settings**
2. **Access control** → **OAuth**
3. Click **Install provider**
4. Choose **GitHub**
5. Enter Client ID and Secret
6. Save

Now users login with GitHub instead of Netlify Identity!

---

## 📱 Mobile App

Decap CMS can be wrapped in a mobile app:

### iOS/Android

Use a wrapper like:
- **Capacitor**: For native mobile apps
- **PWA**: Install as Progressive Web App
- **Mobile browser**: Works in Safari/Chrome

Access `/admin/` on your phone and it works!

---

## 🚀 Advanced Features

### Editorial Workflow

Enable collaborative editing:

```yaml
# In admin/config.yml
publish_mode: editorial_workflow
```

Adds three stages:
1. **Drafts** - Work in progress
2. **In Review** - Ready for review
3. **Ready** - Approved, ready to publish

### Custom Preview

Create custom preview templates in `admin/index.html`:

```javascript
CMS.registerPreviewTemplate("slider", SliderPreview);
```

### Webhooks

Trigger builds on external events:
1. Netlify → **Build hooks**
2. Create webhook URL
3. Use in external services

---

## 📊 Benefits vs Traditional CMS

| Feature | Decap CMS | WordPress | TYPO3 |
|---------|-----------|-----------|-------|
| Cost | Free | Free/$$ | Free/$$$ |
| Hosting | Any static host | PHP + Database | PHP + Database |
| Security | Very High | Medium | Medium |
| Speed | Very Fast | Medium | Medium |
| Maintenance | Minimal | High | Very High |
| Backups | Git (automatic) | Manual/Plugins | Manual/Extensions |
| Learning Curve | Easy | Medium | Hard |

---

## 📖 Resources

### Documentation
- **Decap CMS**: https://decapcms.org/docs/
- **Configuration**: https://decapcms.org/docs/configuration-options/
- **Widgets**: https://decapcms.org/docs/widgets/

### Community
- **GitHub**: https://github.com/decaporg/decap-cms
- **Discord**: https://decapcms.org/community/
- **Forum**: https://github.com/decaporg/decap-cms/discussions

### Your Setup
- **Repository**: https://github.com/VinniWe/mind-studio-website
- **Admin Path**: `/admin/`
- **Config**: `admin/config.yml`
- **Content**: `content/` directory

---

## ✅ Quick Checklist

Setup (one-time):
- [ ] Deploy to Netlify
- [ ] Enable Netlify Identity
- [ ] Enable Git Gateway
- [ ] Invite yourself as admin
- [ ] Set password
- [ ] Login to /admin/
- [ ] Test editing a slide
- [ ] Publish changes
- [ ] Verify live site updates

Daily use:
- [ ] Access /admin/
- [ ] Edit content
- [ ] Upload images
- [ ] Preview changes
- [ ] Publish
- [ ] Check live site

---

## 🎉 You're Ready!

Decap CMS is now configured for your Mind Studio website. It's:
- ✅ Free and open source
- ✅ No database required
- ✅ Git-based (version control)
- ✅ User-friendly interface
- ✅ Mobile responsive
- ✅ Secure authentication
- ✅ Automatic deployments

**Next step**: Deploy to Netlify and start managing your content!

---

Created with ❤️ for Mind Studio
