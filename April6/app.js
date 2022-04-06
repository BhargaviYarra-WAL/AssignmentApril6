var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require("express-session");
var app = express();
//const mongoose = require("mongoose");

var sqRoute = require("./routes/sqproducts");
var usersRouter = require("./routes/users");
var productRouter = require("./routes/products");
var companyRoute = require("./routes/company");
var employeRoute = require("./routes/employee");
var transactionRoute = require("./routes/transactions");

{
  /*require("dotenv").config();
console.log(`The application name is ${process.env.appName}`);
mongoose.connect(process.env.mongoConnUrl, { useNewUrlParser: true });
let db = mongoose.connection;
db.on("error", function (error) {
  console.log("unable to connect to mongoDB");
  console.log(error);
});
db.on("open", function () {
  console.log("we are connected to mongodb server via mongoose");
});*/
}
app.use(
  session({
    secret: "session_secret_key",
    resave: true,
    saveUninitialized: true,
    cookie: {
      secure: false,
    },
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/sqproducts", sqRoute);

app.use("/users", usersRouter);
app.use("/products", productRouter);
app.use("/company", companyRoute);
app.use("/employee", employeRoute);
app.use("/transactions", transactionRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
