const {
  serveStaticFile
} = require('../service.js');
module.exports.personal = (req, res) => {
  serveStaticFile(res, '/personal/personal.json', 'application/json', 200);
};
