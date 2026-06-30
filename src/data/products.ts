export interface ProductColorVariant {
  color: string;
  value: string;
  images: string[];
}

export type ProductStockStatus = "in_stock" | "low_stock" | "out_of_stock";

/**
 * Authoring-seed shape (flat). This is NOT the runtime product model — it exists
 * only so the catalog seed below can be written in the storefront's original
 * format. The single canonical `Product` interface lives in
 * `src/data/mock/products.ts`; `seedToProduct` maps this shape onto it once.
 */
export interface StorefrontSeedInput {
  id: string;
  title: string;
  price: number;
  /** Pre-discount price. When set and greater than `price`, the card shows a discount badge and a struck-through original price. */
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  collection: string;
  season: "summer" | "winter";
  badge?: string;
  /** Defaults to "in_stock" when omitted. */
  stockStatus?: ProductStockStatus;
  description: string;
  details: string[];
  fabric: string;
  packaging: string;
  colors?: string[];
  sizes?: string[];
  variants?: ProductColorVariant[];
}

/**
 * Authoring seed for the unified product catalog. This is NOT a live catalog and
 * must NOT be imported by storefront pages/components — they read the single
 * source of truth via `src/lib/services/storefront/storefront-product.service.ts`.
 * Only `src/data/mock/products.ts` consumes this seed (once, at catalog init) to
 * build the canonical rich `Product[]`.
 */
export const storefrontSeed: StorefrontSeedInput[] = [
  {
    "id": "1",
    "title": "تيشيرت AURA من القطن العضوي الفاخر — صيف ٢٠٢٧",
    "price": 1200,
    "originalPrice": 1450,
    "image": "/images/campaign/campaign_2.png",
    "hoverImage": "/images/campaign/campaign_5.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "تيشيرت كلاسيكي فاخر من كولكشن صيف ٢٠٢٧. منسوج من القطن العضوي المصري 100% لتأمين أقصى درجات النعومة والانتعاش اليومي. قصة هندسية مريحة مع تفاصيل درزات مخفية عند الياقة والأطراف.",
    "details": [
      "المادة: قطن مصري نقي طويل التيلة 100%",
      "القصة: قصة كلاسيكية مريحة بياقة دائرية محبوكة",
      "التفاصيل: درزات جانبية مخفية وتطريز ناعم بشعار أورا",
      "الصنع: خياطة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: غسيل بماء بارد ومنظف لطيف. تجفيف في الظل."
    ],
    "fabric": "قطن مصري نقي 100% ناعم ومعالج ضد الانكماش.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_5.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/campaign/campaign_2.png"
        ]
      }
    ]
  },
  {
    "id": "2",
    "title": "تيشيرت بياقة دائرية وقصة هندسية — صيف ٢٠٢٧",
    "price": 1150,
    "image": "/images/products/product_silk_blouse.png",
    "hoverImage": "/images/flatlay/flatlay_2.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "تيشيرت كلاسيكي فاخر من كولكشن صيف ٢٠٢٧. منسوج من القطن العضوي المصري 100% لتأمين أقصى درجات النعومة والانتعاش اليومي. قصة هندسية مريحة مع تفاصيل درزات مخفية عند الياقة والأطراف.",
    "details": [
      "المادة: قطن مصري نقي طويل التيلة 100%",
      "القصة: قصة كلاسيكية مريحة بياقة دائرية محبوكة",
      "التفاصيل: درزات جانبية مخفية وتطريز ناعم بشعار أورا",
      "الصنع: خياطة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: غسيل بماء بارد ومنظف لطيف. تجفيف في الظل."
    ],
    "fabric": "قطن مصري نقي 100% ناعم ومعالج ضد الانكماش.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/flatlay/flatlay_2.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/products/product_silk_blouse.png"
        ]
      }
    ]
  },
  {
    "id": "3",
    "title": "تيشيرت واسع الأكمام من القطن المصري — صيف ٢٠٢٧",
    "price": 1250,
    "originalPrice": 1550,
    "image": "/images/campaign/campaign_4.png",
    "hoverImage": "/images/products/product_evening_gown.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "تيشيرت كلاسيكي فاخر من كولكشن صيف ٢٠٢٧. منسوج من القطن العضوي المصري 100% لتأمين أقصى درجات النعومة والانتعاش اليومي. قصة هندسية مريحة مع تفاصيل درزات مخفية عند الياقة والأطراف.",
    "details": [
      "المادة: قطن مصري نقي طويل التيلة 100%",
      "القصة: قصة كلاسيكية مريحة بياقة دائرية محبوكة",
      "التفاصيل: درزات جانبية مخفية وتطريز ناعم بشعار أورا",
      "الصنع: خياطة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: غسيل بماء بارد ومنظف لطيف. تجفيف في الظل."
    ],
    "fabric": "قطن مصري نقي 100% ناعم ومعالج ضد الانكماش.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/products/product_evening_gown.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_2.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_4.png"
        ]
      }
    ]
  },
  {
    "id": "4",
    "title": "تيشيرت أورا الكلاسيكي المضلع — صيف ٢٠٢٧",
    "price": 1100,
    "image": "/images/campaign/campaign_5.png",
    "hoverImage": "/images/products/product_linen_set.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "تيشيرت كلاسيكي فاخر من كولكشن صيف ٢٠٢٧. منسوج من القطن العضوي المصري 100% لتأمين أقصى درجات النعومة والانتعاش اليومي. قصة هندسية مريحة مع تفاصيل درزات مخفية عند الياقة والأطراف.",
    "details": [
      "المادة: قطن مصري نقي طويل التيلة 100%",
      "القصة: قصة كلاسيكية مريحة بياقة دائرية محبوكة",
      "التفاصيل: درزات جانبية مخفية وتطريز ناعم بشعار أورا",
      "الصنع: خياطة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: غسيل بماء بارد ومنظف لطيف. تجفيف في الظل."
    ],
    "fabric": "قطن مصري نقي 100% ناعم ومعالج ضد الانكماش.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/products/product_silk_blouse.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/campaign/campaign_5.png"
        ]
      }
    ]
  },
  {
    "id": "5",
    "title": "قميص Linen الكلاسيكي الفضفاض — صيف ٢٠٢٧",
    "price": 1850,
    "stockStatus": "low_stock",
    "image": "/images/flatlay/flatlay_2.png",
    "hoverImage": "/images/campaign/campaign_1.png",
    "collection": "قمصان",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "قميص كلاسيكي فضفاض من خيوط الكتان أو القطن الممتاز لكولكشن صيف ٢٠٢٧. تصميم يدمج بين الفخامة والعملية اليومية بياقة عريضة وأزرار صدفية طبيعية ممتازة.",
    "details": [
      "المادة: كتان بلجيكي معالج بنعومة الكشمير 100% (أو قطن معالج)",
      "القصة: قصة واسعة مريحة بأكمام طويلة قابلة للطي",
      "التفاصيل: ياقة عريضة كلاسيكية وأزرار صدفية طبيعية",
      "الصنع: صنع يدوي بأيدي خياطي دار أورا بالمهندسين",
      "العناية: غسيل يدوي بارد أو تنظيف جاف لطيف."
    ],
    "fabric": "كتان بلجيكي نقي معالج للحصول على سقوط مثالي وملمس مريح.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/flatlay/flatlay_2.png"
        ]
      }
    ]
  },
  {
    "id": "6",
    "title": "قميص صيفي من الكتان الطبيعي بأزرار صدفية — صيف ٢٠٢٧",
    "price": 1950,
    "image": "/images/products/product_evening_gown.png",
    "hoverImage": "/images/campaign/campaign_2.png",
    "collection": "قمصان",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "قميص كلاسيكي فضفاض من خيوط الكتان أو القطن الممتاز لكولكشن صيف ٢٠٢٧. تصميم يدمج بين الفخامة والعملية اليومية بياقة عريضة وأزرار صدفية طبيعية ممتازة.",
    "details": [
      "المادة: كتان بلجيكي معالج بنعومة الكشمير 100% (أو قطن معالج)",
      "القصة: قصة واسعة مريحة بأكمام طويلة قابلة للطي",
      "التفاصيل: ياقة عريضة كلاسيكية وأزرار صدفية طبيعية",
      "الصنع: صنع يدوي بأيدي خياطي دار أورا بالمهندسين",
      "العناية: غسيل يدوي بارد أو تنظيف جاف لطيف."
    ],
    "fabric": "كتان بلجيكي نقي معالج للحصول على سقوط مثالي وملمس مريح.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_2.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_5.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_evening_gown.png"
        ]
      }
    ]
  },
  {
    "id": "7",
    "title": "قميص قطن إيطالي بياقة كلاسيكية واسعة — صيف ٢٠٢٧",
    "price": 1750,
    "originalPrice": 2050,
    "image": "/images/products/product_linen_set.png",
    "hoverImage": "/images/products/product_silk_blouse.png",
    "collection": "قمصان",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "قميص كلاسيكي فضفاض من خيوط الكتان أو القطن الممتاز لكولكشن صيف ٢٠٢٧. تصميم يدمج بين الفخامة والعملية اليومية بياقة عريضة وأزرار صدفية طبيعية ممتازة.",
    "details": [
      "المادة: كتان بلجيكي معالج بنعومة الكشمير 100% (أو قطن معالج)",
      "القصة: قصة واسعة مريحة بأكمام طويلة قابلة للطي",
      "التفاصيل: ياقة عريضة كلاسيكية وأزرار صدفية طبيعية",
      "الصنع: صنع يدوي بأيدي خياطي دار أورا بالمهندسين",
      "العناية: غسيل يدوي بارد أو تنظيف جاف لطيف."
    ],
    "fabric": "كتان بلجيكي نقي معالج للحصول على سقوط مثالي وملمس مريح.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/products/product_silk_blouse.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/flatlay/flatlay_2.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/products/product_linen_set.png"
        ]
      }
    ]
  },
  {
    "id": "8",
    "title": "قميص Aura Noir من الحرير الشفاف — صيف ٢٠٢٧",
    "price": 2100,
    "image": "/images/campaign/campaign_1.png",
    "hoverImage": "/images/campaign/campaign_4.png",
    "collection": "قمصان",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "قميص كلاسيكي فضفاض من خيوط الكتان أو القطن الممتاز لكولكشن صيف ٢٠٢٧. تصميم يدمج بين الفخامة والعملية اليومية بياقة عريضة وأزرار صدفية طبيعية ممتازة.",
    "details": [
      "المادة: كتان بلجيكي معالج بنعومة الكشمير 100% (أو قطن معالج)",
      "القصة: قصة واسعة مريحة بأكمام طويلة قابلة للطي",
      "التفاصيل: ياقة عريضة كلاسيكية وأزرار صدفية طبيعية",
      "الصنع: صنع يدوي بأيدي خياطي دار أورا بالمهندسين",
      "العناية: غسيل يدوي بارد أو تنظيف جاف لطيف."
    ],
    "fabric": "كتان بلجيكي نقي معالج للحصول على سقوط مثالي وملمس مريح.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/products/product_evening_gown.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_1.png"
        ]
      }
    ]
  },
  {
    "id": "9",
    "title": "بلوزة Celeste من الحرير الطبيعي الملوكي — صيف ٢٠٢٧",
    "price": 2400,
    "stockStatus": "out_of_stock",
    "image": "/images/campaign/campaign_2.png",
    "hoverImage": "/images/campaign/campaign_5.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "بلوزة أنيقة من الحرير أو الساتان لكولكشن صيف ٢٠٢٧. تصميم مترهل يبرز تفاصيل الأنوثة برقة مع تطريز برونزي يدوي ناعم عند الياقة الملوكية الكلاسيكية.",
    "details": [
      "المادة: حرير طبيعي 100% ذو لمعان مطفأ فاخر",
      "القصة: قصة منسدلة بياقة مرتفعة وأكمام واسعة تنتهي بأساور مطرزة",
      "التفاصيل: تطريز يدوي ناعم بخيوط البرونز والذهب",
      "الصنع: صناعة يدوية فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي على البارد مغلّفاً بقطعة قطنية."
    ],
    "fabric": "حرير طبيعي 100% ناعم على البشرة وذو مظهر منسدل راقٍ.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_5.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/campaign/campaign_2.png"
        ]
      }
    ]
  },
  {
    "id": "10",
    "title": "بلوزة انسيابية بكسرات ناعمة من الساتان — صيف ٢٠٢٧",
    "price": 2250,
    "image": "/images/products/product_silk_blouse.png",
    "hoverImage": "/images/flatlay/flatlay_2.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "بلوزة أنيقة من الحرير أو الساتان لكولكشن صيف ٢٠٢٧. تصميم مترهل يبرز تفاصيل الأنوثة برقة مع تطريز برونزي يدوي ناعم عند الياقة الملوكية الكلاسيكية.",
    "details": [
      "المادة: حرير طبيعي 100% ذو لمعان مطفأ فاخر",
      "القصة: قصة منسدلة بياقة مرتفعة وأكمام واسعة تنتهي بأساور مطرزة",
      "التفاصيل: تطريز يدوي ناعم بخيوط البرونز والذهب",
      "الصنع: صناعة يدوية فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي على البارد مغلّفاً بقطعة قطنية."
    ],
    "fabric": "حرير طبيعي 100% ناعم على البشرة وذو مظهر منسدل راقٍ.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/flatlay/flatlay_2.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/products/product_silk_blouse.png"
        ]
      }
    ]
  },
  {
    "id": "11",
    "title": "بلوزة بأكمام منفوخة وتطريز يدوي ذهبي — صيف ٢٠٢٧",
    "price": 2500,
    "image": "/images/campaign/campaign_4.png",
    "hoverImage": "/images/products/product_evening_gown.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "بلوزة أنيقة من الحرير أو الساتان لكولكشن صيف ٢٠٢٧. تصميم مترهل يبرز تفاصيل الأنوثة برقة مع تطريز برونزي يدوي ناعم عند الياقة الملوكية الكلاسيكية.",
    "details": [
      "المادة: حرير طبيعي 100% ذو لمعان مطفأ فاخر",
      "القصة: قصة منسدلة بياقة مرتفعة وأكمام واسعة تنتهي بأساور مطرزة",
      "التفاصيل: تطريز يدوي ناعم بخيوط البرونز والذهب",
      "الصنع: صناعة يدوية فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي على البارد مغلّفاً بقطعة قطنية."
    ],
    "fabric": "حرير طبيعي 100% ناعم على البشرة وذو مظهر منسدل راقٍ.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/products/product_evening_gown.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_2.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_4.png"
        ]
      }
    ]
  },
  {
    "id": "12",
    "title": "بلوزة حريرية مطرزة بدون أكمام — صيف ٢٠٢٧",
    "price": 1999,
    "image": "/images/campaign/campaign_5.png",
    "hoverImage": "/images/products/product_linen_set.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "بلوزة أنيقة من الحرير أو الساتان لكولكشن صيف ٢٠٢٧. تصميم مترهل يبرز تفاصيل الأنوثة برقة مع تطريز برونزي يدوي ناعم عند الياقة الملوكية الكلاسيكية.",
    "details": [
      "المادة: حرير طبيعي 100% ذو لمعان مطفأ فاخر",
      "القصة: قصة منسدلة بياقة مرتفعة وأكمام واسعة تنتهي بأساور مطرزة",
      "التفاصيل: تطريز يدوي ناعم بخيوط البرونز والذهب",
      "الصنع: صناعة يدوية فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي على البارد مغلّفاً بقطعة قطنية."
    ],
    "fabric": "حرير طبيعي 100% ناعم على البشرة وذو مظهر منسدل راقٍ.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/products/product_silk_blouse.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/campaign/campaign_5.png"
        ]
      }
    ]
  },
  {
    "id": "13",
    "title": "توب صيفي ناعم بفتحة ظهر هندسية — صيف ٢٠٢٧",
    "price": 1100,
    "image": "/images/flatlay/flatlay_2.png",
    "hoverImage": "/images/campaign/campaign_1.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "توب صيفي خفيف منسوج من ألياف مسامية ناعمة. قطعة أساسية مريحة لتنسيقات الصيف المشرقة وأسفل السترات المفتوحة.",
    "details": [
      "المادة: مزيج حرير وفيسكوز معالج 100%",
      "القصة: قصة منسدلة بدون أكمام بياقة دائرية ناعمة",
      "التفاصيل: حاشية يدوية دقيقة وقصة هندسية مريحة",
      "الصنع: خياطة وتجهيز كوتور بأتيلييه الجيزة",
      "العناية: غسيل يدوي لطيف بماء بارد. كوي بخار خفيف جداً."
    ],
    "fabric": "مزيج حريري ناعم وخفيف الوزن يوفر انتعاشاً كاملاً.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/flatlay/flatlay_2.png"
        ]
      }
    ]
  },
  {
    "id": "14",
    "title": "توب مضلع بدون أكمام من خيوط الفيسكوز — صيف ٢٠٢٧",
    "price": 1050,
    "image": "/images/products/product_evening_gown.png",
    "hoverImage": "/images/campaign/campaign_2.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "توب صيفي خفيف منسوج من ألياف مسامية ناعمة. قطعة أساسية مريحة لتنسيقات الصيف المشرقة وأسفل السترات المفتوحة.",
    "details": [
      "المادة: مزيج حرير وفيسكوز معالج 100%",
      "القصة: قصة منسدلة بدون أكمام بياقة دائرية ناعمة",
      "التفاصيل: حاشية يدوية دقيقة وقصة هندسية مريحة",
      "الصنع: خياطة وتجهيز كوتور بأتيلييه الجيزة",
      "العناية: غسيل يدوي لطيف بماء بارد. كوي بخار خفيف جداً."
    ],
    "fabric": "مزيج حريري ناعم وخفيف الوزن يوفر انتعاشاً كاملاً.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_2.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_5.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_evening_gown.png"
        ]
      }
    ]
  },
  {
    "id": "15",
    "title": "توب كروب كلاسيكي للشاطئ — صيف ٢٠٢٧",
    "price": 990,
    "image": "/images/products/product_linen_set.png",
    "hoverImage": "/images/products/product_silk_blouse.png",
    "collection": "بلوزات",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "توب صيفي خفيف منسوج من ألياف مسامية ناعمة. قطعة أساسية مريحة لتنسيقات الصيف المشرقة وأسفل السترات المفتوحة.",
    "details": [
      "المادة: مزيج حرير وفيسكوز معالج 100%",
      "القصة: قصة منسدلة بدون أكمام بياقة دائرية ناعمة",
      "التفاصيل: حاشية يدوية دقيقة وقصة هندسية مريحة",
      "الصنع: خياطة وتجهيز كوتور بأتيلييه الجيزة",
      "العناية: غسيل يدوي لطيف بماء بارد. كوي بخار خفيف جداً."
    ],
    "fabric": "مزيج حريري ناعم وخفيف الوزن يوفر انتعاشاً كاملاً.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/products/product_silk_blouse.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/flatlay/flatlay_2.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/products/product_linen_set.png"
        ]
      }
    ]
  },
  {
    "id": "16",
    "title": "بنطلون Horizon كريب بخصر عريض ومشدود — صيف ٢٠٢٧",
    "price": 1899,
    "image": "/images/campaign/campaign_1.png",
    "hoverImage": "/images/campaign/campaign_4.png",
    "collection": "بنطلونات",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "بنطلون صيفي بقصة أرجل واسعة وخصر مرتفع مبطن. تصميم مريح يسقط باستقامة تامة مصنوع من الكتان أو الكريب الخفيف لتأمين إطلالة باردة وأنيقة.",
    "details": [
      "المادة: كتان بلجيكي طبيعي 100% (أو كريب خفيف)",
      "القصة: خصر مرتفع مع قصة أرجل مستقيمة واسعة",
      "التفاصيل: حزام خصر مبطن وجيوب جانبية متداخلة دقيقة",
      "الصنع: حياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف لطيف أو غسيل يدوي بماء بارد."
    ],
    "fabric": "كتان بلجيكي طبيعي ذو جودة استثنائية وسقوط مثالي.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/products/product_evening_gown.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_1.png"
        ]
      }
    ]
  },
  {
    "id": "17",
    "title": "بنطلون كتان بلجيكي واسع الساق — صيف ٢٠٢٧",
    "price": 1799,
    "image": "/images/campaign/campaign_2.png",
    "hoverImage": "/images/campaign/campaign_5.png",
    "collection": "بنطلونات",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "بنطلون صيفي بقصة أرجل واسعة وخصر مرتفع مبطن. تصميم مريح يسقط باستقامة تامة مصنوع من الكتان أو الكريب الخفيف لتأمين إطلالة باردة وأنيقة.",
    "details": [
      "المادة: كتان بلجيكي طبيعي 100% (أو كريب خفيف)",
      "القصة: خصر مرتفع مع قصة أرجل مستقيمة واسعة",
      "التفاصيل: حزام خصر مبطن وجيوب جانبية متداخلة دقيقة",
      "الصنع: حياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف لطيف أو غسيل يدوي بماء بارد."
    ],
    "fabric": "كتان بلجيكي طبيعي ذو جودة استثنائية وسقوط مثالي.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_5.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/campaign/campaign_2.png"
        ]
      }
    ]
  },
  {
    "id": "18",
    "title": "بنطلون صيفي مستقيم من القطن الخفيف — صيف ٢٠٢٧",
    "price": 1650,
    "image": "/images/products/product_silk_blouse.png",
    "hoverImage": "/images/flatlay/flatlay_2.png",
    "collection": "بنطلونات",
    "season": "summer",
    "badge": "إصدار خاص",
    "description": "بنطلون صيفي بقصة أرجل واسعة وخصر مرتفع مبطن. تصميم مريح يسقط باستقامة تامة مصنوع من الكتان أو الكريب الخفيف لتأمين إطلالة باردة وأنيقة.",
    "details": [
      "المادة: كتان بلجيكي طبيعي 100% (أو كريب خفيف)",
      "القصة: خصر مرتفع مع قصة أرجل مستقيمة واسعة",
      "التفاصيل: حزام خصر مبطن وجيوب جانبية متداخلة دقيقة",
      "الصنع: حياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف لطيف أو غسيل يدوي بماء بارد."
    ],
    "fabric": "كتان بلجيكي طبيعي ذو جودة استثنائية وسقوط مثالي.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/flatlay/flatlay_2.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/flatlay/flatlay_2.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/products/product_silk_blouse.png"
        ]
      }
    ]
  },
  {
    "id": "19",
    "title": "فستان Soleil صيفي من القطن والكتان البلجيكي — صيف ٢٠٢٧",
    "price": 2999,
    "image": "/images/campaign/campaign_4.png",
    "hoverImage": "/images/products/product_evening_gown.png",
    "collection": "فساتين كاجوال",
    "season": "summer",
    "badge": "كولكشن ٢٠٢٧",
    "description": "فستان صيفي متوسط الطول بقصة منسدلة وتفاصيل أنثوية رقيقة. تصميم يوفر لكِ حرية الحركة والانتعاش في سهرات النهار والمساء الصيفية.",
    "details": [
      "المادة: مزيج قطن وكتان ناعم ومسامي 100%",
      "القصة: قصة ملتفة (Wrap) كلاسيكية بحزام جانبي قابل للتعديل",
      "التفاصيل: ياقة V انسيابية وأطراف سفلية واسعة تمنح حركة جميلة",
      "الصنع: صنع بكل فخر وحرفية في أتيلييه الجيزة، مصر",
      "العناية: غسيل يدوي بارد. تجفيف طبيعي وكوي على حرارة متوسطة."
    ],
    "fabric": "مزيج قطن طبيعي وكتان ناعم ومعالج لتقليل التجعد.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/products/product_evening_gown.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/products/product_evening_gown.png",
          "/images/campaign/campaign_2.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_2.png",
          "/images/campaign/campaign_4.png"
        ]
      }
    ]
  },
  {
    "id": "20",
    "title": "فستان صيفي ملتف حول الجسم بياقة V — صيف ٢٠٢٧",
    "price": 2850,
    "image": "/images/campaign/campaign_5.png",
    "hoverImage": "/images/products/product_linen_set.png",
    "collection": "فساتين كاجوال",
    "season": "summer",
    "badge": "قطعة أساسية",
    "description": "فستان صيفي متوسط الطول بقصة منسدلة وتفاصيل أنثوية رقيقة. تصميم يوفر لكِ حرية الحركة والانتعاش في سهرات النهار والمساء الصيفية.",
    "details": [
      "المادة: مزيج قطن وكتان ناعم ومسامي 100%",
      "القصة: قصة ملتفة (Wrap) كلاسيكية بحزام جانبي قابل للتعديل",
      "التفاصيل: ياقة V انسيابية وأطراف سفلية واسعة تمنح حركة جميلة",
      "الصنع: صنع بكل فخر وحرفية في أتيلييه الجيزة، مصر",
      "العناية: غسيل يدوي بارد. تجفيف طبيعي وكوي على حرارة متوسطة."
    ],
    "fabric": "مزيج قطن طبيعي وكتان ناعم ومعالج لتقليل التجعد.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_5.png",
          "/images/products/product_linen_set.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/products/product_linen_set.png",
          "/images/products/product_silk_blouse.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/products/product_silk_blouse.png",
          "/images/campaign/campaign_5.png"
        ]
      }
    ]
  },
  {
    "id": "21",
    "title": "معطف Étoile من الكشمير الإيطالي الفاخر — شتاء ٢٠٢٧",
    "price": 6500,
    "image": "/images/detail/detail_fabric.png",
    "hoverImage": "/images/lifestyle/lifestyle_interior.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "معطف شتوي فاخر مصنوع من الكشمير الخالص المنسوج بحرفية عالية من كولكشن شتاء ٢٠٢٧. يمنحكِ الهيبة والدفء الاستثنائي بوزنه الخفيف ومظهره الملكي.",
    "details": [
      "المادة: كشمير طبيعي نقي 100% ثقيل الوزن وفائق النعومة",
      "القصة: تصميم طويل يمنحكِ الهيبة والدفء مع حزام خصر عريض",
      "التفاصيل: بطانة حريرية ناعمة وجيوب جانبية دافئة مبطنة بالصوف",
      "الصنع: حياكة كوتور فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف حصرياً بمراكز متخصصة. يُحفظ معلقاً على علاقة عريضة."
    ],
    "fabric": "كشمير إيطالي نقي 100% يوفر دفئاً فائقاً بوزن خفيف.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/detail/detail_fabric.png"
        ]
      }
    ]
  },
  {
    "id": "22",
    "title": "معطف ترنش كلاسيكي طويل مقاوم للمطر — شتاء ٢٠٢٧",
    "price": 5900,
    "image": "/images/campaign/campaign_1.png",
    "hoverImage": "/images/campaign/campaign_3.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "معطف شتوي فاخر مصنوع من الكشمير الخالص المنسوج بحرفية عالية من كولكشن شتاء ٢٠٢٧. يمنحكِ الهيبة والدفء الاستثنائي بوزنه الخفيف ومظهره الملكي.",
    "details": [
      "المادة: كشمير طبيعي نقي 100% ثقيل الوزن وفائق النعومة",
      "القصة: تصميم طويل يمنحكِ الهيبة والدفء مع حزام خصر عريض",
      "التفاصيل: بطانة حريرية ناعمة وجيوب جانبية دافئة مبطنة بالصوف",
      "الصنع: حياكة كوتور فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف حصرياً بمراكز متخصصة. يُحفظ معلقاً على علاقة عريضة."
    ],
    "fabric": "كشمير إيطالي نقي 100% يوفر دفئاً فائقاً بوزن خفيف.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_3.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/products/product_winter_coat.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_1.png"
        ]
      }
    ]
  },
  {
    "id": "23",
    "title": "معطف صوفي طويل مزدوج الصدر بحزام — شتاء ٢٠٢٧",
    "price": 6200,
    "image": "/images/campaign/campaign_6.png",
    "hoverImage": "/images/flatlay/flatlay_1.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "معطف شتوي فاخر مصنوع من الكشمير الخالص المنسوج بحرفية عالية من كولكشن شتاء ٢٠٢٧. يمنحكِ الهيبة والدفء الاستثنائي بوزنه الخفيف ومظهره الملكي.",
    "details": [
      "المادة: كشمير طبيعي نقي 100% ثقيل الوزن وفائق النعومة",
      "القصة: تصميم طويل يمنحكِ الهيبة والدفء مع حزام خصر عريض",
      "التفاصيل: بطانة حريرية ناعمة وجيوب جانبية دافئة مبطنة بالصوف",
      "الصنع: حياكة كوتور فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف حصرياً بمراكز متخصصة. يُحفظ معلقاً على علاقة عريضة."
    ],
    "fabric": "كشمير إيطالي نقي 100% يوفر دفئاً فائقاً بوزن خفيف.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/flatlay/flatlay_1.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/detail/detail_fabric.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/campaign/campaign_6.png"
        ]
      }
    ]
  },
  {
    "id": "24",
    "title": "معطف ميرينو فاخر ببطانة حريرية — شتاء ٢٠٢٧",
    "price": 6800,
    "image": "/images/lifestyle/lifestyle_interior.png",
    "hoverImage": "/images/campaign/campaign_4.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "معطف شتوي فاخر مصنوع من الكشمير الخالص المنسوج بحرفية عالية من كولكشن شتاء ٢٠٢٧. يمنحكِ الهيبة والدفء الاستثنائي بوزنه الخفيف ومظهره الملكي.",
    "details": [
      "المادة: كشمير طبيعي نقي 100% ثقيل الوزن وفائق النعومة",
      "القصة: تصميم طويل يمنحكِ الهيبة والدفء مع حزام خصر عريض",
      "التفاصيل: بطانة حريرية ناعمة وجيوب جانبية دافئة مبطنة بالصوف",
      "الصنع: حياكة كوتور فاخرة بأتيلييه الجيزة",
      "العناية: تنظيف جاف حصرياً بمراكز متخصصة. يُحفظ معلقاً على علاقة عريضة."
    ],
    "fabric": "كشمير إيطالي نقي 100% يوفر دفئاً فائقاً بوزن خفيف.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      }
    ]
  },
  {
    "id": "25",
    "title": "جاكيت صوف مبطن بالريش الطبيعي — شتاء ٢٠٢٧",
    "price": 4900,
    "image": "/images/campaign/campaign_3.png",
    "hoverImage": "/images/products/product_winter_coat.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "جاكيت شتوي بتصميم عصري وخامات معالجة ضد الرياح والمطر. يجمع بين الفخامة الحضرية والدفء الاستثنائي لحمايتكِ طوال الفصل البارد.",
    "details": [
      "المادة: صوف ميرينو 80% وألياف معزولة 20% مقاومة للماء والثلج",
      "القصة: قصة منتفخة هندسية متوسطة الطول بياقة عالية وغطاء رأس مخفي",
      "التفاصيل: سحاب معدني متين مع أزرار كبس مخفية وجيوب بسحابات",
      "الصنع: تصميم وحياكة مشتركة يدوية في صالون أورا بالمهندسين",
      "العناية: تنظيف جاف لطيف بمراكز متخصصة بسترات الصوف الشتوية."
    ],
    "fabric": "صوف ميرينو معالج مع بطانة داخلية ناعمة عازلة للحرارة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/products/product_winter_coat.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_6.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/campaign/campaign_3.png"
        ]
      }
    ]
  },
  {
    "id": "26",
    "title": "جاكيت جلد غزال طبيعي مبطن بالصوف — شتاء ٢٠٢٧",
    "price": 7500,
    "image": "/images/flatlay/flatlay_1.png",
    "hoverImage": "/images/detail/detail_fabric.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "جاكيت شتوي بتصميم عصري وخامات معالجة ضد الرياح والمطر. يجمع بين الفخامة الحضرية والدفء الاستثنائي لحمايتكِ طوال الفصل البارد.",
    "details": [
      "المادة: صوف ميرينو 80% وألياف معزولة 20% مقاومة للماء والثلج",
      "القصة: قصة منتفخة هندسية متوسطة الطول بياقة عالية وغطاء رأس مخفي",
      "التفاصيل: سحاب معدني متين مع أزرار كبس مخفية وجيوب بسحابات",
      "الصنع: تصميم وحياكة مشتركة يدوية في صالون أورا بالمهندسين",
      "العناية: تنظيف جاف لطيف بمراكز متخصصة بسترات الصوف الشتوية."
    ],
    "fabric": "صوف ميرينو معالج مع بطانة داخلية ناعمة عازلة للحرارة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/detail/detail_fabric.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/flatlay/flatlay_1.png"
        ]
      }
    ]
  },
  {
    "id": "27",
    "title": "جاكيت صوف قصير بتصميم هندسي واسع — شتاء ٢٠٢٧",
    "price": 4200,
    "image": "/images/campaign/campaign_4.png",
    "hoverImage": "/images/campaign/campaign_1.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "جاكيت شتوي بتصميم عصري وخامات معالجة ضد الرياح والمطر. يجمع بين الفخامة الحضرية والدفء الاستثنائي لحمايتكِ طوال الفصل البارد.",
    "details": [
      "المادة: صوف ميرينو 80% وألياف معزولة 20% مقاومة للماء والثلج",
      "القصة: قصة منتفخة هندسية متوسطة الطول بياقة عالية وغطاء رأس مخفي",
      "التفاصيل: سحاب معدني متين مع أزرار كبس مخفية وجيوب بسحابات",
      "الصنع: تصميم وحياكة مشتركة يدوية في صالون أورا بالمهندسين",
      "العناية: تنظيف جاف لطيف بمراكز متخصصة بسترات الصوف الشتوية."
    ],
    "fabric": "صوف ميرينو معالج مع بطانة داخلية ناعمة عازلة للحرارة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_3.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/campaign/campaign_4.png"
        ]
      }
    ]
  },
  {
    "id": "28",
    "title": "جاكيت بومبر صوفي كلاسيكي دافئ — شتاء ٢٠٢٧",
    "price": 3999,
    "image": "/images/products/product_winter_coat.png",
    "hoverImage": "/images/campaign/campaign_6.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "جاكيت شتوي بتصميم عصري وخامات معالجة ضد الرياح والمطر. يجمع بين الفخامة الحضرية والدفء الاستثنائي لحمايتكِ طوال الفصل البارد.",
    "details": [
      "المادة: صوف ميرينو 80% وألياف معزولة 20% مقاومة للماء والثلج",
      "القصة: قصة منتفخة هندسية متوسطة الطول بياقة عالية وغطاء رأس مخفي",
      "التفاصيل: سحاب معدني متين مع أزرار كبس مخفية وجيوب بسحابات",
      "الصنع: تصميم وحياكة مشتركة يدوية في صالون أورا بالمهندسين",
      "العناية: تنظيف جاف لطيف بمراكز متخصصة بسترات الصوف الشتوية."
    ],
    "fabric": "صوف ميرينو معالج مع بطانة داخلية ناعمة عازلة للحرارة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_6.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/flatlay/flatlay_1.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/products/product_winter_coat.png"
        ]
      }
    ]
  },
  {
    "id": "29",
    "title": "كنزة Cable Knit من صوف الألبكا الدافئ — شتاء ٢٠٢٧",
    "price": 2450,
    "image": "/images/detail/detail_fabric.png",
    "hoverImage": "/images/lifestyle/lifestyle_interior.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "كنزة شتوية محبوكة بنقوش كلاسيكية دافئة من صوف الألبكا الفاخر. توفر دفئاً فائقاً ومظهراً ريفياً فاخراً في صالونات الشتاء.",
    "details": [
      "المادة: صوف ألبكا طبيعي نقي 100% ذو عزل حراري فائق",
      "القصة: قصة واسعة مريحة بياقة دائرية محبوكة وأكمام طويلة كلاسيكية",
      "التفاصيل: نقوش ضفائر هندسية (Cable Knit) متقنة بسقوط منسدل جميل",
      "الصنع: حياكة يدوية متكاملة بأيدي حرفيات دار أورا",
      "العناية: غسيل يدوي بماء بارد ومنظف صوف خاص. تجفيف مسطح."
    ],
    "fabric": "صوف ألبكا خام 100% فائق النعومة لا يسبب التحسس ويحفظ حرارة الجسم.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/detail/detail_fabric.png"
        ]
      }
    ]
  },
  {
    "id": "30",
    "title": "سترة Blazer صوفية مزدوجة الصدر — شتاء ٢٠٢٧",
    "price": 4200,
    "image": "/images/campaign/campaign_1.png",
    "hoverImage": "/images/campaign/campaign_3.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "كنزة شتوية محبوكة بنقوش كلاسيكية دافئة من صوف الألبكا الفاخر. توفر دفئاً فائقاً ومظهراً ريفياً فاخراً في صالونات الشتاء.",
    "details": [
      "المادة: صوف ألبكا طبيعي نقي 100% ذو عزل حراري فائق",
      "القصة: قصة واسعة مريحة بياقة دائرية محبوكة وأكمام طويلة كلاسيكية",
      "التفاصيل: نقوش ضفائر هندسية (Cable Knit) متقنة بسقوط منسدل جميل",
      "الصنع: حياكة يدوية متكاملة بأيدي حرفيات دار أورا",
      "العناية: غسيل يدوي بماء بارد ومنظف صوف خاص. تجفيف مسطح."
    ],
    "fabric": "صوف ألبكا خام 100% فائق النعومة لا يسبب التحسس ويحفظ حرارة الجسم.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_3.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/products/product_winter_coat.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_1.png"
        ]
      }
    ]
  },
  {
    "id": "31",
    "title": "كنزة ميرينو بياقة مرتفعة مضلعة — شتاء ٢٠٢٧",
    "price": 2100,
    "image": "/images/campaign/campaign_6.png",
    "hoverImage": "/images/flatlay/flatlay_1.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "كنزة شتوية محبوكة بنقوش كلاسيكية دافئة من صوف الألبكا الفاخر. توفر دفئاً فائقاً ومظهراً ريفياً فاخراً في صالونات الشتاء.",
    "details": [
      "المادة: صوف ألبكا طبيعي نقي 100% ذو عزل حراري فائق",
      "القصة: قصة واسعة مريحة بياقة دائرية محبوكة وأكمام طويلة كلاسيكية",
      "التفاصيل: نقوش ضفائر هندسية (Cable Knit) متقنة بسقوط منسدل جميل",
      "الصنع: حياكة يدوية متكاملة بأيدي حرفيات دار أورا",
      "العناية: غسيل يدوي بماء بارد ومنظف صوف خاص. تجفيف مسطح."
    ],
    "fabric": "صوف ألبكا خام 100% فائق النعومة لا يسبب التحسس ويحفظ حرارة الجسم.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/flatlay/flatlay_1.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/detail/detail_fabric.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/campaign/campaign_6.png"
        ]
      }
    ]
  },
  {
    "id": "32",
    "title": "كنزة صوفية ضخمة من الجاكار الهندسي — شتاء ٢٠٢٧",
    "price": 2600,
    "image": "/images/lifestyle/lifestyle_interior.png",
    "hoverImage": "/images/campaign/campaign_4.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "كنزة شتوية محبوكة بنقوش كلاسيكية دافئة من صوف الألبكا الفاخر. توفر دفئاً فائقاً ومظهراً ريفياً فاخراً في صالونات الشتاء.",
    "details": [
      "المادة: صوف ألبكا طبيعي نقي 100% ذو عزل حراري فائق",
      "القصة: قصة واسعة مريحة بياقة دائرية محبوكة وأكمام طويلة كلاسيكية",
      "التفاصيل: نقوش ضفائر هندسية (Cable Knit) متقنة بسقوط منسدل جميل",
      "الصنع: حياكة يدوية متكاملة بأيدي حرفيات دار أورا",
      "العناية: غسيل يدوي بماء بارد ومنظف صوف خاص. تجفيف مسطح."
    ],
    "fabric": "صوف ألبكا خام 100% فائق النعومة لا يسبب التحسس ويحفظ حرارة الجسم.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      }
    ]
  },
  {
    "id": "33",
    "title": "كارديجان طويل مفتوح من الكشمير والصوف — شتاء ٢٠٢٧",
    "price": 3650,
    "image": "/images/campaign/campaign_3.png",
    "hoverImage": "/images/products/product_winter_coat.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "كارديجان طويل مفتوح بدون أزرار منسوج من خيوط الكشمير والصوف الإيطالي الناعم. ينساب بنعومة بالغة ليمنحك الدفء والاسترخاء الفخم في إطلالاتكِ الشتوية.",
    "details": [
      "المادة: مزيج كشمير طبيعي 70% وصوف ناعم 30%",
      "القصة: قصة طويلة مفتوحة بياقة شال عريضة وجيوب جانبية مخفية واسعة",
      "التفاصيل: حواف مرنة محبوكة بدقة وحياكة جانبية معززة لمزيد من القوة",
      "الصنع: حياكة وتجهيز يدوي بأتيلييه المهندسين، الجيزة",
      "العناية: غسيل يدوي لطيف أو تنظيف جاف. تجفيف مسطح."
    ],
    "fabric": "مزيج كشمير وصوف طبيعي يمنح ملمساً حريرياً فائق الخفة والدفء.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/products/product_winter_coat.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_6.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/campaign/campaign_3.png"
        ]
      }
    ]
  },
  {
    "id": "34",
    "title": "كارديجان صوف قصير بكسرات وأزرار ذهبية — شتاء ٢٠٢٧",
    "price": 2999,
    "image": "/images/flatlay/flatlay_1.png",
    "hoverImage": "/images/detail/detail_fabric.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "كارديجان طويل مفتوح بدون أزرار منسوج من خيوط الكشمير والصوف الإيطالي الناعم. ينساب بنعومة بالغة ليمنحك الدفء والاسترخاء الفخم في إطلالاتكِ الشتوية.",
    "details": [
      "المادة: مزيج كشمير طبيعي 70% وصوف ناعم 30%",
      "القصة: قصة طويلة مفتوحة بياقة شال عريضة وجيوب جانبية مخفية واسعة",
      "التفاصيل: حواف مرنة محبوكة بدقة وحياكة جانبية معززة لمزيد من القوة",
      "الصنع: حياكة وتجهيز يدوي بأتيلييه المهندسين، الجيزة",
      "العناية: غسيل يدوي لطيف أو تنظيف جاف. تجفيف مسطح."
    ],
    "fabric": "مزيج كشمير وصوف طبيعي يمنح ملمساً حريرياً فائق الخفة والدفء.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/detail/detail_fabric.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/flatlay/flatlay_1.png"
        ]
      }
    ]
  },
  {
    "id": "35",
    "title": "كارديجان بياقة شال عريضة من صوف الألبكا — شتاء ٢٠٢٧",
    "price": 3400,
    "image": "/images/campaign/campaign_4.png",
    "hoverImage": "/images/campaign/campaign_1.png",
    "collection": "أزياء الشتاء",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "كارديجان طويل مفتوح بدون أزرار منسوج من خيوط الكشمير والصوف الإيطالي الناعم. ينساب بنعومة بالغة ليمنحك الدفء والاسترخاء الفخم في إطلالاتكِ الشتوية.",
    "details": [
      "المادة: مزيج كشمير طبيعي 70% وصوف ناعم 30%",
      "القصة: قصة طويلة مفتوحة بياقة شال عريضة وجيوب جانبية مخفية واسعة",
      "التفاصيل: حواف مرنة محبوكة بدقة وحياكة جانبية معززة لمزيد من القوة",
      "الصنع: حياكة وتجهيز يدوي بأتيلييه المهندسين، الجيزة",
      "العناية: غسيل يدوي لطيف أو تنظيف جاف. تجفيف مسطح."
    ],
    "fabric": "مزيج كشمير وصوف طبيعي يمنح ملمساً حريرياً فائق الخفة والدفء.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_3.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/campaign/campaign_4.png"
        ]
      }
    ]
  },
  {
    "id": "36",
    "title": "بنطال صوفي بقصة مستقيمة واسعة — شتاء ٢٠٢٧",
    "price": 2100,
    "image": "/images/products/product_winter_coat.png",
    "hoverImage": "/images/campaign/campaign_6.png",
    "collection": "بنطلونات",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "بنطال شتوي بقصة واسعة مستقيمة منسوج من خيوط الصوف الإيطالي ثقيل الوزن. يتميز بكسرات أمامية حادة وجيوب جانبية متناسقة تمنح حضورك الفخم طابعاً رسمياً.",
    "details": [
      "المادة: صوف إيطالي نقي 100% ذو بنية متماسكة ووزن مثالي يسقط باستقامة",
      "القصة: خصر مرتفع مبطن بحزام قماشي عريض داخلي وقصة بالازو مستقيمة",
      "التفاصيل: كسرات أمامية هندسية وجيوب مخفية وسحاب معدني مخفي متين",
      "الصنع: قص وحياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف فقط للحفاظ على كسرات البنطال والنسيج الصوفي."
    ],
    "fabric": "صوف طبيعي إيطالي ثقيل مع بطانة داخلية ناعمة تحميك من الاحتكاك.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_6.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/flatlay/flatlay_1.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/products/product_winter_coat.png"
        ]
      }
    ]
  },
  {
    "id": "37",
    "title": "بنطال شتوي صوف عازل بخصر مرتفع — شتاء ٢٠٢٧",
    "price": 2300,
    "image": "/images/detail/detail_fabric.png",
    "hoverImage": "/images/lifestyle/lifestyle_interior.png",
    "collection": "بنطلونات",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "بنطال شتوي بقصة واسعة مستقيمة منسوج من خيوط الصوف الإيطالي ثقيل الوزن. يتميز بكسرات أمامية حادة وجيوب جانبية متناسقة تمنح حضورك الفخم طابعاً رسمياً.",
    "details": [
      "المادة: صوف إيطالي نقي 100% ذو بنية متماسكة ووزن مثالي يسقط باستقامة",
      "القصة: خصر مرتفع مبطن بحزام قماشي عريض داخلي وقصة بالازو مستقيمة",
      "التفاصيل: كسرات أمامية هندسية وجيوب مخفية وسحاب معدني مخفي متين",
      "الصنع: قص وحياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف فقط للحفاظ على كسرات البنطال والنسيج الصوفي."
    ],
    "fabric": "صوف طبيعي إيطالي ثقيل مع بطانة داخلية ناعمة تحميك من الاحتكاك.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/detail/detail_fabric.png"
        ]
      }
    ]
  },
  {
    "id": "38",
    "title": "بنطال كشمير رياضي ناعم ومريح — شتاء ٢٠٢٧",
    "price": 2450,
    "image": "/images/campaign/campaign_1.png",
    "hoverImage": "/images/campaign/campaign_3.png",
    "collection": "بنطلونات",
    "season": "winter",
    "badge": "قطعة أساسية",
    "description": "بنطال شتوي بقصة واسعة مستقيمة منسوج من خيوط الصوف الإيطالي ثقيل الوزن. يتميز بكسرات أمامية حادة وجيوب جانبية متناسقة تمنح حضورك الفخم طابعاً رسمياً.",
    "details": [
      "المادة: صوف إيطالي نقي 100% ذو بنية متماسكة ووزن مثالي يسقط باستقامة",
      "القصة: خصر مرتفع مبطن بحزام قماشي عريض داخلي وقصة بالازو مستقيمة",
      "التفاصيل: كسرات أمامية هندسية وجيوب مخفية وسحاب معدني مخفي متين",
      "الصنع: قص وحياكة يدوية دقيقة في أتيلييه الجيزة، مصر",
      "العناية: تنظيف جاف فقط للحفاظ على كسرات البنطال والنسيج الصوفي."
    ],
    "fabric": "صوف طبيعي إيطالي ثقيل مع بطانة داخلية ناعمة تحميك من الاحتكاك.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "جملي دافئ",
      "رمادي ملانژ",
      "برونزي مطفأ"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "جملي دافئ",
        "value": "#C19A6B",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/campaign/campaign_3.png"
        ]
      },
      {
        "color": "رمادي ملانژ",
        "value": "#7F8C8D",
        "images": [
          "/images/campaign/campaign_3.png",
          "/images/products/product_winter_coat.png"
        ]
      },
      {
        "color": "برونزي مطفأ",
        "value": "#8E6B4B",
        "images": [
          "/images/products/product_winter_coat.png",
          "/images/campaign/campaign_1.png"
        ]
      }
    ]
  },
  {
    "id": "39",
    "title": "فستان Velvet كوتور بأكمام طويلة — شتاء ٢٠٢٧",
    "price": 3900,
    "image": "/images/campaign/campaign_6.png",
    "hoverImage": "/images/flatlay/flatlay_1.png",
    "collection": "فساتين كاجوال",
    "season": "winter",
    "badge": "إصدار خاص",
    "description": "فستان شتوي طويل مصمم من قماش القطيفة المخملية (Velvet) أو الصوف المحبوك الفاخر. قصة انسيابية ضيقة تبرز جمال القوام وفتحة ظهر دائرية ناعمة لتميز حضوركِ.",
    "details": [
      "المادة: قطيفة حريرية فاخرة (Silk Velvet) أو صوف ميرينو 100% محبوك بنعومة",
      "القصة: أكمام طويلة ضيقة بنهاية سحاب مخفي عند المعصم للقصة المثالية",
      "التفاصيل: فتحة ظهر دائرية هادئة وسحاب خلفي طويل غير مرئي",
      "الصنع: خياطة يدوية دقيقة بأيادي حرفيي أتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي بالبخار العمودي الهادئ بدون ضغط المكواة."
    ],
    "fabric": "قطيفة حريرية فاخرة (Silk Velvet) ثقيلة الوزن مع بطانة مرنة ناعمة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "زيتوني هادئ",
      "كحلي داكن",
      "خمري ملوكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "زيتوني هادئ",
        "value": "#556B2F",
        "images": [
          "/images/campaign/campaign_6.png",
          "/images/flatlay/flatlay_1.png"
        ]
      },
      {
        "color": "كحلي داكن",
        "value": "#1A2E40",
        "images": [
          "/images/flatlay/flatlay_1.png",
          "/images/detail/detail_fabric.png"
        ]
      },
      {
        "color": "خمري ملوكي",
        "value": "#800020",
        "images": [
          "/images/detail/detail_fabric.png",
          "/images/campaign/campaign_6.png"
        ]
      }
    ]
  },
  {
    "id": "40",
    "title": "فستان صوفي محبوك ذو ياقة مرتفعة — شتاء ٢٠٢٧",
    "price": 3100,
    "image": "/images/lifestyle/lifestyle_interior.png",
    "hoverImage": "/images/campaign/campaign_4.png",
    "collection": "فساتين كاجوال",
    "season": "winter",
    "badge": "كولكشن ٢٠٢٧",
    "description": "فستان شتوي طويل مصمم من قماش القطيفة المخملية (Velvet) أو الصوف المحبوك الفاخر. قصة انسيابية ضيقة تبرز جمال القوام وفتحة ظهر دائرية ناعمة لتميز حضوركِ.",
    "details": [
      "المادة: قطيفة حريرية فاخرة (Silk Velvet) أو صوف ميرينو 100% محبوك بنعومة",
      "القصة: أكمام طويلة ضيقة بنهاية سحاب مخفي عند المعصم للقصة المثالية",
      "التفاصيل: فتحة ظهر دائرية هادئة وسحاب خلفي طويل غير مرئي",
      "الصنع: خياطة يدوية دقيقة بأيادي حرفيي أتيلييه الجيزة",
      "العناية: تنظيف جاف فقط. كوي بالبخار العمودي الهادئ بدون ضغط المكواة."
    ],
    "fabric": "قطيفة حريرية فاخرة (Silk Velvet) ثقيلة الوزن مع بطانة مرنة ناعمة.",
    "packaging": "تُسلم في علبة أورا الكوتور المخصصة مع ورق حريري فاخر وحامل ملابس حريري.",
    "colors": [
      "عاجي",
      "أسود",
      "بيج كلاسيكي"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "variants": [
      {
        "color": "عاجي",
        "value": "#FAF8F5",
        "images": [
          "/images/lifestyle/lifestyle_interior.png",
          "/images/campaign/campaign_4.png"
        ]
      },
      {
        "color": "أسود",
        "value": "#111111",
        "images": [
          "/images/campaign/campaign_4.png",
          "/images/campaign/campaign_1.png"
        ]
      },
      {
        "color": "بيج كلاسيكي",
        "value": "#E1D7C6",
        "images": [
          "/images/campaign/campaign_1.png",
          "/images/lifestyle/lifestyle_interior.png"
        ]
      }
    ]
  }
];
