var expressLayouts = require("express-ejs-layouts");
var express = require('express');
var cookieParser = require('cookie-parser');
const session = require("express-session");
var prod_array = [];

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();
app.use(expressLayouts);
app.set("view engine", "ejs");
// app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
app.use(express.static('public'));
app.use(cookieParser())
app.use(
  session({
    secret: "Secret",
    cookie: { maxAge: 60000 },
    resave: true,
    saveUninitialized: true,
  })
);
app.use(require("./middlewares/checkSession"));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;

var express = require("express")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")




app.use(express.static('public'))
app.use(bodyParser.urlencoded({
    extended:true
}))

mongoose.connect('mongodb://127.0.0.1/finaldb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var db = mongoose.connection;

db.on('error',()=>console.log("Error in Connecting to Database"));
db.once('open',()=>console.log("Connected to Database"))

app.get('/signup', (req,res) => {
  res.render("signup");
})

app.get('/login', (req,res) => {
  res.render('login');
})

app.get('/admin', (req,res) => {
  res.render('admin');
})

app.post('/delete', (req,res) => {
  (async () => {
    try {
      const deletedUser = await monmodel1.findOneAndDelete({ name: req.body.name });
      if (!deletedUser) {
        req.setFlash("danger", "User not found!");
        console.log('not found.');
      } else {
        req.setFlash("success", "Deleted successfully!");
        console.log('deleted successfully.');
      }
    } catch (err) {
      req.setFlash("danger", "Could not delete user!");
      console.error(err);
    }
    })();
    res.redirect('/products');
})

app.get('/products', (req,res) => {
  (async () => {
    try {
      const prods = await monmodel1.find({}).lean();
      prod_array = prods.map(user => ({ ...user }));
      console.log(prod_array);
    } catch (err) {
      console.error(err);
    }
    res.render('products', {users: prod_array});
  })();
})

app.post("/signup",(req,res)=>{
    var name = req.body.name;
    var email = req.body.email;
    var phno = req.body.phno;
    var password = req.body.password;
    var admin = false;
  if(req.body.isAdmin=='on') admin = true;

    var data = {
        "name": name,
        "email" : email,
        "phno": phno,
        "password" : password,
        "isAdmin":admin
    }

    db.collection('users').insertOne(data,(err,collection)=>{
        if(err){
          console.log(err);
        }
        console.log("Record Inserted Successfully");
    });

    return res.render('login')

})

app.post("/products",(req,res)=>{
  var name = req.body.name;
  var quantity = req.body.quantity;
  var category = req.body.category;
  

  var data = {
      "name": name,
      "quantity" : quantity,
      "category": category,
      
  }

  db.collection('products').insertOne(data,(err,collection)=>{
      if(err){
        console.log(err);
      }
      console.log("products Inserted Successfully");
  });

  return res.render('products')

})

app.post("/login", (req, res) => {
  var name = req.body.name;
  var password = req.body.password;

  // Check if the user exists in the database
  db.collection('users').findOne({ name: name }, (err, user) => {
    if (err) {
      console.log(err)
    }

    if (!user) {
      // User is not signed up, show error message
      return res.send("Please sign up before logging in.");
    }

    
    if (password != user.password) {
      // Incorrect password, show error message
      return res.send("Incorrect password.");
    }

    // Login successful
    req.setFlash("success", "Logged in Successfully");
    console.log("Login Successfully");
    req.session.user = user;
    return res.redirect("/");
  });
});

// Defining User schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }, 
  email: {
    type: String,
    unique: true,
    required: true
  }, 
  phno: {
    type: Number,
    required: true
  }, 
  password: {
    type: String,
    required: true
  },
  isAdmin: {
    type: Boolean,
    required: true
  }
})


const products = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true
  }, 
  quantity: {
    type: Number,
    unique: true,
    required: true
  }, 
  category: {
    type: String,
    required: true
  }, 
})
// Defining User model
const monmodel = mongoose.model('User', userSchema)
const monmodel1 = mongoose.model('products', products)

app.listen(4000, () => {
  console.log("Server Started");
});


console.log("Listening on PORT 4000");

app.get("/", (req, res) => {
  res.render("homepage");
});