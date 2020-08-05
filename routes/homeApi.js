const { serveStaticFile } = require('../service.js');
const fs = require('fs');
const { parse } = require('querystring');

// function work() {
// 	try {
// 		const work = fs.readFileSync('./work/work.json', 'utf8');
// 		const workObj = JSON.parse(work);
// 		return workObj;
// 	} catch (error) {
// 		return [];
// 	}
// }
// function personal() {
// 	try {
// 		const personal = fs.readFileSync('./personal/personal.json', 'utf8');
// 		const personalObj = JSON.parse(personal);
// 		return personalObj;
// 	} catch (error) {
// 		return [];
// 	}
// }
// function study() {
// 	try {
// 		const study = fs.readFileSync('./study/study.json', 'utf8');
// 		const studyObj = JSON.parse(study);
// 		return studyObj;
// 	} catch (error) {
// 		return [];
// 	}
// }
function fetchDataFromTopics(topic) {
	try {
		const data = fs.readFileSync(`./${topic}/${topic}.json`, 'utf8');
		const dataObj = JSON.parse(data);
		return dataObj;
	} catch (error) {
		return [];
	}
}
function deleteNote(topic, id) {
	fs.readFile(`./${topic}/${topic}.json`, 'utf8', function (error, data) {
		if (error) {
			return [];
		}
		if (JSON.parse(data).length === 1) {
			fs.rmdir(`./${topic}`, { recursive: true }, error => {
				if (error) {
				}
			});
		} else {
			fs.readFile(`./${topic}/${topic}.json`, 'utf8', (error, data) => {
				if (error) {
					return false;
				}
				let oldData = JSON.parse(data);
				let newData = oldData.filter(each => {
					return each.id !== id;
				});

				fs.writeFile(
					`./${topic}/${topic}.json`,
					JSON.stringify(newData),
					(error, file) => {
						if (error) return false;
						// serveStaticFile(res, '/api/api.json', 'application/json', 200);
					}
				);
			});
		}
	});
}

exports.homeApi = (req, res) => {
	const api = [];
	const personal = fetchDataFromTopics('personal');
	const work = fetchDataFromTopics('work');
	const study = fetchDataFromTopics('study');

	if (typeof personal !== 'undefined') {
		personal.forEach(i => {
			if (i) api.push(i);
		});
	}
	if (typeof work !== 'undefined') {
		work.forEach(i => {
			if (i) api.push(i);
		});
	}
	if (typeof study !== 'undefined') {
		study.forEach(i => {
			if (i) api.push(i);
		});
	}

	fs.writeFile('./api/api.json', JSON.stringify(api), (error, file) => {
		if (error) return false;
	});

	serveStaticFile(res, '/api/api.json', 'application/json', 200);
};

exports.crudOperation = (req, res) => {
	let body = [];
	req.on('data', chunk => {
		body.push(chunk);
	});
	req.on('end', () => {
		body = Buffer.concat(body).toString();
		const { topic, id } = JSON.parse(body);
		if (topic === 'study') {
			deleteNote(topic, id);
		} else if (topic === 'work') {
			deleteNote(topic, id);
		} else if (topic === 'personal') {
			deleteNote(topic, id);
		}
	});
};
