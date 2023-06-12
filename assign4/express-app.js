const express = require("express");
const mongoose = require('mongoose');
const app = express();
var reload = require('reload');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
var expressLayouts = require("express-ejs-layouts");
const session = require("express-session");
const bcrypt = require("bcryptjs");
var users_array = [];
var products_array = [];
var cart_array = [];

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(bodyParser.json());
app.set("view engine", "ejs");
app.use(expressLayouts);
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
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.render("homepage");
});

app.post('/update-products', async (req,res) => {
  console.log(req.body.id)
  console.log(req.body.name)
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { name: req.body.name ,category:req.body},
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { category: req.body.category },
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { type: req.body.type },
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { quantity: req.body.quantity },
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { price: req.body.price },
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { front_img: req.body.front_img },
    { new: true }
  );
  await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { back_img: req.body.back_img },
    { new: true }
  );
  console.log('successful')

  res.redirect('/products')
})

app.get('/update-products', async (req,res) => {
  const dt = {
    _id: req.query.pr_id,
    name: req.query.pr_name,
    category: req.query.pr_category,
    type: req.query.pr_type,
    quantity: req.query.pr_quantity,
    price: req.query.pr_price,
    front_img: req.query.pr_fimg,
    back_img: req.query.pr_bimg
  }
  res.render('update-products', {data: dt})
})

app.post('/delete-cart', async (req,res) => {
  var product = await cart_model.findOne({id:req.body.id}).exec()
  var prod = await prod_model.findOne({_id:req.body.id}).exec()
  let quan = product.quantity;
  console.log(quan);
  const updatedUser = await prod_model.findOneAndUpdate(
    { _id: req.body.id },
    { quantity: prod.quantity + quan },
    { new: true }
  );
  cart_model.findOneAndDelete({ id: req.body.id }, (err, deletedUser) => {
    if (err) {
      console.error(err);
      req.setFlash("danger", "Could not delete cart item!");
    } else if (!deletedUser) {
      console.log('not found.');
      req.setFlash("danger", "cart item not found!");
    } else {
      console.log('deleted successfully.');
      req.setFlash("success", "Deleted successfully!");
    }
    res.redirect('/cart');
  });
})


app.get("/cart", async (req,res) => {
  try {
    const products = await cart_model.find({}).lean();
    cart_array = products.map(pr => ({ ...pr }));
    // console.log(products_array);
  } catch (err) {
    console.error(err);
  }
  res.render('cart',  { products: cart_array });
})

app.post("/cart", async (req,res) => {
  let quan = req.body.quantity;
  console.log(req.body.id);
  console.log(req.body.quantity);

  try {
    var product = await prod_model.findOne({_id:req.body.id}).exec()
    if(!product) {
      console.log("prod not found");
      req.setFlash("danger", "Product doesn't exist");
      return res.redirect("/");
    }
    if(quan > product.quantity) {
      console.log("not enough quantity available");
      req.setFlash("danger", "Insufficiemt quantity");
      return res.redirect("/");
    }
    else {
      console.log("adding to cart");

      const data= new cart_model({
        id:req.body.id,
        name:product.name,
        quantity:quan,
        price:product.price,
        amount:product.price*quan
    })
  
    try {
      const val = await data.save();
      console.log(val)
      req.setFlash("success", "Added to cart");

      const updatedUser = await prod_model.findOneAndUpdate(
        { _id: req.body.id },
        { quantity: product.quantity - quan },
        { new: true }
      );
    
      if (!updatedUser) {
        console.log("product not found!")
        // req.setFlash("danger","product not found!");
      }
      else {
        console.log("updated successfully!")
        // req.setFlash("success","updated successfully!")
      }

      res.redirect('/cart')
    }
    catch (err) {
      console.log(err)
      req.setFlash("danger", "Could not add to cart");
      res.redirect('/')
    }

    }
  }
  catch (err) {
    console.log(err)
  }
})

app.get("/men", async (req,res) => {
  try {
    const products = await prod_model.find({}).lean();
    products_array = products.map(pr => ({ ...pr }));
    // console.log(products_array);
  } catch (err) {
    console.error(err);
  }
  res.render('men',  { products: products_array });
})

app.get("/kid", async (req,res) => {
  try {
    const products = await prod_model.find({}).lean();
    products_array = products.map(pr => ({ ...pr }));
    // console.log(products_array);
  } catch (err) {
    console.error(err);
  }
  res.render('kid',  { products: products_array });
})

app.get("/women", async (req,res) => {
  try {
    const products = await prod_model.find({}).lean();
    products_array = products.map(pr => ({ ...pr }));
    // console.log(products_array);
  } catch (err) {
    console.error(err);
  }
  res.render('women',  { products: products_array });
})

app.route('/update-pr-quantity')
.get(async (req,res) => {
  console.log("inside pr quantity");
  // req.setProdType("quantity");
  // req.setProdName(req.body.name);
  console.log(req.body);
  return res.redirect('/products');
})

app.get('/update-pr-price', async (req,res) => {
  console.log("inside pr price");
  req.setProdType("price");
  req.setProdName(req.body.name);
  console.log(req.body.name);
  return res.redirect('/products');
})

app.route('/products')
.get(async (req,res) => {
  try {
    const prod = await prod_model.find({}).lean();
    products_array = prod.map(pr => ({ ...pr }));
    // console.log(products_array);
  } catch (err) {
    console.error(err);
  }
  try {
    const users = await monmodel.find({}).lean();
    users_array = users.map(user => ({ ...user }));
    // console.log(users_array);
  } catch (err) {
    console.error(err);
  }
  return res.render('add-products', { layout: false, prod: products_array, users: users_array});
})

app.route('/add-product')
.post(async (req,res) => {
  const data= new prod_model({
    name:req.body.name,
    category:req.body.category,
    type:req.body.type,
    quantity:req.body.quantity,
    price:req.body.price,
    front_img:req.body.front_img,
    back_img:req.body.back_img
})

try {
  const val = await data.save();
  console.log(val)
  req.setFlash("success", "Product added successfully!");
  res.redirect("/products")
}
catch (err) {
  console.log(err)
  req.setFlash("danger", "Could not add product!");
  res.redirect("/products")
}
})

app.route('/delete-product')
.post(async (req,res) => {
  prod_model.findOneAndDelete({ name: req.body.name }, (err, deleted) => {
    if (err) {
      console.error(err);
      req.setFlash("danger", "Could not delete product!");
    } else if (!deleted) {
      console.log('not found.');
      req.setFlash("danger", "product not found!");
    } else {
      console.log('deleted successfully.');
      req.setFlash("success", "Deleted successfully!");
    }
    return res.redirect('/products');
  });
})

app.route('/delete')
.post(async (req,res) => {
  (async () => {
    try {
      const deletedUser = await monmodel.findOneAndDelete({ username: req.body.uname });
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

app.route('/profile')
.get((req,res) => {
  res.render('profile');
})

app.route('/logout')
.get((req,res) => {
  req.session.user = null;
  req.setFlash("danger", "Logged out!");
  res.redirect("/login");
})

app.route('/dashboard')
.get((req,res) => {
  res.render("dashboard");
})

app.route('/login')
.get((req,res) => {
  res.render("login");
})
.post(async (req,res) => {
  console.log("Inside login route post function!");
  var uname = req.body.uname;
  console.log(uname);

  try {
    var user = await monmodel.findOne({uname:uname}).exec()
    if(!user) {
      console.log("ok");
      req.setFlash("danger", "Username doesn't exist");
      return res.redirect("login");
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(validPassword) {
      req.session.user = user;
      console.log("matched");
      req.setFlash("success", "Logged in Successfully");
      if(user.isAdmin) return res.redirect("/products");
      else return res.redirect('/')
    }
    else {
      console.log("not matched");
      req.setFlash("danger", "Invalid Password");
      return res.redirect("/login");
    }
  }
  catch (err) {
    console.log(err)
  }
})

app.route('/signup')
.get((req,res) => {
  res.render("signup")
})
.post(async (req,res) => {
  console.log("inside post function!");
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(req.body.password, salt);
  var admin = false;
  if(req.body.isAdmin=='on') admin = true; 
  
  const data= new monmodel({
      uname:req.body.uname,
      email:req.body.email,
      phno:req.body.phno,
      password:hashed,
      isAdmin:admin
  })

  try {
    const val = await data.save();
    console.log(val)
    req.setFlash("success", "Sign Up successful");
    res.redirect('/login')
  }
  catch (err) {
    console.log(err)
    req.setFlash("danger", "Could not Sign Up");
    res.redirect('/signup')
  }
})

// Making connection
mongoose.connect('mongodb://127.0.0.1/mydb',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection
    .once("open", () => console.log("Connected!"))
    .on("error", error => {
        console.log(error);
    });

let monmodel = require("./models/User");
let prod_model = require("./models/Product");
let cart_model = require("./models/Cart");

app.listen(5000, () => {
  console.log("Server Started");
});

reload(app);