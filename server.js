var express = require('express');
var app = express();
const path = require('path');

var moveroutes = require('./src/app/config/apiroutes');

app.use(express.static(path.join(__dirname, 'dist/Reportsapp')));

app.use('/apiroutes', moveroutes);

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/Reportsapp/index.html'))
});

const http = require('http');
const port = process.env.PORT || '3001';
app.set('port', port);
const server = http.createServer(app);
server.listen(port, () => console.log(`API running on localhost:${port}`));