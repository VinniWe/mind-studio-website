# Mind Studio CMS

A simple, web-based Content Management System for the Mind Studio website, similar to TYPO3 but lightweight and easy to use.

## 🚀 Quick Setup

### 1. Access the CMS
Visit your website's backend:
```
https://vinniwe.github.io/mind-studio-website/backend/
```

### 2. Login Credentials
- **Username**: `admin`
- **Password**: `mindstudio2024`

⚠️ **Important**: Change the password in `backend/index.php` and `backend/login.php`!

## 🎯 Features

### Slider Management
- ✅ **Add/Edit/Delete Slides**: Manage your homepage slider content
- ✅ **Image Upload**: Upload desktop and mobile images for each slide
- ✅ **Drag & Drop Reordering**: Easily reorder slides
- ✅ **Activate/Deactivate**: Turn slides on/off
- ✅ **Responsive Images**: Separate images for desktop and mobile

### Content Management
- ✅ **Homepage Statistics**: Edit the three statistics on your homepage
- ✅ **Services Content**: Manage service descriptions
- ✅ **Real-time Preview**: See changes immediately
- ✅ **Backup**: All content is stored in JSON files

## 📁 File Structure

```
backend/
├── index.php          # Main CMS interface
├── login.php          # Login page
├── api.php            # API endpoints for frontend
└── README.md          # This file

data/
└── content.json       # All website content

uploads/
└── slider/           # Uploaded images
```

## 🔧 How It Works

### 1. Content Storage
All content is stored in `data/content.json` - a simple JSON file that's easy to backup and version control.

### 2. Frontend Integration
The frontend can optionally load content from the CMS via the API:
- `GET /backend/api.php?action=slider` - Get slider content
- `GET /backend/api.php?action=homepage` - Get homepage content

### 3. Static Fallback
If the CMS is not available, the website falls back to static HTML content.

## 🛠️ Customization

### Change Admin Password
Edit these files and update the password:
```php
// In backend/index.php and backend/login.php
$config = [
    'admin_username' => 'admin',
    'admin_password' => 'your-new-password',
];
```

### Enable CMS Integration
To make your frontend use CMS content instead of static HTML:

1. Open `assets/js/cms-loader.js`
2. Change `this.useCMS = false;` to `this.useCMS = true;`
3. The website will now load content from the CMS

### Add New Content Types
You can extend the CMS by:
1. Adding new fields to the admin interface in `index.php`
2. Updating the `content.json` structure
3. Creating new API endpoints in `api.php`

## 🔒 Security

### File Upload Security
- Only image files are allowed (jpg, jpeg, png, gif, webp, svg)
- File size limit: 5MB
- Files are stored in `uploads/` directory with secure naming

### Access Control
- Password-protected admin area
- Session-based authentication
- No database required - uses simple JSON files

## 📱 Mobile Responsive

The CMS interface is fully responsive and works on:
- ✅ Desktop computers
- ✅ Tablets
- ✅ Mobile phones

## 🚀 Deployment

### GitHub Pages
The CMS works with GitHub Pages because:
- Uses PHP (supported by GitHub Pages)
- No database required
- Simple file-based storage
- Static assets served normally

### Backup
Your content is automatically backed up in version control since `data/content.json` is part of your repository.

## 🆘 Troubleshooting

### Can't Access CMS
1. Check that PHP is enabled on your hosting
2. Verify file permissions (755 for directories, 644 for files)
3. Ensure `data/` and `uploads/` directories are writable

### Images Not Uploading
1. Check `uploads/` directory permissions
2. Verify file size is under 5MB
3. Ensure file type is supported (jpg, png, gif, webp, svg)

### Content Not Updating
1. Clear browser cache
2. Check browser console for JavaScript errors
3. Verify API endpoints are accessible

## 🔄 Updates

To update the CMS:
1. Replace the backend files with new versions
2. Keep your `data/content.json` file
3. Test the admin interface

## 📞 Support

This is a custom CMS built specifically for Mind Studio. For issues or enhancements, contact your developer.

---

**Mind Studio CMS** - Simple, Secure, Effective