# Migration Guide: Adding Section Structure

## ⚠️ Breaking Changes

This update introduces a **Section** model to group lessons, which is a breaking change from the previous structure where lessons were directly attached to courses.

## 📋 Migration Steps

### 1. Update Prisma Schema

The schema has already been updated. You need to:

```bash
# Generate Prisma client
npx prisma generate

# Create and apply migration
npx prisma migrate dev --name add_section_structure
```

**OR** if you want to push directly to database (development only):

```bash
npx prisma db push
```

### 2. Data Migration (Important!)

Since the schema changed from `Course → Lesson` to `Course → Section → Lesson`, you need to migrate existing lessons.

**Option A: Create a migration script** (Recommended for production)

Create a file `prisma/migrate-lessons.ts`:

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function migrateLessons() {
  // Get all courses with lessons
  const courses = await prisma.course.findMany({
    include: {
      lessons: {
        orderBy: { order: 'asc' }
      }
    }
  })

  for (const course of courses) {
    if (course.lessons.length > 0) {
      // Create a default section
      const section = await prisma.section.create({
        data: {
          courseId: course.id,
          title: 'Course Content',
          description: 'All lessons',
          order: 1,
          isPreview: false,
        }
      })

      // Move all lessons to this section
      for (const lesson of course.lessons) {
        await prisma.lesson.update({
          where: { id: lesson.id },
          data: {
            sectionId: section.id,
            // Note: courseId field will be removed by Prisma after migration
          }
        })
      }

      console.log(`Migrated ${course.lessons.length} lessons for course: ${course.title}`)
    }
  }

  console.log('Migration completed!')
}

migrateLessons()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
```

**Option B: Manual Migration** (For fresh databases)

If you're starting fresh, you can simply delete all existing lessons and create new ones through the new section structure.

### 3. Update Application Code

All application code has been updated. However, make sure to:

1. **Restart your development server** after running migrations
2. **Regenerate Prisma client** if needed: `npx prisma generate`
3. **Clear Next.js cache** if you encounter issues: `rm -rf .next`

### 4. Verify Migration

After migration, verify:

1. All courses have at least one section
2. All lessons belong to a section
3. Course API returns sections with nested lessons
4. Instructor can create sections and add lessons
5. Student can view course structure with sections

## 🔄 Rollback (If Needed)

If you need to rollback:

1. Restore previous schema from git
2. Run: `npx prisma migrate reset` (⚠️ This will delete all data!)
3. Or restore from backup

## 📝 Notes

- The `Lesson.courseId` field is deprecated but kept for backward compatibility during migration
- After migration, all lessons should have `sectionId` instead
- The old `/api/courses/[id]/lessons` endpoint has been removed
- Use `/api/sections/[id]/lessons` instead

## ✅ Checklist

- [ ] Database schema updated
- [ ] Migration script created (if needed)
- [ ] Existing lessons migrated to sections
- [ ] Prisma client regenerated
- [ ] Development server restarted
- [ ] All tests passing
- [ ] Instructor can create sections
- [ ] Instructor can add lessons to sections
- [ ] Student can view course structure
- [ ] Student can play lessons

---

**Last Updated**: [Current Date]

