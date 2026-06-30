"use client";

import React, { useEffect, useState, use } from 'react';
import { OrderService } from '@/lib/services/order.service';
import { Order } from '@/data/mock/orders';
import { formatCurrency, formatDate } from '@/lib/utils/formatters';
import { IconPrinter, IconArrowRight } from '@tabler/icons-react';
import Link from 'next/link';
import { adminAr } from '@/lib/i18n/admin-ar';

export default function InvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params);
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    OrderService.getOrder(orderId).then(data => {
      if (data) setOrder(data);
    });
  }, [orderId]);

  if (!order) return <div className="p-10 text-center">جاري التحميل...</div>;

  return (
    <div className="bg-gray-50 min-h-screen -m-6 p-6 sm:p-10 font-serif">
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-invoice, #printable-invoice * {
            visibility: visible;
          }
          #printable-invoice {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 0;
            box-shadow: none;
          }
          @page { size: A4; margin: 0; }
        }
      `}} />
      
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href={`/admin/orders/${order.id}`} className="flex items-center gap-2 text-gray-600 hover:text-black">
          <IconArrowRight size={18} /> عودة للطلب
        </Link>
        <button 
          onClick={() => window.print()}
          className="flex items-center gap-2 px-6 py-2.5 bg-black text-white font-medium rounded-md shadow-sm hover:bg-gray-800"
        >
          <IconPrinter size={18} /> طباعة الفاتورة
        </button>
      </div>

      <div id="printable-invoice" className="max-w-4xl mx-auto bg-white p-10 sm:p-16 rounded-xl shadow-sm border border-gray-100">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-16">
          <div>
            <h1 className="text-4xl font-bold tracking-widest uppercase text-black mb-2">AURA</h1>
            <p className="text-gray-500 text-sm">أناقة تعكس هويتك</p>
          </div>
          <div className="text-end">
            <h2 className="text-2xl font-medium text-gray-800 mb-2">فاتورة ضريبية</h2>
            <p className="text-gray-500 text-sm font-sans">{order.orderNumber}</p>
            <p className="text-gray-500 text-sm mt-1">{formatDate(order.date)}</p>
          </div>
        </div>

        {/* Addresses */}
        <div className="grid grid-cols-2 gap-10 mb-12">
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">مصدرة إلى</h3>
            <p className="font-bold text-gray-800 text-lg mb-1">{order.customerName}</p>
            <p className="text-gray-600 text-sm">{order.shippingAddress}</p>
            <p className="text-gray-600 text-sm mt-1" dir="ltr">{order.customerPhone}</p>
            <p className="text-gray-600 text-sm">{order.customerEmail}</p>
          </div>
          <div className="text-end">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">تفاصيل الدفع</h3>
            <p className="font-medium text-gray-800 text-sm mb-1">{order.paymentMethod === 'cod' ? 'الدفع عند الاستلام' : order.paymentMethod === 'card' ? 'بطاقة ائتمان' : order.paymentMethod}</p>
            <p className="text-gray-600 text-sm">{order.paymentStatus === 'paid' ? 'مدفوعة' : 'غير مدفوعة'}</p>
          </div>
        </div>

        {/* Table */}
        <table className="w-full mb-12 text-sm text-right">
          <thead>
            <tr className="border-b-2 border-gray-800 text-gray-800">
              <th className="py-3 px-2 font-bold">المنتج</th>
              <th className="py-3 px-2 font-bold text-center">الكمية</th>
              <th className="py-3 px-2 font-bold text-center">السعر</th>
              <th className="py-3 px-2 font-bold text-end">الإجمالي</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.items.map(item => (
              <tr key={item.id}>
                <td className="py-4 px-2">
                  <p className="font-medium text-gray-800">{item.productName}</p>
                  <p className="text-xs text-gray-500 mt-1">الرمز: {item.sku}</p>
                  {(item.size || item.color) && (
                    <p className="text-xs text-gray-500 mt-0.5">{item.size && `المقاس: ${item.size}`} {item.color && `- اللون: ${item.color}`}</p>
                  )}
                </td>
                <td className="py-4 px-2 text-center text-gray-800">{item.quantity}</td>
                <td className="py-4 px-2 text-center text-gray-800">{formatCurrency(item.price)}</td>
                <td className="py-4 px-2 font-medium text-end text-gray-800">{formatCurrency(item.price * item.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="flex justify-end mb-16">
          <div className="w-64 space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي:</span>
              <span>{formatCurrency(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>تكلفة الشحن:</span>
              <span>{formatCurrency(order.shipping)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>الضرائب:</span>
              <span>{formatCurrency(order.tax)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>الخصم:</span>
                <span>-{formatCurrency(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-xl font-bold text-gray-900 border-t-2 border-gray-800 pt-3 mt-3">
              <span>الإجمالي:</span>
              <span>{formatCurrency(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 mt-auto text-center text-sm text-gray-500">
          <p>شكراً لتسوقك من AURA. نتمنى أن تحوز منتجاتنا على إعجابك.</p>
          <p className="mt-1" dir="ltr">www.aurabrand.com | +201234567890</p>
        </div>

      </div>
    </div>
  );
}
