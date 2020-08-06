const http = require('http');
// const { parse } = require('querystring');

const {
  homeApi,
  crudOperation
} = require('./routes/homeApi.js');

const {
  home
} = require('./routes/home.js');

const {
  work
} = require('./routes/work.js');
const {
  study
} = require('./routes/study.js');
const {
  personal
} = require('./routes/personal.js');
const {
  helper
} = require('./helper.js');
const {
  serveStaticFile
} = require('./service.js');

module.exports = http.createServer((req, res) => {
  //GET form request and POST request
  if (req.url == '/' && req.method === 'GET') {
    home(req, res);
  } else if (req.url == '/' && req.method === 'POST') {
    //recieving data as buffer from the form
    let body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });

    req.on('end', () => {
      //parse the data
      body = Buffer.concat(body).toString();
      body = JSON.parse(body);
      const {
        topic,
        note
      } = body;

      const newData = {
        note: note,
        topic: topic,
        id: topic + '-' + Math.floor(Math.random() * 57876547 + 1),
        timeCreated: new Date().getTime()
      };

      if (newData.topic === 'work') {
        helper(req, res, newData, 'work');
      } else if (newData.topic === 'study') {
        helper(req, res, newData, 'study');
      } else if (newData.topic === 'personal') {
        helper(req, res, newData, 'personal');
      }
    });
    // home(req, res);
  } else if (req.url == '/api/home' && req.method === 'GET') {
    homeApi(req, res);
  } else if (req.url == '/api/notes' && req.method === 'POST') {
    crudOperation(req, res);
  } else if (req.url == '/api/notes' && req.method === 'PATCH') {
    crudOperation(req, res);
  } else if (req.url == '/work' && req.method === 'GET') {
    work(req, res);
  } else if (req.url == '/study' && req.method === 'GET') {
    study(req, res);
  } else if (req.url == '/personal' && req.method === 'GET') {
    personal(req, res);
  } else if (req.url == '/beautify.css' && req.method === 'GET') {
    serveStaticFile(res, '/views/beautify.css', 'text/css');
  } else if (req.url == '/life.js' && req.method === 'GET') {
    serveStaticFile(res, '/views/life.js', 'text/js');
  } else {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    });
    res.end('<h2>Page not found</h2>');
  }
});
