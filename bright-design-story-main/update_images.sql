-- Update image URLs to use working, reliable sources
-- Replace all image URLs with actual working URLs that match the post content

-- Photo Posts (10) - Nature & Travel Photography
UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=1',
  caption = 'Mountain sunrise at dawn 🏔️ The perfect way to start the day. Nature never disappoints! #nature #photography #mountains'
WHERE id = 1;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=2',
  caption = 'Urban exploration in Tokyo 🌃 Every corner tells a story. Love the vibrant energy of this city! #urban #photography #tokyo'
WHERE id = 2;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=3',
  caption = 'Desert dunes golden hour 🌅 Nature''s masterpiece! The silence here is golden. #desert #landscape #photography'
WHERE id = 3;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=4',
  caption = 'Northern lights magic 🌌 The universe putting on a show! Simply breathtaking! #aurora #nature #photography #norway'
WHERE id = 4;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=5',
  caption = 'Tropical paradise found 🏝️ Crystal clear waters and white sand beaches. Pure bliss! #beach #tropical #paradise'
WHERE id = 5;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=6',
  caption = 'Autumn forest walkway 🍂 Nature''s carpet of gold! Fall is my favorite season. #autumn #forest #nature'
WHERE id = 6;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=7',
  caption = 'Misty morning lake reflection 🌅 Nature''s perfect mirror at sunrise! #nature #landscape #photography'
WHERE id = 7;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=8',
  caption = 'Sakura blooming in Kyoto 🌸 Spring''s delicate beauty captured in pixels! #cherryblossom #japan #nature'
WHERE id = 8;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=9',
  caption = 'Golden gate bridge sunset 🌅 San Francisco''s iconic beauty! Even more stunning in person. #california #photography #travel'
WHERE id = 9;

UPDATE posts SET 
  content = 'https://picsum.photos/800/600?random=10',
  caption = 'Snowy mountain peaks at dusk 🏔️ Winter''s rugged beauty never fails to impress! #mountains #winter #photography'
WHERE id = 10;

-- Avatar URLs - Use reliable profile images
UPDATE users SET 
  avatar_url = 'https://picsum.photos/100/100?random=1'
WHERE username = 'alex_wanderer';

UPDATE users SET 
  avatar_url = 'https://picsum.photos/100/100?random=2'
WHERE username = 'maya_photographer';

UPDATE users SET 
  avatar_url = 'https://picsum.photos/100/100?random=3'
WHERE username = 'james_creator';

UPDATE users SET 
  avatar_url = 'https://picsum.photos/100/100?random=4'
WHERE username = 'sarah_vlogr';

UPDATE users SET 
  avatar_url = 'https://picsum.photos/100/100?random=5'
WHERE username = 'david_writer';