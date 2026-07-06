# Strong Energy Content-Gaps

Stand: 2026-05-28

## Crawl-Befund

Die aktuelle Live-Seite liefert im initialen HTML auf den geprüften `/de`-Routen praktisch keine indexierbaren Inhalte aus. Sichtbare Texte, Überschriften, interne Links, Produktdaten, Downloads und Medien erscheinen erst im gerenderten Browser-DOM nach JavaScript-Ausführung. Die neue Next.js-Version bildet diese Inhalte serverseitig/statisch im initialen HTML ab.

## Rekonstruierte Quellen

- Produktdaten: aus dem öffentlich ausgelieferten Live-JavaScript-Bundle extrahiert.
- Download-Daten: aus der öffentlichen Supabase-REST-Tabelle `downloads` gespiegelt.
- Medien-Daten: aus den öffentlichen Supabase-REST-Tabellen `media_items` und `media_categories` gespiegelt.
- Blogdaten: aus der öffentlichen Supabase-REST-Tabelle `blog_posts` gespiegelt.
- Rechtliche Seiten: aus dem gerenderten DOM der Live-Seite übernommen.
- FAQ-Inhalte: aus dem gerenderten Live-DOM übernommen.

## Nicht eindeutig oder bewusst vorbereitet

- Für `EnerC` und `EnerC+` wurden keine produktbezogenen Download-Verknüpfungen in den Live-Daten gefunden. Die Produkte bleiben vollständig indexierbar, verweisen aber nicht auf erfundene Downloads.
- Die Live-Seite enthält 3D-Viewer-Code und zwei GLB-Dateien (`alfred.glb`, `power-bank-s19.glb`). Die Dateien wurden gespiegelt und als Medien-Links den Produkten zugeordnet; ein interaktiver 3D-Viewer wurde noch nicht nachgebaut, um kein zusätzliches schweres Client-JavaScript einzuführen.
- Das Kontaktformular ist validiert und als Server Action vorbereitet. Ohne E-Mail-Provider wird die Anfrage serverseitig angenommen und geloggt; Provider-Anbindung ist als TODO markiert.
- Rechtstexte wurden technisch übernommen, sollten aber vor Livegang rechtlich geprüft werden.
- Tracking-/Marketing-Skripte wurden nicht eingebaut. Die Cookie-Struktur ist vorbereitet und lädt standardmäßig nur notwendige Cookies.

