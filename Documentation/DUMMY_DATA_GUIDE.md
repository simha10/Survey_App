# QC Dummy Data Management System

## Overview

This comprehensive dummy data management system provides safe, risk-free testing data for the QC Workflow implementation. It includes sophisticated safety measures, rollback capabilities, and zero impact on real production data.

## 🛡️ Safety Features

### Data Protection

- **Unique Prefixing**: All dummy data uses `DGIS*` prefix for complete isolation
- **Real Data Protection**: Original survey data remains completely untouched
- **Transaction Safety**: All operations use database transactions for atomicity
- **Foreign Key Respect**: Proper deletion order prevents constraint violations

### Rollback Strategy

- **No Schema Changes**: Dummy data uses existing models without modifications
- **Clean Removal**: Single-command cleanup with comprehensive validation
- **Backup Points**: Checkpoint system for restoration tracking
- **Integrity Validation**: Post-operation database health checks

## 🚀 Quick Start

### Interactive Manager (Recommended)

```bash
cd backend
npm run dummy:manage
```

### Direct Commands

```bash
# Generate dummy data
npm run dummy:generate

# Cleanup dummy data (safe)
npm run dummy:cleanup

# Validate database integrity
npm run dummy:validate

# Complete reset (cleanup + validate)
npm run dummy:reset
```

## 📊 What Gets Created

### Survey Data (15 Test Surveys)

- **5 Residential**: Houses, flats with realistic property details
- **5 Non-Residential**: Shops, offices, medical centers with business data
- **5 Mixed**: Combined residential + commercial properties

### QC Workflow Data

- **QC Records**: Level 1 QC records with realistic statuses
- **Section Records**: 6 sections per survey (location, property, owner, other, assessments, attachments)
- **Status Variety**: Mix of pending, approved, and rejected statuses for testing

### Connected Data

- **Property Details**: Complete property information with relationships
- **Assessment Data**: Floor-wise residential and non-residential assessments
- **Owner Information**: Realistic owner and respondent data
- **Location Data**: GPS coordinates and address details
- **Attachments**: Dummy image URLs for testing file handling

## 🔧 Technical Implementation

### File Structure

```
backend/
├── prisma/
│   └── seedDummyQCLevel1.ts        # Main dummy data generation
├── scripts/
│   ├── dummyDataManager.js         # Interactive management interface
│   └── runDummyData.js            # Command wrapper
└── package.json                    # npm scripts
```

### Database Design

```sql
-- All dummy surveys use DGIS prefix
SurveyDetails.gisId LIKE 'DGIS%'

-- Connected tables via foreign keys:
├── PropertyDetails
├── OwnerDetails
├── LocationDetails
├── OtherDetails
├── ResidentialPropertyAssessment
├── NonResidentialPropertyAssessment
├── PropertyAttachmentDetails
├── QCRecord (Level 1)
└── QCSectionRecord (6 sections each)
```

## 🎯 Usage Scenarios

### Development Testing

1. **Generate Data**: Create comprehensive test dataset
2. **Test QC Workflow**: Verify all QC functionality
3. **UI Testing**: Test web portal with realistic data
4. **API Testing**: Verify backend endpoints with connected data

### Demo Preparation

1. **Clean Setup**: Start with clean database
2. **Generate Demo Data**: Create presentation-ready surveys
3. **QC Demonstrations**: Show workflow transitions
4. **Reset**: Clean up after demo

### Team Onboarding

1. **Fresh Environment**: New developers get consistent data
2. **Training Data**: Safe environment for learning
3. **Testing Practice**: Practice QC operations without risk

## 🧹 Cleanup Strategy

### What Gets Deleted

```typescript
// Deletion order (respects foreign keys):
1. QCSectionRecord (survey references)
2. QCRecord (survey references)
3. ResidentialPropertyAssessment
4. NonResidentialPropertyAssessment
5. PropertyAttachmentDetails
6. OtherDetails
7. LocationDetails
8. OwnerDetails
9. PropertyDetails
10. SurveyDetails (main records)
```

### Safety Checks

- Pre-deletion validation
- Transaction-based operations
- Post-deletion verification
- Orphaned record detection
- Integrity constraint validation

## 📋 Validation & Monitoring

### Database Integrity Checks

```typescript
✅ Orphaned record detection
✅ Foreign key constraint validation
✅ Data consistency verification
✅ Count reconciliation
✅ Relationship integrity
```

### Status Reporting

- Real vs dummy data counts
- QC record distribution
- User account safety
- Master data preservation

## ⚠️ Important Notes

### Prerequisites

- Master data must exist (ULB, Zone, Ward, Mohalla)
- User accounts with proper roles (SURVEYOR, SUPERVISOR)
- Basic seed data completed
- Database connection configured

### Limitations

- Dummy data uses simplified business logic
- Image URLs are placeholder strings
- Some master data relationships are randomized
- GPS coordinates are within Ahmedabad bounds

### Best Practices

1. Always validate database after operations
2. Create backup points before major operations
3. Use interactive manager for safety
4. Clean up dummy data before production deployment
5. Monitor real data counts during testing

## 🔄 Recovery Procedures

### If Something Goes Wrong

1. **Stop Operations**: Interrupt any running scripts
2. **Check Database**: Run integrity validation
3. **Assess Damage**: Compare with backup point
4. **Clean Recovery**: Use cleanup scripts if needed
5. **Re-validate**: Ensure database health

### Emergency Cleanup

```bash
# Force cleanup all dummy data
npm run dummy:cleanup

# Validate afterward
npm run dummy:validate
```

### Data Verification

```sql
-- Check dummy data exists
SELECT COUNT(*) FROM "SurveyDetails" WHERE "gisId" LIKE 'DGIS%';

-- Check real data safe
SELECT COUNT(*) FROM "SurveyDetails" WHERE "gisId" NOT LIKE 'DGIS%';
```

## 🎉 Success Verification

After successful generation, you should see:

- ✅ 15 dummy surveys created
- ✅ 15 QC records (Level 1)
- ✅ 90 QC section records (6 per survey)
- ✅ Multiple property assessments
- ✅ Complete property details for each survey
- ✅ Database integrity validated

The system is now ready for comprehensive QC workflow testing!

## 🆘 Support

If you encounter issues:

1. Check the error logs in the interactive manager
2. Verify prerequisites are met
3. Run database validation
4. Use the cleanup function to reset
5. Refer to this documentation for troubleshooting

Remember: Real data is always protected, and dummy data can be safely regenerated at any time.
