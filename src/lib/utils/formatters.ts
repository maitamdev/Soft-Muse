export function formatCurrency(amount: number | string): string {
 const num = typeof amount === 'string' ? parseFloat(amount) : amount;
 if (isNaN(num)) return '0 ₫';
 return `${num.toLocaleString('vi-VN')} ₫`;
}

export function formatNumber(amount: number | string): string {
 const num = typeof amount === 'string' ? parseFloat(amount) : amount;
 if (isNaN(num)) return '0';
 return num.toLocaleString('vi-VN');
}

export function formatDate(dateStr: string | Date | number, detailed = false): string {
 if (!dateStr) return '';
 const date = new Date(dateStr);
 
 if (detailed) {
 const months = [
 'tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6',
 'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'
 ];
 const day = date.getDate().toLocaleString('vi-VN');
 const month = months[date.getMonth()];
 const year = date.getFullYear().toLocaleString('vi-VN', { useGrouping: false });
 return `${day} ${month} ${year}`;
 }
 
 // Expected: 26/06/2026
 const day = String(date.getDate()).padStart(2, '0');
 const month = String(date.getMonth() + 1).padStart(2, '0');
 const year = date.getFullYear();
 return `${day}/${month}/${year}`;
}
