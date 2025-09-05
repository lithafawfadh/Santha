import { User, Payment, Loan } from '../types';

export const users: User[] = [
  // Administrators
  { id: 'admin1', name: 'Lithaf', username: 'lithaf_admin', role: 'admin', email: 'lithaf@group.com', password: 'admin123', joinDate: '2024-01-01' },
  { id: 'admin2', name: 'Raza', username: 'raza_admin', role: 'admin', email: 'raza@group.com', password: 'admin123', joinDate: '2024-01-01' },
  { id: 'admin3', name: 'Aafiq', username: 'aafiq_admin', role: 'admin', email: 'aafiq@group.com', password: 'admin123', joinDate: '2024-01-01' },
  
  // Members
  { id: 'member1', name: 'Awfadh', username: 'awfadh01', role: 'member', email: 'awfadh@group.com', joinDate: '2024-01-01' },
  { id: 'member2', name: 'Ahsan', username: 'ahsan02', role: 'member', email: 'ahsan@group.com', joinDate: '2024-01-01' },
  { id: 'member3', name: 'Ali', username: 'ali03', role: 'member', email: 'ali@group.com', joinDate: '2024-01-01' },
  { id: 'member4', name: 'Rakisthu', username: 'rakisthu04', role: 'member', email: 'rakisthu@group.com', joinDate: '2024-01-01' },
  { id: 'member5', name: 'Saba', username: 'saba05', role: 'member', email: 'saba@group.com', joinDate: '2024-01-01' },
  { id: 'member6', name: 'Sahmee', username: 'sahmee06', role: 'member', email: 'sahmee@group.com', joinDate: '2024-01-01' },
  { id: 'member7', name: 'Sarfaras', username: 'sarfaras07', role: 'member', email: 'sarfaras@group.com', joinDate: '2024-01-01' },
  { id: 'member8', name: 'Famil', username: 'famil08', role: 'member', email: 'famil@group.com', joinDate: '2024-01-01' },
  { id: 'member9', name: 'Sajith', username: 'sajith09', role: 'member', email: 'sajith@group.com', joinDate: '2024-01-01' },
  { id: 'member10', name: 'Ifrah', username: 'ifrah10', role: 'member', email: 'ifrah@group.com', joinDate: '2024-01-01' },
  { id: 'member11', name: 'Hanan', username: 'hanan11', role: 'member', email: 'hanan@group.com', joinDate: '2024-01-01' },
  { id: 'member12', name: 'Mazy', username: 'mazy12', role: 'member', email: 'mazy@group.com', joinDate: '2024-01-01' },
  { id: 'member13', name: 'Ashlah', username: 'ashlah13', role: 'member', email: 'ashlah@group.com', joinDate: '2024-01-01' },
  { id: 'member14', name: 'Kulshan', username: 'kulshan14', role: 'member', email: 'kulshan@group.com', joinDate: '2024-01-01' },
];

export const initialPayments: Payment[] = [];

export const initialLoans: Loan[] = [
  {
    id: 'loan1',
    memberId: 'member1',
    amount: 5000,
    issueDate: '2024-10-01',
    dueDate: '2025-01-01',
    repaidAmount: 1500,
    status: 'active',
    issuedBy: 'admin1'
  },
  {
    id: 'loan2',
    memberId: 'member3',
    amount: 3000,
    issueDate: '2024-09-15',
    dueDate: '2024-12-15',
    repaidAmount: 3000,
    status: 'repaid',
    issuedBy: 'admin2'
  }
];

// Generate payment records for current year
const currentYear = new Date().getFullYear();
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
 
export const generateInitialPayments = (): Payment[] => {
  const payments: Payment[] = [];
  const members = users.filter(user => user.role === 'member');
  
  // Dynamically generate years from 2023 up to the current year + 1
  const years: number[] = [];
  for (let year = 2023; year <= currentYear + 1; year++) {
    years.push(year);
  }
  
  years.forEach(year => {
    members.forEach(member => {
      months.forEach((month, index) => {
        const isPaid = false; // Default to unpaid - admins can mark as paid through UI
        payments.push({
          id: `${member.id}_${month}_${year}`,
          memberId: member.id,
          month,
          year: year,
          amount: 300,
          paid: isPaid,
          paidDate: isPaid ? `${year}-${String(index + 1).padStart(2, '0')}-${Math.floor(Math.random() * 28) + 1}` : undefined,
          markedBy: isPaid ? 'admin1' : undefined
        });
      });
    });
  });
  
  return payments;
};

export const MONTHLY_CONTRIBUTION = 300;