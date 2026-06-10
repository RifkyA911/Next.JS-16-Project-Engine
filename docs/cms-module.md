# CMS Module

## Overview

The CMS (Content Management System) module provides a complete foundation for managing content including pages, blog posts, media library, categories, tags, authors, and SEO features. It's designed to be flexible, extensible, and multi-tenant aware.

## Architecture

### Core Components

```
CMS Module
├── Content Management
│   ├── Pages
│   ├── Posts
│   └── Media Library
├── Organization
│   ├── Categories
│   ├── Tags
│   └── Authors
├── Workflow
│   ├── Status Management
│   ├── Version History
│   └── Publishing
└── SEO
    ├── Metadata
    ├── Sitemap
    └── Structured Data
```

## Content Management

### Pages

Pages are static content like About, Contact, and custom pages.

#### Page Schema

```typescript
interface Page {
  id: string;
  workspaceId: string;
  title: string;
  slug: string;
  content: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  metadata: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Page Operations

```typescript
// Create page
export async function createPage(data: CreatePageDto) {
  const slug = await generateUniqueSlug(data.title, data.workspaceId);
  
  return prisma.page.create({
    data: {
      ...data,
      slug,
      status: 'DRAFT',
    },
  });
}

// Update page
export async function updatePage(id: string, data: UpdatePageDto) {
  // Create version before update
  await createPageVersion(id);
  
  return prisma.page.update({
    where: { id },
    data,
  });
}

// Publish page
export async function publishPage(id: string) {
  return prisma.page.update({
    where: { id },
    data: {
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });
}
```

### Posts

Posts are blog articles with categories, tags, and authors.

#### Post Schema

```typescript
interface Post {
  id: string;
  workspaceId: string;
  authorId?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  status: 'DRAFT' | 'REVIEW' | 'PUBLISHED' | 'ARCHIVED';
  publishedAt?: Date;
  metadata: {
    title?: string;
    description?: string;
    ogImage?: string;
    robots?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Post Operations

```typescript
// Create post
export async function createPost(data: CreatePostDto) {
  const slug = await generateUniqueSlug(data.title, data.workspaceId);
  
  return prisma.post.create({
    data: {
      ...data,
      slug,
      status: 'DRAFT',
    },
  });
}

// Get published posts
export async function getPublishedPosts(workspaceId: string) {
  return prisma.post.findMany({
    where: {
      workspaceId,
      status: 'PUBLISHED',
      publishedAt: { lte: new Date() },
    },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
    orderBy: { publishedAt: 'desc' },
  });
}

// Get post by slug
export async function getPostBySlug(workspaceId: string, slug: string) {
  return prisma.post.findUnique({
    where: {
      workspaceId_slug: {
        workspaceId,
        slug,
      },
    },
    include: {
      author: true,
      categories: true,
      tags: true,
    },
  });
}
```

### Media Library

Media library manages images, videos, and documents.

#### Media Schema

```typescript
interface Media {
  id: string;
  workspaceId: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  alt?: string;
  folder?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Media Operations

```typescript
// Upload media
export async function uploadMedia(
  file: File,
  workspaceId: string,
  options?: UploadOptions
) {
  // Validate file
  validateFile(file);
  
  // Generate filename
  const filename = generateFilename(file.name);
  
  // Upload to storage
  const url = await uploadToStorage(file, filename);
  
  // Get image dimensions if image
  let width, height;
  if (file.type.startsWith('image/')) {
    const dimensions = await getImageDimensions(file);
    width = dimensions.width;
    height = dimensions.height;
  }
  
  // Create media record
  return prisma.media.create({
    data: {
      workspaceId,
      filename,
      url,
      mimeType: file.type,
      size: file.size,
      width,
      height,
      folder: options?.folder,
    },
  });
}

// Get media by folder
export async function getMediaByFolder(
  workspaceId: string,
  folder?: string
) {
  return prisma.media.findMany({
    where: {
      workspaceId,
      folder: folder || null,
    },
    orderBy: { createdAt: 'desc' },
  });
}
```

## Organization

### Categories

Categories provide hierarchical organization for content.

#### Category Schema

```typescript
interface Category {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Category Operations

```typescript
// Create category
export async function createCategory(data: CreateCategoryDto) {
  const slug = await generateUniqueSlug(data.name, data.workspaceId, 'category');
  
  return prisma.category.create({
    data: {
      ...data,
      slug,
    },
  });
}

// Get category tree
export async function getCategoryTree(workspaceId: string) {
  const categories = await prisma.category.findMany({
    where: { workspaceId },
    orderBy: { order: 'asc' },
  });
  
  return buildTree(categories);
}

function buildTree(categories: Category[]): CategoryTree[] {
  const map = new Map<string, CategoryTree>();
  const roots: CategoryTree[] = [];
  
  // Initialize map
  categories.forEach(cat => {
    map.set(cat.id, { ...cat, children: [] });
  });
  
  // Build tree
  categories.forEach(cat => {
    const node = map.get(cat.id)!;
    if (cat.parentId) {
      const parent = map.get(cat.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      roots.push(node);
    }
  });
  
  return roots;
}
```

### Tags

Tags provide flexible labeling for content.

#### Tag Schema

```typescript
interface Tag {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Tag Operations

```typescript
// Create tag
export async function createTag(data: CreateTagDto) {
  const slug = await generateUniqueSlug(data.name, data.workspaceId, 'tag');
  
  return prisma.tag.create({
    data: {
      ...data,
      slug,
    },
  });
}

// Get popular tags
export async function getPopularTags(workspaceId: string, limit = 10) {
  const tags = await prisma.tag.findMany({
    where: { workspaceId },
    include: {
      _count: {
        select: { posts: true },
      },
    },
    orderBy: {
      posts: {
        _count: 'desc',
      },
    },
    take: limit,
  });
  
  return tags.map(tag => ({
    ...tag,
    postCount: tag._count.posts,
  }));
}
```

### Authors

Author profiles for content attribution.

#### Author Schema

```typescript
interface Author {
  id: string;
  userId: string;
  bio?: string;
  avatar?: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

#### Author Operations

```typescript
// Get author by user
export async function getAuthorByUser(userId: string) {
  return prisma.author.findUnique({
    where: { userId },
  });
}

// Get author posts
export async function getAuthorPosts(authorId: string, workspaceId: string) {
  return prisma.post.findMany({
    where: {
      authorId,
      workspaceId,
      status: 'PUBLISHED',
    },
    orderBy: { publishedAt: 'desc' },
  });
}
```

## Workflow

### Status Management

Content flows through different statuses:

```
DRAFT → REVIEW → PUBLISHED
  ↓         ↓
ARCHIVED  ARCHIVED
```

#### Status Transitions

```typescript
export async function updatePostStatus(
  id: string,
  status: PostStatus
) {
  const post = await prisma.post.findUnique({ where: { id } });
  
  // Validate transition
  const validTransitions = {
    DRAFT: ['REVIEW', 'ARCHIVED'],
    REVIEW: ['DRAFT', 'PUBLISHED', 'ARCHIVED'],
    PUBLISHED: ['ARCHIVED'],
    ARCHIVED: ['DRAFT'],
  };
  
  if (!validTransitions[post.status].includes(status)) {
    throw new Error(`Invalid status transition from ${post.status} to ${status}`);
  }
  
  // Create version before status change
  await createPostVersion(id);
  
  // Update status
  return prisma.post.update({
    where: { id },
    data: {
      status,
      publishedAt: status === 'PUBLISHED' ? new Date() : null,
    },
  });
}
```

### Version History

Track all content changes.

#### Version Schema

```typescript
interface PostVersion {
  id: string;
  postId: string;
  content: string;
  metadata?: any;
  createdBy: string;
  createdAt: Date;
}
```

#### Version Operations

```typescript
// Create version
export async function createPostVersion(postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  
  return prisma.postVersion.create({
    data: {
      postId,
      content: post.content,
      metadata: post.metadata,
      createdBy: post.authorId,
    },
  });
}

// Get version history
export async function getVersionHistory(postId: string) {
  return prisma.postVersion.findMany({
    where: { postId },
    orderBy: { createdAt: 'desc' },
    include: {
      createdBy: true,
    },
  });
}

// Restore version
export async function restoreVersion(versionId: string) {
  const version = await prisma.postVersion.findUnique({
    where: { id: versionId },
  });
  
  await createPostVersion(version.postId);
  
  return prisma.post.update({
    where: { id: version.postId },
    data: {
      content: version.content,
      metadata: version.metadata,
    },
  });
}
```

### Publishing

Scheduled publishing and immediate publishing.

#### Scheduled Publishing

```typescript
// Schedule post
export async function schedulePost(id: string, publishAt: Date) {
  return prisma.post.update({
    where: { id },
    data: {
      status: 'REVIEW',
      scheduledFor: publishAt,
    },
  });
}

// Process scheduled posts (cron job)
export async function processScheduledPosts() {
  const scheduledPosts = await prisma.post.findMany({
    where: {
      status: 'REVIEW',
      scheduledFor: { lte: new Date() },
    },
  });
  
  for (const post of scheduledPosts) {
    await publishPost(post.id);
  }
}
```

## SEO

### Metadata

SEO metadata for pages and posts.

#### Metadata Structure

```typescript
interface SEOMetadata {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  robots?: string;
  canonical?: string;
}
```

#### Metadata Operations

```typescript
// Generate metadata for page
export function generatePageMetadata(page: Page): Metadata {
  return {
    title: page.metadata.title || page.title,
    description: page.metadata.description,
    openGraph: {
      title: page.metadata.ogTitle || page.title,
      description: page.metadata.ogDescription,
      images: page.metadata.ogImage ? [{ url: page.metadata.ogImage }] : [],
    },
    twitter: {
      card: page.metadata.twitterCard || 'summary',
    },
    robots: page.metadata.robots,
  };
}
```

### Sitemap

Dynamic sitemap generation.

```typescript
// GET /sitemap.xml
export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
  
  const pages = await prisma.page.findMany({
    where: { status: 'PUBLISHED' },
    select: {
      slug: true,
      updatedAt: true,
    },
  });
  
  const sitemap = generateSitemap(posts, pages);
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}

function generateSitemap(posts: Post[], pages: Page[]): string {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  const urls = [
    `${baseUrl}/`,
    ...posts.map(post => ({
      loc: `${baseUrl}/blog/${post.slug}`,
      lastmod: post.updatedAt.toISOString(),
    })),
    ...pages.map(page => ({
      loc: `${baseUrl}/${page.slug}`,
      lastmod: page.updatedAt.toISOString(),
    })),
  ];
  
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;
}
```

### Structured Data

Schema.org structured data.

```typescript
// Generate article structured data
export function generateArticleStructuredData(post: Post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author?.name,
    },
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
  };
}
```

## Rich Text Editor

### Editor Integration

```typescript
'use client';

import { Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export function RichTextEditor({ content, onChange }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });
  
  if (!editor) return null;
  
  return (
    <div className="prose max-w-none">
      <EditorContent editor={editor} />
    </div>
  );
}
```

## Future Enhancements

### Page Builder

Drag-and-drop page builder with blocks:

```
Page Builder
├── Blocks
│   ├── Hero
│   ├── Text
│   ├── Image
│   ├── Gallery
│   └── Custom
├── Templates
└── Preview
```

### Block Editor

Modern block-based editor similar to Notion:

```
Block Editor
├── Block Types
│   ├── Paragraph
│   ├── Heading
│   ├── List
│   ├── Code
│   └── Embed
├── Block Operations
└── Collaboration
```

### Multi-Site CMS

Manage multiple sites from one installation:

```
Multi-Site CMS
├── Site Management
├── Site Isolation
├── Cross-Site Sharing
└── Site Templates
```

### Localization

Multi-language support:

```
Localization
├── Language Management
├── Translation Workflow
├── Language Switching
└── SEO per Language
```

## Best Practices

### 1. Always Generate Unique Slugs

```typescript
const slug = await generateUniqueSlug(title, workspaceId);
```

### 2. Create Versions Before Updates

```typescript
await createPostVersion(postId);
await prisma.post.update({ where: { id: postId }, data });
```

### 3. Validate Status Transitions

```typescript
if (!validTransitions[currentStatus].includes(newStatus)) {
  throw new Error('Invalid status transition');
}
```

### 4. Optimize Images on Upload

```typescript
const optimized = await optimizeImage(file);
await uploadMedia(optimized, workspaceId);
```

### 5. Invalidate Cache on Publish

```typescript
await publishPost(postId);
await cache.invalidate(`posts:${workspaceId}`);
await cache.invalidate(`post:${post.slug}`);
```

## References

- [Headless CMS Patterns](https://www.headlesscms.org/)
- [Content Modeling](https://www.contentful.com/developers/docs/concepts/data-model/)
- [SEO Best Practices](https://developers.google.com/search/docs)
