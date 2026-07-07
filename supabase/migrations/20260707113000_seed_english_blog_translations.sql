insert into public.blog_posts (id, title, slug, excerpt, content, category, author, tags, cover_image_url, is_published, is_featured, published_at, scheduled_at, reading_time_minutes, created_at, updated_at, language, translation_group_id, author_id)
values
  (
    'a645b4de-2d2c-4f36-942a-631b99f6ee71',
    $title$The Benefits of Switch Box Integration in Combination with ALFRED$title$,
    'benefits-switch-box-integration-alfred',
    $excerpt$In today's blog post, we take a closer look at the Switch Box and summarize the most important benefits.$excerpt$,
    $content$In today's blog post, we take a closer look at the Switch Box and summarize the most important benefits.

## The 4 key benefits of the Switch Box

1. **Preconfigured, integrated solution** - pre-assembled with AC cables, RS485 smart meter, circuit breakers (3x32 A), a directly measuring 80 A smart meter and an automatic transfer switch for the backup output; no additional components are required.

2. **Automatic backup operation** - keeps critical loads supplied during a power outage and switches seamlessly between grid and battery operation.

3. **Simple and fast installation** - pre-wired, with only minimal changes required in the household distribution board and no additional fuses or smart meters needed.

4. **Compact and space-saving** - increases the height of the ALFRED All-in-One by only 240 mm and replaces external metering or protection devices.

In short: the Switch Box makes installation easier, improves supply security and helps ensure that you remain well supplied even during a power outage.$content$,
    'Products',
    'Fabian Patterson, Michael Müller',
    array['Switch Box', 'ALFRED', 'Backup', 'Installation']::text[],
    'https://qyxshvsbovymfodqnvfq.supabase.co/storage/v1/object/public/media/blog/switchbox.jfif',
    true,
    false,
    '2025-09-15T10:00:00+00:00',
    null,
    1,
    '2026-02-25T09:29:48.815856+00:00',
    now(),
    'en',
    '5c13f07f-0d92-41eb-98f6-ce5853d8a0d8',
    null
  ),
  (
    '8075c7e4-28ce-4c45-9c6c-0337f0b572c8',
    $title$Alfred 10 – The Smart All-in-One Battery Storage for a Sustainable Energy Future$title$,
    'alfred-10-the-smart-all-in-one-battery-storage',
    $excerpt$In a world where sustainable energy sources are becoming increasingly important, Alfred 10 from Strong Energy offers an innovative and powerful storage solution for households and businesses.$excerpt$,
    $content$In a world where sustainable energy sources are becoming increasingly important, **[Alfred 10](/en/products/solar-systems/alfred-10)** from **Strong Energy** offers an innovative and powerful storage solution for households and businesses. This **modular all-in-one energy storage system** combines efficiency, flexibility and modern design, setting new standards for energy supply.

[Request a quote for Alfred 10](/en/products/solar-systems/alfred-10?anfrage=true)

## Maximum performance and flexibility

With a **storage capacity of 12 to 24 kWh** and the option to integrate up to **10 battery modules**, Alfred 10 adapts individually to the needs of its users. Thanks to the powerful **10 kW inverter**, the power supply remains stable even in **backup mode** - a decisive advantage for households and businesses that rely on a dependable energy source.

## Fast and simple installation

Another highlight is the **quick setup**: with a **depth of only 24 cm**, the battery storage system can be installed in a space-saving and straightforward way - in less than **45 minutes**. The **IP65 protection rating** ensures safe use both **indoors and outdoors**.

## Intelligent control via app

By integrating the **[Strong Energy 360 App](/en/360-app)**, users can conveniently monitor and control their Alfred 10. The intuitive user interface makes energy storage management simple and provides maximum transparency over electricity consumption.

## Design meets innovation

Alfred 10 is impressive not only technically, but also visually. Its modern and functional design was recognized with the renowned **Red Dot Award 2024**, underlining the successful combination of **aesthetic design and technological excellence**.

## Outlook for 2025

The Alfred 10 success story continues: integration with **Solar Manager** will be finalized and presented by **Intersolar 2025**. In addition to households and businesses in Germany, **installers in Switzerland and Austria** will soon also benefit from this innovative storage technology.

**David Norris, Sales Director at Strong Energy, confirms:** "We are continuously expanding our **installer network** in the D/A/CH region. Week after week, more people are becoming part of the Strong Energy family. These are exciting times for all of us."

## Key facts at a glance

- ✔ **10 kW inverter power** even in backup mode (black start capable)
- ✔ **High IP65 protection rating** - suitable for indoor and outdoor use
- ✔ **Flexibly scalable** with 12-24 kWh battery storage
- ✔ **AC coupling** for easy integration into existing systems
- ✔ **12-year warranty** with 10,000 charging cycles
- ✔ **Fast modular setup** - installation in under 45 minutes
- ✔ **[Strong Energy 360 App](/en/360-app)** for intelligent control and monitoring
- ✔ **Red Dot Award 2024 winner** - award-winning design
- ✔ **German support and free hotline**

---

**Interested?** Alfred 10 is the perfect solution for anyone looking to rely on sustainable energy supply.

[Request a non-binding quote](/en/products/solar-systems/alfred-10?anfrage=true)$content$,
    'Products',
    'Strong Energy',
    array['Alfred 10', 'Battery storage', 'All-in-One', 'Solar energy']::text[],
    'https://qyxshvsbovymfodqnvfq.supabase.co/storage/v1/object/public/media/blog/alfred-05.jpg',
    true,
    true,
    '2025-04-25T10:00:00+00:00',
    null,
    2,
    '2026-02-25T09:29:48.815856+00:00',
    now(),
    'en',
    '775fb99d-ef5c-4630-86b0-65ed460fe84e',
    null
  )
on conflict (id) do update set
  title = excluded.title,
  slug = excluded.slug,
  excerpt = excluded.excerpt,
  content = excluded.content,
  category = excluded.category,
  author = excluded.author,
  tags = excluded.tags,
  cover_image_url = excluded.cover_image_url,
  is_published = excluded.is_published,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  scheduled_at = excluded.scheduled_at,
  reading_time_minutes = excluded.reading_time_minutes,
  updated_at = excluded.updated_at,
  language = excluded.language,
  translation_group_id = excluded.translation_group_id,
  author_id = excluded.author_id;
