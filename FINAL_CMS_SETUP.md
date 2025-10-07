# Final CMS Setup - GitHub OAuth App

Since Netlify OAuth isn't configured, let's use a direct GitHub OAuth application.

## 🔧 Step 1: Create GitHub OAuth App

1. **Go to GitHub Developer Settings:**
   ```
   https://github.com/settings/developers
   ```

2. **Click "OAuth Apps" in the left sidebar**

3. **Click "New OAuth App"**

4. **Fill in the form:**
   ```
   Application name: Mind Studio CMS
   Homepage URL: https://mind-studio.netlify.app
   Authorization callback URL: https://api.netlify.com/auth/done
   ```

5. **Click "Register application"**

6. **Copy the Client ID** (you'll see it immediately)

7. **Click "Generate a new client secret"**

8. **Copy the Client Secret** (save it somewhere safe!)

---

## 🔧 Step 2: Add OAuth App to Netlify

1. **Go to Netlify OAuth Settings:**
   ```
   https://app.netlify.com/sites/mind-studio/settings/access
   ```

2. **Scroll to "OAuth" section**

3. **Click "Install provider"**

4. **Select "GitHub"**

5. **Paste your Client ID**

6. **Paste your Client Secret**

7. **Click "Install"**

---

## 🚀 Step 3: Login!

1. **Go to:** `https://mind-studio.netlify.app/admin/`

2. **Click "Mit GitHub einloggen"**

3. **Authorize the app**

4. **Start editing!** 🎉

---

## ⚡ Alternative: Skip OAuth - Use Test Repo

If the above is too complicated, we can use a test mode where you can explore the CMS interface (changes won't save to GitHub, but you can see everything):

**Just let me know and I'll switch to test mode!**

---

Created with ❤️ for Mind Studio

