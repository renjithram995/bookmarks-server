
const authRoutes = require('./authRoutes');
const githubRoutes = require('./githubRoutes');
const bookmarkRoutes = require('./bookmarkRoutes');
const healthCheckRoutes = require('./healthCheck');
const appPackage = require('../package.json');

const routesHandler = (app) => {
  app.use('/auth', authRoutes);
  app.use('/github', githubRoutes);
  app.use('/bookmarks', bookmarkRoutes);
  app.use('/health-check', healthCheckRoutes);

  app.get('/', function (_req, res) {
    res.writeHead(225, {
      'Content-Type': 'text/html'
    });
    res.end(`<h4 style='display: flex;justify-content: center;letter-spacing: 0.4;'>${appPackage.name.toUpperCase()}</h4>`)
  })
  app.get('/*', function (_req, res) {
    res.redirect('/')
  })
};
  
module.exports = routesHandler;