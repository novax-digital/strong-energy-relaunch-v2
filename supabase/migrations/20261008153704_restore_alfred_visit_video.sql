-- Restore the public comic video using the new Supabase Storage project.
UPDATE public.media_items
SET video_url = 'https://jguraczvnxkjrrcpigzf.supabase.co/storage/v1/object/public/media/videos/besuch-bei-alfred-20261008.mp4'
WHERE id = '9d94c138-9590-4fc7-9158-484710509521'
  AND (video_url IS NULL OR video_url = 'https://qyxshvsbovymfodqnvfq.supabase.co/storage/v1/object/public/media/videos/besuch-bei-alfred-1.mp4');
