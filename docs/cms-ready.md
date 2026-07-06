# CMS-Ready Datenmodell

Stand: 2026-05-28

Die Inhalte liegen aktuell lokal unter `src/content` und `src/content/generated`. Die UI liest über `src/lib/content/*`, sodass später ein CMS angebunden werden kann, ohne die Komponentenstruktur grundlegend zu ändern.

## Page

- `slug`
- `locale`
- `title`
- `description`
- `heroTitle`
- `heroText`
- `sections`
- `seoTitle`
- `seoDescription`
- `ogImage`
- `canonicalPath`
- `published`

## Product

- `slug`
- `locale`
- `name`
- `subtitle`
- `tagline`
- `shortDescription`
- `description`
- `category`
- `categorySlug`
- `heroImage`
- `images`
- `videos`
- `modelAssets`
- `highlights`
- `specs`
- `specsSections`
- `specsTable`
- `relatedDownloads`
- `relatedMedia`
- `seoTitle`
- `seoDescription`
- `ogImage`
- `published`

## ProductCategory

- `slug`
- `locale`
- `label`
- `description`
- `sortOrder`
- `isVisible`
- `seoTitle`
- `seoDescription`

## Download

- `id`
- `locale`
- `title`
- `description`
- `category`
- `file`
- `productSlugs`
- `sortOrder`
- `isPublished`

## MediaItem

- `id`
- `locale`
- `title`
- `description`
- `category`
- `mediaType`
- `file`
- `thumbnail`
- `videoUrl`
- `productSlugs`
- `sortOrder`
- `isPublished`

## BlogPost

- `slug`
- `locale`
- `title`
- `excerpt`
- `content`
- `coverImage`
- `category`
- `tags`
- `author`
- `publishedAt`
- `readingTimeMinutes`
- `seoTitle`
- `seoDescription`
- `isPublished`

## Partner

- `name`
- `logo`
- `url`
- `description`
- `premium`
- `sortOrder`
- `isPublished`

## TeamMember

- `name`
- `role`
- `image`
- `bio`
- `email`
- `phone`
- `sortOrder`
- `isPublished`

## LegalPage

- `slug`
- `locale`
- `title`
- `content`
- `seoTitle`
- `seoDescription`
- `updatedAt`
- `published`

## Migrationshinweis

Beim CMS-Wechsel sollten zuerst die lokalen Zugriffsfunktionen in `src/lib/content` ersetzt werden. Die Komponenten erwarten typisierte Content-Objekte und müssen nur angepasst werden, wenn sich die Feldnamen oder Relationen ändern.

