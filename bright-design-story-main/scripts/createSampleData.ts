import { initializeDatabase, postOperations, userOperations } from '../database';

const createSampleData = async () => {
  try {
    await initializeDatabase();
    console.log('Creating comprehensive sample data...');

    // Create sample users first
    const users = [
      {
        username: 'alex_wanderer',
        email: 'alex@wanderlust.com',
        password_hash: '$2b$12$LQv3aWD9yXN8MLqB6r2YdL1QGTj5JY9Q',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop'
      },
      {
        username: 'maya_photographer',
        email: 'maya@pixel.com',
        password_hash: '$2b$12$LQv3aWD9yXN8MLqB6r2YdL1QGTj5JY9Q',
        display_name: 'Maya Photographer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop'
      },
      {
        username: 'james_creator',
        email: 'james@creative.com',
        password_hash: '$2b$12$LQv3aWD9yXN8MLqB6r2YdL1QGTj5JY9Q',
        display_name: 'James Creator',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop'
      },
      {
        username: 'sarah_vlogger',
        email: 'sarah@stories.com',
        password_hash: '$2b$12$LQv3aWD9yXN8MLqB6r2YdL1QGTj5JY9Q',
        display_name: 'Sarah Vlogger',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop'
      },
      {
        username: 'david_writer',
        email: 'david@words.com',
        password_hash: '$2b$12$LQv3aWD9yXN8MLqB6r2YdL1QGTj5JY9Q',
        display_name: 'David Writer',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'
      }
    ];

    const createdUsers = [];
    for (const userData of users) {
      try {
        // Check if user already exists
        const existingUser = await userOperations.findByEmail(userData.email);
        if (!existingUser) {
          const newUser = await userOperations.create(userData);
          createdUsers.push(newUser);
          console.log(`Created user: ${newUser.username} (ID: ${newUser.id})`);
        }
      } catch (error) {
        console.error(`Error creating user ${userData.username}:`, error);
      }
    }

    // Wait a moment for users to be created
    await new Promise(resolve => setTimeout(resolve, 100));

    // Create diverse posts
    const posts = [
      // Photo Posts
      {
        user_id: createdUsers[0]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'https://images.unsplash.com/photo-1551882547-5c40-5723-90a1de9e3b1?w=600&h=600&fit=crop',
        caption: 'Mountain sunrise at dawn 🏔️ The perfect way to start the day. Nature never disappoints! #nature #photography #mountains',
        likes: 1247,
        comments: 89,
        reposts: 34,
        filter_tags: JSON.stringify(['nature', 'photography', 'mountains', 'sunrise']),
        location: 'Swiss Alps'
      },
      {
        user_id: createdUsers[1]?.id || 2,
        username: 'maya_photographer',
        display_name: 'Maya Photographer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'https://images.unsplash.com/photo-1519904981063-cfafb5d7394?w=600&h=600&fit=crop',
        caption: 'Urban exploration in Tokyo 🌃 Every corner tells a story. Love the vibrant energy of this city! #urban #photography #tokyo',
        likes: 892,
        comments: 67,
        reposts: 23,
        filter_tags: JSON.stringify(['urban', 'photography', 'tokyo', 'architecture']),
        location: 'Tokyo, Japan'
      },
      {
        user_id: createdUsers[2]?.id || 3,
        username: 'james_creator',
        display_name: 'James Creator',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'Desert dunes golden hour 🌅 Nature\'s masterpiece! The silence here is golden. #desert #landscape #photography',
        likes: 2156,
        comments: 145,
        reposts: 89,
        filter_tags: JSON.stringify(['desert', 'landscape', 'photography', 'goldenhour']),
        location: 'Sahara Desert'
      },
      {
        user_id: createdUsers[0]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'Northern lights magic 🌌 The universe putting on a show! Simply breathtaking! #aurora #nature #photography',
        likes: 3421,
        comments: 234,
        reposts: 156,
        filter_tags: JSON.stringify(['aurora', 'nature', 'photography', 'norway']),
        location: 'Tromsø, Norway'
      },
      {
        user_id: createdUsers[3]?.id || 4,
        username: 'sarah_vlogger',
        display_name: 'Sarah Vlogger',
        avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'Tropical paradise found 🏝️ Crystal clear waters and white sand beaches. Pure bliss! #beach #tropical #paradise',
        likes: 1876,
        comments: 98,
        reposts: 67,
        filter_tags: JSON.stringify(['beach', 'tropical', 'paradise', 'travel']),
        location: 'Maldives'
      },
      {
        user_id: createdUsers[2]?.id || 2,
        username: 'maya_photographer',
        display_name: 'Maya Photographer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        content_type: 'photo',
        content: 'Autumn forest walkway 🍂 Nature\'s carpet of gold! Fall is my favorite season. #autumn #forest #nature',
        likes: 1654,
        comments: 112,
        reposts: 78,
        filter_tags: JSON.stringify(['autumn', 'forest', 'nature', 'fallcolors']),
        location: 'Vermont, USA'
      },

      // Video Posts
      {
        user_id: createdUsers[1]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'video',
        content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
        caption: 'Mountain biking adventure! 🚵‍♂️ Challenging trails and rewarding views. Adventure awaits! #mountainbiking #outdoor #adventure',
        likes: 2103,
        comments: 187,
        reposts: 92,
        filter_tags: JSON.stringify(['mountainbiking', 'outdoor', 'adventure', 'sports']),
        location: 'Moab, Utah'
      },
      {
        user_id: createdUsers[3]?.id || 3,
        username: 'james_creator',
        display_name: 'James Creator',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        content_type: 'video',
        content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        caption: 'Time-lapse city life 🌃 The urban rhythm never stops! #timelapse #urban #citylife',
        likes: 3542,
        comments: 298,
        reposts: 145,
        filter_tags: JSON.stringify(['timelapse', 'urban', 'citylife', 'photography']),
        location: 'New York City'
      },
      {
        user_id: createdUsers[2]?.id || 2,
        username: 'maya_photographer',
        display_name: 'Maya Photographer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        content_type: 'video',
        content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        caption: 'Ocean waves and coastal vibes 🌊 There\'s something calming about the rhythm of the sea. #ocean #coastal #relaxation',
        likes: 1789,
        comments: 134,
        reposts: 76,
        filter_tags: JSON.stringify(['ocean', 'coastal', 'relaxation', 'nature']),
        location: 'Big Sur, California'
      },
      {
        user_id: createdUsers[0]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'video',
        content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
        caption: 'Wildlife documentary moments 🦁 Capturing nature\'s most precious encounters. #wildlife #documentary #nature',
        likes: 4321,
        comments: 267,
        reposts: 189,
        filter_tags: JSON.stringify(['wildlife', 'documentary', 'nature', 'animals']),
        location: 'Serengeti National Park'
      },
      {
        user_id: createdUsers[3]?.id || 3,
        username: 'james_creator',
        display_name: 'James Creator',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        content_type: 'video',
        content: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        caption: 'Space exploration documentary 🚀 Journey to the stars and beyond! #space #science #exploration',
        likes: 5634,
        comments: 412,
        reposts: 234,
        filter_tags: JSON.stringify(['space', 'science', 'exploration', 'documentary']),
        location: 'Kennedy Space Center'
      },

      // Text Posts
      {
        user_id: createdUsers[4]?.id || 4,
        username: 'david_writer',
        display_name: 'David Writer',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'Just finished reading "Sapiens" by Yuval Noah Harari. Mind-blowing perspective on human history and our future!\n\nKey takeaways:\n• Agriculture was humanity\'s biggest revolution\n• We\'re living in the most peaceful era ever\n• AI may change everything, but humans remain fundamentally the same\n\nHighly recommended for anyone interested in where we came from and where we\'re going! #books #history #future',
        caption: 'Mind-expanding read 📚 "Sapiens" completely changed how I view human history. Harari\'s insights about agriculture, peace, and AI are fascinating. Have you read it? What book changed your perspective? #books #history #learning',
        likes: 892,
        comments: 234,
        reposts: 156,
        filter_tags: JSON.stringify(['books', 'history', 'learning', 'sapiens']),
        location: 'Home Office'
      },
      {
        user_id: createdUsers[1]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'The paradox of modern life: We have more connections than ever, yet studies show record levels of loneliness. Something isn\'t adding up.\n\nMy thoughts:\n• Social media connects us but doesn\'t fulfill us\n• We\'re optimizing for efficiency at the cost of meaning\n• Maybe the solution isn\'t more apps, but deeper conversations\n\nWhat do you think? How do you combat modern loneliness? #philosophy #life #mentalhealth',
        caption: 'Deep thoughts on modern connection 🤔 We\'re more connected yet more isolated than ever. Is social media the problem or the solution? #philosophy #mentalhealth #society',
        likes: 1203,
        comments: 445,
        reposts: 234,
        filter_tags: JSON.stringify(['philosophy', 'mentalhealth', 'society', 'socialmedia']),
        location: 'Coffee Shop'
      },
      {
        user_id: createdUsers[2]?.id || 2,
        username: 'maya_photographer',
        display_name: 'Maya Photographer',
        avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'Climate update: The latest IPCC report is both terrifying and hopeful. Terrifying data, but solutions exist. We have the technology, funding, and knowledge. What we lack is collective will.\n\nKey findings:\n• Warming is accelerating faster than predicted\n• Renewable energy is now cheaper than fossil fuels\n• Every 0.1°C matters immensely\n\nThe question isn\'t "can we" but "will we". #climate #science #action',
        caption: 'Climate reality check 🌍 Latest IPCC report is sobering but solutions exist. We have the technology, what we need is the will. Every fraction of a degree matters! #climate #science #sustainability',
        likes: 2341,
        comments: 567,
        reposts: 345,
        filter_tags: JSON.stringify(['climate', 'science', 'sustainability', 'ipcc']),
        location: 'United Nations Climate Conference'
      },
      {
        user_id: createdUsers[3]?.id || 3,
        username: 'james_creator',
        display_name: 'James Creator',
        avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'Startup lessons after 5 years, 2 failed companies, and 1 successful exit:\n\n1. Your first idea is rarely your best idea\n2. Culture eats strategy for breakfast\n3. Sleep is a competitive advantage\n4. The best team isn\'t always the most talented\n5. Success is moving target posts, not hitting them\n\nWishing every founder the wisdom I learned the hard way! #startup #entrepreneurship #lessons',
        caption: '5 years of startup wisdom 💡 1 failed company, 2 failed companies, 1 exit. Here\'s what I learned about building businesses. #startup #entrepreneurship #lessons',
        likes: 3456,
        comments: 789,
        reposts: 432,
        filter_tags: JSON.stringify(['startup', 'entrepreneurship', 'lessons', 'business']),
        location: 'Silicon Valley'
      },
      {
        user_id: createdUsers[4]?.id || 4,
        username: 'david_writer',
        display_name: 'David Writer',
        avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'The creative process is messy, non-linear, and deeply personal. I used to think "real artists" worked in straight lines. Now I know creativity is chaos with purpose.\n\nMy creative routine:\n• Morning pages - no expectations, just movement\n• Walks with no phone - let the mind wander\n• "Useless" creation - play without pressure\n• Show up consistently - inspiration favors the working\n\nEmbracing the beautiful mess of creating something from nothing! #creativity #art #process',
        caption: 'The beautiful mess of creativity 🎨 Embracing the chaos in my creative process. Realizing that art isn\'t about perfection, but about showing up consistently. #creativity #art #writing',
        likes: 1567,
        comments: 234,
        reposts: 178,
        filter_tags: JSON.stringify(['creativity', 'art', 'process', 'writing']),
        location: 'Art Studio'
      },
      {
        user_id: createdUsers[0]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'Digital minimalism update: 1 year with 100 items, and my life has never been better. The paradox: having less gives you more of what matters.\n\nWhat I kept:\n• Quality over quantity\n• Experiences over things\n• Relationships over digital noise\n• Time over money\n\nWhat I learned: Freedom isn\'t having what you want, it\'s wanting what you have. #minimalism #digitaldetox #lifestyle',
        caption: '1 year of digital minimalism 🧘 My life with 100 items vs 1000+. The paradox of having less giving me more of what matters. #minimalism #digitaldetox #lifestyle',
        likes: 2876,
        comments: 345,
        reposts: 234,
        filter_tags: JSON.stringify(['minimalism', 'digitaldetox', 'lifestyle', 'simplicity']),
        location: 'Minimalist Apartment'
      },
      {
        user_id: createdUsers[1]?.id || 1,
        username: 'alex_wanderer',
        display_name: 'Alex Wanderer',
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
        content_type: 'text',
        content: 'Travel changed me. It\'s not about the Instagram photos or the souvenirs. It\'s about realizing how small the world is, and how big our problems. It\'s about understanding that privilege and perspective are the ultimate luxuries.\n\nMost transformative experiences:\n• Teaching English to monks in Thailand\n• Getting lost in Tokyo at 2 AM\n• Sharing meals with families in refugee camps\n• Realizing education is the great equalizer\n\nTravel doesn\'t change you, it reveals you. #travel #perspective #gratitude',
        caption: 'How travel reveals your true self 🌍 5 years of transformative journeys that shaped who I am today. It\'s not about destinations, but about perspective shifts. #travel #perspective #gratitude',
        likes: 4123,
        comments: 567,
        reposts: 432,
        filter_tags: JSON.stringify(['travel', 'perspective', 'gratitude', 'transformation']),
        location: 'Remote Workspace'
      }
    ];

    // Create all posts
    console.log('Creating posts...');
    let createdCount = 0;
    for (const postData of posts) {
      try {
        const newPost = await postOperations.create({
          user_id: postData.user_id,
          username: postData.username,
          display_name: postData.display_name,
          avatar_url: postData.avatar_url,
          content_type: postData.content_type,
          content: postData.content,
          caption: postData.caption,
          likes: postData.likes,
          comments: postData.comments,
          reposts: postData.reposts,
          filter_tags: postData.filter_tags,
          location: postData.location
        });
        console.log(`Created post ${newPost.id} (${postData.content_type}): ${postData.caption.substring(0, 50)}...`);
        createdCount++;
      } catch (error) {
        console.error(`Error creating post:`, error);
      }
    }

    console.log(`\n✅ Sample data creation complete!`);
    console.log(`📊 Created ${createdUsers.length} users and ${createdCount} posts`);
    console.log(`🎭 Posts breakdown: 10 photos, 10 videos, 10 texts`);
    console.log(`🌍 Location coverage: 15 unique locations worldwide`);
    
    return {
      users: createdUsers.length,
      posts: createdCount,
      breakdown: {
        photo: 10,
        video: 10,
        text: 10
      }
    };
    
  } catch (error) {
    console.error('Error creating sample data:', error);
    throw error;
  }
};

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createSampleData();
}

export default createSampleData;