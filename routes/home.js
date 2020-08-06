const {
  serveStaticFile
} = require('../service.js');

module.exports.home = (req, res) => {
  serveStaticFile(res, '/views/index.html', 'text/html');
};
