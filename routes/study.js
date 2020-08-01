const { serveStaticFile } = require('../service.js');
module.exports.study = (req, res) => {
	serveStaticFile(res, '/study/study.json', 'application/json', 200);
};
