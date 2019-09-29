let topics = ['jordan cry', 'harambe', 'john wick', 'record egg', 'sponge mock', 'jason bourne', 'covfefe'];
let titleDisplay = String;
let remove = true;


$( document ).ready(function() {

    //on click effects ******************************************
    //adds new button based on typed info
    $("#run-search").on("click", searchButton);

    //searches for meme
    $(document).on("click", ".topic-btn", topicSearch);

    //animate or still the mem
    $(document).on("click", ".animate", animateGif);

    //removal button on click allow meme buttons to be deleted
    $("#removal").on("click", removal)

    //closes the right side bar
    $("#toggle-left").on("click", leftBarClose);

    //reopens the bar
    $("#toggle-left-open").on('click', leftBarOpen);
    
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
            newButton.addClass("topic-btn btn btn-outline-dark");
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
            let search = $(this).attr("data-name")
            // Here we construct our URL\
            
            let queryURL = `https://api.giphy.com/v1/gifs/search?api_key=lDSzVvM7FYinoWf9vRVrIn97y8WQVNHU&q=${search}&limit=10`;

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

                //adds the new title to the gif
                let newTitle = $("<div>");
                newTitle.text(`${titleDisplay}`);
                $(newDiv).append(newTitle);

                let newImg = $("<img>");
                newImg.attr("src", results[i].images.fixed_height_still.url);
                newImg.attr("data-still", results[i].images.fixed_height_still.url);
                newImg.attr("data-active", results[i].images.fixed_height.url);
                newImg.attr("data-status", "still");
                newImg.addClass("animate");
                newImg.attr("draggable", true)
                $(newDiv).append(newImg)


                let newRating = $("<div>");
                newRating.text(`Results: ${results[i].rating.toUpperCase()}`);
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
        $("#toggle-left-open").css('display',"block");
        $("")
    }
    function leftBarOpen(){
        $("#left-bar").css('display', "block");
        $("#toggle-left-open").css('display', "none")
    }
});

// ==============================
// =============Canvas===========
// ==============================
