import { TimelineEvent } from '@/data/mock/timeline';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';

interface ActivityTimelineProps {
 events: TimelineEvent[];
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
 if (!events || events.length === 0) {
 return (
 <div className="flex flex-col items-center justify-center p-8 text-[var(--admin-text-subtle)]"> <p>Không có.</p> </div>
 );
 }

 return (
 <div className="space-y-4">
 {events.map((event, index) => (
 <div key={event.id} className="relative flex gap-4"> <div className="flex flex-col items-center"> <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--admin-primary-muted)] text-[var(--admin-primary)] ring-4 ring-[var(--admin-bg-card)]"> <span className="text-xs font-bold">{event.adminName.charAt(0)}</span> </div>
 {index !== events.length - 1 && (
 <div className="w-px h-full bg-[var(--admin-border-base)] my-2" />
 )}
 </div> <div className="flex flex-col pb-6"> <div className="flex items-center gap-2"> <span className="font-semibold text-[var(--admin-text-base)]">{event.adminName}</span> <span className="text-sm text-[var(--admin-text-subtle)]">ـ</span> <span className="font-medium text-[var(--admin-primary)]">
 {translateAction(event.action)}
 </span> </div> <p className="text-sm text-[var(--admin-text-muted)] mt-1">{event.description}</p> <div className="flex items-center gap-3 mt-2 text-xs text-[var(--admin-text-subtle)]"> <time dateTime={event.timestamp}>
 {format(new Date(event.timestamp), 'PPp', { locale: arSA })}
 </time> <span>•</span> <span dir="ltr">IP: {event.mockIp}</span> </div>

 {event.diff && (
 <div className="mt-3 rounded-[var(--admin-radius-md)] bg-[var(--admin-bg-base)] p-3 text-xs font-mono overflow-x-auto border border-[var(--admin-border-light)]"> <table className="w-full text-left"> <thead> <tr className="text-[var(--admin-text-subtle)] border-b border-[var(--admin-border-base)]"> <th className="pb-2 font-normal"></th> <th className="pb-2 font-normal"></th> <th className="pb-2 font-normal"></th> </tr> </thead> <tbody>
 {Object.entries(event.diff).map(([key, value]) => (
 <tr key={key} className="border-b border-[var(--admin-border-light)] last:border-0"> <td className="py-2 font-medium text-[var(--admin-text-base)]">{key}</td> <td className="py-2 text-[var(--admin-danger)] line-through opacity-70">
 {JSON.stringify(value.before)}
 </td> <td className="py-2 text-[var(--admin-success)]">
 {JSON.stringify(value.after)}
 </td> </tr>
 ))}
 </tbody> </table> </div>
 )}
 </div> </div>
 ))}
 </div>
 );
}

function translateAction(action: string): string {
 const map: Record<string, string> = {
 created: '',
 updated: '',
 deleted: 'Xóa',
 archived: 'Lưu trữ',
 restored: '',
 published: '',
 hidden: '',
 scheduled: '',
 status_changed: 'Trạng thái',
 stock_adjusted: 'Sửa Tồn kho'
 };
 return map[action] || action;
}
