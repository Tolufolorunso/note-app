const fs = require('fs');

module.exports.serveStaticFile = (res, path, contentType, responseCode) => {
	if (!responseCode) responseCode = 200;
	fs.readFile(__dirname + path, function (error, data) {
		if (error) {
			if (error.code === 'ENOENT') {
				res.writeHead(400, { 'Content-Type': 'text/html' });
				console.log(path.split('/')[1]);
				res.end(`<h2>Topic not found</h2>
					<p>You have not added note(s) under this topic <b>${path
						.split('/')[1]
						.toUpperCase()}</b>.</p>
				`);
			}
			res.writeHead(500, { 'Content-Type': 'text/plain' });
			res.end('');
		} else {
			res.writeHead(responseCode, { 'Content-Type': contentType });
			res.end(data);
		}
	});
};
