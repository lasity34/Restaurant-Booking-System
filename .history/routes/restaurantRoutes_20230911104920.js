
export default function RestaurantRoute(restaurant_service) {
    async function get(req, res) {
        const tables = await restaurant_service.getTables();
        res.render('index', { tables });
    }

    async function bookings(req, res) {
        const tables = await restaurant_service.getBookedTables();
        res.render('bookings', { tables });
    }

    async function book(req, res) {
        const { tableName, username, numberOfPeople } = req.body;
        const success = await restaurant_service.bookTable(tableName, username, numberOfPeople);
        if (success) {
            req.flash('success', 'Table booked successfully');
        } else {
            req.flash('error', 'Unable to book table');
        }
        res.redirect('/');
    }

    async function userBookings(req, res) {
        const username = req.params.username;
        const tables = await restaurant_service.getBookedTablesForUser(username);
        res.render('userBookings', { tables });
    }

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
