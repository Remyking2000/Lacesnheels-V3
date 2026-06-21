INSERT INTO categories (slug, name, intro, image_url) VALUES
  ('bags', 'Bags', 'Structured handbags, everyday totes, and event-ready clutches.', 'https://laces-n-heels-luxe.vercel.app/assets/cat-bags-DfRhb7t2.jpg'),
  ('ponchos', 'Ponchos', 'Cold-season layers for travel, work, and weekend styling.', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'),
  ('suitcases', 'Suitcases', 'Travel essentials for polished trips and easy packing.', 'https://laces-n-heels-luxe.vercel.app/assets/cat-suitcases-B_mbAqdz.jpg'),
  ('shoes', 'Shoes', 'Comfortable statement pairs for daily plans and occasions.', 'https://laces-n-heels-luxe.vercel.app/assets/cat-heels-BmmasMDd.jpg'),
  ('new-arrivals', 'New Arrivals', 'Fresh finds added in limited quantities.', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80')
ON CONFLICT (slug) DO UPDATE SET
  name = excluded.name,
  intro = excluded.intro,
  image_url = excluded.image_url;

INSERT INTO products (slug, name, category_slug, price_label, badge_label, image_url, colors, details, condition, availability, description, featured, sort_order) VALUES
  ('cabin-suitcase', 'Cabin Travel Suitcase', 'suitcases', 'From KES 12,500', 'Travel Essential', 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&w=900&q=82', 'Black, champagne, blush nude', 'Lightweight cabin size, smooth wheels, secure zip closure.', 'New', 'Limited pieces available', 'A polished travel suitcase for quick trips, gifting, and everyday travel plans. Message before ordering so the team can confirm the current colours and pickup or delivery window.', true, 1),
  ('premium-poncho', 'Premium Soft Poncho', 'ponchos', 'From KES 4,800', 'Cold Season', 'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=82', 'Camel, charcoal, cream', 'Soft-touch knit, relaxed fit, easy layering.', 'New', 'Check availability before ordering', 'A cozy but elevated layer for work days, travel, weekend plans, and gifting. Designed to feel warm without making the outfit look heavy.', true, 2),
  ('leather-handbag', 'Structured Leather Handbag', 'bags', 'From KES 7,900', 'Limited', 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=900&q=82', 'Tan, black, burgundy', 'Structured shape, top handle, detachable strap.', 'New', 'Limited pieces available', 'A clean everyday handbag that works for office looks, lunch plans, and polished errands. Ask about current stock because colours move quickly.', true, 3),
  ('ladies-shoes', 'Classic Ladies Shoes', 'shoes', 'From KES 5,500', 'New Arrival', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=82', 'Black, nude, gold', 'Comfortable heel height, occasion-ready finish.', 'New', 'Sizes sell fast', 'Elegant shoes for events, work outfits, and refined everyday styling. Message with your size to confirm what is currently available.', true, 4),
  ('weekend-tote', 'Everyday Weekend Tote', 'bags', 'From KES 6,200', 'Everyday', 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=900&q=82', 'Beige, black, brown', 'Roomy interior, soft handles, practical compartments.', 'New', 'Available while stock lasts', 'A roomy tote for work, shopping, travel extras, and simple gifting. It is easy to style and practical for daily use.', false, 5),
  ('gift-accessory-set', 'Gift Accessory Set', 'new-arrivals', 'From KES 3,500', 'Gift Pick', 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=900&q=82', 'Assorted', 'Curated accessories, gift-ready packaging options.', 'New', 'Ask for current sets', 'A simple giftable set for birthdays, thank-you moments, weekend visits, and personal treats. Ask what combinations are available today.', false, 6)
ON CONFLICT (slug) DO UPDATE SET
  name = excluded.name,
  category_slug = excluded.category_slug,
  price_label = excluded.price_label,
  badge_label = excluded.badge_label,
  image_url = excluded.image_url,
  colors = excluded.colors,
  details = excluded.details,
  condition = excluded.condition,
  availability = excluded.availability,
  description = excluded.description,
  featured = excluded.featured,
  sort_order = excluded.sort_order;
