// TODO: test yelp fetch api
// yelp search endpoint https://api.yelp.com/v3/businesses/search
// yelp business details endpoint https://api.yelp.com/v3/businesses/{id}
// 
let userLat = "";
let userLon = "";
let searchedFoodImage = "";
let searchedCategory = "";
let limit = 5;
let id = "";

// navigator.geolocation.getCurrentPosition(function(pos) {
//     console.log(pos)
// })

function getRestaurants(){
    let yelpEndpoint = `https://api.yelp.com/v3/businesses/search?lat=${userLat}&lon=${userLon}&categories=${searchedCategory}&limit=${limit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantData(data));
}


function printRestaurantResults(data){
    for (let i=0;i<data.businesses.length();i++){
        id = data.businesses[i].id;
        const name = data.businesses[i].name;
        const rating = data.businesses[i].rating;
        // searchedFoodImage
        const imageUrl = data.businesses[i].image_url;
        const phoneNumber = data.businesses[i].phone;
    }
    
}

function printRestaurantDetails(){

}