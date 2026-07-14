export const WHATSAPP_CONFIG = {
 phoneNumber: "0900000000",
 defaultMessage: "Xin chào, tôi muốn hỏi về sản phẩm Soft Muse",
};

export const getWhatsAppUrl = (message?: string) => {
 const text = message || WHATSAPP_CONFIG.defaultMessage;
 return `https://zalo.me/${WHATSAPP_CONFIG.phoneNumber}?text=${encodeURIComponent(text)}`;
};
