let topics = ['Pluto', 'Solar System', 'Earth', 'Mars', 'Space Force', 'Black Hole', 'Space Jam'];
let titleDisplay = String;
let remove = true;
let offset = 0;
let search;
let favTopicsName = [];
let favTopicsID = [];
let saveCount = 0;


$( document ).ready(function() {

    //on click effects ******************************************
    //adds new button based on typed info
    $("#run-search").on("click", searchButton);

    //searches for meme
    $(document).on("click", ".topic-btn", topicSearch);

    //animate or still the mem
    $(document).on("click", ".animate", animateGif);

    //random gif
    $("#random").on('click', randomSearch)

    //favorites
    $(document).on('click', ".favored", favorites)

    //removal button on click allow meme buttons to be deleted
    $("#removal").on("click", removal)

    //closes the right side bar
    $("#toggle-left").on("click", leftBarClose);

    //reopens the bar
    $("#toggle-left-open").on('click', leftBarOpen);

    //clears content ares
    $("#clearGifs").on('click', function clearGifs(){
        $("#content").empty()
    })
    
    //*******************************************************

    //will add new search term to buttons if it is not blank
    function searchButton(){
        
        event.preventDefault();
        
        if ($("#search-term").val() != "") {
            topics.push($("#search-term").val().trim())
        }
        else {
            alert("You must write something")
        }
        $("#search-term").val('')
        console.log(topics)
       
        renderButton();
    }

    //will render the new set of buttons on page load and after new button added
    function renderButton(){
        $("#gifButtons").empty();
        for (let x = 0; x < topics.length; x++){
            let newButton = $("<button>");

            let bg = ["#00FFFF", "#00CCFF", "#7CB9E8", "#0048BA", "#ACE5EE"];
            let gen = bg[Math.floor(Math.random() * bg.length)];

            newButton.css("background-color", gen)
            newButton.attr("data-name", topics[x]);
            newButton.addClass("topic-btn btn btn-outline-dark text-secondary");
            newButton.text(topics[x]);
            $("#gifButtons").append(newButton)
        }
    }
    renderButton();

    //changes gif from still to active
    function animateGif(){
        if ($(this).attr("data-status")==="still"){
            console.log("still")
            $(this).attr("src",$(this).attr("data-active"))
            $(this).attr("data-status","active")
        }else {
            console.log("active");
            $(this).attr("src",$(this).attr("data-still"))
            $(this).attr("data-status","still")
        }
    }
    
    //function for when meme button is pressed
    function topicSearch() {

        event.preventDefault();
        if (remove){
            // Here we grab the text from the input box
            if ($(this).attr("data-name") === search){
                offset += 10;
            }else {
                offset = 0;
                $("#content").empty()
            }
            search = $(this).attr("data-name")
            // Here we construct our URL\
            
            let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=lDSzVvM7FYinoWf9vRVrIn97y8WQVNHU&q=${search}&limit=10&offset=${offset}`;

            $.ajax({
            url: queryURL,
            method: "GET",
            }).then(function(response){
            let results = response.data;
            // console.log(response)
            for(var i = 0; i < results.length; i++){
                let newDiv = $("<div>");
                newDiv.addClass("float-left text-center border border-dark")
                $("#content").prepend(newDiv);
                
                //removes everything after from gif and later then capitilizes the words
                let gifTitle = results[i].title
                let n = gifTitle.search("GIF")            
                str = gifTitle.slice(0,n)

                if (str.search(" ")){
                    str = str.split(" ");

                    for (var c = 0, x = str.length; c < x; c++) {
                    str[c] = str[c].charAt(0).toUpperCase() + str[c].substr(1);
                    }

                    titleDisplay = str.join(" ");
                }
                if (titleDisplay === ""){
                    titleDisplay = "No Title"
                }
                //adds the new title to the gif
                let newTitle = $("<div>");
                newTitle.text(`${titleDisplay}`);
                $(newDiv).append(newTitle);

                let newImg = $("<img>");
                newImg.attr("src", results[i].images.fixed_height_still.url);
                newImg.attr("data-still", results[i].images.fixed_height_still.url);
                newImg.attr("data-active", results[i].images.fixed_height.url);
                newImg.attr("data-status", "still");
                newImg.attr("data-name", titleDisplay);
                newImg.attr("data-id", results[i].id);
                newImg.attr("ondragstart", "drag(event)");
                newImg.attr("title", "Drag this to favorites to save for later");
                newImg.addClass("animate");
                newImg.attr("draggable", true)
                $(newDiv).append(newImg)


                let newRating = $("<div>");
                newRating.text(`Rating: ${results[i].rating.toUpperCase()}`);
                $(newDiv).append(newRating)
            }
            });
                
        }
        else {
            
            $(this).remove();
            for (var z = 0; z < topics.length; z++){
                if ($(this).context.dataset.name === topics[z]){
                    topics.splice(z,1)
                }
            }
            
            console.log("removed: " + $(this).context.dataset.name)
        }
    };
    //when random button is pressed
    function randomSearch(){
        event.preventDefault();
            
            
            let queryURL = `https://api.giphy.com/v1/gifs/random?api_key=lDSzVvM7FYinoWf9vRVrIn97y8WQVNHU`;

            $.ajax({
                url: queryURL,
                method: "GET",
                }).then(function(response){
                let results = response.data;
                // console.log(response)
                
                    let newDiv = $("<div>");
                    newDiv.addClass("float-left text-center border border-dark")
                    $("#content").prepend(newDiv);
                    
                    //removes everything after from gif and later then capitilizes the words
                    let gifTitle = results.title
                    let n = gifTitle.search("GIF")            
                    str = gifTitle.slice(0,n)

                    if (str.search(" ")){
                        str = str.split(" ");

                        for (var c = 0, x = str.length; c < x; c++) {
                        str[c] = str[c].charAt(0).toUpperCase() + str[c].substr(1);
                        }

                        titleDisplay = str.join(" ");
                    }
                    if (titleDisplay === ""){
                        titleDisplay = "No Title"
                    }
                    //adds the new title to the gif
                    let newTitle = $("<div>");
                    newTitle.text(`${titleDisplay}`);
                    $(newDiv).append(newTitle);

                    let newImg = $("<img>");
                    newImg.attr("src", results.images.fixed_height_still.url);
                    newImg.attr("data-still", results.images.fixed_height_still.url);
                    newImg.attr("data-active", results.images.fixed_height.url);
                    newImg.attr("data-status", "still");
                    newImg.attr("data-name", titleDisplay);
                    newImg.attr("data-id", results.id);
                    newImg.attr("ondragstart", "drag(event)");
                    newImg.attr("title", "Drag this to favorites to save for later");
                    newImg.addClass("animate");
                    newImg.attr("draggable", true)
                    $(newDiv).append(newImg)


                    let newRating = $("<div>");
                    newRating.text(`Rating: none`);
                    $(newDiv).append(newRating)
                    console.log(results)
                
            });
                
        
        
    }
    //when a favorite button is pressed
    function favorites(){
        event.preventDefault();
        if (remove){
            gifID = $(this).attr('data-ID')
            let queryURL = `https://api.giphy.com/v1/gifs/${gifID}?api_key=lDSzVvM7FYinoWf9vRVrIn97y8WQVNHU`;

            $.ajax({
                url: queryURL,
                method: "GET",
                }).then(function(response){
                let results = response.data;
                // console.log(response)
                
                    let newDiv = $("<div>");
                    newDiv.addClass("float-left text-center border border-dark")
                    $("#content").prepend(newDiv);
                    
                    //removes everything after from gif and later then capitilizes the words
                    let gifTitle = results.title
                    let n = gifTitle.search("GIF")            
                    str = gifTitle.slice(0,n)

                    if (str.search(" ")){
                        str = str.split(" ");

                        for (var c = 0, x = str.length; c < x; c++) {
                        str[c] = str[c].charAt(0).toUpperCase() + str[c].substr(1);
                        }

                        titleDisplay = str.join(" ");
                    }
                    if (titleDisplay === ""){
                        titleDisplay = "No Title"
                    }
                    //adds the new title to the gif
                    let newTitle = $("<div>");
                    newTitle.text(`${titleDisplay}`);
                    $(newDiv).append(newTitle);

                    let newImg = $("<img>");
                    newImg.attr("src", results.images.fixed_height_still.url);
                    newImg.attr("data-still", results.images.fixed_height_still.url);
                    newImg.attr("data-active", results.images.fixed_height.url);
                    newImg.attr("data-status", "still");
                    newImg.attr("data-name", titleDisplay);
                    newImg.attr("data-id", results.id);
                    newImg.attr("ondragstart", "drag(event)");
                    newImg.attr("title", "Drag this to favorites to save for later");
                    newImg.addClass("animate");
                    newImg.attr("draggable", true)
                    $(newDiv).append(newImg)


                    let newRating = $("<div>");
                    newRating.text(`Rating: none`);
                    $(newDiv).append(newRating)
                    console.log(results)
                
            });
        }else {
            $(this).remove();
            console.log(this)
            console.log(favTopicsID)
            console.log(favTopicsName)
            for (var z = 0; z < favTopicsName.length; z++){
                if ($(this).attr('data-name') === favTopicsName[z]){
                    favTopicsName.splice(z,1)
                    favTopicsID.splice(z,1)
                    
                }
            }
        }
        
    }
  
    //alternates removal button
    function removal(){
        console.log("working")
        if (remove){
            console.log(remove)
            remove = false;
            $("#removal").removeClass("btn-dark");
            $("#removal").addClass("btn-danger");
            console.log(remove)
        }else {
            console.log(remove)
            remove = true;
            console.log(remove)
            $("#removal").removeClass("btn-danger");
            $("#removal").addClass("btn-dark");
        }
    }

    
    function leftBarClose(){        
        $("#left-bar").css('display',"none");
        $("#invis").css('display',"none");
        $("#toggle-left-open").css('display',"block");
        $("#left-bar").removeClass('d-flex flex-column')
        $(".main").removeClass('col-9')
        $(".main").addClass('col')
    }
    function leftBarOpen(){
        $("#left-bar").css('display', "block");
        $("#invis").css('display',"block");
        $("#toggle-left-open").css('display', "none")
        $(".main").addClass('col-9')
        $("#left-bar").addClass('d-flex flex-column')
        $(".main").removeClass('col')
    }

 
    });
    let gifName;
    let gifID; 
    // ===========DRAG & DROP ===========================
    $(document).on('dragstart', ".animate", function saveData (){
        gifName = $(this).attr("data-name")
        gifID = $(this).attr("data-id")
    })

    function drag(event){
    event.dataTransfer.setData("text", event.target.id);
    }

    function allowDrop(event){
    event.preventDefault()
    }
    function drop(event){
    event.preventDefault()
    $(".favorites").empty()
    
    favTopicsName.push(gifName)
    favTopicsID.push(gifID)
    console.log(favTopicsID)
    console.log(favTopicsName)
    
    for (let y = 0; y < favTopicsName.length; y++){
        var newButton = $("<button>")
        newButton.attr("data-name", favTopicsName[y]);
        newButton.attr("data-ID", favTopicsID[y]);
        newButton.addClass("favored btn btn-warning btn-outline-dark");
        newButton.text(favTopicsName[y]);
        $(".favorites").append(newButton)
    }
}
//================================================

    // localStorage.removeItem(`favName${$(this).attr('data-num')}`)
    // localStorage.removeItem(`favID${$(this).attr('data-num')}`)
    // localStorage.removeItem(`data-${$(this).attr('data-num')}`)

    // localStorage.setItem(`favName${saveCount}`, gifName)
    // localStorage.setItem(`favID${saveCount}`, gifID)
    // localStorage.setItem(`data-${saveCount}`, saveCount)

    // localStorage.getItem(`favName${saveCount}`, gifName)
    // localStorage.getItem(`favID${saveCount}`, gifID)
    // localStorage.getItem(`data-${saveCount}`, saveCount)


    //   // Capture User Inputs and store them into variables
    //   let user = {
    //     name: $("#name-input").val().trim(),
    //     email: $("#email-input").val().trim(),
    //     age: $("#age-input").val().trim(),
    //     comment: $("#comment-input").val().trim(),
    //   }

    //   // Console log each of the user inputs to confirm we are receiving them correctly
    //   console.log(user.name)
    //   console.log(user.email)
    //   console.log(user.age)
    //   console.log(user.comment)
    //   localStorage.setItem("user", user);

    //   // Output all of the new information into the relevant HTML sections
    //   $("#name-display").html(user.name);
    //   $("#email-display").html(`Email: ${user.email}`);
    //   $("#age-display").html(user.age);
    //   $("#comment-display").html(user.comment);
