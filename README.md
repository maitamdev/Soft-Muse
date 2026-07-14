# Soft Muse Commerce

Website thương mại điện tử và hệ thống quản trị cho thương hiệu thời trang công sở nữ Soft Muse.

## Công nghệ

- Next.js 16, React 19, TypeScript, Tailwind CSS
- Supabase PostgreSQL, Auth, Storage và Row Level Security
- Vercel cho hosting và CI/CD
- Framer Motion, Recharts và Tabler Icons

## Chức năng chính

- Cửa hàng, bộ lọc sản phẩm, chi tiết sản phẩm, giỏ hàng và wishlist
- Checkout tạo đơn thật, kiểm tra giá và tồn kho tại database
- Mã giảm giá có thời hạn, giới hạn lượt dùng và giá trị đơn tối thiểu
- Tra cứu đơn bằng mã đơn và số điện thoại/email
- Admin quản lý sản phẩm, ảnh, biến thể, tồn kho, đơn hàng, khách hàng và mã giảm giá
- Dashboard doanh thu lấy trực tiếp từ Supabase
- Supabase Auth cho nhân viên và RLS bảo vệ dữ liệu
- SEO, sitemap, responsive và ảnh tối ưu bằng Next.js

## Chạy local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mở `http://localhost:3000`. Cấu hình Supabase và triển khai production được hướng dẫn trong [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Database

Migration nằm tại:

```text
supabase/migrations/202607140001_commerce_core.sql
supabase/migrations/202607140002_seed_soft_muse.sql
```

Migration đầu tạo schema, RLS, Storage bucket và các transaction bảo vệ checkout/tồn kho. Migration sau thêm 12 sản phẩm Soft Muse, danh mục, bộ sưu tập và mã `WELCOME10`.

## Kiểm tra

```bash
npm run lint
npm run build
```

Không commit `.env.local` hoặc `SUPABASE_SERVICE_ROLE_KEY` lên GitHub.
