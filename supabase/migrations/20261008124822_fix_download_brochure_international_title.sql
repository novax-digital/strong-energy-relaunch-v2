-- Correct the brochure label while preserving the existing download URLs.
update public.downloads
set
  title_de = replace(title_de, '(Intermational)', '(International)'),
  title_en = replace(title_en, '(Intermational)', '(International)')
where id = '5449b12a-6d63-47f2-9d61-4cc3d9e50032'
  and (title_de like '%(Intermational)%' or title_en like '%(Intermational)%');
