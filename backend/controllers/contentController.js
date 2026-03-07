const Event = require('../models/Event');
const Product = require('../models/Product');
const BlogPost = require('../models/BlogPost');
const Startup = require('../models/Startup');
const TeamMember = require('../models/TeamMember');
const Advisor = require('../models/Advisor');
const Joi = require('joi');

// Basic list endpoints (read-only for now)
const listFactory = (Model, defaultSort = { createdAt: -1 }) => async (req, res) => {
  try {
    const filter = {};
    // optional category/type filters
    if (req.query.category) filter.category = req.query.category;
    if (req.query.type) filter.type = req.query.type;
    const items = await Model.find(filter).sort(defaultSort).lean();
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    console.error('List error', Model.modelName, err);
    res.status(500).json({ success: false, message: 'Unable to fetch data' });
  }
};

// Seed initial content (dev only)
const seedContent = async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Seeding disabled in production' });
    }
    if (!process.env.SEED_KEY || req.query.key !== process.env.SEED_KEY) {
      return res.status(401).json({ success: false, message: 'Unauthorized seed attempt' });
    }

    const seedIfEmpty = async (Model, data) => {
      const count = await Model.countDocuments();
      if (count === 0) await Model.insertMany(data);
      return Model.countDocuments();
    };

    const events = [
      { title:'Startup Bootcamp 2025', date:'2025-06-15', location:'PSTU Auditorium', type:'upcoming', category:'Workshop', cover:'', excerpt:'3-day intensive idea to MVP experience.' },
      { title:'Annual Pitch Competition', date:'2025-07-05', location:'Incubation Center', type:'upcoming', category:'Competition', cover:'', excerpt:'Pitch to investors & win seed credits.' },
      { title:'Innovation Summit 2024', date:'2024-02-10', location:'Main Hall', type:'past', category:'Conference', cover:'', excerpt:'Flagship annual innovation gathering.' }
    ];
    const products = [
      { name:'Club T-Shirt', price:300, category:'Apparel', badge:'Bestseller', img:'' },
      { name:'Club Mug', price:150, category:'Accessories', img:'' }
    ];
    const posts = [
      { title:'Validating Your Startup Idea', date:'2025-02-14', category:'Startup Basics', cover:'', excerpt:'Lean validation loops.', readTime:5 },
      { title:'Funding Options for Students', date:'2025-01-28', category:'Funding', cover:'', excerpt:'Bootstrap & grants.', readTime:6 }
    ];
    const startups = [
      { name:'AgriTech Solutions', tagline:'IoT farming intelligence', stage:'Scaling', cover:'' },
      { name:'EduTech BD', tagline:'Accessible rural education', stage:'Growth', cover:'' }
    ];
    const team = [
      { name:'Rahim Khan', role:'President', department:'CSE', avatar:'', socials:{ linkedin:'#' } },
      { name:'Tasnim Ahmed', role:'Vice President', department:'BBA', avatar:'', socials:{ linkedin:'#' } }
    ];

    const results = {
      events: await seedIfEmpty(Event, events),
      products: await seedIfEmpty(Product, products),
      posts: await seedIfEmpty(BlogPost, posts),
      startups: await seedIfEmpty(Startup, startups),
      team: await seedIfEmpty(TeamMember, team),
      advisors: await seedIfEmpty(Advisor, [])
    };

    res.json({ success: true, seeded: results });
  } catch (err) {
    console.error('Seed error', err);
    res.status(500).json({ success: false, message: 'Seed failed' });
  }
};

module.exports = {
  listEvents: listFactory(Event, { date: 1 }),
  listProducts: listFactory(Product),
  listPosts: listFactory(BlogPost, { date: -1 }),
  listStartups: listFactory(Startup),
  listStartups: listFactory(Startup),
  listTeam: listFactory(TeamMember),
  listAdvisors: listFactory(Advisor),
  seedContent
};
