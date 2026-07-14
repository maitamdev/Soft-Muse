import Link from "next/link";
import {
  IconBrush,
  IconChecklist,
  IconMessageCircle,
  IconPackage,
  IconSearch,
  IconShoppingBag,
  IconTicket,
  IconTruckDelivery,
} from "@tabler/icons-react";

const quickLinks = [
  { title: "Sản phẩm", description: "Quản lý áo sơ mi, váy, blazer, set đồ và phụ kiện.", href: "/admin/products", Icon: IconShoppingBag },
  { title: "Đơn hàng", description: "Theo dõi đơn mới, thanh toán, đóng gói và giao hàng.", href: "/admin/orders", Icon: IconPackage },
  { title: "Mã giảm giá", description: "Tạo coupon cho khách mới, sale theo mùa hoặc freeship.", href: "/admin/coupons", Icon: IconTicket },
  { title: "Nội dung website", description: "Sửa banner, homepage, footer, navigation và media.", href: "/admin/website", Icon: IconBrush },
  { title: "SEO", description: "Tối ưu tiêu đề, mô tả và hình ảnh chia sẻ mạng xã hội.", href: "/admin/website/seo", Icon: IconSearch },
  { title: "Khách hàng", description: "Quản lý thông tin khách mua, lịch sử đơn và chăm sóc lại.", href: "/admin/customers", Icon: IconMessageCircle },
];

const launchChecklist = [
  "Thay logo chính thức và favicon Soft Muse.",
  "Upload ảnh sản phẩm thật theo từng màu, từng size.",
  "Cập nhật địa chỉ, số điện thoại, Zalo, Messenger và email chăm sóc khách hàng.",
  "Kết nối cổng thanh toán thật hoặc cấu hình COD/chuyển khoản.",
  "Cấu hình phí vận chuyển, chính sách đổi trả và thời gian giao hàng.",
  "Kiểm tra SEO cho trang chủ, sản phẩm, bộ sưu tập và khuyến mãi.",
];

export default function SoftMuseAdminPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <section className="rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-6 md:p-8 shadow-[var(--admin-shadow-sm)]">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--admin-primary)]">
            Soft Muse Commerce Studio
          </p>
          <h1 className="mt-3 text-2xl md:text-3xl font-bold text-[var(--admin-text-base)]">
            Trung tâm quản trị thương hiệu
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--admin-text-muted)]">
            Một bảng điều khiển riêng cho Soft Muse: quản lý catalog công sở nữ, đơn hàng,
            ưu đãi, nội dung website, SEO và các kênh tư vấn khách hàng.
          </p>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {quickLinks.map(({ title, description, href, Icon }) => (
          <Link
            key={href}
            href={href}
            className="group rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-5 shadow-[var(--admin-shadow-sm)] transition-all hover:-translate-y-0.5 hover:shadow-[var(--admin-shadow-md)]"
          >
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-[var(--admin-radius-lg)] bg-[var(--admin-primary-muted)] text-[var(--admin-primary)] flex items-center justify-center shrink-0">
                <Icon size={22} stroke={1.7} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-[var(--admin-text-base)] group-hover:text-[var(--admin-primary)] transition-colors">
                  {title}
                </h2>
                <p className="mt-1.5 text-xs leading-5 text-[var(--admin-text-muted)]">
                  {description}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
        <div className="rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-5 shadow-[var(--admin-shadow-sm)]">
          <div className="flex items-center gap-3 mb-4">
            <IconChecklist size={22} className="text-[var(--admin-primary)]" />
            <h2 className="text-sm font-bold text-[var(--admin-text-base)]">Checklist trước khi bán thật</h2>
          </div>
          <div className="space-y-3">
            {launchChecklist.map((item) => (
              <label key={item} className="flex items-start gap-3 text-sm text-[var(--admin-text-muted)]">
                <input type="checkbox" className="mt-1 accent-[var(--admin-primary)]" />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-[var(--admin-radius-xl)] border border-[var(--admin-border-base)] bg-[var(--admin-bg-surface)] p-5 shadow-[var(--admin-shadow-sm)]">
          <div className="flex items-center gap-3 mb-4">
            <IconTruckDelivery size={22} className="text-[var(--admin-primary)]" />
            <h2 className="text-sm font-bold text-[var(--admin-text-base)]">Luồng vận hành đề xuất</h2>
          </div>
          <ol className="space-y-3 text-sm text-[var(--admin-text-muted)]">
            <li>1. Thêm sản phẩm và tồn kho theo màu/size.</li>
            <li>2. Kiểm tra ảnh, mô tả, chất liệu và bảng size.</li>
            <li>3. Tạo mã ưu đãi cho chiến dịch mở bán.</li>
            <li>4. Chạy thử checkout, tạo đơn, in phiếu giao hàng.</li>
            <li>5. Theo dõi review và phản hồi khách sau mua.</li>
          </ol>
        </div>
      </section>
    </div>
  );
}
