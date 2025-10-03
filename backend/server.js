const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable for file uploads
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000', 'https://vinniwe.github.io'],
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', express.static(path.join(__dirname, 'public')));

// Ensure directories exist
async function ensureDirectories() {
  const dirs = ['data', 'uploads', 'uploads/slider', 'uploads/slider/mobile', 'uploads/slider/desktop'];
  for (const dir of dirs) {
    try {
      await fs.access(dir);
    } catch {
      await fs.mkdir(dir, { recursive: true });
    }
  }
}

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on field name
    const deviceType = file.fieldname.includes('mobile') ? 'mobile' : 'desktop';
    cb(null, `uploads/slider/${deviceType}/`);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const deviceType = file.fieldname.includes('mobile') ? 'mobile' : 'desktop';
    cb(null, `${deviceType}-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = (process.env.ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/webp,image/svg+xml').split(',');
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'), false);
    }
  }
});

// Data file paths
const SLIDER_DATA_FILE = path.join(__dirname, 'data', 'slider.json');
const SETTINGS_DATA_FILE = path.join(__dirname, 'data', 'settings.json');

// Helper functions
async function readJsonFile(filePath, defaultValue = []) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return defaultValue;
    }
    throw error;
  }
}

async function writeJsonFile(filePath, data) {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// API Routes

// Get slider content
app.get('/api/slider', async (req, res) => {
  try {
    const sliderData = await readJsonFile(SLIDER_DATA_FILE, []);
    res.json(sliderData);
  } catch (error) {
    console.error('Error reading slider data:', error);
    res.status(500).json({ error: 'Failed to read slider data' });
  }
});

// Get website settings
app.get('/api/settings', async (req, res) => {
  try {
    const settings = await readJsonFile(SETTINGS_DATA_FILE, {});
    res.json(settings);
  } catch (error) {
    console.error('Error reading settings:', error);
    res.status(500).json({ error: 'Failed to read settings' });
  }
});

// Admin authentication middleware (simple password check)
function authenticateAdmin(req, res, next) {
  const password = req.headers.authorization?.replace('Bearer ', '');
  if (password === process.env.ADMIN_PASSWORD || password === 'admin123') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
}

// Admin routes
app.post('/api/admin/slider', authenticateAdmin, upload.fields([
  { name: 'imageDesktop', maxCount: 1 },
  { name: 'imageMobile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { title, description, meta, order = 0, active = true } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const sliderData = await readJsonFile(SLIDER_DATA_FILE, []);
    
    // Handle responsive images
    const images = {};
    if (req.files.imageDesktop) {
      images.desktop = `/uploads/slider/desktop/${req.files.imageDesktop[0].filename}`;
    }
    if (req.files.imageMobile) {
      images.mobile = `/uploads/slider/mobile/${req.files.imageMobile[0].filename}`;
    }
    
    const newSlide = {
      id: Date.now().toString(),
      title,
      description,
      meta: meta || '',
      images: Object.keys(images).length > 0 ? images : null,
      order: parseInt(order),
      active: active === 'true',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    sliderData.push(newSlide);
    await writeJsonFile(SLIDER_DATA_FILE, sliderData);

    res.json({ success: true, slide: newSlide });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ error: 'Failed to create slide' });
  }
});

// Update slide
app.put('/api/admin/slider/:id', authenticateAdmin, upload.fields([
  { name: 'imageDesktop', maxCount: 1 },
  { name: 'imageMobile', maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, meta, order, active } = req.body;
    
    const sliderData = await readJsonFile(SLIDER_DATA_FILE, []);
    const slideIndex = sliderData.findIndex(slide => slide.id === id);
    
    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    const updatedSlide = {
      ...sliderData[slideIndex],
      title: title || sliderData[slideIndex].title,
      description: description || sliderData[slideIndex].description,
      meta: meta !== undefined ? meta : sliderData[slideIndex].meta,
      order: order !== undefined ? parseInt(order) : sliderData[slideIndex].order,
      active: active !== undefined ? active === 'true' : sliderData[slideIndex].active,
      updatedAt: new Date().toISOString()
    };

    // Handle responsive image updates
    if (req.files) {
      const currentImages = sliderData[slideIndex].images || {};
      
      // Update desktop image
      if (req.files.imageDesktop) {
        // Delete old desktop image if it exists
        if (currentImages.desktop) {
          const oldImagePath = path.join(__dirname, currentImages.desktop);
          try {
            await fs.unlink(oldImagePath);
          } catch (error) {
            console.warn('Could not delete old desktop image:', error.message);
          }
        }
        currentImages.desktop = `/uploads/slider/desktop/${req.files.imageDesktop[0].filename}`;
      }
      
      // Update mobile image
      if (req.files.imageMobile) {
        // Delete old mobile image if it exists
        if (currentImages.mobile) {
          const oldImagePath = path.join(__dirname, currentImages.mobile);
          try {
            await fs.unlink(oldImagePath);
          } catch (error) {
            console.warn('Could not delete old mobile image:', error.message);
          }
        }
        currentImages.mobile = `/uploads/slider/mobile/${req.files.imageMobile[0].filename}`;
      }
      
      updatedSlide.images = Object.keys(currentImages).length > 0 ? currentImages : null;
    }

    sliderData[slideIndex] = updatedSlide;
    await writeJsonFile(SLIDER_DATA_FILE, sliderData);

    res.json({ success: true, slide: updatedSlide });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ error: 'Failed to update slide' });
  }
});

// Delete slide
app.delete('/api/admin/slider/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const sliderData = await readJsonFile(SLIDER_DATA_FILE, []);
    const slideIndex = sliderData.findIndex(slide => slide.id === id);
    
    if (slideIndex === -1) {
      return res.status(404).json({ error: 'Slide not found' });
    }

    // Delete associated images (both mobile and desktop)
    const slide = sliderData[slideIndex];
    if (slide.images) {
      const imagesToDelete = [];
      if (slide.images.desktop) imagesToDelete.push(slide.images.desktop);
      if (slide.images.mobile) imagesToDelete.push(slide.images.mobile);
      
      for (const imagePath of imagesToDelete) {
        try {
          await fs.unlink(path.join(__dirname, imagePath));
        } catch (error) {
          console.warn('Could not delete image:', error.message);
        }
      }
    }

    sliderData.splice(slideIndex, 1);
    await writeJsonFile(SLIDER_DATA_FILE, sliderData);

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    res.status(500).json({ error: 'Failed to delete slide' });
  }
});

// Update settings
app.put('/api/admin/settings', authenticateAdmin, async (req, res) => {
  try {
    const settings = await readJsonFile(SETTINGS_DATA_FILE, {});
    const updatedSettings = {
      ...settings,
      ...req.body,
      updatedAt: new Date().toISOString()
    };
    
    await writeJsonFile(SETTINGS_DATA_FILE, updatedSettings);
    res.json({ success: true, settings: updatedSettings });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large' });
    }
  }
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Initialize server
async function startServer() {
  await ensureDirectories();
  
  app.listen(PORT, () => {
    console.log(`🚀 Mind Studio Backend running on port ${PORT}`);
    console.log(`📁 Data directory: ${path.join(__dirname, 'data')}`);
    console.log(`📸 Uploads directory: ${path.join(__dirname, 'uploads')}`);
    console.log(`🔧 Admin panel: http://localhost:${PORT}/admin`);
    console.log(`📊 API health: http://localhost:${PORT}/api/health`);
  });
}

startServer().catch(console.error);
