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
    const urlArray = event.target.style.backgroundImage.split("/");
    searchedTerm = urlArray[urlArray.length - 2];
    getUserLocation()
});
$(".choices-button").on("click", function(){
    getRandomFoodImages();
});

function getUserLocation(){
    // TODO: Make this appear as a modal
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos)
        userLat = pos.latitude;
        userLon = pos.longitude;
        if (userLat && userLon){
            getRestaurantsByLatLon(userLat, userLon);
        } else {
            const city = showModal();
            getRestuarantsByCity(city);
        }
    })
}

function showModal(){
    return
}


function getRestaurantsByLatLon(lat, lon){
    let yelpEndpoint = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchedTerm}&latitude=${lat}&longitude=${lon}&limit=${resultsLimit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantResults(data));
}

function getRestuarantsByCity(city){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${city}&term=${searchedTerm}&limit=${resultsLimit}`,{
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response=>response.json())
    .then(data=>printRestaurantResults(data));
}


function printRestaurantResults(data){
    console.log(data);
    const resultsTitleEl = $("<h2>").text("Near You");
    $("#restaurant-list").append(resultsTitleEl);
    for (let i=0;i<data.businesses.length;i++){
        const id = data.businesses[i].id;
        const name = data.businesses[i].name;
        const rating = data.businesses[i].rating;
        // searchedFoodImage
        const imageUrl = data.businesses[i].image_url;
        const phoneNumber = data.businesses[i].phone;
        const resultImage = $(`<img src=${imageUrl}>`)
        // TODO: append and a tag to the p to bring us to the details section
        const resultItemEl = $(`<p id='${id}' class='result-item'>`).text(`${name} rating: ${rating}, phone: ${phoneNumber}`);
        $("#restaurant-list").append(resultItemEl);
    }
    $("#restaurant-list").append("<a href='#choices-button-div'>Still hungry? Click to see more pictures!</a>")
}

function getRandomFoodImages(){
    randomImageArray = [];
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
    $(".choices-button").css({'display': 'block'});
    $("#choices-button-div").css({'text-align':'center'});
    $(`#${imageArrayIndex}`).attr('style','')
    $(`#${imageArrayIndex}`).css({'background-image':`url(${randomImageArray[imageArrayIndex]})`,'background-size':'cover','background-position': 'center center', 'width':'100%', 'min-height': '200px'})
    
    // $(`#${imageArrayIndex}`).append(`<img class='random-img' name='${randomImageArray[imageArrayIndex]}' src=${randomImageArray[imageArrayIndex]} />`);
}


function getRestaurantDetails(id){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/${id}`,{
            headers: {
                Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
            }
        
    })
    .then(function(response){
        return response.json();
    })
    .then(function(data) {
        console.log(data)
        printRestaurantDetails(data)

    })
};

function printRestaurantDetails(data){
    console.log(data)
    var restaurantName = data.name;
    var restaurantAddress = data.location.display_address.join("\n")
    var restaurantPhone = data.display_phone;
    var restaurantPhoto = data.photos[0]
   

    
    //0 is Monday
}

// TODO: CREATE FUNCTION FOR LOCAL STORAGE
// TODO: Get from local storage function
// TODO: display from local storage function
