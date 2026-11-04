# Project Architecture & System Documentation

## 1. System Overview
This project ("Santha") is a modernized **Group/Club Fund Management System** built to handle members, monthly financial contributions, loans, general donations, and administrative meetings.

- **Frontend Tech Stack**: React 18, TypeScript, Vite, Tailwind CSS.
- **Backend / Database**: Supabase (PostgreSQL, Supabase Auth).
- **Architecture Pattern**: Single Page Application (SPA) with centralized Context API state management and a layered Data Service approach connecting to a Backend-as-a-Service (BaaS).

---

## 2. Core Entities and Data Models
The core entities map directly to Supabase tables, explicitly defined in `src/types/index.ts`:

- **User**: The participants. Categorized by `role` (`admin` or `member`) and `status` (`active` or `inactive`). Includes soft delete logic via deactivation.
- **Payment**: Tracks monthly recurring contributions required from members.
- **Loan**: Tracks funds given to members, tracking original `amount`, `dueDate`, and `repaidAmount`.
- **Donation**: Tracks general, un-attached financial contributions to the group.
- **MeetingReport**: Logs decisions, agenda, and attendance for group meetings.
- **Warning**: A notification system used by admins to alert specific members regarding overdue payments, loans, or urgent matters.

---

## 3. Module Breakdown

### A. Authentication Module
- **Location**: `src/services/authService.ts`, `src/components/Login.tsx`
- **Flow**: The application authenticates users based on a `username` and `role`. Administrators require an additional password to log in. Upon login, the app evaluates `currentUser.role` inside `App.tsx` to lazy load either the `AdminDashboard` or the `MemberDashboard`. 

### B. State Management Layer (The "Brain")
- **Location**: `src/context/AppContext.tsx`
- **Flow**: The `AppProvider` wraps the entire application, serving as the single source of truth for global state. 
- **Features**:
  - Automatically calculates `GroupStats` (Total Funds, Members, Monthly Collection, Active Loans) based on arrays of raw data.
  - Generates initial yearly payments when a new member is added via a helper `generatePaymentsForMember()`.
  - Maintains separate arrays for `activeMembers` and `inactiveMembers` using `useMemo`.
  - Handles the Dark Mode user-preference initialization.

### C. Data Access Layer
- **Location**: `src/services/dataService.ts`
- **Flow**: Direct communication interface to Supabase.
- **Features**:
  - **In-Memory Caching Mechanism**: A `Map` that caches read-heavy calls (`getUsers`, `getPayments`, `getLoans` etc.) for `30,000ms` (30 seconds) to heavily optimize network traffic and minimize database reads.
  - Implements complex multi-table functions. For example `permanentlyDeleteMember()` performs a cascading deletion workflow for Payments -> Loans -> User.

### D. User Interface Modules
- **Location**: `src/components/`
- **Admin Dashboard (`admin/`)**: Comprehensive access to manipulate the Context API. Admins can update payment records, approve loans, send warnings, and deactivate members.
- **Member Dashboard (`member/`)**: A heavily restricted, read-only interface. Members can view their outstanding loan statuses, past monthly payments, and read any active warnings issued.
- **Common Resources (`common/`)**: Shared visual components logic used across both dashboards.

---

## 4. Workflows & Interactions

### 1. The Member Activation Workflow:
1. Admin triggers "Add Member."
2. `AppContext.addMember(userData)` executes.
3. `dataService.addUser(userData)` persists it to Supabase.
4. `AppContext` creates a full year of Monthly `Payment` skeletons for the newly inserted `memberId` to preemptively track their upcoming dues.
5. Those default payments are batch-inserted via `dataService.addPayments()`.

### 2. The Data Refresh Workflow:
Data behaves somewhat reactively due to React component renders. However, because of the Data Access Layer's 30-second cache:
1. Most page transitions or fetches hit the fast memory cache.
2. `AppContext.refreshData()` is called explicitly to bypass cache or after forceful state updates (like submitting new records) to ensure accurate cross-component state synchronization.

---

## 5. Directory Structure Synopsis
```text
/src
 ├── /components      # UI pieces sorted by domain (admin, member, common)
 ├── /context         # AppContext.tsx (Global State Manager)
 ├── /data            # Static setups / mock data configurations
 ├── /hooks           # Custom React hooks (e.g. useLocalStorage for theme)
 ├── /lib             # BaaS configuration (supabase.ts initialization)
 ├── /services        # The data-access layer (authService.ts, dataService.ts)
 └── /types           # TypeScript generic entity models
/supabase
 └── /migrations      # Iterative SQL scripts configuring database schema changes
```
