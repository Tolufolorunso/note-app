const fs = require('fs');
const fsPath = require('fs-path');
const { serveStaticFile } = require('./service.js');

module.exports.helper = (req, res, newData, topic) => {
	let oldFile;
	fs.open(`./${topic}/${topic}.json`, (error, fd) => {
		if (error) {
			if (error.code === 'ENOENT') {
				fsPath.writeFileSync(`./${topic}/${topic}.json`, JSON.stringify([]));
				return;
			}
		}
		console.log(fd);
		return;
	});

	setTimeout(function () {
		try {
			const data = fs.readFileSync(`./${topic}/${topic}.json`, 'utf8');
			oldFile = JSON.parse(data);
			oldFile.push(newData);
		} catch (error) {
			console.log('file not found');
		}

		fs.writeFile(
			`./${topic}/${topic}.json`,
			JSON.stringify(oldFile),
			(error, file) => {
				if (error) {
					//   throw error;
					console.log('error 2');
				}
				// res.statusCode = 200;
				// res.setHeader('Content-Type', 'application/json');
				// res.end(JSON.stringify(oldFile));
				serveStaticFile(res, '/views/index.html', 'text/html', 201);
			}
		);
	}, 0);
};
