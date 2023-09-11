import express from "express";
import pgp from "pg-promise";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import dotenv from "dotenv";
import RestaurantRoute from "./routes/restaurantRoutes.js";
import restaurant from "./services/restaurant.js";

const app = express()
dotenv.config();

app.use(express.static('public'));
app.use(flash());

const pgp = pgPromise(); // Initialize it here

const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});
  db.one('SELECT version()')
  .then(result => {
    console.log('DB connection successful:', result);
  })
  .catch(error => {
    console.log('DB connection error:', error);
  });
  

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const handlebarSetup = exphbs.engine({
    partialsDir: "./views/partials",
    viewPath: './views',
    layoutsDir: './views/layouts'
});

app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');


const restaurant_service = restaurant(db)

const restaurant_route = RestaurantRoute(restaurant_service)
app.get("/", restaurant_route.get);


app.get("/bookings", restaurant_route.bookings );


var portNumber = process.env.PORT || 3000;

//start everything up
app.listen(portNumber, function () {
    console.log('🚀  server listening on:', portNumber);
});