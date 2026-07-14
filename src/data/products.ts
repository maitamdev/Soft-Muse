export interface ProductColorVariant {
  color: string;
  value: string;
  images: string[];
}

export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock";

export interface StorefrontSeedInput {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  collection: string;
  season: "summer" | "winter";
  badge?: string;
  stockStatus?: ProductStockStatus;
  description: string;
  details: string[];
  fabric: string;
  packaging: string;
  colors?: string[];
  sizes?: string[];
  variants?: ProductColorVariant[];
}

const palette: Record<string, string> = {
  "Trắng kem": "#F7F1E8",
  "Đen": "#111111",
  "Hồng đất": "#B98E83",
  "Be": "#D8C8B6",
  "Nâu mocha": "#80665A",
  "Xám ghi": "#9A9A96",
  "Xanh navy": "#1F2A44",
  "Xanh sage": "#A8B4A2",
};

const images = {
  blouse: "/images/products/product_silk_blouse.png",
  set: "/images/products/product_linen_set.png",
  dress: "/images/products/product_evening_gown.png",
  blazer: "/images/products/product_winter_coat.png",
  bag: "/images/products/product_leather_bag.png",
  accessory: "/images/products/product_necklace.png",
  look1: "/images/campaign/campaign_1.png",
  look2: "/images/campaign/campaign_2.png",
  look3: "/images/campaign/campaign_3.png",
  look4: "/images/campaign/campaign_4.png",
  look5: "/images/campaign/campaign_5.png",
  look6: "/images/campaign/campaign_6.png",
};

function details(category: string, fabric: string): string[] {
  return [
    `Danh mục: ${category}`,
    `Chất liệu: ${fabric}`,
    "Phom dáng thanh lịch, dễ mặc đi làm và gặp gỡ sau giờ công sở",
    "Đường may gọn, bề mặt vải mềm và hạn chế nhăn",
    "Bảo quản: giặt nhẹ, phơi trong bóng râm, ủi nhiệt độ thấp",
  ];
}

function variants(primary: string, secondary: string, imageA: string, imageB: string): ProductColorVariant[] {
  return [
    { color: primary, value: palette[primary], images: [imageA, imageB] },
    { color: secondary, value: palette[secondary], images: [imageB, imageA] },
  ];
}

export const storefrontSeed: StorefrontSeedInput[] = [
  {
    id: "1",
    title: "Áo sơ mi lụa mềm Muse",
    price: 429000,
    originalPrice: 529000,
    image: images.blouse,
    hoverImage: images.look2,
    collection: "Áo sơ mi",
    season: "summer",
    badge: "Hàng mới",
    description: "Áo sơ mi tay dài chất lụa mềm, cổ đứng nhẹ và phom suông vừa vặn cho ngày làm việc thanh lịch.",
    details: details("Áo sơ mi", "lụa satin pha polyester cao cấp"),
    fabric: "Lụa satin pha polyester cao cấp",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Trắng kem", "Hồng đất"],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: variants("Trắng kem", "Hồng đất", images.blouse, images.look2),
  },
  {
    id: "2",
    title: "Áo kiểu cổ nơ Grace",
    price: 389000,
    image: images.look1,
    hoverImage: images.blouse,
    collection: "Áo kiểu",
    season: "summer",
    badge: "Bestseller",
    description: "Áo kiểu cổ nơ mềm mại, phù hợp quần tây, chân váy bút chì và blazer mỏng.",
    details: details("Áo kiểu", "voan lụa hai lớp"),
    fabric: "Voan lụa hai lớp",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Trắng kem", "Be"],
    sizes: ["S", "M", "L", "XL"],
    variants: variants("Trắng kem", "Be", images.look1, images.blouse),
  },
  {
    id: "3",
    title: "Chân váy bút chì The Office",
    price: 459000,
    image: images.look3,
    hoverImage: images.set,
    collection: "Chân váy",
    season: "winter",
    badge: "Bestseller",
    description: "Chân váy bút chì cạp cao, tôn dáng nhưng vẫn thoải mái khi di chuyển cả ngày.",
    details: details("Chân váy", "tuytsi co giãn nhẹ"),
    fabric: "Tuytsi co giãn nhẹ",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Đen", "Xám ghi"],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: variants("Đen", "Xám ghi", images.look3, images.set),
  },
  {
    id: "4",
    title: "Váy midi cổ vuông L'Amour",
    price: 699000,
    originalPrice: 820000,
    image: images.dress,
    hoverImage: images.look4,
    collection: "Váy",
    season: "summer",
    badge: "Sale",
    description: "Váy midi cổ vuông, chiết eo nhẹ, đủ chỉn chu cho công sở và đủ mềm mại cho buổi hẹn tối.",
    details: details("Váy", "cotton pha rayon thoáng mát"),
    fabric: "Cotton pha rayon thoáng mát",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Hồng đất", "Đen"],
    sizes: ["S", "M", "L"],
    variants: variants("Hồng đất", "Đen", images.dress, images.look4),
  },
  {
    id: "5",
    title: "Quần tây ống đứng Bella",
    price: 549000,
    image: images.set,
    hoverImage: images.look5,
    collection: "Quần tây",
    season: "winter",
    badge: "Hàng mới",
    description: "Quần tây ống đứng lưng cao, ly trước tinh tế, dễ phối áo sơ mi và blazer.",
    details: details("Quần tây", "tuytsi mềm, đứng phom"),
    fabric: "Tuytsi mềm, đứng phom",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Đen", "Nâu mocha"],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: variants("Đen", "Nâu mocha", images.set, images.look5),
  },
  {
    id: "6",
    title: "Blazer linen Muse Tailored",
    price: 899000,
    image: images.blazer,
    hoverImage: images.look6,
    collection: "Blazer",
    season: "winter",
    badge: "Bestseller",
    description: "Blazer phom suông nhẹ, vai mềm và đường cắt tối giản cho vẻ ngoài chuyên nghiệp.",
    details: details("Blazer", "linen pha viscose có lót mỏng"),
    fabric: "Linen pha viscose có lót mỏng",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Be", "Xanh navy"],
    sizes: ["S", "M", "L", "XL"],
    variants: variants("Be", "Xanh navy", images.blazer, images.look6),
  },
  {
    id: "7",
    title: "Set áo vest và chân váy Soft Power",
    price: 990000,
    originalPrice: 1150000,
    image: images.look4,
    hoverImage: images.look3,
    collection: "Set đồ",
    season: "winter",
    badge: "Sale",
    description: "Set đồng bộ gồm áo vest ngắn và chân váy, dành cho những ngày cần xuất hiện thật gọn gàng.",
    details: details("Set đồ", "tuytsi cao cấp, ít nhăn"),
    fabric: "Tuytsi cao cấp, ít nhăn",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Xám ghi", "Đen"],
    sizes: ["S", "M", "L"],
    variants: variants("Xám ghi", "Đen", images.look4, images.look3),
  },
  {
    id: "8",
    title: "Túi mini Muse Workday",
    price: 359000,
    image: images.bag,
    hoverImage: images.look1,
    collection: "Phụ kiện",
    season: "summer",
    badge: "Bestseller",
    description: "Túi mini phom hộp, đủ chỗ cho điện thoại, ví nhỏ và son môi khi đi làm.",
    details: details("Phụ kiện", "da PU vân mịn"),
    fabric: "Da PU vân mịn",
    packaging: "Gói trong hộp Soft Muse kèm túi vải bảo quản.",
    colors: ["Đen", "Be"],
    sizes: ["F"],
    variants: variants("Đen", "Be", images.bag, images.look1),
  },
  {
    id: "9",
    title: "Áo sơ mi tay lỡ Monday",
    price: 329000,
    image: images.look2,
    hoverImage: images.blouse,
    collection: "Áo sơ mi",
    season: "summer",
    badge: "Giá tốt",
    description: "Áo sơ mi tay lỡ phom rộng vừa, dễ sơ vin và thoải mái cho ngày làm việc nhiều di chuyển.",
    details: details("Áo sơ mi", "cotton poplin mềm"),
    fabric: "Cotton poplin mềm",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Trắng kem", "Xanh sage"],
    sizes: ["S", "M", "L", "XL"],
    variants: variants("Trắng kem", "Xanh sage", images.look2, images.blouse),
  },
  {
    id: "10",
    title: "Đầm sơ mi Everyday Muse",
    price: 629000,
    image: images.look5,
    hoverImage: images.dress,
    collection: "Váy",
    season: "summer",
    badge: "Hàng mới",
    description: "Đầm sơ mi thắt eo nhẹ, kín đáo, hiện đại và hợp nhiều môi trường công sở.",
    details: details("Váy", "cotton pha spandex"),
    fabric: "Cotton pha spandex",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Be", "Xanh navy"],
    sizes: ["S", "M", "L", "XL"],
    variants: variants("Be", "Xanh navy", images.look5, images.dress),
  },
  {
    id: "11",
    title: "Áo knit cổ tim Calm",
    price: 399000,
    image: images.look6,
    hoverImage: images.blazer,
    collection: "Áo kiểu",
    season: "winter",
    badge: "Hàng mới",
    description: "Áo knit cổ tim mỏng, mềm, phối đẹp cùng quần tây hoặc chân váy trong thời tiết mát.",
    details: details("Áo kiểu", "len dệt mịn pha viscose"),
    fabric: "Len dệt mịn pha viscose",
    packaging: "Gói trong túi giấy Soft Muse kèm thẻ cảm ơn và hướng dẫn bảo quản.",
    colors: ["Nâu mocha", "Trắng kem"],
    sizes: ["S", "M", "L"],
    variants: variants("Nâu mocha", "Trắng kem", images.look6, images.blazer),
  },
  {
    id: "12",
    title: "Khăn lụa nơ cổ Muse Ribbon",
    price: 219000,
    originalPrice: 279000,
    image: images.accessory,
    hoverImage: images.bag,
    collection: "Phụ kiện",
    season: "summer",
    badge: "Sale",
    description: "Khăn lụa bản nhỏ dùng thắt cổ, buộc tóc hoặc trang trí túi xách.",
    details: details("Phụ kiện", "lụa satin mềm"),
    fabric: "Lụa satin mềm",
    packaging: "Gói trong phong bì Soft Muse kèm hướng dẫn phối đồ.",
    colors: ["Hồng đất", "Be"],
    sizes: ["F"],
    variants: variants("Hồng đất", "Be", images.accessory, images.bag),
  },
];
