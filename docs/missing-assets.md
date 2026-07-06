# Strong Energy Missing Assets

Stand: 2026-05-28

## Gespiegelte Assets

- 237 Dateien unter `public/assets`, inklusive Logo, Produktbilder, Medienbilder, App-Store-Badges und 3D-Modelle.
- 7 Videodateien unter `public/videos`.
- 36 Download-Datensätze aus den öffentlichen Live-Daten, lokal unter `public/assets/downloads` gespiegelt.
- 98 Medien-Datensätze aus den öffentlichen Live-Daten, lokal unter `public/assets/media` gespiegelt.

## Fehlende öffentliche Assets

Aktuell sind keine fehlenden öffentlich erreichbaren Kern-Assets bekannt. Die Datenprüfung ergab:

- Medienbilder ohne lokale Datei: 0
- Medien-Thumbnails ohne lokale Datei: 0
- Download-Dateien ohne lokale Datei: 0

## Hinweise

- Die zwei öffentlich referenzierten GLB-Dateien liegen unter `public/assets/models`.
- Externe App-Store-Badges wurden lokal gespiegelt und in `src/content/generated/app-badges.json` referenziert.
- Falls die Live-Seite künftig weitere Supabase-Dateien oder neue Produktmedien erhält, muss `npm run sync:live` erneut ausgeführt und die resultierenden Content-JSON-Dateien geprüft werden.

