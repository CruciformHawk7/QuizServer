const
    clientSessions = require(`client-sessions`),
    express = require(`express`),
    app = express(),
    body = require(`body-parser`),
    ip = require('ip'),
    fs = require('fs');

// prepare index, quiz, header, etc.
// requires: index.html, quiz.html, header.html, [questions.csv]
var indexFile, quizFile, headerFile, logFile;

function logWrite(data) {
    data += `${new Date().toString().slice(16, 24)}: `;
    fs.appendFile('log.txt', data, (err) => {
        if (err) console.log(`Error while writing log.`);
    });
}

fs.readFile(`index.html`, `utf8`, (err, data) => {
    if (err) {
        console.log(`Failed to serve index.html`);
        logWrite(`Failed to server index.html`);
    }
    indexFile = data;
});

fs.readFile(`quiz.part.html`, 'utf8', (err, data) => {
    if (err) {
        console.log(`Failed to serve quiz.part.html`);
        logWrite(`Failed to serve quiz.part.html`);
    quizFile = data;
});

app.use(body.json());
app.use(body.urlencoded({ extended: true }));

app.use(clientSessions({
    secret: 'ZVEoHzyY9hvsDutDtxA8iVX6NWWtWMF',
    name: 'quizCookie'
}));

app.get('/', (request, response) => {
    if (request.session_state.playerCode) {
        response.redirect('/quiz');
    } else {
        console.log(`Request ${new Date().toString().slice(16, 24)} 
                    @ ${request.ip.toString().slice(7)}`);
        response.send(indexFile);
    }
});

app.post('/login', (request, response) => {
    request.session_state.playerCode = request.body.playerCode;
    console.log(`IP ${request.ip.toString().slice(7)} 
        is ${request.body.playerCode}`);
    response.end('done');
    response.redirect('/');
});

app.get('/quiz', (response, redirect) => {
    response.send(quizFile);
});

app.post('/quizDone', function (request, response) {
    //log data
    req.session_state.reset();
    response.redirect('/');
});

app.listen(3000);

console.log(`Navigate to http://${ip.address()}:${process.env.PORT || 3000} on client machines.`);
console.log(`Press Ctrl + C to quit`);
console.log(`Log `);

if (process.platform === "win32") {
    var rl = require("readline").createInterface({
       input: process.stdin,
       output: process.stdout
    });
 
    rl.on("SIGINT", () => {
       process.emit("SIGINT");
    });
 }
 
 process.on("SIGINT", () => {
    console.log(`BYE!`);
    process.exit();
 });