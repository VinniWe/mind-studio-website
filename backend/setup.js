const fs = require('fs').promises;
const path = require('path');

async function setup() {
    console.log('🚀 Setting up Mind Studio Backend...');
    
    try {
        // Create directories
        const dirs = ['data', 'uploads', 'uploads/slider', 'uploads/slider/mobile', 'uploads/slider/desktop'];
        for (const dir of dirs) {
            try {
                await fs.access(dir);
                console.log(`✅ Directory exists: ${dir}`);
            } catch {
                await fs.mkdir(dir, { recursive: true });
                console.log(`📁 Created directory: ${dir}`);
            }
        }

        // Create sample slider data
        const sampleSliderData = [
            {
                id: '1',
                title: 'Willkommen bei Mind Studio',
                description: 'Systemische Therapie und psychologische Beratung für Einzelpersonen und Organisationen. Wir begleiten Sie auf Ihrem Weg zu mehr Klarheit und Wohlbefinden.',
                meta: 'Herzlich Willkommen',
                images: null,
                order: 0,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Individuelle Therapie',
                description: 'In Einzelgesprächen arbeiten wir an Ihren persönlichen Themen und entwickeln gemeinsam Lösungsansätze für mehr Lebensqualität und Zufriedenheit.',
                meta: 'Einzelpersonen',
                images: null,
                order: 1,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '3',
                title: 'Team-Entwicklung',
                description: 'Für Organisationen bieten wir Workshops, Moderation und Begleitung bei Veränderungsprozessen. Gemeinsam stärken wir Zusammenarbeit und Unternehmenskultur.',
                meta: 'Organisationen',
                images: null,
                order: 2,
                active: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];

        // Check if slider data already exists
        try {
            await fs.access('data/slider.json');
            console.log('📄 Slider data already exists');
        } catch {
            await fs.writeFile('data/slider.json', JSON.stringify(sampleSliderData, null, 2));
            console.log('📄 Created sample slider data');
        }

        // Create default settings
        const defaultSettings = {
            siteTitle: 'Mind Studio',
            siteDescription: 'Systemische Psychologie - Therapie und Beratung',
            contactEmail: 'hello@mind-studio.me',
            contactPhone: '+49 123 45678901',
            autoPlaySpeed: 5000,
            maxSlides: 10,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        try {
            await fs.access('data/settings.json');
            console.log('⚙️ Settings already exist');
        } catch {
            await fs.writeFile('data/settings.json', JSON.stringify(defaultSettings, null, 2));
            console.log('⚙️ Created default settings');
        }

        // Create .env file if it doesn't exist
        const envContent = `# Mind Studio Backend Configuration
PORT=3001
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-${Math.random().toString(36).substring(2)}
ADMIN_PASSWORD=admin123

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,image/svg+xml

# CORS
CORS_ORIGIN=http://localhost:3000,https://vinniwe.github.io

# Database (using JSON files for simplicity)
DATA_DIR=./data
UPLOADS_DIR=./uploads`;

        try {
            await fs.access('.env');
            console.log('🔐 Environment file already exists');
        } catch {
            await fs.writeFile('.env', envContent);
            console.log('🔐 Created environment file');
        }

        console.log('\n✅ Setup completed successfully!');
        console.log('\n📋 Next steps:');
        console.log('1. Install dependencies: npm install');
        console.log('2. Start the server: npm start');
        console.log('3. Access admin panel: http://localhost:3001/admin');
        console.log('4. Default admin password: admin123');
        console.log('\n🔧 API Endpoints:');
        console.log('- GET /api/slider - Get slider content');
        console.log('- GET /api/settings - Get website settings');
        console.log('- POST /api/admin/slider - Add new slide (requires auth)');
        console.log('- PUT /api/admin/slider/:id - Update slide (requires auth)');
        console.log('- DELETE /api/admin/slider/:id - Delete slide (requires auth)');

    } catch (error) {
        console.error('❌ Setup failed:', error);
        process.exit(1);
    }
}

setup();
