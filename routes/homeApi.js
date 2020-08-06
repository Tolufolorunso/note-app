const {
    serveStaticFile
} = require('../service.js');
const fs = require('fs');
const {
    parse
} = require('querystring');

function fetchDataFromTopics(topic) {
    try {
        const data = fs.readFileSync(`./${topic}/${topic}.json`, 'utf8');
        const dataObj = JSON.parse(data);
        return dataObj;
    } catch (error) {
        return [];
    }
}

function deleteNote(res, topic, id) {
    fs.readFile(`./${topic}/${topic}.json`, 'utf8', function (error, data) {
        if (error) {
            return [];
        }
        if (JSON.parse(data).length === 1) {
            fs.rmdir(`./${topic}`, {
                recursive: true
            }, error => {
                if (error) {
                    console.log('error on line 56', error)
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
                        if (error) console.log(error);
                        console.log(newData);
                    }
                );
            });
        }
    });
    // serveStaticFile(res, '/api/api.json', 'application/json', 200);
}

const updateNote = (note, topic, id, timeCreated) => {
    const newUpdatedNotes = [];
    const updatedNote = {
        note,
        topic,
        id,
        timeCreated,
        timeUpdated: new Date().getTime()
    };

    const fetchNotes = fetchDataFromTopics(topic);
    newUpdatedNotes.push(updatedNote);
    fetchNotes.forEach(each => {
        if (each.id !== id) {
            newUpdatedNotes.push(each);
        }
    });
    console.log(newUpdatedNotes);

    fs.writeFile(
        `./${topic}/${topic}.json`,
        JSON.stringify(newUpdatedNotes),
        (error, file) => {
            if (error) return false;
        }
    );
};

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
        const {
            topic,
            id,
            note,
            timeCreated
        } = JSON.parse(body);
        console.log('body', body)
        if (note) {
            if (topic === 'study') {
                updateNote(note, topic, id, timeCreated);
            } else if (topic === 'work') {
                updateNote(note, topic, id, timeCreated);
            } else if (topic === 'personal') {
                updateNote(note, topic, id, timeCreated);
            }
        } else {
            if (topic === 'study') {
                deleteNote(res, topic, id);
            } else if (topic === 'work') {
                deleteNote(res, topic, id);
            } else if (topic === 'personal') {
                deleteNote(res, topic, id);
            }
        }
    });
};
