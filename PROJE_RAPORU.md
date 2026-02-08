# Royal E-Ticaret & CMS Projesi - Teknik Dokümantasyon

## 1. PROJE ÖZETİ

**Proje Adı:** Royal Catalog CMS  
**Tip:** Next.js Full-Stack E-Ticaret ve İçerik Yönetim Sistemi  
**Durum:** Vercel'de Deploy Edildi (Aktif Sorun: Admin 405 Hatası)  
**GitHub:** https://github.com/fancykiki/Royal

---

## 2. TEKNOLOJİ STACK

### Core Framework
- **Next.js:** 16.1.1 (App Router)
- **React:** 19.2.1
- **React DOM:** 19.2.1
- **Node.js:** Serverless Runtime

### Database & ORM
- **Database:** MySQL (Railway Cloud)
- **ORM:** Prisma 6.16.1
- **Client:** @prisma/client 6.16.1

### Authentication & Security
- **JWT:** jose 6.1.0
- **Password Hashing:** bcryptjs 3.0.2
- **Cookie-based Auth:** httpOnly cookies

### UI & Styling
- **Icons:** lucide-react 0.563.0
- **Styling:** Sass 1.83.0
- **Slider:** Swiper 11.1.15
- **Drag & Drop:** @dnd-kit/core 6.3.1
- **State Management:** Redux Toolkit 2.2.7

### File Upload
- **Cloudinary:** 2.0.0 (cloudinary_cloud_name: dafqkkckq)

### Deployment
- **Hosting:** Vercel (Serverless)
- **Database:** Railway (MySQL)

---

## 3. PROJE YAPISI

```
c:\xampp\htdocs/
├── app/                          # Next.js App Router
│   ├── (shop)/                   # Public shop pages
│   ├── admin/                    # Admin panel
│   │   ├── (shell)/              # Admin shell layout
│   │   │   ├── page.js           # Dashboard (overview)
│   │   │   ├── products/         # Product management
│   │   │   ├── categories/       # Category management
│   │   │   ├── cms/              # CMS (menus, sliders, banners)
│   │   │   └── blog/             # Blog management
│   │   ├── login/                # Admin login page
│   │   └── setup/                # Initial setup
│   ├── api/                      # API Routes
│   │   ├── admin/                # Admin API endpoints
│   │   ├── products/             # Public product APIs
│   │   ├── categories/           # Public category APIs
│   │   └── ...
│   └── layout.js                 # Root layout
├── components/                   # Reusable components
├── lib/                          # Utilities
│   ├── prisma.js                 # Prisma client singleton
│   ├── adminAuth.js              # JWT auth utilities
│   └── security.js               # Rate limiting, validation
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Migration files
├── public/                       # Static assets
└── middleware.js                 # Route protection
```

---

## 4. VERİTABANI ŞEMASI (PRISMA)

### 4.1 Core Models

#### AdminUser
```prisma
model AdminUser {
  id           Int      @id @default(autoincrement())
  email        String   @unique
  passwordHash String
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}
```

#### Product
```prisma
model Product {
  id          Int      @id @default(autoincrement())
  title       String
  slug        String   @unique
  sku         String?  @unique
  description String?  @db.LongText
  videoUrl    String?  @db.LongText
  categoryId  Int?
  category    Category? @relation(fields: [categoryId], references: [id])
  priceMin    Decimal  @db.Decimal(10, 2)
  priceMax    Decimal  @db.Decimal(10, 2)
  imageMain   String?
  imageAlt    String?
  published   Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // SEO Fields
  seoTitle        String?
  seoDescription  String?  @db.LongText
  seoKeywords     String?  @db.LongText
  canonicalUrl    String?
  ogImage         String?
  noIndex         Boolean  @default(false)
  
  // Relations
  images      ProductImage[]
  specs       ProductSpec[]
  tags        ProductTag[]
  infoBoxes   ProductInfoBox[]
  features    ProductFeature[]
  colors      ProductColor[]
}
```

#### Category (Self-Referencing Hierarchy)
```prisma
model Category {
  id        Int       @id @default(autoincrement())
  name      String
  slug      String    @unique
  iconImage String?
  sortOrder Int       @default(0)
  parentId  Int?
  parent    Category? @relation("CategoryHierarchy", fields: [parentId], references: [id])
  children  Category[] @relation("CategoryHierarchy")
  products  Product[]
  
  // SEO Fields
  seoTitle        String?
  seoDescription  String?  @db.LongText
  seoKeywords     String?  @db.LongText
  canonicalUrl    String?
  ogImage         String?
  noIndex         Boolean  @default(false)
  
  @@index([parentId])
}
```

### 4.2 CMS Models

#### Menu System (Hierarchical)
```prisma
model Menu {
  id        Int       @id @default(autoincrement())
  key       String    @unique  // e.g., "main", "footer"
  name      String
  items     MenuItem[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model MenuItem {
  id          Int       @id @default(autoincrement())
  menuId      Int
  menu        Menu      @relation(fields: [menuId], references: [id])
  parentId    Int?
  parent      MenuItem? @relation("MenuItemTree", fields: [parentId], references: [id])
  children    MenuItem[] @relation("MenuItemTree")
  label       String
  href        String
  targetBlank Boolean   @default(false)
  isLabel     Boolean   @default(false)
  isActive    Boolean   @default(true)
  sortOrder   Int       @default(0)
  
  @@index([menuId])
  @@index([parentId])
}
```

#### Slider & Slides
```prisma
model Slider {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  name      String
  slides    Slide[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Slide {
  id          Int      @id @default(autoincrement())
  sliderId    Int
  slider      Slider   @relation(fields: [sliderId], references: [id])
  title       String
  subtitle    String?
  buttonLabel String?
  buttonHref  String?
  imageUrl    String
  isActive    Boolean  @default(true)
  sortOrder   Int      @default(0)
  
  @@index([sliderId])
}
```

#### Banner System
```prisma
model BannerGroup {
  id        Int      @id @default(autoincrement())
  key       String   @unique
  name      String
  banners   Banner[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Banner {
  id           Int         @id @default(autoincrement())
  bannerGroupId Int
  bannerGroup  BannerGroup @relation(fields: [bannerGroupId], references: [id])
  imageUrl     String
  alt          String?
  title        String?
  subtitle     String?
  href         String?
  variant      String?
  isActive     Boolean     @default(true)
  sortOrder    Int         @default(0)
  
  @@index([bannerGroupId])
}
```

### 4.3 Blog System

```prisma
model BlogCategory {
  id        Int      @id @default(autoincrement())
  name      String
  slug      String   @unique
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  posts     BlogPost[]
}

model BlogPost {
  id          Int           @id @default(autoincrement())
  title       String
  slug        String        @unique
  excerpt     String?       @db.LongText
  contentHtml String?       @db.LongText
  coverImage  String?
  authorName  String?
  categoryId  Int?
  category    BlogCategory? @relation(fields: [categoryId], references: [id])
  published   Boolean       @default(false)
  publishedAt DateTime?
  
  // SEO Fields
  seoTitle        String?
  seoDescription  String?       @db.LongText
  canonicalUrl    String?
  ogImage         String?
  
  tags        BlogPostTag[]
  
  @@index([categoryId])
  @@index([published, publishedAt])
}

model BlogTag {
  id        Int          @id @default(autoincrement())
  name      String
  slug      String       @unique
  posts     BlogPostTag[]
}

model BlogPostTag {
  postId    Int
  post      BlogPost @relation(fields: [postId], references: [id])
  tagId     Int
  tag       BlogTag  @relation(fields: [tagId], references: [id])
  
  @@id([postId, tagId])
  @@index([tagId])
}
```

### 4.4 Product Features

```prisma
model ProductImage {
  id        Int      @id @default(autoincrement())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  url       String
  alt       String?
  sortOrder Int      @default(0)
  
  @@index([productId])
}

model ProductSpec {
  id        Int      @id @default(autoincrement())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  key       String
  value     String
  sortOrder Int      @default(0)
  
  @@index([productId])
}

model ProductFeature {
  id        Int      @id @default(autoincrement())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  imageUrl  String
  title     String
  subtitle  String?
  sortOrder Int      @default(0)
  isActive  Boolean  @default(true)
  
  @@index([productId])
}

model ProductInfoBox {
  id        Int      @id @default(autoincrement())
  productId Int
  product   Product  @relation(fields: [productId], references: [id])
  iconUrl   String
  title     String
  subtitle  String?
  color     String?
  isActive  Boolean  @default(true)
  sortOrder Int      @default(0)
  
  @@index([productId])
}

model Color {
  id        Int            @id @default(autoincrement())
  name      String
  slug      String         @unique
  hex       String?
  sortOrder Int            @default(0)
  isActive  Boolean        @default(true)
  products  ProductColor[]
}

model ProductColor {
  productId Int
  product   Product @relation(fields: [productId], references: [id])
  colorId   Int
  color     Color   @relation(fields: [colorId], references: [id])
  
  @@id([productId, colorId])
  @@index([colorId])
}
```

### 4.5 Settings & Configuration

```prisma
model SiteSettings {
  id              Int      @id @default(1)
  siteName        String   @default("Catalog")
  logoUrl         String?
  headerPhone     String?
  headerEmail     String?
  footerAbout     String?  @db.LongText
  footerPhone     String?
  footerWorkHours String?
  socialFacebook  String?
  socialInstagram String?
  socialYoutube   String?
  socialX         String?
  
  // SEO Fields
  defaultSeoTitle       String?
  defaultSeoDescription String? @db.LongText
  defaultSeoKeywords    String? @db.LongText
  siteUrl               String?
  googleVerification    String?
  googleAnalyticsId     String?
}

model HomepageCategorySection {
  id          Int      @id @default(autoincrement())
  categoryId  Int      @unique
  category    Category @relation(fields: [categoryId], references: [id])
  title       String?
  isVisible   Boolean  @default(true)
  productLimit Int     @default(4)
  sortOrder   Int      @default(0)
  
  @@index([sortOrder])
  @@index([isVisible])
}
```

---

## 5. API ENDPOINTS

### 5.1 Public APIs (No Auth Required)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/products` | GET | List all products with pagination |
| `/api/products/[slug]` | GET | Get single product by slug |
| `/api/categories` | GET | List all categories with hierarchy |
| `/api/categories/[slug]` | GET | Get single category |
| `/api/colors` | GET | List all colors |
| `/api/banners/[key]` | GET | Get banners by group key |
| `/api/sliders/[key]` | GET | Get slides by slider key |
| `/api/menus/[key]` | GET | Get menu items by key |
| `/api/settings` | GET | Site settings |
| `/api/homepage-sections` | GET | Homepage category sections |
| `/api/blog/posts` | GET | List blog posts |
| `/api/blog/posts/[slug]` | GET | Get single blog post |
| `/api/blog/categories` | GET | List blog categories |

### 5.2 Admin APIs (Auth Required)

#### Authentication
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/bootstrap` | GET | Check if admin exists |
| `/api/admin/bootstrap` | POST | Create initial admin |

#### Products
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/products` | GET | List products |
| `/api/admin/products` | POST | Create product |
| `/api/admin/products/[id]` | GET | Get product |
| `/api/admin/products/[id]` | PUT | Update product |
| `/api/admin/products/[id]` | DELETE | Delete product |
| `/api/admin/import/products` | POST | Bulk import products |

#### Categories
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/categories` | GET | List categories |
| `/api/admin/categories` | POST | Create category |
| `/api/admin/categories/[id]` | GET | Get category |
| `/api/admin/categories/[id]` | PUT | Update category |
| `/api/admin/categories/[id]` | DELETE | Delete category |

#### CMS
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/menus` | GET | List menus |
| `/api/admin/menus/[key]` | GET | Get menu details |
| `/api/admin/menus/[key]` | PUT | Update menu |
| `/api/admin/sliders` | GET | List sliders |
| `/api/admin/sliders/[key]` | GET | Get slider details |
| `/api/admin/sliders/[key]` | PUT | Update slider |
| `/api/admin/banners` | GET | List banner groups |
| `/api/admin/banners/[key]` | GET | Get banner group |
| `/api/admin/banners/[key]` | PUT | Update banners |

#### Blog
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/blog/posts` | GET | List posts |
| `/api/admin/blog/posts` | POST | Create post |
| `/api/admin/blog/posts/[id]` | GET | Get post |
| `/api/admin/blog/posts/[id]` | PUT | Update post |
| `/api/admin/blog/posts/[id]` | DELETE | Delete post |
| `/api/admin/blog/categories` | GET | List categories |
| `/api/admin/blog/categories` | POST | Create category |
| `/api/admin/blog/categories/[id]` | PUT | Update category |
| `/api/admin/blog/categories/[id]` | DELETE | Delete category |

#### Utilities
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/upload` | POST | Upload image to Cloudinary |
| `/api/admin/settings` | GET | Get settings |
| `/api/admin/settings` | PUT | Update settings |
| `/api/admin/homepage-sections` | GET | Get homepage sections |
| `/api/admin/homepage-sections` | PUT | Update homepage sections |
| `/api/admin/colors` | GET | List colors |
| `/api/admin/colors` | POST | Create color |
| `/api/admin/colors/[id]` | PUT | Update color |
| `/api/admin/colors/[id]` | DELETE | Delete color |
| `/api/admin/seed/cms` | POST | Seed CMS data |
| `/api/admin/cleanup/test-products` | POST | Cleanup test data |

---

## 6. AUTHENTICATION SİSTEMİ

### JWT Token Yapısı
```javascript
// lib/adminAuth.js
import { SignJWT, jwtVerify } from "jose"

const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET)

export async function signAdminToken(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(secret)
}

export async function verifyAdminToken(token) {
  const { payload } = await jwtVerify(token, secret)
  return payload
}
```

### Cookie Yapılandırması
```javascript
// Cookie settings
const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 8, // 8 hours
  path: "/",
}
```

### Middleware Protection
```javascript
// middleware.js
export async function middleware(request) {
  const { pathname } = request.nextUrl
  
  const isAdminPage = pathname.startsWith("/admin")
  const isAdminApi = pathname.startsWith("/api/admin")
  
  const isPublicAdminApi =
    pathname.startsWith("/api/admin/login") ||
    pathname.startsWith("/api/admin/bootstrap") ||
    pathname.startsWith("/api/admin/logout")
  
  if (pathname === "/admin/login") return NextResponse.next()
  if (isAdminApi && isPublicAdminApi) return NextResponse.next()
  
  // Verify JWT token for protected routes
  const token = request.cookies.get("admin_token")?.value
  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }
  
  // ... verify token logic
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
}
```

---

## 7. DEPLOYMENT KONFİGÜRASYONU

### 7.1 Vercel Environment Variables

| Variable | Value | Description |
|----------|-------|-------------|
| `DATABASE_URL` | `mysql://root:...` | Railway MySQL connection |
| `ADMIN_JWT_SECRET` | `RoyalJWT2025...` | JWT signing key |
| `ADMIN_SETUP_KEY` | `RoyalSetup2025` | Initial admin setup key |
| `CLOUDINARY_CLOUD_NAME` | `dafqkkckq` | Cloudinary cloud |
| `CLOUDINARY_API_KEY` | `181245...` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | `FVX6-dl9mImgtBmi4X_6WRgXN9M` | Cloudinary secret |

### 7.2 Vercel Configuration (vercel.json)
```json
{
  "installCommand": "npm install --legacy-peer-deps"
}
```

### 7.3 Next.js Config (next.config.js)
```javascript
const nextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}
```

### 7.4 Prisma Client Configuration
```javascript
// lib/prisma.js
import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis

const prismaClientSingleton = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" 
      ? ["query", "error", "warn"] 
      : ["error"],
  })
}

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma
}

export default prisma
```

---

## 8. KARŞILAŞILAN SORUNLAR VE ÇÖZÜMLERİ

### 8.1 Sorun: Prisma Migration Hataları (P3018)
**Hata:** `Table 'railway.category' doesn't exist`
**Neden:** MySQL case sensitivity (Linux vs Windows)
**Çözüm:** Migration dosyalarındaki tablo isimlerini PascalCase'e çevir:
```sql
-- Eski: category, product
-- Yeni: Category, Product
```
**Alternatif:** `npx prisma db push --accept-data-loss`

### 8.2 Sorun: HTTP 405 (Method Not Allowed)
**Hata:** Admin login/setup çalışmıyor
**Neden:** Next.js App Router + Vercel runtime uyumsuzluğu
**Çözüm Denemeleri:**
1. `export const runtime = "nodejs"` eklendi API route'lara
2. Middleware pathname matching `startsWith` ile düzeltildi
3. Form action URL'leri doğrulandı
4. `parseBody` helper fonksiyonu kaldırıldı, direkt `formData()` kullanıldı

**Mevcut Durum:** Halen çözülmedi - detaylı debug gerekli

### 8.3 Sorun: Build Sırasında "Too Many Connections"
**Hata:** Railway MySQL 60 bağlantı limiti aşıldı
**Neden:** Next.js build 50+ admin sayfasını prerender ederken her biri DB'ye bağlanıyor
**Çözüm:** Tüm admin sayfalarına `export const dynamic = "force-dynamic"` eklendi:
```javascript
// app/admin/(shell)/page.js
export const dynamic = "force-dynamic"
export default async function AdminDashboard() {
  // ...
}
```

### 8.4 Sorun: Duplicate Import Build Hatası
**Hata:** `The name "..." was already defined.`
**Neden:** Aynı dosyada veya global scope'ta çakışan importlar.
**Çözüm:** Importları kontrol et ve gereksizleri temizle. Genellikle `import { X } from '...'` ve `import X from '...'` karıştırıldığında olur.

---

## 9. ANTIGRAVITY UZMAN İNCELEMESİ VE ÖNERİLERİ

Projeyi detaylıca inceledikten sonra aşağıdaki kritik noktaları ve iyileştirme önerilerini sunuyorum:

### 9.1 Mimari ve Kod Kalitesi
- **Modüler Yapı:** `app/admin` ve `app/(shop)` ayrımı oldukça başarılı. Bu yapı, admin panelinin ve mağaza yüzünün birbirini etkilemeden geliştirilmesine olanak tanıyor.
- **Component Design:** `components/admin` ve `components/shop` ayrımı kodun okunabilirliğini artırıyor. Ancak, bazı bileşenlerin (örneğin butonlar, inputlar) `components/elements` altında daha fazla generic hale getirilmesi kod tekrarını azaltabilir.
- **State Management:** Redux Toolkit kullanımı yerinde, ancak server component'lerin gücünden daha fazla yararlanılarak client-side state'i minimize edilebilir. Özellikle filtreleme işlemlerinde URL query parametreleri Redux yerine tercih edilebilir.

### 9.2 Performans ve Ölçeklenebilirlik
- **Rate Limiting:** Şu anki `lib/security.js` in-memory (RAM tabanlı) çalışıyor. Vercel gibi serverless ortamlarda her request farklı bir container'a düşebileceği için bu yöntem **çalışmayacaktır**.
    - **Öneri:** Upstash Redis veya Vercel KV kullanarak merkezi bir rate limiting yapısına geçilmeli.
- **Veritabanı Bağlantıları:** Railway üzerindeki MySQL bağlantı limiti (60) production'da darboğaz oluşturabilir.
    - **Öneri:** `prisma.js` dosyasında connection pooling ayarlarının yapıldığından emin olunmalı. Ayrıca `pgbouncer` gibi bir connection pooler kullanılabilir.
- **Image Optimization:** Cloudinary kullanımı harika. `next/image` bileşeninin `loader` prop'u ile Cloudinary entegrasyonu tam performanslı çalışıyor mu kontrol edilmeli.

### 9.3 Güvenlik
- **Middleware:** `middleware.js` dosyasındaki admin koruması başarılı. Ancak `jose` kütüphanesi ile yapılan doğrulama işlemlerinde `exp` (expiration) kontrolü backend tarafında da (API route'larında) çift dikiş yapılmalı.
- **CSP (Content Security Policy):** `lib/security.js` içinde CSP oluşturuluyor ancak `next.config.js` headers kısmında bu CSP'nin etkinleştirildiğinden emin olunmalı.

### 9.4 Gelecek Yol Haritası (Roadmap)
1.  **Tailwind CSS Migrasyonu:** Mevcut SASS yapısı güçlü olsa da, modern Next.js ekosistemi Tailwind ile daha verimli çalışıyor. Özellikle "Premium Design" hedefleri için Tailwind'in utility-first yapısı geliştirme hızını artıracaktır.
2.  **Redis Entegrasyonu:** Rate limiting ve basit caching (örn: menü verileri) için Redis eklenmeli.
3.  **Global Error Handling:** `app/global-error.js` ve `app/not-found.js` dosyalarının tüm edge case'leri kapsadığından emin olunmalı.
4.  **Unit & E2E Testleri:** Kritik ödeme ve login akışları için Playwright veya Cypress testleri yazılmalı.

---

*Bu rapor Antigravity tarafından 09.02.2025 tarihinde güncellenmiştir.*
