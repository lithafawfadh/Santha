import { BankAccount } from '../types';

export interface BankingApp {
  id: string;
  name: string;
  bankName: string;
  description: string;
  androidPackage: string;
  iosUrl?: string;
  webUrl?: string;
  primaryColor: string;
  accentBg: string;
  keywords: string[];
}

export const SRI_LANKAN_BANKING_APPS: BankingApp[] = [
  {
    id: 'combank-qplus',
    name: 'Q+ Payment App',
    bankName: 'Commercial Bank of Ceylon',
    description: 'Commercial Bank LankaQR & fast fund transfers',
    androidPackage: 'lk.combank.qplus',
    iosUrl: 'https://apps.apple.com/lk/app/q-payment-app/id1454508930',
    webUrl: 'https://www.combankdigital.com',
    primaryColor: '#0054A6',
    accentBg: '#EBF3FB',
    keywords: ['commercial', 'combank', 'ceylon', 'q+']
  },
  {
    id: 'combank-digital',
    name: 'COMBANK Digital',
    bankName: 'Commercial Bank of Ceylon',
    description: 'Full Internet & Mobile Banking portal',
    androidPackage: 'com.combank.digital',
    iosUrl: 'https://apps.apple.com/lk/app/combank-digital/id1531776106',
    webUrl: 'https://www.combankdigital.com',
    primaryColor: '#003366',
    accentBg: '#E6EFF7',
    keywords: ['commercial', 'combank', 'ceylon']
  },
  {
    id: 'boc-flex',
    name: 'BOC Flex',
    bankName: 'Bank of Ceylon',
    description: 'Bank of Ceylon official mobile banking app',
    androidPackage: 'lk.boc.bocflex',
    iosUrl: 'https://apps.apple.com/lk/app/boc-flex/id1571217088',
    webUrl: 'https://online.boc.lk',
    primaryColor: '#F59E0B',
    accentBg: '#FEF3C7',
    keywords: ['boc', 'bank of ceylon', 'flex']
  },
  {
    id: 'boc-smartpay',
    name: 'BOC SmartPay',
    bankName: 'Bank of Ceylon',
    description: 'BOC digital wallet & LankaQR direct pay',
    androidPackage: 'lk.boc.smartpay',
    iosUrl: 'https://apps.apple.com/lk/app/smartpay-boc/id1465225488',
    webUrl: 'https://online.boc.lk',
    primaryColor: '#D97706',
    accentBg: '#FFFBEB',
    keywords: ['boc', 'smartpay']
  },
  {
    id: 'sampath-vishwa',
    name: 'Sampath Vishwa',
    bankName: 'Sampath Bank',
    description: 'Sampath Bank Internet & Mobile Banking',
    androidPackage: 'com.sampath.vishwa',
    iosUrl: 'https://apps.apple.com/lk/app/sampath-vishwa/id1537025816',
    webUrl: 'https://www.sampathvishwa.com',
    primaryColor: '#EA580C',
    accentBg: '#FFEDD5',
    keywords: ['sampath', 'vishwa']
  },
  {
    id: 'sampath-wepay',
    name: 'Sampath WePay',
    bankName: 'Sampath Bank',
    description: 'Sampath digital wallet & instant QR transfers',
    androidPackage: 'lk.sampath.wepay',
    iosUrl: 'https://apps.apple.com/lk/app/wepay-sri-lanka/id1454508930',
    webUrl: 'https://www.sampathvishwa.com',
    primaryColor: '#F97316',
    accentBg: '#FFF7ED',
    keywords: ['sampath', 'wepay']
  },
  {
    id: 'peoples-wave',
    name: "People's Wave",
    bankName: "People's Bank",
    description: "People's Bank self-banking digital app",
    androidPackage: 'lk.peoplesbank.peopleswave',
    iosUrl: 'https://apps.apple.com/lk/app/peoples-wave/id1279888629',
    webUrl: 'https://www.peoplesbank.lk',
    primaryColor: '#DC2626',
    accentBg: '#FEE2E2',
    keywords: ['people', "people's", 'wave']
  },
  {
    id: 'hnb-solo',
    name: 'HNB SOLO',
    bankName: 'Hatton National Bank',
    description: 'HNB digital payments & instant LankaQR',
    androidPackage: 'lk.hnb.solo',
    iosUrl: 'https://apps.apple.com/lk/app/hnb-solo/id1458920199',
    webUrl: 'https://www.hnb.net',
    primaryColor: '#1D4ED8',
    accentBg: '#DBEAFE',
    keywords: ['hnb', 'hatton', 'solo']
  },
  {
    id: 'dialog-genie',
    name: 'Dialog Genie',
    bankName: 'Dialog FinTech',
    description: 'FinTech multi-bank wallet & payments',
    androidPackage: 'lk.dialog.genie',
    iosUrl: 'https://apps.apple.com/lk/app/genie-fintech-super-app/id1274950346',
    webUrl: 'https://www.genie.lk',
    primaryColor: '#E11D48',
    accentBg: '#FFE4E6',
    keywords: ['genie', 'dialog']
  },
  {
    id: 'frimi',
    name: 'FriMi',
    bankName: 'Nations Trust Bank',
    description: 'NTB digital banking & money transfers',
    androidPackage: 'lk.fintechnology.frimi',
    iosUrl: 'https://apps.apple.com/lk/app/frimi/id1220478083',
    webUrl: 'https://www.frimi.lk',
    primaryColor: '#BE123C',
    accentBg: '#FFE4E6',
    keywords: ['frimi', 'nations', 'ntb']
  },
  {
    id: 'seylan-pay',
    name: 'Seylan Pay',
    bankName: 'Seylan Bank',
    description: 'Seylan Bank LankaQR merchant & fund transfer',
    androidPackage: 'com.seylan.seylanpay',
    iosUrl: 'https://apps.apple.com/lk/app/seylan-pay/id1489721734',
    webUrl: 'https://www.seylan.lk',
    primaryColor: '#991B1B',
    accentBg: '#FEE2E2',
    keywords: ['seylan']
  }
];

export const DEFAULT_BANK_ACCOUNTS: BankAccount[] = [
  {
    id: 'default-combank',
    bankName: 'Commercial Bank of Ceylon',
    accountName: 'Santha Mutual Pool',
    accountNumber: '8010 000 000',
    branchName: 'Colombo Main Branch',
    contributionText: 'Monthly Contribution · LKR 300',
    notes: 'Please include your member name in the transfer remarks so the treasurer can stamp your month promptly.',
    isActive: true,
    isPrimary: true,
    displayOrder: 1,
  }
];

export function cleanAccountNumber(raw: string): string {
  return raw.replace(/[^0-9]/g, '');
}

export function getRecommendedAppsForBank(bankName: string): BankingApp[] {
  const lower = (bankName || '').toLowerCase();
  const matched = SRI_LANKAN_BANKING_APPS.filter(app =>
    app.keywords.some(k => lower.includes(k))
  );
  const remaining = SRI_LANKAN_BANKING_APPS.filter(app =>
    !matched.some(m => m.id === app.id)
  );
  return [...matched, ...remaining];
}

export function launchBankingApp(app: BankingApp): void {
  const userAgent = navigator.userAgent || '';
  const isAndroid = /Android/i.test(userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(userAgent);

  if (isAndroid) {
    const intentUrl = `intent:#Intent;package=${app.androidPackage};end;`;
    const startTime = Date.now();
    
    // Attempt launching via Android package intent
    window.location.href = intentUrl;

    // Fallback timer if app is not installed
    setTimeout(() => {
      if (document.hidden || Date.now() - startTime > 2500) {
        return;
      }
      const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.androidPackage}`;
      window.open(playStoreUrl, '_blank');
    }, 1200);
  } else if (isIOS && app.iosUrl) {
    window.open(app.iosUrl, '_blank');
  } else if (app.webUrl) {
    window.open(app.webUrl, '_blank');
  } else {
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${app.androidPackage}`;
    window.open(playStoreUrl, '_blank');
  }
}
