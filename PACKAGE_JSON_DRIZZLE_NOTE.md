# Package.json Drizzle Reference

## Important Note
In the package.json file, there is a script that should NOT be used:

```json
"db:push": "drizzle-kit push"
```

This script references the previously removed Drizzle ORM dependency and has no function in our current architecture. Due to restrictions on editing the package.json file directly, we can't remove this script without risking environment instability.

## What to Do Instead
- We use FileSystemStorage.ts for all data storage
- Do NOT run `npm run db:push` as it will fail (Drizzle dependencies are not installed)

## Related Documentation
See DRIZZLE_REMOVAL_DOCUMENTATION.md for complete details on the Drizzle removal process.

## VOID-CENTERED DESIGN PRINCIPLE
This explicit documentation follows our VOID-CENTERED DESIGN principle by explicitly acknowledging the system boundaries and ensuring we don't perform operations that could create void-space inconsistencies.

## TSAR BOMBA PROTOCOL
Following our TSAR BOMBA direct-verification protocol, we've explicitly documented this boundary case to avoid silent failures or system inconsistencies.