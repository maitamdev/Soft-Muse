insert into public.categories (name, slug, sort_order) values
  ('Áo sơ mi', 'ao-so-mi', 1), ('Áo kiểu', 'ao-kieu', 2), ('Chân váy', 'chan-vay', 3),
  ('Váy', 'vay', 4), ('Quần tây', 'quan-tay', 5), ('Blazer', 'blazer', 6),
  ('Set đồ', 'set-do', 7), ('Phụ kiện', 'phu-kien', 8)
on conflict (slug) do nothing;

insert into public.collections (name, slug, description) values
  ('Office Essentials', 'office-essentials', 'Những thiết kế công sở nền tảng của Soft Muse'),
  ('New Arrivals', 'new-arrivals', 'Các thiết kế mới nhất'),
  ('Bestseller', 'bestseller', 'Những thiết kế được yêu thích nhất')
on conflict (slug) do nothing;

insert into public.products (
  id, name, slug, sku, short_description, description, category, collection, season,
  price, compare_price, cost_price, stock, material, featured, best_seller, new_arrival,
  status, badge, details, fabric, packaging, colors, sizes, seo
) values
(
  '00000000-0000-4000-8000-000000000001', 'Áo sơ mi lụa mềm Muse', 'ao-so-mi-lua-mem-muse', 'SM-ASM-001',
  'Áo sơ mi lụa mềm dành cho ngày làm việc thanh lịch.',
  'Áo sơ mi tay dài chất lụa mềm, cổ đứng nhẹ và phom suông vừa vặn cho ngày làm việc thanh lịch.',
  'Áo sơ mi', 'New Arrivals', 'summer', 429000, 529000, 172000, 25, 'Lụa satin pha polyester cao cấp', true, false, true,
  'published', 'Hàng mới', array['Phom suông vừa', 'Bề mặt mềm và hạn chế nhăn', 'Giặt nhẹ, ủi nhiệt độ thấp'],
  'Lụa satin pha polyester cao cấp', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Trắng kem','Hồng đất'], array['XS','S','M','L','XL'],
  '{"metaTitle":"Áo sơ mi lụa mềm Muse | Soft Muse","metaDescription":"Áo sơ mi công sở nữ chất lụa mềm, thanh lịch và dễ phối."}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000002', 'Áo kiểu cổ nơ Grace', 'ao-kieu-co-no-grace', 'SM-AK-002',
  'Áo kiểu cổ nơ nữ tính, dễ phối đồ công sở.',
  'Áo kiểu cổ nơ mềm mại, phù hợp quần tây, chân váy bút chì và blazer mỏng.',
  'Áo kiểu', 'Bestseller', 'summer', 389000, 0, 156000, 25, 'Voan lụa hai lớp', true, true, false,
  'published', 'Bestseller', array['Cổ nơ mềm mại', 'Có lớp lót kín đáo', 'Phom vừa cơ thể'],
  'Voan lụa hai lớp', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Trắng kem','Be'], array['S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000003', 'Chân váy bút chì The Office', 'chan-vay-but-chi-the-office', 'SM-CV-003',
  'Chân váy bút chì cạp cao, thanh lịch và thoải mái.',
  'Chân váy bút chì cạp cao, tôn dáng nhưng vẫn thoải mái khi di chuyển cả ngày.',
  'Chân váy', 'Bestseller', 'winter', 459000, 0, 184000, 25, 'Tuytsi co giãn nhẹ', true, true, false,
  'published', 'Bestseller', array['Cạp cao', 'Co giãn nhẹ', 'Xẻ sau dễ di chuyển'],
  'Tuytsi co giãn nhẹ', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Đen','Xám ghi'], array['XS','S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000004', 'Váy midi cổ vuông L''Amour', 'vay-midi-co-vuong-lamour', 'SM-V-004',
  'Váy midi cổ vuông chiết eo nhẹ.',
  'Váy midi cổ vuông, chiết eo nhẹ, đủ chỉn chu cho công sở và mềm mại cho buổi hẹn tối.',
  'Váy', 'Office Essentials', 'summer', 699000, 820000, 280000, 25, 'Cotton pha rayon thoáng mát', true, false, false,
  'published', 'Sale', array['Dáng midi', 'Chiết eo nhẹ', 'Có lớp lót'],
  'Cotton pha rayon thoáng mát', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Hồng đất','Đen'], array['S','M','L'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000005', 'Quần tây ống đứng Bella', 'quan-tay-ong-dung-bella', 'SM-QT-005',
  'Quần tây ống đứng lưng cao, dễ phối hàng ngày.',
  'Quần tây ống đứng lưng cao, ly trước tinh tế, dễ phối áo sơ mi và blazer.',
  'Quần tây', 'New Arrivals', 'winter', 549000, 0, 220000, 25, 'Tuytsi mềm, đứng phom', true, false, true,
  'published', 'Hàng mới', array['Lưng cao', 'Ống đứng', 'Ly trước tinh tế'],
  'Tuytsi mềm, đứng phom', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Đen','Nâu mocha'], array['XS','S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000006', 'Blazer linen Muse Tailored', 'blazer-linen-muse-tailored', 'SM-BL-006',
  'Blazer vai mềm với đường cắt tối giản.',
  'Blazer phom suông nhẹ, vai mềm và đường cắt tối giản cho vẻ ngoài chuyên nghiệp.',
  'Blazer', 'Bestseller', 'winter', 899000, 0, 360000, 18, 'Linen pha viscose có lót mỏng', true, true, false,
  'published', 'Bestseller', array['Vai mềm', 'Lót mỏng thoáng', 'Hai túi trước'],
  'Linen pha viscose có lót mỏng', 'Hộp Soft Muse và túi vải bảo quản', array['Be','Xanh navy'], array['S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000007', 'Set áo vest và chân váy Soft Power', 'set-soft-power', 'SM-SET-007',
  'Set vest ngắn và chân váy đồng bộ.',
  'Set đồng bộ gồm áo vest ngắn và chân váy, dành cho những ngày cần xuất hiện thật gọn gàng.',
  'Set đồ', 'Office Essentials', 'winter', 990000, 1150000, 396000, 14, 'Tuytsi cao cấp, ít nhăn', true, false, false,
  'published', 'Sale', array['Hai món đồng bộ', 'Ít nhăn', 'Phom hiện đại'],
  'Tuytsi cao cấp, ít nhăn', 'Hộp Soft Muse và túi vải bảo quản', array['Xám ghi','Đen'], array['S','M','L'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000008', 'Túi mini Muse Workday', 'tui-mini-muse-workday', 'SM-PK-008',
  'Túi mini phom hộp gọn gàng cho ngày đi làm.',
  'Túi mini phom hộp, đủ chỗ cho điện thoại, ví nhỏ và son môi khi đi làm.',
  'Phụ kiện', 'Bestseller', 'summer', 359000, 0, 144000, 20, 'Da PU vân mịn', false, true, false,
  'published', 'Bestseller', array['Dây đeo điều chỉnh', 'Khóa nam châm', 'Có ngăn phụ'],
  'Da PU vân mịn', 'Hộp Soft Muse và túi vải bảo quản', array['Đen','Be'], array['F'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000009', 'Áo sơ mi tay lỡ Monday', 'ao-so-mi-tay-lo-monday', 'SM-ASM-009',
  'Áo sơ mi tay lỡ phom rộng vừa.',
  'Áo sơ mi tay lỡ phom rộng vừa, dễ sơ vin và thoải mái cho ngày làm việc nhiều di chuyển.',
  'Áo sơ mi', 'Office Essentials', 'summer', 329000, 0, 132000, 25, 'Cotton poplin mềm', false, false, false,
  'published', 'Giá tốt', array['Tay lỡ', 'Dễ sơ vin', 'Cotton thoáng'],
  'Cotton poplin mềm', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Trắng kem','Xanh sage'], array['S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000010', 'Đầm sơ mi Everyday Muse', 'dam-so-mi-everyday-muse', 'SM-V-010',
  'Đầm sơ mi thắt eo nhẹ, kín đáo và hiện đại.',
  'Đầm sơ mi thắt eo nhẹ, kín đáo, hiện đại và hợp nhiều môi trường công sở.',
  'Váy', 'New Arrivals', 'summer', 629000, 0, 252000, 25, 'Cotton pha spandex', true, false, true,
  'published', 'Hàng mới', array['Cổ sơ mi', 'Đai eo tháo rời', 'Túi hai bên'],
  'Cotton pha spandex', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Be','Xanh navy'], array['S','M','L','XL'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000011', 'Áo knit cổ tim Calm', 'ao-knit-co-tim-calm', 'SM-AK-011',
  'Áo knit cổ tim mỏng, mềm và dễ phối.',
  'Áo knit cổ tim mỏng, mềm, phối đẹp cùng quần tây hoặc chân váy trong thời tiết mát.',
  'Áo kiểu', 'New Arrivals', 'winter', 399000, 0, 160000, 20, 'Len dệt mịn pha viscose', false, false, true,
  'published', 'Hàng mới', array['Dệt mịn', 'Co giãn nhẹ', 'Cổ tim thanh lịch'],
  'Len dệt mịn pha viscose', 'Túi giấy Soft Muse và thẻ hướng dẫn bảo quản', array['Nâu mocha','Trắng kem'], array['S','M','L'], '{}'::jsonb
),
(
  '00000000-0000-4000-8000-000000000012', 'Khăn lụa nơ cổ Muse Ribbon', 'khan-lua-muse-ribbon', 'SM-PK-012',
  'Khăn lụa bản nhỏ đa dụng.',
  'Khăn lụa bản nhỏ dùng thắt cổ, buộc tóc hoặc trang trí túi xách.',
  'Phụ kiện', 'Office Essentials', 'summer', 219000, 279000, 88000, 30, 'Lụa satin mềm', false, false, false,
  'published', 'Sale', array['Bản nhỏ', 'In hai mặt', 'Dùng theo nhiều cách'],
  'Lụa satin mềm', 'Phong bì Soft Muse và hướng dẫn phối đồ', array['Hồng đất','Be'], array['F'], '{}'::jsonb
)
on conflict (id) do nothing;

insert into public.product_images (product_id, url, alt_text, sort_order) values
('00000000-0000-4000-8000-000000000001','/images/products/product_silk_blouse.png','Áo sơ mi lụa mềm Muse',0),
('00000000-0000-4000-8000-000000000001','/images/campaign/campaign_2.png','Áo sơ mi lụa mềm Muse phối đồ',1),
('00000000-0000-4000-8000-000000000002','/images/campaign/campaign_1.png','Áo kiểu cổ nơ Grace',0),
('00000000-0000-4000-8000-000000000002','/images/products/product_silk_blouse.png','Áo kiểu cổ nơ Grace phối đồ',1),
('00000000-0000-4000-8000-000000000003','/images/campaign/campaign_3.png','Chân váy bút chì The Office',0),
('00000000-0000-4000-8000-000000000003','/images/products/product_linen_set.png','Chân váy bút chì phối đồ',1),
('00000000-0000-4000-8000-000000000004','/images/products/product_evening_gown.png','Váy midi cổ vuông L''Amour',0),
('00000000-0000-4000-8000-000000000004','/images/campaign/campaign_4.png','Váy midi cổ vuông phối đồ',1),
('00000000-0000-4000-8000-000000000005','/images/products/product_linen_set.png','Quần tây ống đứng Bella',0),
('00000000-0000-4000-8000-000000000005','/images/campaign/campaign_5.png','Quần tây Bella phối đồ',1),
('00000000-0000-4000-8000-000000000006','/images/products/product_winter_coat.png','Blazer linen Muse Tailored',0),
('00000000-0000-4000-8000-000000000006','/images/campaign/campaign_6.png','Blazer Muse Tailored phối đồ',1),
('00000000-0000-4000-8000-000000000007','/images/campaign/campaign_4.png','Set Soft Power',0),
('00000000-0000-4000-8000-000000000007','/images/campaign/campaign_3.png','Set Soft Power phối đồ',1),
('00000000-0000-4000-8000-000000000008','/images/products/product_leather_bag.png','Túi mini Muse Workday',0),
('00000000-0000-4000-8000-000000000008','/images/campaign/campaign_1.png','Túi Muse Workday phối đồ',1),
('00000000-0000-4000-8000-000000000009','/images/campaign/campaign_2.png','Áo sơ mi tay lỡ Monday',0),
('00000000-0000-4000-8000-000000000009','/images/products/product_silk_blouse.png','Áo sơ mi Monday phối đồ',1),
('00000000-0000-4000-8000-000000000010','/images/campaign/campaign_5.png','Đầm sơ mi Everyday Muse',0),
('00000000-0000-4000-8000-000000000010','/images/products/product_evening_gown.png','Đầm sơ mi Everyday Muse phối đồ',1),
('00000000-0000-4000-8000-000000000011','/images/campaign/campaign_6.png','Áo knit cổ tim Calm',0),
('00000000-0000-4000-8000-000000000011','/images/products/product_winter_coat.png','Áo knit Calm phối đồ',1),
('00000000-0000-4000-8000-000000000012','/images/products/product_necklace.png','Khăn lụa Muse Ribbon',0),
('00000000-0000-4000-8000-000000000012','/images/products/product_leather_bag.png','Khăn lụa Muse Ribbon phối đồ',1)
on conflict (product_id, url) do nothing;

insert into public.coupons (code, name, discount_type, discount_value, minimum_order, maximum_discount, usage_limit, expires_at)
values ('WELCOME10', 'Ưu đãi khách hàng mới', 'percentage', 10, 500000, 100000, 500, now() + interval '1 year')
on conflict (code) do nothing;

insert into public.site_settings (key, value) values
('store', '{"name":"Soft Muse","currency":"VND","freeShippingThreshold":800000,"standardShippingFee":30000}'::jsonb),
('contact', '{"email":"hello@softmuse.vn","country":"Việt Nam"}'::jsonb)
on conflict (key) do nothing;
