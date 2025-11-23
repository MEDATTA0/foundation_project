# Resources System Guide

## Overview

The Resources system allows teachers to:

1. **Store external resource URLs** (PDFs, videos, links, images) associated with classes
2. **View all resources** across all their classes in a resource library
3. **Manage resources** per class

## Architecture Explanation

### Why `classId`?

Resources are tied to classes because:

- **Organization**: Resources belong to specific classes/courses
- **Access Control**: Only the teacher who owns the class can manage its resources
- **Context**: Resources are relevant to specific learning contexts

### How to Get Resources Without a `classId`?

We've added a **new endpoint** that doesn't require `classId`:

**`GET /resources`** - Fetches ALL resources for the current teacher across all their classes

This is perfect for displaying a resource library where teachers can see all their resources at once.

## API Endpoints

### 1. Get All Resources (No classId needed)

```http
GET /resources
Authorization: Bearer <token>
```

**Response:**

```json
[
  {
    "id": "resource-id",
    "classId": "class-id",
    "resource": "https://example.com/textbook.pdf",
    "createdAt": "2025-11-23T10:00:00.000Z",
    "updatedAt": "2025-11-23T10:00:00.000Z",
    "class": {
      "id": "class-id",
      "name": "Mathematics 101"
    }
  }
]
```

### 2. Class-Specific Resources

```http
GET /classes/:classId/resources
POST /classes/:classId/resources
GET /classes/:classId/resources/:id
PATCH /classes/:classId/resources/:id
DELETE /classes/:classId/resources/:id
```

## How to Add External Resources

### Step 1: Create a Class (if you don't have one)

```http
POST /classes
{
  "name": "Mathematics 101",
  "startDate": "2024-01-15T00:00:00.000Z",
  "endDate": "2024-06-15T00:00:00.000Z"
}
```

### Step 2: Add Resources to the Class

```http
POST /classes/{classId}/resources
{
  "resources": [
    "https://example.com/textbook.pdf",
    "https://youtube.com/watch?v=abc123",
    "https://example.com/worksheet.docx"
  ]
}
```

The `resources` field accepts an array of **URLs** (strings). These can be:

- PDF documents
- Video links (YouTube, Vimeo, etc.)
- Document links
- Image URLs
- Any external resource URL

### Step 3: View All Resources

```http
GET /resources
```

This returns all resources from all your classes.

## Frontend Integration

The frontend has been updated to:

1. **Fetch resources** from `GET /resources` (no classId needed)
2. **Display resources** in a resource library
3. **Transform backend data** to match UI expectations

### Example Usage in Frontend

```javascript
import { api } from "../services/api";
import { API_ENDPOINTS } from "../constants";

// Fetch all resources for teacher
const resources = await api.get(API_ENDPOINTS.RESOURCES.LIST);

// Each resource has:
// - id: resource ID
// - resource: URL string (the external resource)
// - classId: which class it belongs to
// - class: { id, name } - class information
```

## Database Schema

```prisma
model Resource {
  id        String   @id @default(cuid())
  classId   String   @map("class_id")
  resource  String   // This is the URL to the external resource
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  class Class @relation(fields: [classId], references: [id])

  @@map("resources")
}
```

## Key Points

1. **`resource` field is a URL string** - It stores the link to external resources
2. **Resources belong to classes** - For organization and access control
3. **You can fetch all resources** - Using `GET /resources` without needing classId
4. **External sources** - Just provide URLs when creating resources

## Future Enhancements

If you want to add more metadata (title, description, ageRange, etc.), you could:

1. Extend the Prisma schema to add optional fields
2. Update the DTOs to accept these fields
3. Store them in the database

For now, the system works with simple URLs, and the frontend can extract metadata from the URLs (file type, etc.).
