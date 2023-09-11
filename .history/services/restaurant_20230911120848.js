
export default function restaurant(db){
    async function getTables() {
        return await db.any('SELECT * FROM table_booking WHERE booked = false;');
    }

    // Query to book a table by name if not already booked and within capacity
    async function bookTable(tableName, username, phoneNumber, seats) {
        try {
            const table = await db.oneOrNone('SELECT * FROM table_booking WHERE table_name = $1;', [tableName]);
            
          
        console.log(table)
            
            // Moved this block to the top, after table validity checks
            if (seats > table.capacity) return "capacity greater than the table seats";
            
            // Check for username, phoneNumber, and seats
            if (!username) return "Please enter a username";
            if (!phoneNumber) return "Please enter a contact number";
            if (!seats) return "Please enter the number of seats";
            
            await db.none('UPDATE table_booking SET booked = true, username = $1, contact_number = $2, number_of_people = $3 WHERE table_name = $4;', 
                          [username, phoneNumber, seats, tableName]);
            
            return true;
        } catch (error) {
            console.error(error);
            return "An error occurred while booking the table";
        }
    }
    
    


    // Query to get all booked tables
    async function getBookedTables() {
        return await db.any('SELECT * FROM table_booking WHERE booked = true;');
    }

    // Query to check if a table is booked
    async function isTableBooked(tableName) {
        const table = await db.oneOrNone('SELECT * FROM table_booking WHERE table_name = $1;', [tableName]);
        return table ? table.booked : false;
    }

    async function cancelTableBooking(tableName) {
        // Query to cancel a table booking
        await db.none('UPDATE table_booking SET booked = false, username = NULL, number_of_people = NULL WHERE table_name = $1;', [tableName]);
    }

    async function getBookedTablesForUser(username) {
        // Query to get all tables booked by a specific user
        return await db.any('SELECT * FROM table_booking WHERE username = $1;', [username]);
    }

    return {
        getTables,
        bookTable,
        getBookedTables,
        isTableBooked,
        cancelTableBooking,
        getBookedTablesForUser
    };
};


