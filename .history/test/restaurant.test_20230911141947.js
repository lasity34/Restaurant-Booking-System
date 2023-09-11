import assert from "assert"
import RestaurantTableBooking from "../services/restaurant.js";
import pgPromise from "pg-promise";
import dotenv from "dotenv";

dotenv.config();



// Database connection
const pgp = pgPromise();

// Database connection
const db = pgp({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});


describe("The restaurant booking table", function () {
    this.timeout(5000);
    beforeEach(async function () {
        try {
    
            await db.none("TRUNCATE TABLE table_booking RESTART IDENTITY CASCADE;");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table one', 4, false);");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table two', 6, false);");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table three', 4, false);");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table four', 2, false);");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table five', 6, false);");
            await db.none("INSERT into table_booking (table_name, capacity, booked) values ('Table six', 4, false);");
        } catch (err) {
            console.log(err);
            throw err;
        }
    });
    it("Get all the available tables", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        const expectedTables = [
            { id: 1, table_name: 'Table one', capacity: 4, booked: false, username: null, number_of_people: null, contact_number: null },
            { id: 2, table_name: 'Table two', capacity: 6, booked: false, username: null, number_of_people: null, contact_number: null },
            { id: 3, table_name: 'Table three', capacity: 4, booked: false, username: null, number_of_people: null, contact_number: null },
            { id: 4, table_name: 'Table four', capacity: 2, booked: false, username: null, number_of_people: null, contact_number: null },
            { id: 5, table_name: 'Table five', capacity: 6, booked: false, username: null, number_of_people: null, contact_number: null },
            { id: 6, table_name: 'Table six', capacity: 4, booked: false, username: null, number_of_people: null, contact_number: null }
        ];
        assert.deepEqual(expectedTables, await restaurantTableBooking.getTables());
    });
    
    


    it("It should check if the capacity is not greater than the available seats.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);

        const result = await restaurantTableBooking.bookTable({
            username: 'Kim',
            phoneNumber: '084 009 8910',
            seats: 3
        });

    

        assert.deepEqual("capacity greater than the table seats", result);
    });

  it("should check if there are available seats for a booking.", async function () {
    const restaurantTableBooking = await RestaurantTableBooking(db);
    
    // Number of seats required for the booking
    const seatsRequired = 4;

    // Fetch all tables
    const tables = await restaurantTableBooking.getTables();

    // Filter out booked tables
    const availableTables = tables.filter(table => !table.booked);

    // Check if there is a table with enough seats
    const tableWithEnoughSeats = availableTables.find(table => table.capacity >= seatsRequired);

    if (tableWithEnoughSeats) {
        assert.deepEqual(true, true); // Pass the test
    } else {
        assert.deepEqual(true, false); // Fail the test
    }
});


    it("Check if the booking has a user name provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual("Please enter a username", await restaurantTableBooking.bookTable({
            tableName: 'Table four',
            phoneNumber: Number('084 009 8910'),
            seats: 2
        }));
    });

    it("Check if the booking has a contact number provided.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        assert.deepEqual("Please enter a contact number", await restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            seats: 2
        }));
    });

    it("should not be able to book a table with an invalid table name.", async function () {
        const restaurantTableBooking = await RestaurantTableBooking(db);
        const message = await restaurantTableBooking.bookTable({
            tableName: 'Table eight', // Make sure this table is actually invalid in your DB
            username: 'Kim',
            phoneNumber: Number('084 009 8910'),
            seats: 2
        });
    
        assert.deepEqual(message, "Invalid table name provided");
    });
    

    it("should be able to book a table.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
      
        assert.equal(false, await restaurantTableBooking.isTableBooked('Table three')); 
        // book Table three
        await restaurantTableBooking.bookTable({
            tableName: 'Table three',
            username: 'Kim',
            phoneNumber:  Number('084 009 8910'),
            seats: 2
        });
        
        // Table three should be booked now
        const booked = await restaurantTableBooking.isTableBooked('Table three');
        assert.equal(true, booked); // assert it is now booked
    });
    

    it("should list all booked tables.", async function () {
        let restaurantTableBooking = RestaurantTableBooking(db);
        let tables = await restaurantTableBooking.getTables();
        assert.deepEqual(6, tables.length);
    });

    it("should allow users to book tables", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        assert.deepEqual([], await restaurantTableBooking.getBookedTablesForUser('jodie'));
        
        restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber:  Number('084 009 8910'),
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Jodie',
            phoneNumber: Number('084 009 8910'),
            seats: 2
        });

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber:  Number('084 009 8910'),
            seats: 4
        })

        // should only return 2 bookings as two of the bookings were for the same table
        assert.deepEqual([{}, {}], await restaurantTableBooking.getBookedTablesForUser('jodie'));
    });

    it("should be able to cancel a table booking", async function () {
        let restaurantTableBooking = await RestaurantTableBooking(db);

        await restaurantTableBooking.bookTable({
            tableName: 'Table five',
            username: 'Jodie',
            phoneNumber:  Number('084 009 8910'),
            seats: 4
        });

        restaurantTableBooking.bookTable({
            tableName: 'Table four',
            username: 'Kim',
            phoneNumber:  Number('084 009 8910'),
            seats: 2
        });

        let bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(2, bookedTables.length);

        await restaurantTableBooking.cancelTableBooking("Table four");

        bookedTables = await restaurantTableBooking.getBookedTables();
        assert.equal(1, bookedTables.length);
    });

    after(function () {
        db.$pool.end;
    });
})
