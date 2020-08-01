const { serveStaticFile } = require('../service.js');
module.exports.work = (req, res) => {
	serveStaticFile(res, '/work/work.json', 'application/json', 200);
};
