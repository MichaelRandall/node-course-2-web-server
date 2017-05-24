const express = require('express');
const hbs = require('hbs');
const fs = require('fs');
const request = require('request');

const port = process.env.PORT || 3000;
var app = express();

//express' set uses key value pairs to
hbs.registerPartials(__dirname + '/views/partials')
//tells express what view engine to use
app.set('view engine', 'hbs');



//use registers middleware - this logs request data to screen
app.use((request, response, next) => {
  var now = new Date().toString();
  var log = `${now}: ${request.method} ${request.url}`;

  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) =>{
    if(err){
      console.log("trouble follows you");
    }
  });
  next(); //middleware needs to call next when it is done so app loads
});

//uncomment to intercept all requests since next is not called
//nothing after this is executed
// app.use((request, response, next) => {
//   response.render('maintenance.hbs');
// });

//use registers middleware - this serves up a directory
app.use(express.static(__dirname + '/public'));

//hbs helpers
hbs.registerHelper('getCurrentYear', ()=>{
  return new Date().getFullYear();
});

//hbs helpers
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

app.get('/projects', (request, response) => {
  response.render('projects.hbs',{
    pageTitle: 'Projects Page',
  });
});

app.get('/zoom', (req, res) =>{
  var options = {
    url:'https://api.zoomcare.com/zoomapi-service/v2/rest/content/type/event/'
  };
  request(options).pipe(res);
});

app.listen(port, ()=> {
  console.log(`Server is running on port ${port}`);
}); //binds app to aport on the machine
