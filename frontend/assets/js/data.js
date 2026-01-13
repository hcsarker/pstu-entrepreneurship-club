// Centralized mock data sets for dynamic rendering
// In future, can be replaced by API fetch (e.g., /api/...)

export const events = [
  { id:1, title:'Startup Bootcamp 2025', date:'2025-06-15', location:'PSTU Auditorium', type:'upcoming', category:'Workshop', cover:'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=70', excerpt:'3-day intensive idea to MVP experience.' },
  { id:2, title:'Annual Pitch Competition', date:'2025-07-05', location:'Incubation Center', type:'upcoming', category:'Competition', cover:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70', excerpt:'Pitch to investors & win seed credits.' },
  { id:3, title:'Digital Marketing Workshop', date:'2025-07-20', location:'Computer Lab', type:'upcoming', category:'Workshop', cover:'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=70', excerpt:'Hands-on growth & funnel strategies.' },
  { id:4, title:'Innovation Summit 2024', date:'2024-02-10', location:'Main Hall', type:'past', category:'Conference', cover:'https://images.unsplash.com/photo-1485217988980-11786ced9454?auto=format&fit=crop&w=800&q=70', excerpt:'Flagship annual innovation gathering.' },
  { id:5, title:'Green Tech Hackathon', date:'2024-11-12', location:'Innovation Lab', type:'past', category:'Hackathon', cover:'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=70', excerpt:'48-hour sustainability challenge.' }
  { id:6, title:'Entrepreneurship Summit 2025', date:'2025-08-10', location:'Main Hall', type:'upcoming', category:'Conference', cover:'https://images.unsplash.com/photo-1531058020387-3be344556be6?auto=format&fit=crop&w=800&q=70', excerpt:'Flagship summit bringing founders, mentors, and investors.' }
];

export const products = [
  { id:1, name:'Club T-Shirt', price:300, badge:'Bestseller', category:'Apparel', img:'assets/images/club-materials.png' },
  { id:2, name:'Club Mug', price:150, badge:null, category:'Accessories', img:'assets/images/club-materials.png' },
  { id:3, name:'Club Notebook', price:120, badge:'Limited', category:'Stationery', img:'assets/images/club-materials.png' },
  { id:4, name:'Club Hoodie', price:500, badge:'New', category:'Apparel', img:'assets/images/club-materials.png' },
  { id:5, name:'Laptop Sticker Pack', price:80, badge:null, category:'Accessories', img:'assets/images/club-materials.png' },
  { id:6, name:'Executive Pen', price:100, badge:null, category:'Stationery', img:'assets/images/club-materials.png' }
];

export const blogPosts = [
  { id:101, title:'Validating Your Startup Idea', date:'2025-02-14', category:'Startup Basics', cover:'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=70', excerpt:'Learn lean validation loops & reduce risk.', readTime:5 },
  { id:102, title:'Funding Options for Students', date:'2025-01-28', category:'Funding', cover:'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=70', excerpt:'Bootstrap, grants, micro investors & more.', readTime:6 },
  { id:103, title:'Building MVP the Smart Way', date:'2024-12-20', category:'Product', cover:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=70', excerpt:'Prioritize core value & feedback cycles.', readTime:7 },
  { id:104, title:'Design Thinking for Founders', date:'2025-02-01', category:'Innovation', cover:'https://images.unsplash.com/photo-1492724441997-5dc865305da7?auto=format&fit=crop&w=800&q=70', excerpt:'Empathy-driven approach to solution design.', readTime:4 }
];

export const startups = [
  { id:201, name:'AgriTech Solutions', tagline:'IoT farming intelligence', stage:'Scaling', cover:'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=70' },
  { id:202, name:'EduTech BD', tagline:'Accessible rural education', stage:'Growth', cover:'https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=800&q=70' },
  { id:203, name:'Green Packaging', tagline:'Eco packaging innovation', stage:'Pilot', cover:'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=70' },
  { id:204, name:'MediCare', tagline:'Telemedicine access', stage:'Early', cover:'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=70' }
];

export const teamMembers = [
  { id:301, name:'Rahim Khan', role:'President', department:'CSE', avatar:'https://randomuser.me/api/portraits/men/32.jpg', socials:{linkedin:'#', facebook:'#'} },
  { id:302, name:'Tasnim Ahmed', role:'Vice President', department:'BBA', avatar:'https://randomuser.me/api/portraits/women/44.jpg', socials:{linkedin:'#'} },
  { id:303, name:'Sajid Rahman', role:'General Secretary', department:'EEE', avatar:'https://randomuser.me/api/portraits/men/76.jpg', socials:{github:'#'} },
  { id:304, name:'Fatima Akter', role:'Head of Events', department:'Agri', avatar:'https://randomuser.me/api/portraits/women/68.jpg', socials:{instagram:'#'} },
  { id:305, name:'Shuvo Das', role:'Tech Lead', department:'CSE', avatar:'https://randomuser.me/api/portraits/men/12.jpg', socials:{github:'#'} },
  { id:306, name:'Maliha Noor', role:'Marketing Lead', department:'BBA', avatar:'https://randomuser.me/api/portraits/women/12.jpg', socials:{dribbble:'#'} }
];

// GALLERY: Local asset images for the photo gallery
export const galleryImages = [
  { src: 'assets/images/547681134_122180583572564989_6191046846726229010_n.jpg', alt: 'Club event moment 1' },
  { src: 'assets/images/552885768_122181443138564989_1335234260207935214_n.jpg', alt: 'Club event moment 2' },
  { src: 'assets/images/553295222_122181595376564989_3669177668535221672_n.jpg', alt: 'Club event moment 3' },
  { src: 'assets/images/554555010_122182089860564989_3791081792842274683_n.jpg', alt: 'Club event moment 4' },
  { src: 'assets/images/571022729_122186224298564989_4893407098330538923_n.jpg', alt: 'Club event moment 5' },
  { src: 'assets/images/590877411_122191041788564989_1420952966212735132_n.jpg', alt: 'Club event moment 6' },
  { src: 'assets/images/Digital marketing course.jpg', alt: 'Workshop snapshot' },
  { src: 'assets/images/aboutsection.jpg', alt: 'Club members group' }
];

// VIDEOS: YouTube embeds (replace ids with club channel’s videos)
export const youtubeVideos = [
  { id: 'dQw4w9WgXcQ', title: 'Event Highlights' },
  { id: '3fumBcGZQK0', title: 'Pitch Competition Recap' },
  { id: 'lTTajzrSkCw', title: 'Workshop Moments' }
];

// Simple category extraction helpers
export const blogCategories = [...new Set(blogPosts.map(p => p.category))];
export const productCategories = [...new Set(products.map(p => p.category))];
export const eventCategories = [...new Set(events.map(e => e.category))];
