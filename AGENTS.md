# Santha Digital Ledger - Agent Guidelines & Repository Memory

## Project Synopsis
Santha is a digital ledger and financial management web application for a close-knit group of friends who pool monthly contributions into a shared mutual-aid fund and offer interest-free emergency loans.

- **Workspace**: `d:\santha\Santha`
- **Tech Stack**: React 18 (Vite SPA) + TypeScript + Tailwind CSS + Supabase (PostgreSQL) + Framer Motion + Lucide React.
- **Port / Server**: `http://localhost:5173` via `npm run dev`.

---

## Core Domain Rules & Financial Mechanics
1. **Monthly Contribution**: Fixed at **LKR 300 / month** per active member.
2. **Interest-Free Loans**: All loans carry **0% interest**. Standard repayment period is 2–4 months.
3. **Fund Calculation (`totalFunds`)**:
   $$\text{totalFunds} = \text{totalPaidContributions} + \text{totalDonations} - \text{totalActiveLoanBalance} - \text{totalRefunds}$$
   Where:
   - `totalPaidContributions` = sum of all `payments` where `paid === true`.
   - `totalDonations` = sum of all records in `donations`.
   - `totalActiveLoanBalance` = $\sum (\text{amount} - \text{repaidAmount})$ for loans with `status === 'active'`.
   - `totalRefunds` = sum of all refunds issued in `member_exits`.
4. **Member Exit Policy**:
   - Members with an active loan **CANNOT** exit until the loan is fully repaid.
   - Refund formula: $(\text{paidPaymentMonths} \times 300) \pm \text{adjustments}$.
   - Deactivates member profile (`status: 'inactive'`) and logs `MEMBER_EXIT`.

---

## Architecture & Code Organization
```
d:\santha\Santha\src\
├── App.tsx                      # Root component: dark mode sync, role-based suspense routing
├── main.tsx                     # React DOM entry with ErrorBoundary
├── context\AppContext.tsx       # Global state ("The Brain"): handles users, payments, loans, stats
├── services\
│   ├── dataService.ts           # Supabase operations with 30s in-memory caching & activity logging
│   └── authService.ts           # Username and password authentication
├── lib\supabase.ts              # Supabase client initialization (checks env vars)
├── types\index.ts               # Core TypeScript interfaces (User, Payment, Loan, Donation, etc.)
├── data\mockData.ts             # Default mock profiles and seed constants
├── components\
│   ├── Login.tsx                # Role-based login (Admin requires password, Member username-only)
│   ├── admin\                   # Admin portal & management modules
│   │   ├── AdminDashboard.tsx   # Bento grid, KPIs, tab controller
│   │   ├── PaymentGrid.tsx      # Annual grid to toggle payments
│   │   ├── LoanManagement.tsx   # Issue loans, record repayments, edit due dates
│   │   ├── MemberManagement.tsx # Member lifecycle, deactivation, exit refunds
│   │   ├── MeetingReportsManagement.tsx # Meeting agendas & resolutions
│   │   ├── WarningManagement.tsx # Warning notifications
│   │   ├── DonationManagement.tsx # External contributions
│   │   ├── Reports.tsx          # Analytics and export reports
│   │   └── ActivityNotifications.tsx # Admin action audit trail
│   ├── member\                  # Read-only member portal
│   │   ├── MemberDashboard.tsx  # Personal dashboard, contribution progress, alerts
│   │   └── MeetingReportCard.tsx
│   └── common\                  # Shared glassmorphic UI components
```

---

## Important Patterns & Developer Guidelines
- **Avoid Repeated Full-Tree Exploration**: Refer to this file and the Knowledge Item (`project-context.md`) instead of reading every directory and file sequentially.
- **Cache Invalidation**: `dataService.ts` implements a 30-second read cache. When writing mutations in `dataService`, always delete corresponding keys from `cache` (e.g., `cache.delete('users')`, `cache.delete('payments')`, etc.).
- **Supabase Null Checks**: `supabase` in `src/lib/supabase.ts` returns `null as any` if env variables are missing to prevent runtime crash during initialization.
- **Loading State Fallback**: `AppContext.tsx` runs an 8-second safety timeout so slow database responses never trap the UI in an infinite spinner.
- **Per-User Preferences**: Dark mode is stored in `localStorage` keyed as `darkMode_${currentUser.id}`.
