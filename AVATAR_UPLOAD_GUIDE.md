# Avatar Upload System Guide

## Overview

The Eightblock platform now features a professional avatar upload system that allows users to upload profile pictures directly from their devices. The system automatically optimizes images for performance and storage efficiency.

## Features

### Image Upload

- **File Selection**: Users can select images from their local device
- **Supported Formats**: JPEG, JPG, PNG, WebP, GIF
- **File Size Limit**: 10MB maximum
- **Preview**: Real-time preview before upload

### Automatic Optimization

- **Resize**: All images are resized to 400x400px (square)
- **Format Conversion**: Converted to WebP for optimal compression
- **Quality**: 85% quality setting for balance between size and quality
- **Compression**: Images are significantly reduced in size while maintaining quality

### User Experience

- **Drag-and-Drop Ready**: File input with professional UI
- **Upload Progress**: Loading states during upload
- **Instant Feedback**: Toast notifications for success/errors
- **File Info Display**: Shows selected file name and size
- **Cancel Support**: Users can cancel selection before upload

## Technical Implementation

### Backend

#### Dependencies

```json
{
  "multer": "^2.0.2", // File upload handling
  "sharp": "^0.34.5", // Image optimization
  "@types/multer": "^2.0.0" // TypeScript definitions
}
```

#### File Structure

```
backend/
├── src/
│   ├── middleware/
│   │   └── upload.ts              // Multer configuration
│   ├── utils/
│   │   └── image-optimizer.ts     // Sharp image processing
│   └── controllers/
│       └── user-controller.ts     // Avatar upload handler
└── uploads/
    └── avatars/                   // Stored avatar images
```

#### API Endpoint

**POST** `/api/users/me/avatar`

- **Authentication**: Required (JWT token)
- **Content-Type**: `multipart/form-data`
- **Field Name**: `avatar`
- **Response**:

```json
{
  "user": {
    "id": "...",
    "walletAddress": "...",
    "name": "...",
    "bio": "...",
    "avatarUrl": "/uploads/avatars/avatar-1234567890-123456789.webp"
  },
  "avatar": {
    "url": "/uploads/avatars/avatar-1234567890-123456789.webp",
    "size": 45678,
    "width": 400,
    "height": 400
  }
}
```

#### Image Processing Pipeline

1. **Upload**: File received via Multer
2. **Validation**: Check file type and size
3. **Optimization**:
   - Resize to 400x400px (cover fit, center position)
   - Convert to WebP format
   - Apply 85% quality compression
4. **Storage**: Save to `/uploads/avatars/`
5. **Cleanup**: Delete original file
6. **Database**: Update user's `avatarUrl` field
7. **Response**: Return optimized image details

### Frontend

#### Component Location

`frontend/app/profile/page.tsx`

#### Key Features

```typescript
// File selection handler
const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
  // Validates file type and size
  // Creates preview using FileReader API
};

// Upload handler
const handleUploadAvatar = async () => {
  // Creates FormData
  // Sends to API
  // Updates profile state
  // Shows success notification
};
```

#### UI Components

- **Avatar Preview**: Circular 96px preview
- **Choose Image Button**: Opens file picker
- **Upload Button**: Submits selected file (shown when file selected)
- **Cancel Button**: Removes selection
- **Progress Indicators**: Loading spinners during upload
- **Info Text**: File requirements and selected file details

## Usage

### For Users

1. **Navigate to Profile Page**: Go to `/profile`
2. **Click "Choose Image"**: Opens file picker
3. **Select Image**: Choose from your device
4. **Preview**: See how it will look
5. **Click "Upload"**: Image is optimized and saved
6. **Success**: Avatar updated instantly

### For Developers

#### Adding to Other Components

```typescript
// Import the API function
const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const token = localStorage.getItem('authToken');
  const response = await fetch(`${API_URL}/users/me/avatar`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  return response.json();
};
```

#### Customizing Optimization Settings

Edit `/backend/src/controllers/user-controller.ts`:

```typescript
const optimizedImage = await optimizeImage(uploadedPath, outputPath, {
  width: 400, // Change dimensions
  height: 400,
  quality: 85, // Adjust quality (1-100)
  format: 'webp', // Change format: 'webp' | 'jpeg' | 'png'
});
```

## Security Considerations

### File Validation

- **MIME Type Check**: Only allows image types
- **File Extension Check**: Validates file extensions
- **Size Limit**: 10MB maximum to prevent abuse
- **Storage Isolation**: Uploads stored in dedicated directory

### Access Control

- **Authentication Required**: Only authenticated users can upload
- **User-Specific**: Users can only update their own avatar
- **Old File Cleanup**: Previous avatars are deleted to save space

### CORS & Headers

```typescript
// Helmet configured to allow cross-origin resource access
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
```

## Performance

### Optimization Results

- **Original Size**: Varies (up to 10MB)
- **Optimized Size**: Typically 20-100KB
- **Reduction**: ~90-99% size reduction
- **Quality**: Visually identical to original

### Storage

- **Format**: WebP (best compression)
- **Dimensions**: 400x400px (consistent)
- **Location**: `/backend/uploads/avatars/`
- **Naming**: `avatar-{timestamp}-{random}.webp`

## Troubleshooting

### Common Issues

**Upload fails with "Invalid file type"**

- Ensure file is JPEG, PNG, WebP, or GIF
- Check file extension matches content type

**Upload fails with "File too large"**

- File must be under 10MB
- Try compressing the image first

**Avatar not displaying**

- Check backend server is serving `/uploads` directory
- Verify `avatarUrl` in database is correct
- Check CORS settings allow cross-origin requests

**Upload succeeds but image quality is poor**

- Increase quality setting in optimization options
- Use higher resolution source images
- Consider using PNG format instead of WebP

## Future Enhancements

- [ ] Drag-and-drop file upload
- [ ] Image cropping tool before upload
- [ ] Multiple image size variants (thumbnail, medium, large)
- [ ] Cloud storage integration (AWS S3, Cloudinary)
- [ ] Image rotation/flip tools
- [ ] Avatar filters and effects
- [ ] Bulk upload for admins
- [ ] CDN integration for faster delivery

## Testing

### Manual Testing Steps

1. Navigate to `/profile` page
2. Click "Choose Image"
3. Select valid image (JPEG/PNG)
4. Verify preview displays correctly
5. Click "Upload"
6. Verify success notification
7. Refresh page - avatar should persist
8. Try uploading invalid file type - should show error
9. Try uploading file > 10MB - should show error

### Test Files

- Small JPEG (< 1MB)
- Large PNG (5-10MB)
- Invalid file type (PDF, TXT)
- Oversized file (> 10MB)

## API Reference

### Upload Avatar

```http
POST /api/users/me/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

**Success Response (200 OK)**

```json
{
  "user": {...},
  "avatar": {
    "url": "/uploads/avatars/...",
    "size": 45678,
    "width": 400,
    "height": 400
  }
}
```

**Error Responses**

- `401 Unauthorized`: Missing or invalid token
- `400 Bad Request`: No file uploaded or invalid file type
- `500 Internal Server Error`: Upload or optimization failed

## Configuration

### Environment Variables

Add to `.env` if needed:

```env
# Maximum upload size (bytes)
MAX_UPLOAD_SIZE=10485760

# Upload directory
UPLOAD_DIR=./uploads/avatars

# Image quality (1-100)
IMAGE_QUALITY=85

# Image dimensions
IMAGE_WIDTH=400
IMAGE_HEIGHT=400
```

## Support

For issues or questions:

1. Check this documentation
2. Review backend logs for errors
3. Check browser console for client errors
4. Verify file permissions on uploads directory
5. Ensure sharp dependencies are installed correctly
