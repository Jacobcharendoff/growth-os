# Tech Debt Fix — Infrastructure Hardening

Run this as a multi-phase cleanup. Build after each phase to catch regressions.

## Phase 1: Type Safety (CRITICAL)

The codebase has 80+ `any` types. Fix them in this order:

### 1a. `src/lib/data-service.ts`
Every mapper function (`mapContactFromApi`, `mapDealFromApi`, `mapActivityFromApi`, `mapEstimateFromApi`, `mapInvoiceFromApi`) takes `any` params. Create proper DB row types that match the Supabase/Drizzle schema and use those instead. The `mapped: any` objects inside should use `Partial<Contact>` etc.

### 1b. `src/components/contacts/ContactDetailPanel.tsx`
Props `deals: any[]`, `estimates: any[]`, `invoices: any[]` should use the actual `Deal[]`, `Estimate[]`, `Invoice[]` types from `@/types`.

### 1c. `src/app/(app)/automations/page.tsx`
30+ `any` casts. The `store` is cast `as any` on line 409. All the filter/map callbacks use `(c: any)`, `(d: any)`, `(e: any)`, `(inv: any)`. These should use the proper types from `@/types` — Contact, Deal, Estimate, Invoice.

### 1d. `src/app/(app)/advisor/page.tsx`
`buildAccountData(store: any)` — type the store param using the Zustand store type. All internal casts `(d: any)`, `(inv: any)`, `(est: any)` should use proper types.

### 1e. `src/lib/google-calendar.ts`
4 error response casts `as any`. Create a `GoogleCalendarErrorResponse` interface.

### 1f. `src/lib/rbac-middleware.ts`
`(error as any).status` — create a typed error class with status.

### 1g. `src/app/api/` routes
- `webhooks/stripe/route.ts` — `paymentIntent: any` on lines 70, 120
- `email/send/route.ts` — `resendResponse: any`, `activityData: any`
- `email/templates/route.ts` — same pattern
- `invoices/[id]/route.ts` — `(item: any)` in reduce
- `sms/send/route.ts` — `activityData: any`

### 1h. Other files
- `src/app/(app)/schedule/page.tsx` — `t: (key: any)` and `setEditingDealData: (data: any)`
- `src/app/(app)/notifications/page.tsx` — `(notif: any)` and `type: notif.type as any`
- `src/app/(app)/estimates/page.tsx` — `handleTierChange` value param
- `src/app/(app)/pipeline/page.tsx` — `as any` casts for translation keys
- `src/app/(app)/reports/page.tsx` — `(props: any)` for recharts shape

## Phase 2: Hardcoded Strings → i18n

These English strings need to move to `src/lib/translations.ts` with both EN and FR:

In `src/components/Sidebar.tsx`:
- "Lead Capture" → `t('nav.leadCapture')`
- "Templates" → `t('nav.templates')`  
- "Reports" → `t('nav.reports')`

Search all files in `src/app/` for quoted English strings that should be translated. Focus on button labels, empty states, headings, and placeholder text.

## Phase 3: Security Fixes

### 3a. Portal token hardcoded fallback
`src/lib/portal-tokens.ts:3` — Remove the `|| 'staybookt-portal-default'` fallback. Throw an error if PORTAL_SECRET is not set, or generate a random one per deployment.

### 3b. Remove production console.log
`src/app/api/webhooks/twilio/route.ts:107` — `console.log` that logs SMS content. Replace with structured logging or remove.

## Phase 4: TODO Stubs

Review and either implement or add proper error responses for:
- `src/app/api/email/trial-sequence/route.ts:61,200` — Auth permission checks
- `src/app/api/team/route.ts:119` — Send invite email
- `src/app/api/email/unsubscribe/[userId]/route.ts:8` — Actually unsubscribe user
- `src/app/api/portal/[token]/invoices/[id]/pay/route.ts:67` — Stripe payment intent

For any that can't be fully implemented yet, add a proper 501 response instead of silently passing.

## Phase 5: Build Verification

After all changes:
1. `npm run build` — must pass with zero errors
2. `npx tsc --noEmit` — verify type safety
3. Commit with message: "refactor: type safety and infrastructure hardening — remove 80+ any types, fix i18n gaps, secure portal tokens"
