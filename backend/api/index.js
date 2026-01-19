// Vercel Serverless entry: adapt file-system /api base to our Express app
const app = require('../server');

module.exports = (req, res) => {
  const u = req.url || '/';
  // Allow health and root to pass through unchanged
  const passthrough = u === '/' || u.startsWith('/health') || u.startsWith('/integrations');
  // If path doesn't already start with /api and isn't passthrough, prefix /api
  if (!passthrough && !u.startsWith('/api')) {
    req.url = '/api' + u;
  }
  return app(req, res);
};
