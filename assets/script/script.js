// user info and search variables
let userLat = "";
let userLon = "";
let searchedFoodImage = "";
let searchedTerm = "";
let userInputLocation = "";
let resultsLimit = 5;
let id = "";
let randomImageArray = [];
// event listeners
// Button will call the function to show random food images on screen.
$(".what-to-eat").on("click", function(){
    getRandomFoodImages();
});
// apply event listeners to each of the divs containing images of food. 
$(".random-img-div").on("click", function(event){
    // the second to last element of this array will always contain the name of the food pictured
    const urlArray = event.target.style.backgroundImage.split("/");
    // the name of the food is then saved in a global varable.
    searchedTerm = urlArray[urlArray.length - 2];

    // put in searched term in local storage or increment if it already exists
    if (localStorage.getItem(searchedTerm)) {
        var countToInt = localStorage.getItem(searchedTerm);
        countToInt = parseInt(countToInt);
        countToInt++;
        countToInt = countToInt.toString();
        localStorage.setItem(searchedTerm, countToInt);
    } else {
        localStorage.setItem(searchedTerm, "1");
    }

    // check to see if the user has allowed access to their location through geolocation or user input
    // call the appropriate fetch, based on the condition.
    if (userLat  && userLon){
        getRestaurantsByLatLon(userLat, userLon)
    } else if (userInputLocation){
        getRestuarantsByCity(userInputLocation);
    } else {
        getUserLocation();
    }
});
// button will repopulate the random food images.
$(".choices-button").on("click", function(){
    getRandomFoodImages();
});
// form is located inside of a modal that is only called if the user has not supplied a location.
// after the user fills out the form, a fetch is called based on a more general location search.
let userInputLocationEl = $("#user-input-location");
$("#user-input-form").on("submit", (e)=>{
    e.preventDefault();
    userInputLocation = userInputLocationEl.val();
    $("#user-input-form").trigger("reset");
    $(".btn-close").trigger("click");
    getRestuarantsByCity(userInputLocation);
})
// this was added to give the option of clicking the search button or simply hitting return on the input
// above.
$("#search-button").on("click", ()=>{
    userInputLocation = userInputLocationEl.val();
    $("#user-input-form").trigger("reset");
    $(".btn-close").trigger("click");
    getRestuarantsByCity(userInputLocation);
})
// triggers the modal asking for user location.
function getUserLocation(){
    $("#exampleModal").modal('show');
}
// if the user has allowed their geolocation to be shared, this is the fetch that will run when they click
// on an image.
function getRestaurantsByLatLon(lat, lon){
    let yelpEndpoint = `https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term=${searchedTerm}&latitude=${lat}&longitude=${lon}&limit=${resultsLimit}`
    fetch(yelpEndpoint, {
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response => response.json())
    .then(data => printRestaurantResults(data))
    .catch(()=>{
        handleSearchError();
    });
}
// if the user wrote a location in the modal input, this is the fetch that will be called.
function getRestuarantsByCity(location){
    fetch(`https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?location=${location}&term=${searchedTerm}&limit=${resultsLimit}`,{
        headers: {
            Authorization: "Bearer Klnnz8t9NTQXYdSXh_xINM4iG-gO-MuwhkpztrTsDv6qn56ed5zTt2oZM25jBkaVp4zAA4DTJVQg526evOA8_KrmRYFEoYK1cCsH4rbaAXeQTEH1cLns2vOLfgqiYnYx"
        }
    })
    .then(response=>response.json())
    .then(data=>printRestaurantResults(data))
    .catch(()=>{
        handleSearchError();
    })
}

// both yelp fetches will call this function upon reciving the response. The results are limited to 5.
// the function starts with the empty command so that the list will refesh with each call to the API.
function printRestaurantResults(data){
    $("#restaurant-list").empty()
    const resultsTitleEl = $("<h2>").text("Near You").addClass("near");
    $("#restaurant-list").append(resultsTitleEl);
    for (let i=0;i<data.businesses.length;i++){
        const id = data.businesses[i].id;
        const name = data.businesses[i].name;
        const rating = data.businesses[i].rating;
        const imageUrl = data.businesses[i].image_url;
        const phoneNumber = data.businesses[i].phone;
        const resultImage = $(`<img>`).attr("src", imageUrl).css({height: '100px', width: '100px', border: "solid var(--mred) 2px", "border-radius": "5%", "margin-right":"25px"})
        const resultItemEl = $(`<p>`).attr({"id": id, "class": "result-item"}).text(`${name} rating: ${rating}, phone: ${phoneNumber}`);
        resultItemEl.prepend(resultImage);
        // handlers are created for each listed retaurant. they will call an additional fetch to yelp by useing
        // the business id to search, rather than the user location.
        resultItemEl.on("click", (e)=>{
            if (e.target.id){
                getRestaurantDetails(e.target.id);
            }
            
        });
        $("#restaurant-list").append(resultItemEl);
    }
    // a link that is used as a sort of back button to refresh the random images, if the user wasn't interesting
    // in the restaurnts displayed.
    const stillHungryLinkEl = $("<a class='still-hungry-link' href='#choices-button-div'>Still hungry? Click to see more pictures!</a>");
    stillHungryLinkEl.on("click", ()=>{
        getRandomFoodImages()
        $("#restaurant-list").empty()
    });
    $("#restaurant-list").append(stillHungryLinkEl)
}
// fetch to call to the foodish API that will generate random images with each request. The images are then 
// stored in a global variable will be used in the printRandomFoodImages function at the end of this function.
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
// display the food images on screen and apply styling.
function printRandomFoodImages(imageArrayIndex){
    $(".choices-button").css({'display': 'block'});
    $("#choices-button-div").css({'text-align':'center'});
    $(`#${imageArrayIndex}`).attr('style', '')
    $(`#${imageArrayIndex}`).css({'background-image':`url(${randomImageArray[imageArrayIndex]})`,'background-size':'cover','background-position': 'center center', 'width':'100%', 'min-height': '200px', 'border': 'solid var(--mred) 2px', "border-radius": "5%"});
}

// will get the details by id and call another function to display the response.
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
    .catch(()=>{
        handleSearchError();
    });
}
// will print and style the response from getRestaurantDetails().
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
// will display a modal if there is a problem with any yelp fetch request. 
function handleSearchError(){
    $("#search-error-message-display").text(`A bad request was made to the server.\n Try searching by address, city, zipcode, etc.\n Try checking your preferences for sharing location data.`);
    $("#searchErrorModal").modal('show');
    userInputLocation = "";
}
// will give the user some fun insights into which foods they tend to click on.
function printUserStats(){
    $("#user-details-div").empty();
    let keysArray = [];
    for (let i=0; i<localStorage.length;i++){
        keysArray.push(localStorage.key(i));
    }
    let commentEl = $("<h3>").text(`Look at you! Here are your search stats:`);
    $("#user-details-div").append(commentEl);
    for (let i=0; i<keysArray.length; i++){
        let pluralOrSingular = "";
        if (parseInt(localStorage.getItem(keysArray[i])) > 1){
            pluralOrSingular = "times";
        } else {
            pluralOrSingular = "time";
        }
        const userStat = $("<p>").text(`Clicked on ${keysArray[i]} ${localStorage.getItem(keysArray[i])} ${pluralOrSingular}.`);
        $("#user-details-div").append(userStat);
    }
}
// the user's geolocation will be requested at the start of there opening the app.
navigator.geolocation.getCurrentPosition(function(pos) {
    userLat = pos.coords.latitude;
    userLon = pos.coords.longitude;
    });

