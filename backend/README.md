# Mind Studio Backend

A simple content management system for the Mind Studio website, built with Node.js and Express.

## Features

- **Slider Management**: Add, edit, delete, and reorder slider content with images
- **File Upload**: Secure image upload with validation
- **Admin Interface**: Web-based admin panel for content management
- **API Endpoints**: RESTful API for frontend integration
- **Security**: Password-based authentication and rate limiting
- **CORS Support**: Configured for cross-origin requests

## Quick Start

### 1. Setup

```bash
# Navigate to backend directory
cd backend

# Run setup script
npm run setup

# Install dependencies
npm install
```

### 2. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3001`

### 3. Access Admin Panel

Visit `http://localhost:3001/admin` and login with:
- **Password**: `admin123` (default)

## API Endpoints

### Public Endpoints

- `GET /api/slider` - Get all slider content
- `GET /api/settings` - Get website settings
- `GET /api/health` - Health check

### Admin Endpoints (require authentication)

- `POST /api/admin/slider` - Create new slide
- `PUT /api/admin/slider/:id` - Update slide
- `DELETE /api/admin/slider/:id` - Delete slide
- `PUT /api/admin/settings` - Update settings

## File Structure

```
backend/
├── server.js              # Main server file
├── setup.js               # Setup script
├── package.json           # Dependencies
├── data/                  # JSON data files
│   ├── slider.json        # Slider content
│   └── settings.json      # Website settings
├── uploads/               # Uploaded files
│   └── slider/            # Slider images
└── public/                # Admin interface
    └── index.html         # Admin panel
```

## Configuration

Copy `config.example.env` to `.env` and customize:

```env
PORT=3001
ADMIN_PASSWORD=your-secure-password
CORS_ORIGIN=http://localhost:3000,https://yourdomain.com
MAX_FILE_SIZE=5242880
```

## Slider Content Structure

Each slide contains:

```json
{
  "id": "unique-id",
  "title": "Slide Title",
  "description": "Slide description text",
  "meta": "Category or meta information",
  "image": "/uploads/slider/filename.jpg",
  "order": 0,
  "active": true,
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

## Frontend Integration

The frontend can fetch slider content using:

```javascript
fetch('http://localhost:3001/api/slider')
  .then(response => response.json())
  .then(slides => {
    // Use slides data
  });
```

## Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **File Validation**: Only images allowed, size limits enforced
- **CORS Protection**: Configurable allowed origins
- **Helmet Security**: Security headers
- **Authentication**: Password-based admin access

## Deployment

### Local Development

```bash
npm run dev
```

### Production

1. Set `NODE_ENV=production` in `.env`
2. Use a process manager like PM2:

```bash
npm install -g pm2
pm2 start server.js --name "mind-studio-backend"
```

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Troubleshooting

### Common Issues

1. **Port already in use**: Change `PORT` in `.env`
2. **Permission errors**: Ensure write permissions for `data/` and `uploads/` directories
3. **CORS errors**: Update `CORS_ORIGIN` in `.env`
4. **File upload fails**: Check `MAX_FILE_SIZE` and file permissions

### Logs

The server logs all requests and errors to console. For production, consider using a logging service.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.
