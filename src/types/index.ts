export interface User {
  id: string;
  name: string;
  username: string;
  role: 'admin' | 'member';
  email?: string;
  password?: string;
  joinDate: string;
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

export interface GroupStats {
  totalMembers: number;
  totalFunds: number;
  monthlyCollection: number;
  activeLoans: number;
  totalLoanAmount: number;
}

export interface Donation {
  id: string;
  amount: number;
  date: string;
  description: string;
  addedBy: string;
}