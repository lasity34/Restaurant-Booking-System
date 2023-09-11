


export default function RestaurantRoute(restaurant_service) {
    // Show tables that can be booked and allow client to book a table that is not already booked.
    async function get(req, res) {
        const tables = await restaurant_service.getTables();
       
        res.render('index', { tables,  messages: req.flash() });
    }

    // Book a table that has not already been booked.
    async function book(req, res) {
        const { tableId, booking_size, username, phone_number } = req.body;
        const message = await restaurant_service.bookTable(tableId, booking_size, username, phone_number);
        
        if (message === 'Table booked successfully') {
            req.flash('success', message);
        } else {
            req.flash('error', message);
        }
        res.redirect('/bookings');
    }
    

    // Show all the bookings made
    async function bookings(req, res) {
        const tables = await restaurant_service.getBookedTables();
        res.render('bookings', { tables });
    }

    // Show all the bookings made by a given user and allow booking cancellations
    async function userBookings(req, res) {
        const username = req.params.username;
        const tables = await restaurant_service.getBookedTablesForUser(username);
        res.render('userBookings', { tables });
    }

    // Cancel the booking for the selected table and redirect back to the /bookings screen
    async function cancel(req, res) {
        const { tableName } = req.body;
        await restaurant_service.cancelTableBooking(tableName);
        res.redirect('/bookings');
    }

    return {
        get,
        bookings,
        book,
        userBookings,
        cancel
    };
}
