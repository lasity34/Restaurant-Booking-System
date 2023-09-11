import pgPromise from "pg-promise";  // Import pg-promise and rename it to avoid conflict
import express from "express";
import exphbs from "express-handlebars";
import bodyParser from "body-parser";
import flash from "flash-express";
import dotenv from "dotenv";
import RestaurantRoute from "./routes/restaurantRoutes.js";
import restaurant from "./services/restaurant.js";

// Initialize application and environment variables
const app = express();
dotenv.config();

// Middleware
app.use(express.static('public'));
app.use(flash());

// Initialize pg-promise
const pgp = pgPromise();  // Initialize pg-promise here

// Database connection
const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Test database connection
db.one('SELECT version()')
  .then(result => {
    console.log('DB connection successful:', result);
  })
  .catch(error => {
    console.log('DB connection error:', error);
  });

// Body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Handlebars setup
const handlebarSetup = exphbs.engine({
  partialsDir: "./views/partials",
  viewPath: './views',
  layoutsDir: './views/layouts'
});
app.engine('handlebars', handlebarSetup);
app.set('view engine', 'handlebars');

// Services and routes
const restaurant_service = restaurant(db);
const restaurant_route = RestaurantRoute(restaurant_service);

app.get("/", restaurant_route.get);
app.get("/bookings", restaurant_route.bookings);

// Server initialization
const portNumber = process.env.PORT || 3000;
app.listen(portNumber, function () {
  console.log('🚀  server listening on:', portNumber);
});
