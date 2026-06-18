/**
 * BH DECO AI — Central Image Configuration
 *
 * To update any image:
 *   1. Place image in /public/images/<folder>/filename.jpg
 *   2. Update the path below
 *   3. No page code changes needed
 *
 * Future admin dashboard will write to this file.
 */
export const siteImages = {

  // ── HOME ──────────────────────────────────────────────────────
  hero:               "/images/home/hero.jpg",
  aiDesignPanel:      "/images/home/ai-design-panel.jpg",
  referenceLab:       "/images/home/reference-lab.jpg",
  aiResult:           "/images/home/ai-result.jpg",
  furnitureFactory:   "/images/home/furniture-factory.jpg",
  blueprintCenter:    "/images/home/blueprint-center.jpg",

  // ── AI DESIGN ─────────────────────────────────────────────────
  aiDesignHero:       "/images/ai-design/hero.jpg",
  livingRoom:         "/images/ai-design/living-room.jpg",
  bedroom:            "/images/ai-design/bedroom.jpg",
  kitchen:            "/images/ai-design/kitchen.jpg",
  office:             "/images/ai-design/office.jpg",
  commercial:         "/images/ai-design/commercial.jpg",
  outdoor:            "/images/ai-design/outdoor.jpg",

  // ── FURNITURE ─────────────────────────────────────────────────
  furnitureHero:      "/images/furniture/hero.jpg",
  wardrobeImg:        "/images/furniture/wardrobe.jpg",
  kitchenCabinetImg:  "/images/furniture/kitchen-cabinet.jpg",
  tvCabinetImg:       "/images/furniture/tv-cabinet.jpg",
  vanityImg:          "/images/furniture/vanity.jpg",
  studyDeskImg:       "/images/furniture/study-desk.jpg",
  receptionImg:       "/images/furniture/reception.jpg",

  // ── PRODUCTS ──────────────────────────────────────────────────
  productsHero:       "/images/products/hero.jpg",
  productFurniture:   "/images/products/furniture.jpg",
  productKitchen:     "/images/products/kitchen.jpg",
  productWardrobe:    "/images/products/wardrobe.jpg",
  productTvCabinet:   "/images/products/tv-cabinet.jpg",
  productVanity:      "/images/products/vanity.jpg",
  productPanels:      "/images/products/panels.jpg",
  productSteel:       "/images/products/steel-frame.jpg",
  productContainer:   "/images/products/container-house.jpg",
  productMobihome:    "/images/products/mobihome.jpg",

  // ── COURSES ───────────────────────────────────────────────────
  coursesHero:        "/images/courses/hero.jpg",
  course1:            "/images/courses/course-1.jpg",
  course2:            "/images/courses/course-2.jpg",
  course3:            "/images/courses/course-3.jpg",
  course4:            "/images/courses/course-4.jpg",
  course5:            "/images/courses/course-5.jpg",
  course6:            "/images/courses/course-6.jpg",

  // ── PRICING ───────────────────────────────────────────────────
  pricingHero:        "/images/pricing/hero.jpg",

  // ── RECHARGE ──────────────────────────────────────────────────
  rechargeHero:       "/images/recharge/hero.jpg",

  // ── ABOUT ─────────────────────────────────────────────────────
  aboutHero:          "/images/about/hero.jpg",
  companyFactory:     "/images/about/factory.jpg",
  companyShowroom:    "/images/about/showroom.jpg",
  companyTeam:        "/images/about/team.jpg",

  // ── CONTACT ───────────────────────────────────────────────────
  contactHero:        "/images/contact/hero.jpg",
  officeMap:          "/images/contact/map.jpg",

} as const;

export type SiteImageKey = keyof typeof siteImages;
