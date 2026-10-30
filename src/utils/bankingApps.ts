import { Share } from '@capacitor/share';
import { BankAccount } from '../types';

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
  return (raw || '').replace(/[^0-9]/g, '');
}

/**
 * Formats a clean, professional transfer brief that can be passed
 * directly to the native Android system chooser / share sheet.
 */
export function formatPaymentTransferText(account: BankAccount): string {
  const cleanAcc = cleanAccountNumber(account.accountNumber);
  return [
    `SANTHA MUTUAL AID TRANSFER`,
    `Bank: ${account.bankName}`,
    `Account Name: ${account.accountName}`,
    `Account Number: ${cleanAcc}`,
    `Branch: ${account.branchName}`,
    `Amount: ${account.contributionText || 'LKR 300'}`,
    `Remarks: ${account.notes || 'Include member name in transfer remarks'}`,
  ].join('\n');
}

/**
 * Native Android Intent Chooser invocation.
 * Opens the device OS bottom sheet ("Complete action using: Q+ / BOC Flex / Vishwa / Notes / etc.")
 * exactly like sharing a photo or opening a file with an app picker.
 *
 * NO automatic Play Store redirects.
 */
export async function openNativePaymentChooser(account: BankAccount): Promise<boolean> {
  const cleanAcc = cleanAccountNumber(account.accountNumber);

  // 1. Always copy the clean account number to the user's clipboard first
  try {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      await navigator.clipboard.writeText(cleanAcc);
    }
  } catch (err) {
    console.warn('Clipboard write fallback:', err);
  }

  const transferText = formatPaymentTransferText(account);
  const title = `Transfer to ${account.bankName}`;

  // 2. Try native Capacitor Share plugin (Triggers Android Intent.ACTION_CHOOSER on device)
  try {
    const canShareResult = await Share.canShare();
    if (canShareResult.value) {
      await Share.share({
        title,
        text: transferText,
        dialogTitle: 'Select Banking or Payment App',
      });
      return true;
    }
  } catch (capErr) {
    console.info('Capacitor native chooser unavailable, trying Web Share API:', capErr);
  }

  // 3. Try standard Web Share API (native mobile browser bottom sheet)
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({
        title,
        text: transferText,
      });
      return true;
    } catch (shareErr: any) {
      // If user dismissed the popup, do not treat as an error
      if (shareErr.name === 'AbortError') {
        return true;
      }
      console.warn('Web Share failed:', shareErr);
    }
  }

  // 4. If neither native sheet is available (e.g. desktop web browser without Web Share), return false
  return false;
}
