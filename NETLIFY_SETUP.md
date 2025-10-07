# Netlify CMS Setup Guide

Your Mind Studio website is now configured with Netlify CMS! Follow these steps to deploy and start managing your content.

## 📋 What's Been Configured

✅ **Netlify CMS** - Git-based content management
✅ **Admin Interface** - Access at `/admin`
✅ **Slider Management** - Add, edit, reorder slides
✅ **Page Content** - Manage all page content
✅ **Image Uploads** - Upload and manage images
✅ **Preview Templates** - See changes before publishing

---

## 🚀 Step 1: Deploy to Netlify

### 1.1 Sign Up for Netlify

1. Go to https://www.netlify.com/
2. Click "Sign up"
3. Choose "Sign up with GitHub"
4. Authorize Netlify to access your GitHub account

### 1.2 Create New Site

1. Click "Add new site" → "Import an existing project"
2. Choose "GitHub"
3. Select your repository: `VinniWe/mind-studio-website`
4. Click "Deploy site"

### 1.3 Build Settings

Netlify will automatically detect these settings:
- **Build command**: (leave empty for static site)
- **Publish directory**: `.` (root directory)
- **Branch**: `main`

Click **"Deploy site"** and wait 1-2 minutes for the first deployment.

---

## 🔐 Step 2: Enable Netlify Identity

### 2.1 Enable Identity Service

1. In your Netlify dashboard, go to **"Site settings"**
2. Click **"Identity"** in the sidebar
3. Click **"Enable Identity"**

### 2.2 Configure Git Gateway

1. Still in **Identity** settings
2. Scroll to **"Services"**
3. Click **"Enable Git Gateway"**
4. This allows the CMS to commit directly to GitHub

### 2.3 Set Registration Preferences

1. In **Identity** settings
2. Click **"Registration preferences"**
3. Choose **"Invite only"** (recommended for security)
4. Click **"Save"**

---

## 👤 Step 3: Create Your Admin User

### 3.1 Invite Yourself

1. In **Identity** tab
2. Click **"Invite users"**
3. Enter your email address
4. Click **"Send"**

### 3.2 Accept Invitation

1. Check your email for the invitation
2. Click the link in the email
3. Set your password
4. You're now registered!

---

## 🎨 Step 4: Access the CMS

### 4.1 Access Admin Interface

Your CMS is now available at:
```
https://your-site-name.netlify.app/admin/
```

### 4.2 Login

1. Go to `/admin/`
2. Click **"Login with Netlify Identity"**
3. Enter your email and password
4. You're in!

---

## ✏️ Step 5: Start Managing Content

### Slider Management

1. In the CMS, click **"Slider"**
2. You'll see your existing 3 slides
3. Click on a slide to edit it
4. Or click **"New Slide"** to add more

**What you can edit:**
- Title and subtitle
- Description text
- Meta text (category)
- Desktop and mobile images
- CTA button text and link
- Slide order
- Active/inactive status

### Homepage Content

1. Click **"Homepage"**
2. Edit sections:
   - **Statistics** - The 3 stats on your homepage
   - **Services** - Individual and organization services
   - **Approach** - Your approach items
   - **Testimonials** - Client testimonials

### Pages

1. Click **"Seiten"** (Pages)
2. Edit:
   - Über Mich (About)
   - Leistungen - Einzel (Individual Services)
   - Leistungen - Organisationen (Organization Services)
   - Ansatz (Approach)

### Settings

1. Click **"Einstellungen"**
2. Update:
   - Site title and description
   - Contact information
   - Social media links

---

## 📸 Uploading Images

### In Any Editor

1. Click the **image field**
2. Click **"Choose an image"**
3. Drag & drop or select files
4. Images are automatically uploaded to your repository

### Image Best Practices

- **Desktop Images**: 1200x600px or larger
- **Mobile Images**: 800x600px or larger
- **Format**: JPG, PNG, WebP, or SVG
- **Size**: Keep under 500KB for performance

---

## 💾 Publishing Changes

### How It Works

1. Make your changes in the CMS
2. Click **"Publish"** (top right)
3. Changes are committed to GitHub
4. Netlify automatically rebuilds your site
5. Live in 1-2 minutes!

### Draft Mode

- Click **"Save"** instead of **"Publish"** to keep as draft
- Drafts are saved but not published
- Come back later to finish editing

### Editorial Workflow (Optional)

Enable in `admin/config.yml`:
```yaml
publish_mode: editorial_workflow
```

This adds:
- **Draft** - Work in progress
- **In Review** - Ready for review
- **Ready** - Approved, ready to publish

---

## 🌐 Step 6: Custom Domain (Optional)

### Add Your Domain

1. In Netlify dashboard, go to **"Domain settings"**
2. Click **"Add custom domain"**
3. Enter your domain (e.g., `mind-studio.me`)
4. Click **"Verify"**

### Update DNS

Netlify will show you DNS records to add:

For **mind-studio.me**:
```
Type: A
Name: @
Value: 75.2.60.5
```

For **www.mind-studio.me**:
```
Type: CNAME
Name: www
Value: your-site.netlify.app
```

### SSL Certificate

- Netlify automatically provides free SSL
- Your site will be https://mind-studio.me
- Takes 1-24 hours to provision

---

## 🔧 Advanced Configuration

### Local Development

Test the CMS locally:

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Link your site
netlify link

# Run local development server
netlify dev
```

Access CMS at: `http://localhost:8888/admin/`

### Custom Preview Templates

Edit `admin/index.html` to customize how content previews look in the CMS.

### Webhooks

Set up webhooks to trigger builds:
1. **Settings** → **Build & deploy** → **Build hooks**
2. Create a webhook
3. Use it to trigger builds from external services

---

## 📊 Monitoring

### Build Status

- View build history in Netlify dashboard
- Get email notifications for failed builds
- Check deploy logs for errors

### Analytics

Enable Netlify Analytics:
1. **Site settings** → **Analytics**
2. Enable analytics ($9/month)
3. View page views, bandwidth, and performance

---

## 🆘 Troubleshooting

### Can't Login to CMS

1. Check that Identity is enabled
2. Verify Git Gateway is enabled
3. Try incognito mode
4. Clear browser cache

### Changes Not Appearing

1. Check build status in Netlify
2. Wait 2-3 minutes for build to complete
3. Hard refresh browser (Ctrl+F5 or Cmd+Shift+R)
4. Check GitHub for latest commits

### Image Upload Fails

1. Check image size (< 500KB recommended)
2. Verify image format (JPG, PNG, WebP, SVG)
3. Try a different image
4. Check browser console for errors

### Build Fails

1. Check deploy logs in Netlify
2. Verify all content files have valid frontmatter
3. Check for YAML syntax errors
4. Test locally with `netlify dev`

---

## 📱 Mobile Access

The CMS works on mobile devices:
- Login at `/admin/` on your phone
- Edit content on the go
- Upload images from your phone camera
- Publish from anywhere

---

## 🔒 Security Best Practices

### Password

- Use a strong, unique password
- Enable two-factor authentication (recommended)
- Don't share your login credentials

### Access Control

- Keep registration set to "Invite only"
- Only invite trusted users
- Regularly review user list

### Backups

Your content is automatically backed up because:
- All changes are committed to GitHub
- GitHub keeps full version history
- You can revert any change

---

## 🎓 Next Steps

1. ✅ **Deploy to Netlify** (5 minutes)
2. ✅ **Enable Identity & Git Gateway** (2 minutes)
3. ✅ **Create admin user** (2 minutes)
4. ✅ **Login to CMS** (1 minute)
5. ✅ **Edit your first slide** (2 minutes)
6. ✅ **Publish changes** (1 minute)
7. ✅ **Add custom domain** (optional, 30 minutes)

**Total setup time: ~15 minutes** ⚡

---

## 📞 Support

### Resources

- Netlify CMS Docs: https://www.netlifycms.org/docs/
- Netlify Support: https://www.netlify.com/support/
- Community Forum: https://answers.netlify.com/

### Your Setup

- **Repository**: https://github.com/VinniWe/mind-studio-website
- **CMS Path**: `/admin/`
- **Content Path**: `/content/`
- **Media Path**: `/uploads/`

---

**🎉 Congratulations!** Your Mind Studio CMS is ready to use. Start managing your content with ease!

---

Created with ❤️ for Mind Studio
