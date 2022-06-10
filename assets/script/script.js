// TODO: test yelp fetch api
// yelp search endpoint https://api.yelp.com/v3/businesses/search
// yelp business details endpoint https://api.yelp.com/v3/businesses/{id}
// foodish endpoint https://foodish-api.herokuapp.com/
let userLat = "";
let userLon = "";
let searchedFoodImage = "";
let searchedTerm = "";
let searchedCity = "";
let resultsLimit = 5;
let id = "";
let randomImageArray = [];
// event listeners
$(".what-to-eat").on("click", function(){
    getRandomFoodImages();
})
// random food images
$(".random-img-div").on("click", function(event){
    const urlArray = event.target.name.split("/");
    searchedTerm = urlArray[urlArray.length - 2];
    console.log(searchedTerm);
    // uncomment bellow to start the yelp search process
    // getUserLocation()
});
$(".choices").on("click", function(){
    getRandomFoodImages();
});

function getUserLocation(){
    // TODO: Make this appear as a modal
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos)
    })
    if (userLat && userLon){
        getRestaurantsByLatLon(userLat, userLon);
    } else {
        const city = showModal();
        getRestuarantsByCity(city);
    }
}

function showModal(){
    return "modal";
}


function getRestaurantsByLatLon(lat, lon){
    let yelpEndpoint = `https://api.yelp.com/v3/businesses/search?lat=${lat}&lon=${lon}&term=${searchedTerm}&limit=${resultsLimit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantResults(data));
}

function getRestuarantsByCity(city){
    fetch(`https://api.yelp.com/v3/businesses/search?location=${city}&term=${searchedTerm}&limit=${resultsLimit}`)
    .then(response=>response.json())
    .then(data=>printRestaurantResults(data));
}

// TODO: decide where to display results
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
// TODO: decide what information we need from the get restaurant details function
function printRestaurantDetails(data){
    // lat and lon
    // whatever else
}

function getRandomFoodImages(){
    for (let i=0;i<6;i++){
        fetch("https://foodish-api.herokuapp.com/api/")
        .then(response=>response.json())
        .then(data=>{
            randomImageArray.push(data.image);
            printRandomFoodImages(i);
        })
    }
}

function printRandomFoodImages(imageArrayIndex){
    $(`#${imageArrayIndex}`).append(`<img class='random-img' name='${randomImageArray[imageArrayIndex]}' src=${randomImageArray[imageArrayIndex]} />`);
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

// TODO: CREATE FUNCTION FOR LOCAL STORAGE
// TODO: Get from local storage function
// TODO: display from local storage function
