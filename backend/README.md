# Backend Setup - Quick Reference

## Database Reset & Seeding

### Full Reset (Clean Slate)
```bash
npm run db:reset
```
This will:
- Drop all tables
- Run fresh migrations
- Generate Prisma Client
- Seed master data (including VIEWER role)
- Create test users

### Seed Geographic Data
```bash
npm run seed:tanda
```

## Test User Credentials

| Username | Password | Role |
|----------|----------|------|
| superadmin | superadmin123 | SuperAdmin |
| admin | admin123 | Admin |
| supervisor | supervisor123 | Supervisor |
| surveyor | surveyor123 | Surveyor |
| **viewer** | **viewer123** | **Viewer** |
| user | user123 | Admin |

## Available Commands

```bash
# Database
npm run db:reset          # Full reset + seed
npm run db:migrate        # Development migrations
npm run db:generate       # Generate Prisma Client
npm run db:seed           # Run main seed script
npm run db:studio         # Visual database browser

# Seeding
npm run seed:tanda        # Seed Tanda ULB geographic data
npm run seed:geographic   # Seed general geographic data

# Development
npm run dev              # Start dev server
npm run build            # Build for production
```

## Files

- `prisma/schema.prisma` - Database schema (includes VIEWER role)
- `prisma/seed.ts` - Main seed script (creates VIEWER user)
- `prisma/seedTandaULB.ts` - Tanda geographic data seeder
- `scripts/resetDatabase.js` - Interactive database reset
