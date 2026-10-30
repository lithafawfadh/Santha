export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'member';
  email?: string;
  password?: string;
  joinDate: string;
  avatarUrl?: string;
  status?: 'active' | 'inactive';
  deactivatedAt?: string;
  deactivatedBy?: string;
  deactivationReason?: string;
}

export interface Warning {
  id: string;
  memberId: string;
  title: string;
  message: string;
  type: 'payment' | 'loan' | 'general' | 'urgent';
  createdBy: string;
  createdAt: string;
  isRead: boolean;
  expiresAt?: string;
}

export interface Payment {
  id: string;
  memberId: string;
  month: string;
  year: number;
  amount: number;
  paid: boolean;
  paidDate?: string;
  markedBy?: string;
}

export interface Loan {
  id: string;
  memberId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  repaidAmount: number;
  status: 'active' | 'repaid' | 'overdue';
  issuedBy: string;
}

export interface Donation {
  id: string;
  amount: number;
  date: string;
  description: string;
  addedBy: string;
}

export interface GroupStats {
  totalMembers: number;
  totalFunds: number;
  monthlyCollection: number;
  activeLoans: number;
  totalLoanAmount: number;
}

export interface MeetingReport {
  id: string;
  title: string;
  date: string;
  agenda: string[];
  decisions: string[];
  attendees: string[];
  createdBy: string;
  createdAt: string;
  updatedAt?: string;
}

export interface MemberExit {
  id: string;
  memberId: string;
  memberName: string;
  exitDate: string;
  totalPaidMonths: number;
  refundAmount: number;
  processedBy: string;
  notes?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actionType: string;
  description: string;
  actorId: string;
  createdAt: string;
}


export interface BankAccount {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  branchName: string;
  contributionText?: string;
  notes?: string;
  isActive: boolean;
  isPrimary: boolean;
  qrCodeUrl?: string;
  displayOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}
