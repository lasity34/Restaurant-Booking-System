


export default function RestaurantRoute() {




function get(req, res) {
    res.render('index', { tables : [{}, {}, {booked : true}, {}, {}, {}]})
}

function bookings(req, res) {
  
        res.render('bookings', { tables : [{}, {}, {}, {}, {}, {}]})
    
}


return {
    get,
    bookings
}
    
}