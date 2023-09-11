


export default function RestaurantRoute() {




function get(req, res) {
    res.render('index', { tables : [{}, {}, {booked : true}, {}, {}, {}]})
}
    
}