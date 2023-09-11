
export default function RestaurantRoute(restaurant_service) {
    // Show tables that can be booked and allow client to book a table that is not already booked.
    async function get(req, res) {
        const tables = await restaurant_service.getTables();
        res.render('index', { tables });
    }

    // Book a table that has not already been booked.
    async function book(req, res) {
        const { tableName, username, numberOfPeople } = req.body;
        const success = await restaurant_service.bookTable(tableName, username, numberOfPeople);
        if (success) {
            req.flash('success', 'Table booked successfully');
        } else {
            req.flash('error', 'Unable to book table');
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
