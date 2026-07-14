"use client";

import { useCallback, useEffect, useState } from "react";
import { ContentService } from "@/lib/services/storefront/content.service";
import { useEventSubscribeMany } from "@/hooks/useEventBus";

export const HOME_CONTENT = {
  home_hero_label: "Soft Muse Officewear",
  home_hero_title: "Thanh lịch mỗi ngày, tự tin theo cách của bạn",
  home_hero_text: "Thời trang công sở nữ tối giản, nữ tính và hiện đại với mức giá 200.000-1.000.000đ.",
  home_hero_primary_cta: "Mua sắm ngay",
  home_hero_secondary_cta: "Xem bộ sưu tập",
  home_hero_image: "/images/campaign/campaign_1.png",
  home_category_label: "Danh mục",
  home_category_title: "Mua theo nhu cầu đi làm",
  home_lookbook_label: "Lookbook",
  home_lookbook_title: "Một tủ đồ công sở mềm mại, ít nghĩ nhưng luôn đẹp",
  home_lookbook_text: "Phối sơ mi lụa với quần tây ống đứng, thêm blazer linen cho những cuộc họp quan trọng, hoặc chọn váy midi khi bạn muốn vẻ ngoài nữ tính và gọn gàng hơn.",
  home_lookbook_button: "Khám phá lookbook",
  home_lookbook_image: "/images/campaign/campaign_5.png",
  home_testimonial_label: "Khách hàng nói gì",
  home_testimonial_title: "Từ những ngày làm việc thật",
  home_newsletter_label: "Newsletter",
  home_newsletter_title: "Nhận ưu đãi từ Soft Muse",
  home_newsletter_text: "Hàng mới, mẹo phối đồ công sở và mã giảm giá riêng cho thành viên.",
  home_instagram_label: "@softmuse.vn",
  home_instagram_title: "Instagram Gallery",
};

export const ABOUT_CONTENT = {
  about_hero_label: "Về Soft Muse",
  about_hero_title: "Thời trang công sở nữ thanh lịch cho nhịp sống hiện đại",
  about_hero_image: "/images/campaign/campaign_1.png",
  about_philosophy_label: "Triết lý thương hiệu",
  about_philosophy_title: "Minimal Luxury, nhưng gần gũi với nàng công sở Việt",
  about_philosophy_text: "Soft Muse được xây dựng cho phụ nữ 22-35 tuổi: nhân viên văn phòng, giáo viên, nhân viên ngân hàng và những người đi làm yêu thích vẻ ngoài gọn gàng, nữ tính và chuyên nghiệp. Mỗi thiết kế hướng đến sự dễ mặc, dễ phối và đủ tinh tế để đồng hành qua nhiều hoàn cảnh.",
  about_philosophy_image: "/images/campaign/campaign_2.png",
  about_products_label: "Sản phẩm",
  about_products_title: "Áo sơ mi, áo kiểu, chân váy, váy, quần tây, blazer, set đồ và phụ kiện",
  about_products_text: "Bảng màu chủ đạo gồm kem, trắng, hồng đất, đen và các sắc trung tính. Sản phẩm được phát triển để lên dáng đẹp, dễ chăm sóc và có mức giá hợp lý.",
  about_values_label: "Giá trị cốt lõi",
  about_values_title: "Điều Soft Muse theo đuổi",
  about_cta_label: "Bắt đầu mua sắm",
  about_cta_title: "Tìm outfit công sở tiếp theo của bạn",
  about_cta_text: "Khám phá những thiết kế mới nhất và các sản phẩm bán chạy của Soft Muse.",
  about_cta_button: "Vào cửa hàng",
};

export function usePageContent<T extends Record<string, string>>(defaults: T): T {
  const [content, setContent] = useState<T>(defaults);
  const load = useCallback(async () => {
    const blocks = await ContentService.getContentByGroup("pages");
    const stored = Object.fromEntries(blocks.filter(block => block.value.trim()).map(block => [block.key, block.value]));
    setContent({ ...defaults, ...stored });
  }, [defaults]);
  useEffect(() => { void load(); }, [load]);
  useEventSubscribeMany(["website.changed"], load);
  return content;
}
