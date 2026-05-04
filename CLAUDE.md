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
Phase H complete — offer matching engine built. Build clean: 67 pages, 0 TypeScript errors.

## Last Session Completed
Phase H fully complete:
1. ✅ Prisma Offer model extended with 30 new eligibility fields
2. ✅ offer-service.ts with matchOffers() — 15 eligibility checks, scoring, pre-approval, rate estimation
3. ✅ /api/offers route updated — personalized vs generic mode, X-Match-Strategy header
4. ✅ Admin offers form — Eligibility Rules collapsible section (Credit, Income, Loan, Geography groups)
5. ✅ Apply page report (Step H5) — see Decisions Pending below

## Decisions Pending: Apply page offer matching wire-up
apply/page.tsx collects income + category in Step 3.
Currently passes ONLY category to /api/offers.
Minimum wiring needed: pass income + category → personalized matching activates.
Full wiring in Phase I: add employmentType, age, state, pincode, cityTier to form.

## Next Task
Phase I — Wire apply page to offer matching:
1. Pass income + category query params to /api/offers from Step 3 handleDetailsSubmit
2. Add employmentType dropdown to Step 3 form (salaried/self-employed/freelancer/pensioner)
3. Update Step 4 offer cards to display matchScore, approvalLikelihood, estimatedRate, badgeText
4. Update category filter pills on Step 4 to also pass income param
5. Consider adding loanAmount input to Step 3 (already in Lead model)

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
- OTP in-memory store → OtpAttempt DB table (complete)
- Provider adapter pattern: lib/providers/otp/ + lib/providers/credit/
- Service layer: lib/services/ for business logic separation
- mCarbon primary OTP, Twilio fallback
- CREDIT_PROVIDER env var: mock | decentro
- Offer matching: NULL field = no restriction (benefit of doubt rule)
- Approval likelihood thresholds: >=85 very_high, >=70 high, >=55 medium, else low
- Match score base: 50, max bonuses: credit score buffer (+20), income buffer (+15), priority (+10), NTC friendly (+10), FOIR (+8)