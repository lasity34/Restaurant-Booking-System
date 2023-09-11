
export default function restaurant(db){
    async function getTables() {
        return await db.any('SELECT * FROM table_booking ');
    }

    // Query to book a table by name if not already booked and within capacity
    async function bookTable({ tableName, username, phoneNumber, seats }) {
        try {
            
        
            const table = await db.oneOrNone('SELECT * FROM table_booking WHERE table_name = $1;', [tableName]);
            
          
            
            if (!table) return 'Invalid table name provided';
            
            if (table.booked) return 'Table is already booked';
            
            if (seats > table.capacity) return 'Number of seats exceeds the table capacity';
            
            if (!username) return 'Username is required for booking';
            if (!phoneNumber) return 'Contact number is required for booking';
            if (!seats) return 'capacity greater than the table seats';
            
            await db.none('UPDATE table_booking SET booked = true, username = $1, contact_number = $2, number_of_people = $3 WHERE table_name = $4;', 
                          [username, phoneNumber, seats, tableName]);
            
            return 'Table booked successfully';
        } catch (error) {
            console.error(error);
            return 'An error occurred while booking the table';
        }
    }
    
    


    // Query to get all booked tables
    async function getBookedTables() {
        return await db.any('SELECT * FROM table_booking WHERE booked = true;');
    }

    // Query to check if a table is booked
    async function isTableBooked(tableName) {
        const table = await db.oneOrNone('SELECT * FROM table_booking WHERE table_name = $1;', [tableName]);
     return table
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


