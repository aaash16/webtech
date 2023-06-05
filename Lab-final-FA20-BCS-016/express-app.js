const express = require("express");
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
var expressLayouts = require("express-ejs-layouts");
var products = [];

app.use(bodyParser.urlencoded({limit: '5000mb', extended: true, parameterLimit: 100000000000}));
app.use(expressLayouts);

let model = require("./models/Products");

app.set("view engine", "ejs");
app.use(express.json());
app.get("/",async (req,res) => {
    (async () => {
      try {
        const prod = await model.find({}).lean();
        products = prod.map(pr => ({ ...pr }));
        console.log(prod);
      } catch (err) {
        console.error(err);
      }
      return res.render('homepage', {prod: products});
    })();
})

app.post("/delete", (req,res) => {
    (async () => {
    try {
        const deleted = await model.findOneAndDelete({ title: req.body.title });
        if (!deleted) {
        console.log('not found.');
        } else {
        console.log('deleted successfully.');
        }
    } catch (err) {
        console.error(err);
    }
    })();
    res.redirect('/');
})

app.get("/products", (req,res) => {
    res.render('products');
})

app.post("/products", async (req,res) => {

    const data= new model({
        color:req.body.color,
        title:req.body.title,
        price:req.body.price
    })

    try {
        const val = await data.save();
        console.log(val)
        res.redirect("/")
    }
    catch (err) {
        console.log(err)
        res.redirect("/products")
    }
})

mongoose.connect("mongodb://127.0.0.1/labfinal", { useNewUrlParser: true});

mongoose.connection
    .once("open", () => console.log("MongoDB Connected Succesfully"))
    .on("error", error => {
        console.log(error);
    });


app.listen(3000, () => {
  console.log("Listening at port 3000");
});
