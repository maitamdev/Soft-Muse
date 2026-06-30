export function formatCurrency(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0 جنيه';
  // Use en-US to ensure English digits (0-9)
  return `${num.toLocaleString('en-US')} جنيه`;
}

export function formatNumber(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return '0';
  return num.toLocaleString('en-US');
}

export function formatDate(dateStr: string | Date | number, detailed = false): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  
  if (detailed) {
    // Expected: 26 يونيو 2026
    const months = [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ];
    const day = date.getDate().toLocaleString('en-US');
    const month = months[date.getMonth()];
    const year = date.getFullYear().toLocaleString('en-US', { useGrouping: false });
    return `${day} ${month} ${year}`;
  }
  
  // Expected: 26/06/2026
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}
