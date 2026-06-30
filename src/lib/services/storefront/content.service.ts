import { mockStorage } from '@/lib/storage/mock-storage';

export interface ContentBlock {
  id: string;
  group: 'general' | 'checkout' | 'order_tracking' | 'emails' | 'pages';
  key: string;
  value: string;
  description: string;
}

let mockContent: ContentBlock[] = [
  { id: 'cnt-1', group: 'pages',         key: 'about_us',          value: 'تأسست دار أورا في الجيزة لنقدم مفهوماً جديداً للأناقة المعاصرة. نؤمن بالحياكة البطيئة والمدروسة؛ حيث يُقَص ويُحاك كل تصميم يدوياً بأيدي أمهر الحرفيين في أتيلييه الجيزة.', description: 'نص صفحة من نحن' },
  { id: 'cnt-2', group: 'pages',         key: 'privacy',           value: 'تحترم دار أورا خصوصية عملائها وتلتزم بحماية بياناتهم الشخصية وفقاً للقوانين المعمول بها. لن تُشارَك بياناتكِ مع أطراف ثالثة دون موافقة صريحة منكِ.', description: 'نص سياسة الخصوصية' },
  { id: 'cnt-3', group: 'order_tracking', key: 'status_received',  value: 'تم استلام طلبك بنجاح — يجهزه فريق أورا بعناية.',           description: 'رسالة: تم الاستلام' },
  { id: 'cnt-4', group: 'order_tracking', key: 'status_processing', value: 'طلبك قيد التحضير في أتيلييه أورا — الخياطة والتغليف الفاخر.',  description: 'رسالة: قيد التحضير' },
  { id: 'cnt-5', group: 'order_tracking', key: 'status_shipped',   value: 'تم شحن طلبك وهو في طريقه إليكِ — يصلكِ خلال 2-5 أيام عمل.', description: 'رسالة: تم الشحن' },
  { id: 'cnt-6', group: 'order_tracking', key: 'status_delivered', value: 'وصل طلبك بنجاح! نتمنى أن تستمتعي بكل قطعة من دار أورا.',       description: 'رسالة: تم التسليم' },
  { id: 'cnt-7', group: 'general',        key: 'announcement_bar', value: 'الشحن مجاني لجميع محافظات مصر | التغليف الفاخر مجاني',         description: 'نص شريط الإعلان العلوي' },
];

mockContent = mockStorage.read('storefront.content', mockContent);

export const ContentService = {
  async getAllContent(): Promise<ContentBlock[]> {
    return [...mockContent];
  },

  async getContentByGroup(group: ContentBlock['group']): Promise<ContentBlock[]> {
    return mockContent.filter(c => c.group === group);
  },

  async updateContent(id: string, value: string): Promise<ContentBlock> {
    const idx = mockContent.findIndex(c => c.id === id);
    if (idx > -1) {
      mockContent[idx].value = value;
      mockStorage.write('storefront.content', mockContent);
      return mockContent[idx];
    }
    throw new Error('Content not found');
  }
};
