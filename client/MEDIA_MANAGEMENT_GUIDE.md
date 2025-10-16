# BSM Media Management System

## Overview

The BSM Media Management System provides a comprehensive solution for organizing and managing images and videos in Cloudinary for Benzard Sports Management. The system is fully integrated with the existing BSM project and includes role-based access control, automatic optimization, and a user-friendly interface.

## Features

### ✅ Cloudinary Integration
- **Folder Structure**: Organized hierarchy (`/bsm/athletes/{athleteId}`, `/bsm/events/{eventId}`, `/bsm/blog/{postId}`)
- **Metadata Tagging**: Automatic tagging with BSM-specific tags (athlete, event, blog, football, grassroots, etc.)
- **Optimization**: Automatic format selection (WebP for images, MP4 for videos) and responsive transformations
- **CDN Delivery**: Fast, optimized media delivery via Cloudinary CDN

### ✅ Media Library Interface
- **Searchable**: Search by filename, caption, alt text, and tags
- **Filterable**: Filter by category, resource type, folder, and date range
- **Paginated**: Efficient loading with pagination support
- **Responsive**: Works on desktop and mobile devices
- **Multiple Views**: Grid and list view modes

### ✅ Bulk Upload Support
- **Progress Tracking**: Real-time upload progress with error handling
- **Batch Processing**: Upload multiple files simultaneously
- **Validation**: File size and format validation
- **Error Reporting**: Detailed error messages for failed uploads

### ✅ Blog Post Integration
- **Media Picker**: Replace URL input with visual media selection
- **Image Preview**: Preview selected images before publishing
- **Rich Text Editor**: Easy integration with blog content editor
- **Automatic Optimization**: Images automatically optimized for web delivery

### ✅ Role-Based Access Control
- **Admin**: Full CRUD access to all media categories
- **Media Team**: Upload and manage blog/event media
- **Manager**: Upload athlete and event media
- **Coach**: Upload athlete media only
- **Athlete/Viewer**: View-only access

## Technical Architecture

### Components

#### Core Components
- `BSMMediaLibrary.tsx` - Main media library interface
- `MediaPicker.tsx` - Media selection dialog for blog posts
- `BlogManagement.tsx` - Updated with Cloudinary image upload

#### Services
- `cloudinaryService.ts` - Enhanced with BSM media functions
- `bsmMediaService.ts` - Firestore metadata management
- `mediaService.ts` - Legacy Firebase Storage service (kept for compatibility)

#### Types
- `media.ts` - Complete TypeScript interfaces for media assets

#### API Routes
- `/api/media/upload` - Handle media uploads to Cloudinary
- `/api/media/list` - Fetch media assets with filtering
- `/api/media/delete` - Delete media from Cloudinary
- `/api/media/update` - Update media metadata
- `/api/media/analytics` - Media usage analytics

### Folder Structure

```
/bsm/
├── athletes/
│   └── {athleteId}/
├── events/
│   └── {eventId}/
├── blog/
│   └── {postId}/
├── general/
├── branding/
│   ├── logos/
│   └── banners/
├── social/
└── documents/
```

### Tagging System

#### Category Tags
- `athlete` - Athlete-related media
- `event` - Event photos and videos
- `blog` - Blog post images
- `branding` - BSM branding materials

#### Sport Tags
- `football` - Football-related content
- `basketball` - Basketball content
- `athletics` - Track and field

#### Level Tags
- `grassroots` - Grassroots level
- `semi-pro` - Semi-professional
- `professional` - Professional level

#### Location Tags
- County-specific tags for Liberia (e.g., `montserrado`, `nimba`, `bong`)

#### Quality Tags
- `high-quality` - High-resolution media
- `featured` - Featured content
- `thumbnail` - Thumbnail images
- `social-media` - Social media optimized

## Usage Guide

### For Administrators

#### Accessing the Media Library
1. Navigate to **Dashboard > Content Management > Media Library**
2. Use search and filters to find specific media
3. Switch between grid and list views as needed

#### Uploading Media
1. Click the **Upload** button
2. Select multiple files (images/videos)
3. Files are automatically organized and tagged
4. Monitor upload progress in real-time

#### Managing Media
1. Click the **⋮** menu on any media item
2. Options: Copy URL, Edit metadata, Download, Delete
3. Edit captions, alt text, and tags as needed

### For Blog Authors

#### Adding Images to Blog Posts
1. In the blog post editor, click **Select Image** for featured image
2. Choose from existing media or upload new images
3. Images are automatically optimized for web delivery
4. Preview images before publishing

#### Using the Media Picker
1. **Media Library Tab**: Browse existing media
2. **Upload New Tab**: Upload images directly
3. Select single or multiple images (depending on context)
4. Images are automatically tagged with blog category

### For Media Team

#### Event Media Management
1. Upload event photos/videos to `/bsm/events/{eventId}`
2. Tag with relevant categories (ceremony, match, training)
3. Add captions and descriptions for better organization
4. Use bulk upload for large photo sets

#### Content Organization
1. Use consistent naming conventions
2. Add descriptive tags and captions
3. Organize by event, date, and content type
4. Maintain high-quality standards

## File Size Limits

| User Role | Max File Size | Allowed Formats |
|-----------|---------------|-----------------|
| Admin | 100MB | All supported formats |
| Media Team | 50MB | Images, Videos |
| Manager | 25MB | Images, Videos |
| Coach | 10MB | Images only |
| Athlete | 5MB | Images only |

## Supported Formats

### Images
- JPEG/JPG
- PNG
- GIF
- WebP
- SVG

### Videos
- MP4
- WebM
- MOV (converted to MP4)

## Performance Optimizations

### Automatic Transformations
- **Quality**: Auto-optimization based on content
- **Format**: Automatic format selection (WebP, AVIF when supported)
- **Responsive**: Multiple sizes generated automatically
- **Compression**: Lossless compression applied

### CDN Benefits
- **Global Delivery**: Fast loading worldwide
- **Caching**: Intelligent caching strategies
- **Bandwidth Optimization**: Reduced bandwidth usage
- **Mobile Optimization**: Optimized for mobile devices

## Security Features

### Access Control
- **Authentication**: Firebase Authentication required
- **Authorization**: Role-based permissions enforced
- **API Security**: Server-side validation and sanitization

### Data Protection
- **Secure URLs**: HTTPS-only delivery
- **Metadata Privacy**: Sensitive data filtered from public access
- **Upload Validation**: File type and size validation

## Maintenance

### Regular Tasks
1. **Monitor Storage Usage**: Check Cloudinary dashboard for usage limits
2. **Clean Unused Media**: Remove orphaned media assets
3. **Update Tags**: Maintain consistent tagging system
4. **Performance Review**: Monitor loading times and optimization

### Troubleshooting

#### Upload Issues
- Check file size limits
- Verify file format support
- Ensure stable internet connection
- Check browser console for errors

#### Display Issues
- Verify Cloudinary configuration
- Check image URLs and transformations
- Test on different devices/browsers

## Future Enhancements

### Planned Features
- **AI Tagging**: Automatic content recognition and tagging
- **Advanced Analytics**: Detailed usage statistics and insights
- **Batch Operations**: Bulk editing and organization tools
- **Integration**: Enhanced integration with social media platforms

### Scalability Considerations
- **Storage Limits**: Monitor Cloudinary storage usage
- **API Limits**: Track API call usage
- **Performance**: Optimize for large media libraries
- **Backup**: Implement backup strategies for critical media

## Support

For technical issues or questions:
1. Check the browser console for error messages
2. Verify user permissions and role assignments
3. Test with different file types and sizes
4. Contact the development team for advanced troubleshooting

## BSM Branding Guidelines

### Colors
- **Primary**: #ADF802 (Bright Green)
- **Secondary**: #03045e (Dark Blue)
- **Consistent**: All UI elements follow BSM color scheme

### Logo Usage
- Store official BSM logos in `/bsm/branding/logos/`
- Use appropriate sizes for different contexts
- Maintain aspect ratios and quality standards

This media management system provides BSM with a professional, scalable solution for organizing and delivering media content across all platforms while maintaining the highest standards of performance and user experience.
