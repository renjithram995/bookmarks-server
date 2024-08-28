
const authRoutes = require('./authRoutes');
const githubRoutes = require('./githubRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const healthCheckRoutes = require('./healthCheck');
const routesHandler = (app) => {
  app.use('/auth', authRoutes);
  app.use('/github', githubRoutes);
  app.use('/bookmarks', bookmarkRoutes);
  app.use('/health-check', healthCheckRoutes);
};
  
module.exports = routesHandler;