// TODO: test yelp fetch api
// yelp search endpoint https://api.yelp.com/v3/businesses/search
// yelp business details endpoint https://api.yelp.com/v3/businesses/{id}
// foodish endpoint https://foodish-api.herokuapp.com/
let userLat = "";
let userLon = "";
let searchedFoodImage = "";
let searchedCategory = "";
let limit = 5;
let id = "";
let randomImageArray = [];


// navigator.geolocation.getCurrentPosition(function(pos) {
//     console.log(pos)
// })

function getUserLocation(){
    if (userLat && userLon){
        getRestaurantsByLatLon(userLat, userLon);
    } else {
        const city = showModal();
        getRestuarantsByCity(city);
    }
}


function getRestaurantsByLatLon(lat, lon){
    let yelpEndpoint = `https://api.yelp.com/v3/businesses/search?lat=${lat}&lon=${lon}&categories=${searchedCategory}&limit=${limit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantData(data));
}

function getRestuarantsByCity(city){

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

function printRestaurantDetails(data){

}

function getRandomFoodImages(){

    for (let i=0;i<6;i++){
        fetch("https://foodish-api.herokuapp.com/api/")
        .then(response=>response.json())
        .then(data=>{
            randomImageArray.push(data.image);
        })
    }
    printRandomFoodImages();
}


function getRestaurantDetails(id){
    fetch(`https://api.yelp.com/v3/businesses/${id}`)
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        printRestaurantDetails(data)
    })
};


