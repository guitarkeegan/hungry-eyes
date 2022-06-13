let userLat = "";
let userLon = "";
let searchedFoodImage = "";
let searchedTerm = "";
let userInputLocation = "";
let resultsLimit = 5;
let id = "";
let randomImageArray = [];

//local storage logic


const borderSpinner = $(".spinner-border");
// event listeners
$(".what-to-eat").on("click", function(){
    getRandomFoodImages();
})
.on("click", ()=>getRandomFoodImages());
// random food images
$(".random-img-div").on("click", function(event){

    const urlArray = event.target.style.backgroundImage.split("/");
    searchedTerm = urlArray[urlArray.length - 2];

    // put in searched term in local storage or increment if it already exists
    if (localStorage.getItem(searchedTerm)) {
        var countToInt = localStorage.getItem(searchedTerm);
        countToInt = parseInt(countToInt);
        console.log(countToInt);
        countToInt++;
        console.log(countToInt)
        countToInt = countToInt.toString();
        console.log(countToInt);
        localStorage.setItem(searchedTerm, countToInt);
    } else {
        console.log("hit else");
        localStorage.setItem(searchedTerm, "1");
    }

    // check to see if the user has allowed access to their location, else ask for user input
    if (userLat  && userLon){
        getRestaurantsByLatLon(userLat, userLon)
    } else if (userInputLocation){
        getRestuarantsByCity(userInputLocation);
    } else {
        getUserLocation();
    }
});
$(".choices-button").on("click", function(){
    getRandomFoodImages();
});
let userInputLocationEl = $("#user-input-location");
$("#user-input-form").on("submit", (e)=>{
    e.preventDefault();
    userInputLocation = userInputLocationEl.val();
    $("#user-input-form").trigger("reset");
    $(".btn-close").trigger("click");
    getRestuarantsByCity(userInputLocation);
})
$("#search-button").on("click", ()=>{
    userInputLocation = userInputLocationEl.val();
    $("#user-input-form").trigger("reset");
    $(".btn-close").trigger("click");
    getRestuarantsByCity(userInputLocation);
})

function getUserLocation(){
    $("#exampleModal").modal('show');
}

function getRestaurantsByLatLon(lat, lon){
    let yelpEndpoint = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchedTerm}&latitude=${lat}&longitude=${lon}&limit=${resultsLimit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantResults(data))
    .catch((err)=>{
        handleSearchError()
        console.log(err);
    })
}

function getRestuarantsByCity(location){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${location}&term=${searchedTerm}&limit=${resultsLimit}`,{
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response=>response.json())
    .then(data=>printRestaurantResults(data))
    .catch((err)=>{
        handleSearchError()
        console.log(err);
    })
}


function printRestaurantResults(data){
    $("#restaurant-list").empty()
    const resultsTitleEl = $("<h2>").text("Near You").addClass("near");
    var icon = $('<span class="material-symbols-outlined">explore</span>');
    resultsTitleEl.append(icon)
    $("#restaurant-list" ).append(resultsTitleEl)
    for (let i=0;i<data.businesses.length;i++){
        const id = data.businesses[i].id;
        const name = data.businesses[i].name;
        const rating = data.businesses[i].rating;
        // searchedFoodImage
        const imageUrl = data.businesses[i].image_url;
        const phoneNumber = data.businesses[i].phone;
        const resultImage = $(`<img>`).attr("src", imageUrl).css({height: '100px', width: '100px', border: "solid var(--mred) 8px", "border-radius": "5%"})
        const resultItemEl = $(`<p>`).attr({"id": id, "class": "result-item"}).text(`${name} rating: ${rating}, phone: ${phoneNumber}`);
        resultItemEl.prepend(resultImage);
        resultItemEl.on("click", (e)=>{
            if (e.target.id){
                getRestaurantDetails(e.target.id);
            }
            
        });
        $("#restaurant-list").append(resultItemEl);
    }
    const stillHungryLinkEl = $("<a class='still-hungry-link' href='#choices-button-div'>Still hungry? Click to see more pictures!</a>");
    stillHungryLinkEl.on("click", ()=>{
        getRandomFoodImages()
        $("#restaurant-list").empty()
    });
    $("#restaurant-list").append(stillHungryLinkEl)
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
    $(`#${imageArrayIndex}`).attr('style', '')
    $(`#${imageArrayIndex}`).css({'background-image':`url(${randomImageArray[imageArrayIndex]})`,'background-size':'cover','background-position': 'center center', 'width':'100%', 'min-height': '200px', 'border': 'solid var(--mred) 2px', "border-radius": "5%"});
    
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
        printRestaurantDetails(data)
    
    })
    .catch((err)=>{
        handleSearchError()``
        console.log(err);
    })
}

function printRestaurantDetails(data){
    // left parent element
    const detailsDivEl = $("#details-div");
    // right parent element
    const detailsMapDivEl = $("#details-map-div")
    detailsDivEl.empty()
    detailsMapDivEl.empty()
// left side
    var restaurantName = data.name;
    var restaurantAddress = data.location.display_address.join("\n")
    var restaurantPhone = data.display_phone;
    var restaurantPhoto = data.image_url;
    
    const nameEl = $("<h3>").text(restaurantName);
    const addressEl = $("<p>").text(restaurantAddress);
    const phoneEl = $("<p>").text(restaurantPhone);
    const imageEl = $("<img>").attr("src", restaurantPhoto).css({"width": "77vw", "max-width": "400px", 'border': 'solid var(--mred) 2px', "border-radius": "5%"});
    detailsDivEl.append(nameEl, addressEl, phoneEl, imageEl);
    // right side
    
    const directionsHeaderEl = $(`<h3>Take me to ${searchedTerm} town!</h3>`);
    const getDirectionsEl = $(`<p><a href='https://www.google.com/maps/place/${restaurantAddress}'>Get directions</a></p>`);
    const goToYelpEl = $(`<a>`).attr("href", data.url).text("Check them out on Yelp!");
    detailsMapDivEl.append(directionsHeaderEl, getDirectionsEl, goToYelpEl);
    // update the user on their past searches
    printUserStats();
}

function handleSearchError(){
    $("#search-error-message-display").text(`A bad request was made to the server. Try searching by address, city, zipcode, etc. Try checking your preferences for sharing location data. Follow the link for a demo request. https://cors-anywhere.herokuapp.com/corsdemo`);
    $("#searchErrorModal").modal('show');
}

function printUserStats(){
    $("#user-details-div").empty();
    let keysArray = [];
    for (let i=0; i<localStorage.length;i++){
        keysArray.push(localStorage.key(i));
    }
    console.log(keysArray);
    let commentEl = $("<h3>").text(`Look at you! Here are your search stats:`);
    $("#user-details-div").append(commentEl);
    for (let i=0; i<keysArray.length; i++){
        const userStat = $("<p>").text(`Clicked on ${keysArray[i]} ${localStorage.getItem(keysArray[i])} time/s`);
        $("#user-details-div").append(userStat);
    }
}

navigator.geolocation.getCurrentPosition(function(pos) {
    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;
    });

