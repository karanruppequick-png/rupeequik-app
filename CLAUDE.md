# RupeeQuik — CLAUDE.md (Claude Working Memory)

## Project Location
Single Next.js app at src/. npm package manager.
NOT a monorepo. No mobile app yet.

## CRITICAL RULES — Never Break These
- NEVER change existing UI, pages, or components — they are live
- NEVER change existing API route response shapes — UI depends on them
- NEVER hardcode credentials — env vars only
- mCarbon: test creds in .env.local, prod creds in .env.production — zero code changes
- Decentro staging URL: https://in.staging.decentro.tech
- Decentro production URL: https://in.decentro.tech — only the .env changes
- Use existing prisma.ts singleton at src/lib/prisma.ts
- Use existing bcryptjs (installed), jsonwebtoken (installed)
- Use jose only in middleware.ts (edge runtime requirement)

## What Is Live — DO NOT TOUCH
- src/app/page.tsx — homepage, full UI
- src/app/apply/page.tsx — 4-step funnel
- src/app/credit-score/ — full credit report UI
- src/app/dashboard/ — user dashboard
- src/app/login/ — login page
- src/app/register/ — register page
- src/app/verify-otp/ — OTP page
- src/app/personal-loan/, home-loan/, business-loan/, credit-card/
- src/app/admin/* — all admin pages and their UI
- src/components/* — all components

## Tech Stack (installed)
- Next.js 16.2.2, React 19.2.4, TypeScript (strict), Prisma 5.22.0
- PostgreSQL via Supabase (schema updated from SQLite)
- Tailwind CSS v4, lucide-react, recharts, date-fns
- bcryptjs 3.0.3, jsonwebtoken 9.0.3
- Twilio 5.13.1 (installed, not wired yet)
- @playwright/test for e2e

## Database Models (prisma/schema.prisma)
EXISTING: Admin, User, Lead, Offer, CreditCheck, Setting
PHASE A2 ADD: OtpAttempt, StaffMember, DsaPartner, WithdrawalRequest,
              LeadTimelineEvent, ConsentLog, AuditLog, ReferralReward,
              Notification, LenderProduct, LendingPartner, ContentBlock, FeatureFlag

## Key Files
- src/lib/prisma.ts — Prisma singleton
- src/lib/auth.ts — JWT sign/verify, cookie helpers (user-token, admin-token)
- src/lib/otp-store.ts — OLD in-memory OTP (being replaced with OtpAttempt model)
- src/lib/providers/ — NEW provider adapters (otp, credit)
- src/lib/services/ — NEW service layer (otp-service, auth-service, credit-service, etc.)
- src/app/api/ — all API routes

## Env Files
- .env.example — template with all vars documented
- .env.local — git-ignored, placeholders to fill
- Must fill NOW: DATABASE_URL, DIRECT_URL, JWT_SECRET, ENCRYPTION_KEY
- Can wait: MCARBON_*, TWILIO_*, DECENTRO_*, RAZORPAY_*, RESEND_*, POSTHOG, SENTRY

## Current Phase
DSA Portal complete. All 12 prior tasks + 3 DSA auth/leads tasks done.
Build clean: 66 pages, 0 TypeScript errors.

## Last Session Completed
Phase A2 fully complete:
1. ✅ Middleware with jose (admin, dsa, dashboard routes)
2. ✅ Credit bureau provider (mock + decentro wired)
3. ✅ Auth refresh route
4. ✅ User profile PATCH
5. ✅ Leads /mine route
6. ✅ DSA backend APIs (register, profile, stats, leads, withdraw)
7. ✅ Admin stats route
8. ✅ Admin leads bulk update
9. ✅ Audit log route
10. ✅ Legal pages (privacy, terms, grievance, about, contact)
11. ✅ DSA portal pages (apply, dashboard, withdrawals, leads)
12. ✅ TypeScript check clean
13. ✅ DSA login backend (dsa-login + dsa-verify routes)
14. ✅ DSA login page wired (phone + OTP flow)
15. ✅ DSA leads page created

## Next Task
Phase E — Staff management portal:
1. Create /admin/staff page for StaffMember management
2. Create /api/admin/staff/* routes (CRUD)
3. Wire Razorpay payment routes (create-order, verify)
4. Create /api/user/push-token route
5. Add LeadTimelineEvent logging to lead mutations
6. Add AuditLog entries for admin actions

## Decisions Made
- DSA login: phone+OTP via mCarbon → verifyOTP → JWT (dsa-token cookie)
- JWT payload: { dsaId, partnerCode, role: 'dsa' }
- DSA leads API already masks phone: ****....xxxx
- Middleware injects X-Dsa-Id header for /api/dsa/* routes
- Wallet amounts in paise (integers)
- NEXTAUTH_SECRET = JWT_SECRET (used by both jsonwebtoken and jose)
- Using jsonwebtoken in API routes (already installed)
- Using jose in middleware.ts only (edge runtime)
- SQLite → PostgreSQL schema updated
- OTP in-memory store → OtpAttempt DB table (in progress)
- Provider adapter pattern: lib/providers/otp/ + lib/providers/credit/
- Service layer: lib/services/ for business logic separation
- mCarbon primary OTP, Twilio fallback
- CREDIT_PROVIDER env var: mock | decentro