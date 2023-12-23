const express = require('express');
const app = express();
const session = require('express-session');

const morgan = require('morgan');
const path = require('path');

require('dotenv').config();

const connectDB = require('./server/database/connection');
//session
app.use(session({ 
  secret:'key',
  resave: true, 
  saveUninitialized: true 
}));

//clear cache
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate"); 
  res.setHeader("Pragma", "no-cache"); 
  res.setHeader("Expires", "0");
  next(); 
});

// Parsing the incoming request payloads
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//morgan
app.use(morgan('tiny'));
 
// Connecting database
connectDB();
 
// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Specify the views directory
 
// Loading static files
app.use(express.static(path.join(__dirname, 'public')));



//loading userroutes
app.use('/',require('./server/routes/user_routes'));

//loading admin routes

app.use('/',require('./server/routes/admin_routes'))

app.all("*",(req,res)=>{
  res.status(400).render('error')
})


const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
  