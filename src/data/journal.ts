export interface JournalArticle {
 slug: string;
 title: string;
 excerpt: string;
 content: string; // Markdown or simple HTML strings for now
 category: string;
 publishDate: string;
 isoDate: string;
 readTime: string;
 image: string;
}

export const journalCategories = [
 "Thời trang",
 "",
 "",
 "Mùa",
 "Thanh lịch"
];

export const mockArticles: JournalArticle[] = [
 {
 slug: "fashion-colors-summer-2026",
 title: "Màu sắc thời trang mùa hè 2026",
 excerpt: "Màu sắc thời trang mùa hè này, couture.",
 content: "Mùa hè màu sắc từcao cấp.. <br/><br/> ĐồngTrắng Ngà. trong hộp AURA, nàyMàu sắc không với.",
 category: "Mùa",
 publishDate: "20 2026",
 isoDate: "2026-05-20T10:00:00Z",
 readTime: "4 ",
 image: "/images/campaign/campaign_2.png"
 },
 {
 slug: "how-to-choose-perfect-look-every-occasion",
 title: "",
 excerpt: "trong.",
 content: "Thanh lịch trong..<br/><br/>, từ từ linen cao cấp.,lụa không.",
 category: "",
 publishDate: "15 2026",
 isoDate: "2026-05-15T10:00:00Z",
 readTime: "5 ",
 image: "/images/campaign/campaign_3.png"
 },
 {
 slug: "luxury-fabrics-guide",
 title: "cao cấp",
 excerpt: "trênlụa,linen,Bảo quản.",
 content: "từ.linen,lụa cao cấp.. <br/><br/> Bảo quản : trên.",
 category: "",
 publishDate: "10 2026",
 isoDate: "2026-05-10T10:00:00Z",
 readTime: "6 ",
 image: "/images/flatlay/flatlay_1.png"
 },
 {
 slug: "secrets-of-quiet-luxury-styling",
 title: "",
 excerpt: "(Quiet Luxury), ...từLogo؟",
 content: "trênmay đo từLogo..<br/><br/> trongcashmere,Đen. này không.",
 category: "Thanh lịch",
 publishDate: "5 2026",
 isoDate: "2026-05-05T10:00:00Z",
 readTime: "3 ",
 image: "/images/detail/detail_fabric.png"
 },
 {
 slug: "building-elegant-wardrobe",
 title: "",
 excerpt: "từ không, đếncouture trong tất cả.",
 content: "không, này trên..<br/><br/> Màu sắc. vàVáy từcao cấp.",
 category: "Thời trang",
 publishDate: "1 2026",
 isoDate: "2026-05-01T10:00:00Z",
 readTime: "5 ",
 image: "/images/lifestyle/lifestyle_interior.png"
 }
];
