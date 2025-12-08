# Rich Text Editor Implementation Guide

## Overview

Eightblock now features a professional, enterprise-grade rich text editor built with **Tiptap** - a headless, framework-agnostic editor framework. The editor provides extensive formatting options, keyboard shortcuts, and a clean, intuitive interface for article creation.

## Features

### Text Formatting

- **Bold** (Ctrl/Cmd + B)
- **Italic** (Ctrl/Cmd + I)
- **Strikethrough**
- **Inline Code** (Ctrl/Cmd + E)
- **Highlight** - Yellow text highlighting

### Headings

- **H1** - Main title
- **H2** - Section headings
- **H3** - Subsection headings
- **H4** - Minor headings

### Lists

- **Bullet Lists** - Unordered lists
- **Ordered Lists** - Numbered lists
- **Task Lists** - Interactive checkboxes

### Rich Content

- **Links** - Add hyperlinks with custom URLs
- **Images** - Embed images from URLs
- **Code Blocks** - Syntax-highlighted code with 100+ languages
- **Blockquotes** - Quoted text styling
- **Horizontal Rules** - Section dividers
- **Tables** - Resizable tables with headers

### Editor Functions

- **Undo/Redo** - Full history support
- **Preview Mode** - See how your article will look
- **Auto-save** - Draft saving
- **Markdown-like shortcuts** - Type `# ` for H1, `- ` for lists, etc.

## Usage

### Creating a New Article

1. **Navigate to Article Creation**
   - Click your profile avatar in the header
   - Select "New Article" from the dropdown
   - Or visit `/admin/articles/new` directly

2. **Fill in Article Details**
   - **Title** (required): Article headline
   - **Slug**: Auto-generated URL-friendly version of title (editable)
   - **Excerpt**: Brief description for previews
   - **Tags**: Comma-separated keywords
   - **Featured Image**: URL to header image

3. **Write Your Content**
   - Use the rich text editor toolbar
   - Format text with buttons or keyboard shortcuts
   - Add links, images, code blocks, tables
   - Use preview mode to check formatting

4. **Publish or Save**
   - **Save Draft**: Store work-in-progress
   - **Publish**: Make article live immediately

### Editor Keyboard Shortcuts

| Action       | Windows/Linux    | Mac             |
| ------------ | ---------------- | --------------- |
| Bold         | Ctrl + B         | Cmd + B         |
| Italic       | Ctrl + I         | Cmd + I         |
| Code         | Ctrl + E         | Cmd + E         |
| Undo         | Ctrl + Z         | Cmd + Z         |
| Redo         | Ctrl + Shift + Z | Cmd + Shift + Z |
| Heading 1    | Type `# `        | Type `# `       |
| Heading 2    | Type `## `       | Type `## `      |
| Bullet List  | Type `- `        | Type `- `       |
| Ordered List | Type `1. `       | Type `1. `      |
| Blockquote   | Type `> `        | Type `> `       |
| Code Block   | Type ```         | Type ```        |

### Adding Content

#### Links

1. Click the link icon in toolbar
2. Enter URL (e.g., `https://cardano.org`)
3. Click "Add Link"
4. Or select text first, then add link

#### Images

1. Click the image icon in toolbar
2. Enter image URL
3. Click "Add Image"
4. Image will be inserted and auto-sized

#### Code Blocks

1. Click the code block icon
2. Or type ` ``` ` followed by space
3. Paste your code
4. Syntax highlighting is automatic

#### Tables

1. Click the table icon
2. A 3x3 table with headers is inserted
3. Click cells to edit
4. Add/remove rows and columns as needed

## Technical Details

### Architecture

```
components/
├── editor/
│   ├── RichTextEditor.tsx      # Main editor component
│   └── EditorToolbar.tsx       # Toolbar with formatting buttons
app/
├── admin/
│   └── articles/
│       ├── new/
│       │   └── page.tsx        # New article page
│       ├── [id]/
│       │   └── edit/
│       │       └── page.tsx    # Edit article page (future)
│       └── page.tsx            # Articles list
styles/
└── editor.css                  # Custom editor styles
```

### Dependencies

```json
{
  "@tiptap/react": "^3.13.0",
  "@tiptap/starter-kit": "^3.13.0",
  "@tiptap/extension-link": "^3.13.0",
  "@tiptap/extension-image": "^3.13.0",
  "@tiptap/extension-placeholder": "^3.13.0",
  "@tiptap/extension-code-block-lowlight": "^3.13.0",
  "@tiptap/extension-table": "^3.13.0",
  "@tiptap/extension-table-row": "^3.13.0",
  "@tiptap/extension-table-cell": "^3.13.0",
  "@tiptap/extension-table-header": "^3.13.0",
  "@tiptap/extension-task-list": "^3.13.0",
  "@tiptap/extension-task-item": "^3.13.0",
  "@tiptap/extension-typography": "^3.13.0",
  "@tiptap/extension-highlight": "^3.13.0",
  "lowlight": "^3.3.0"
}
```

### Component Props

#### RichTextEditor

```typescript
interface RichTextEditorProps {
  content: string; // HTML content
  onChange: (content: string) => void; // Called on content change
  placeholder?: string; // Placeholder text
  editable?: boolean; // Enable/disable editing
  minHeight?: string; // Minimum editor height
}
```

### Data Flow

1. **User Input** → Editor captures changes
2. **HTML Generation** → Tiptap converts to HTML
3. **State Update** → `onChange` callback fired
4. **API Submission** → HTML sent to backend
5. **Database Storage** → Content stored as HTML
6. **Rendering** → HTML rendered with proper styling

### Styling

The editor uses Tailwind's typography plugin with custom CSS for:

- Proper heading hierarchy
- Code syntax highlighting
- Table formatting
- List styling
- Responsive images
- Link colors

### Extensions Used

1. **StarterKit** - Base functionality (paragraphs, bold, italic, etc.)
2. **Link** - Hyperlink support with custom styling
3. **Image** - Image embedding with responsive sizing
4. **Placeholder** - Hint text when editor is empty
5. **CodeBlockLowlight** - Syntax-highlighted code blocks
6. **Table** - Full table support with resize
7. **TaskList/TaskItem** - Interactive checkboxes
8. **Typography** - Smart quotes, dashes, ellipses
9. **Highlight** - Text highlighting

## API Integration

### Create Article

```http
POST /api/articles
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Article Title",
  "slug": "article-url-slug",
  "excerpt": "Brief description",
  "content": "<h1>Rich HTML content</h1>",
  "tags": ["cardano", "blockchain"],
  "featuredImage": "https://example.com/image.jpg",
  "status": "PUBLISHED" | "DRAFT"
}
```

### Update Article

```http
PUT /api/articles/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "<h1>Updated content</h1>",
  "status": "PUBLISHED"
}
```

## Best Practices

### Content Creation

1. **Use Semantic Headings**
   - Start with H2 (H1 is the title)
   - Follow hierarchy (H2 → H3 → H4)
   - Don't skip levels

2. **Optimize Images**
   - Use appropriate sizes
   - Compress before uploading
   - Consider using CDN URLs

3. **Structure Content**
   - Break long text into paragraphs
   - Use lists for enumeration
   - Add code blocks for technical content

4. **Write Meaningful Links**
   - Use descriptive link text
   - Avoid "click here"
   - Open external links in new tabs

### Performance

- **Content is stored as HTML** - Fast rendering
- **No runtime parsing** - HTML ready to display
- **Syntax highlighting** - Cached by lowlight
- **Image lazy loading** - Built into Next.js

## Customization

### Adding New Extensions

```typescript
// In RichTextEditor.tsx
import CustomExtension from '@tiptap/extension-custom';

const editor = useEditor({
  extensions: [
    StarterKit,
    // ... other extensions
    CustomExtension.configure({
      // options
    }),
  ],
});
```

### Custom Toolbar Buttons

```typescript
// In EditorToolbar.tsx
<ToolbarButton
  onClick={() => editor.chain().focus().toggleCustomFormat().run()}
  isActive={editor.isActive('customFormat')}
  title="Custom Format"
>
  <CustomIcon className="h-4 w-4" />
</ToolbarButton>
```

### Styling

Edit `/frontend/styles/editor.css` to customize:

- Colors
- Fonts
- Spacing
- Borders
- Backgrounds

## Troubleshooting

### Editor Not Loading

- Check console for errors
- Verify all dependencies installed
- Ensure `'use client'` directive present

### Formatting Not Working

- Check if extension is imported
- Verify extension is added to editor config
- Check for conflicting CSS

### Content Not Saving

- Verify `onChange` callback is connected
- Check API endpoint is responding
- Verify authentication token is valid

### Preview Not Matching

- Ensure same CSS classes in preview
- Check for conflicting global styles
- Verify HTML structure is valid

## Future Enhancements

- [ ] Image upload instead of URL
- [ ] Markdown import/export
- [ ] Collaborative editing
- [ ] Version history
- [ ] Auto-save drafts to localStorage
- [ ] Word count and reading time
- [ ] SEO analyzer
- [ ] Grammar checker integration
- [ ] Templates library
- [ ] Mobile touch gestures

## Examples

### Basic Article

```typescript
const content = `
  <h2>Introduction</h2>
  <p>Welcome to this article about blockchain technology.</p>
  
  <h2>Key Concepts</h2>
  <ul>
    <li>Decentralization</li>
    <li>Consensus mechanisms</li>
    <li>Smart contracts</li>
  </ul>
  
  <h2>Code Example</h2>
  <pre><code>const transaction = await wallet.send({
    to: recipientAddress,
    amount: 1000000
  });</code></pre>
`;
```

### With Images and Links

```typescript
const content = `
  <h2>Featured Image</h2>
  <img src="https://example.com/header.jpg" alt="Article header" />
  
  <p>Learn more at <a href="https://cardano.org">Cardano.org</a></p>
`;
```

## Support

For issues or feature requests:

1. Check this documentation
2. Review component source code
3. Check Tiptap documentation: https://tiptap.dev
4. Test in browser dev tools
5. Verify API responses

---

**Note**: The editor automatically sanitizes HTML to prevent XSS attacks. User-generated content is safe to render.
