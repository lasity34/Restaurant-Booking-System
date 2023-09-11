


export default function RestaurantRoute(restaurant_service) {




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