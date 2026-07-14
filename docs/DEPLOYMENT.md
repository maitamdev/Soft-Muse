# Triển khai Soft Muse với Supabase, GitHub và Vercel

## 1. Tạo dự án Supabase

1. Tạo project tại Supabase và lưu database password ở nơi an toàn.
2. Mở SQL Editor, chạy lần lượt hai tệp trong `supabase/migrations` theo tên tăng dần.
3. Vào Authentication > Users, tạo tài khoản quản trị bằng email thật.
4. Chạy câu SQL sau, thay email bằng tài khoản vừa tạo:

```sql
update public.profiles
set role = 'admin', full_name = 'Quản trị Soft Muse'
where id = (select id from auth.users where email = 'admin@softmuse.vn');
```

Không tạo mật khẩu admin trong migration và không commit mật khẩu vào GitHub.

## 2. Cấu hình local

Sao chép `.env.example` thành `.env.local`, sau đó lấy giá trị tại Supabase > Project Settings > API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` chỉ được đặt trên máy chủ. Không dùng khóa này trong component client và không thêm tiền tố `NEXT_PUBLIC_`.

## 3. Kiểm tra trước khi đẩy GitHub

```bash
npm install
npm run lint
npm run build
```

Sau đó tạo repository GitHub và đẩy mã nguồn:

```bash
git add .
git commit -m "Production Supabase commerce backend"
git branch -M main
git remote add origin https://github.com/USERNAME/soft-muse.git
git push -u origin main
```

Kiểm tra kỹ `git status` để chắc chắn `.env.local` không nằm trong commit.

## 4. Triển khai Vercel

1. Trong Vercel, chọn Add New > Project và import repository GitHub.
2. Framework Preset chọn Next.js; Build Command giữ `npm run build`.
3. Thêm bốn biến môi trường giống `.env.local`; đổi `NEXT_PUBLIC_SITE_URL` thành domain production.
4. Deploy, sau đó thêm domain chính thức trong Vercel > Domains.
5. Trong Supabase > Authentication > URL Configuration, đặt Site URL là domain production và thêm `https://domain-cua-ban.vn/**` vào Redirect URLs.

Mỗi lần push vào `main`, Vercel sẽ tự build và triển khai phiên bản mới.

## 5. Kiểm tra sau deploy

- Đăng nhập `/admin` bằng tài khoản đã cấp role `admin`.
- Tạo một sản phẩm nháp, tải ảnh, sau đó xuất bản và kiểm tra tại `/shop`.
- Tạo đơn COD, kiểm tra tồn kho giảm và đơn xuất hiện trong `/admin/orders`.
- Tra cứu đơn bằng mã đơn cùng số điện thoại/email đã đặt.
- Thử mã `WELCOME10` với đơn từ 500.000đ.
- Kiểm tra sitemap tại `/sitemap.xml` và robots tại `/robots.txt`.

## Thanh toán trực tuyến

COD và chuyển khoản thủ công có thể vận hành ngay. Thanh toán thẻ/QR tự động cần tài khoản merchant và khóa API riêng của VNPay, MoMo hoặc Stripe; chỉ bật phương thức đó sau khi đã có webhook xác thực thanh toán phía server.
