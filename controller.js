const http = require('http');
const { parse } = require('querystring');

const { home } = require('./routes/home.js');
const { work } = require('./routes/work.js');
const { study } = require('./routes/study.js');
const { personal } = require('./routes/personal.js');
const { helper } = require('./helper.js');
const { serveStaticFile } = require('./service.js');

module.exports = http.createServer((req, res) => {
	//GET form request and POST request
	if (req.url == '/' && req.method === 'GET') {
		home(req, res);
	} else if (req.url == '/' && req.method === 'POST') {
		//recieving data as buffer from the form
		var body = '';
		req.on('data', chunk => {
			body += chunk.toString();
		});

		req.on('end', () => {
			//parse the data
			const dataObj = parse(body);
			const newData = {
				note: dataObj.note,
				topic: dataObj.topic
			};

			if (dataObj.topic === 'work') {
				helper(req, res, newData, 'work');
			} else if (dataObj.topic === 'study') {
				helper(req, res, newData, 'study');
			} else if (dataObj.topic === 'personal') {
				helper(req, res, newData, 'personal');
			}
		});
		// home(req, res);
	} else if (req.url == '/work' && req.method === 'GET') {
		work(req, res);
	} else if (req.url == '/study' && req.method === 'GET') {
		study(req, res);
	} else if (req.url == '/personal' && req.method === 'GET') {
		personal(req, res);
	} else if ('/beautify.css') {
		serveStaticFile(res, '/views/beautify.css', 'text/css');
	} else {
		res.writeHead(404, { 'Content-Type': 'text/html' });
		res.end('<h2>Page not found</h2>');
	}
});
