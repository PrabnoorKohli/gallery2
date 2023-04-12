

const HTTP_PORT = process.env.PORT || 3000;

// use require to bring in necessary modules
const express = require("express");
const exphbs = require('express-handlebars');
const path = require("path");
const app = express();
const readline = require("linebyline");
const session = require('client-sessions');
const bodyParser = require('body-parser');
const fs = require('fs');


// read each line of text in imagelist.txt and declare bikes array
const rl = readline("./imagelist.txt");
let bikes = [];
const users = JSON.parse(fs.readFileSync('./user.json', 'utf-8'));

// push bikes array as values for line
rl.on("line", (line, lineCount, byteCount) => {
    bikes.push(path.parse(line).name);
})
.on("error", (err) => {
    console.error(err);
});


// connect .hbs in views folder
app.engine(".hbs", exphbs.engine({
    extname: ".hbs",
    defaultLayout: false,
    layoutsDir: path.join(__dirname, "/views")
}));
app.set("view engine", ".hbs");
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static('./'));
app.use(express.static('public'));
app.use(express.static('images'));

//login page

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  cookieName: 'session',
  secret: 'random_string_goes_here',
  duration: 30 * 60 * 1000,
  activeDuration: 5 * 60 * 1000,
}));


//get routes for login page
app.get('/', (req, res) => {
    res.render('login');
  });


  

app.post('/login', (req, res) => {
    const { username, password } = req.body;
  
    if (users[username]) {
      if (users[username] === password) {
        req.session.user = username;
        res.redirect('/content');

      } else {
        res.render('login', { error: 'Invalid password' });
      }
    } else {
      res.render('login', { error: 'Not a registered username' });
    }
  });



// get values for browser side
app.get("/content", (req, res) => {
    let someData = {
        collection : bikes,
        choice : "Let the Race begin !!"
    };

        
    res.render('content', {
    data: someData});
});


// post selected image/button or use default if unselected
app.post("/content", (req, res) => {
    let inputData = req.body.rdoImage;
    if (inputData == undefined) {
        inputData = "Let the Race begin !!"
    }
    let someData = {
        collection : bikes,
        choice : inputData
    };

    res.render('content', {
    data: someData});
});


const server = app.listen(HTTP_PORT, () => {
    console.log(`Listening on port ${HTTP_PORT}`);
});