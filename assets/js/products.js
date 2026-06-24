/* ============================================================================
 *  商品目录数据 (Product Catalog)
 *  - category: "household"（日用百货） | "beauty"（美妆）
 *  - 价格单位与 SITE_CONFIG.currency 一致（默认 USD）。
 *  - 上线前：请把 thumb（占位渐变）替换为真实商品图（建议 800x800 webp）。
 * ========================================================================== */

window.PRODUCTS = [
  /* ---------------- 日用百货 Household ---------------- */
  { id: "hh-bottle-500",  category: "household", name: "不锈钢真空保温杯 500ml", nameEn: "Stainless Steel Vacuum Bottle 500ml",
    price: 18.99, compareAt: 25.99, rating: 4.8, reviews: 312, badge: "Best Seller",
    blurb: "316 食品级内胆，12 小时长效保温，防漏旋盖。", accent: "#0ea5e9" },
  { id: "hh-storage-3",   category: "household", name: "可叠加收纳箱（3 件套）", nameEn: "Stackable Storage Boxes (Set of 3)",
    price: 24.99, compareAt: 32.00, rating: 4.7, reviews: 198, badge: "",
    blurb: "透明可视、带盖防尘，衣物玩具杂物一站整理。", accent: "#6366f1" },
  { id: "hh-cloth-10",    category: "household", name: "超细纤维清洁布（10 片装）", nameEn: "Microfiber Cleaning Cloths (10-pack)",
    price: 9.99, compareAt: 13.99, rating: 4.9, reviews: 540, badge: "Value",
    blurb: "强吸水不掉毛，厨房玻璃汽车多用途。", accent: "#10b981" },
  { id: "hh-utensil",     category: "household", name: "硅胶厨房用具套装", nameEn: "Silicone Kitchen Utensil Set",
    price: 21.99, compareAt: 29.99, rating: 4.6, reviews: 156, badge: "",
    blurb: "耐高温 230°C，不伤锅，含锅铲、汤勺、打蛋器等 7 件。", accent: "#f97316" },
  { id: "hh-umbrella",    category: "household", name: "便携折叠旅行伞", nameEn: "Foldable Travel Umbrella",
    price: 14.99, compareAt: 19.99, rating: 4.5, reviews: 274, badge: "",
    blurb: "十骨抗风，UPF50+ 防晒，一键自动开收。", accent: "#8b5cf6" },
  { id: "hh-organizer",   category: "household", name: "竹制抽屉分隔收纳盒", nameEn: "Bamboo Drawer Organizer",
    price: 16.99, compareAt: 22.00, rating: 4.7, reviews: 121, badge: "",
    blurb: "天然楠竹，可调隔板，餐具文具整齐有序。", accent: "#84cc16" },

  /* ---------------- 美妆 Beauty ---------------- */
  { id: "bt-serum",       category: "beauty", name: "玻尿酸保湿精华液 30ml", nameEn: "Hyaluronic Acid Hydrating Serum 30ml",
    price: 22.99, compareAt: 34.00, rating: 4.8, reviews: 421, badge: "Best Seller",
    blurb: "五重玻尿酸深层补水，清爽不黏腻，敏感肌适用。", accent: "#ec4899" },
  { id: "bt-lipstick",    category: "beauty", name: "丝绒哑光口红", nameEn: "Matte Velvet Lipstick",
    price: 12.99, compareAt: 17.99, rating: 4.6, reviews: 389, badge: "",
    blurb: "高显色持久不沾杯，丝滑膏体不拔干。", accent: "#f43f5e" },
  { id: "bt-powder",      category: "beauty", name: "控油定妆散粉", nameEn: "Oil-Control Loose Setting Powder",
    price: 15.99, compareAt: 21.00, rating: 4.7, reviews: 233, badge: "",
    blurb: "细腻无暇，持妆 12 小时，告别大油田。", accent: "#a855f7" },
  { id: "bt-cleanser",    category: "beauty", name: "氨基酸温和洁面乳", nameEn: "Amino Acid Gentle Cleanser",
    price: 13.99, compareAt: 18.99, rating: 4.9, reviews: 512, badge: "Value",
    blurb: "弱酸性温和配方，深层清洁不紧绷。", accent: "#14b8a6" },
  { id: "bt-sunscreen",   category: "beauty", name: "清爽防晒乳 SPF50+ PA++++", nameEn: "Daily Sunscreen SPF50+ PA++++",
    price: 17.99, compareAt: 24.00, rating: 4.7, reviews: 298, badge: "",
    blurb: "广谱防护，水润成膜不泛白，可作妆前乳。", accent: "#f59e0b" },
  { id: "bt-mask",        category: "beauty", name: "维C亮颜面膜（5 片装）", nameEn: "Vitamin C Brightening Sheet Mask (5-pack)",
    price: 11.99, compareAt: 16.99, rating: 4.6, reviews: 176, badge: "",
    blurb: "高浓度维C精华，提亮肤色，焕活水光。", accent: "#eab308" },
];

/* 按分类取商品 */
window.getProductsByCategory = function (cat) {
  if (!cat || cat === "all") return window.PRODUCTS;
  return window.PRODUCTS.filter(function (p) { return p.category === cat; });
};
window.getProductById = function (id) {
  return window.PRODUCTS.find(function (p) { return p.id === id; }) || null;
};
