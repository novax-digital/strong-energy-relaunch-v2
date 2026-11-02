-- Match the Star H CMS entry to the corrected PDFs bundled with the website.
update public.downloads
set
  title_en = 'Star H Datasheet',
  file_url_de = '/assets/downloads/Datenblatt_Star_H-232_GER.pdf',
  file_url_en = '/assets/downloads/Datasheet_Star_H-232_EN.pdf'
where id = '3e568e7f-a2e9-4fdb-88ae-886c7c9fb347';
