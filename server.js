const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

const port = process.env.PORT || 3000;
var app = express();

//express' set uses key value pairs to
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');

//app.use is called in the order that they in the file

//use registers middleware - this logs request data to screen
app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}: ${request.method} ${request.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n');
  next(); //middleware needs to call next when it is done so app loads
});

// app.use((request, response, next) => {
//   response.render('maintenance.hbs');
// });

//use registers middleware - this serves up a directory
app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text)=>{
  return text.toUpperCase();
})

//get registers handlers
//set routes using get
//request has headers, body info, method, path, etc..
//response set status codes, define what sent back, etc...
app.get('/', (request, response)=>{
  // response.send('<h1>Hello Express<h1>');
  response.render('home.hbs', {
    name: 'Mike',
    likes: [
      'Food',
      'Cities',
      'Movies',
      'Travel'
    ],
    pageTitle: 'Home Page',
    welcomeMessage: "Welcome Dude!"
  });
});

app.get('/about', (request, response) => {
  response.render('about.hbs', {
    pageTitle: 'About Page',
  });
});

app.get('/bad', (request, response) => {
  response.send({
    errorMessage: 'Unable to handle request!'
  });
});

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
}); //binds app to aport on the machine
