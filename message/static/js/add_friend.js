function find_matching(username) {
    $.ajax({
        type: 'get',
        url: '/find/?username='+username,
        success: (data) => {
            if(Object.keys(data).length <= 0) {
                $("#username-search-name").text("No user found.");
                $("#username-search-id").text("Please try again.");
                $("#add-friend-button").hide();

            } else {
                
                $("#username-search-name").text(data["full_name"]);
                $("#username-search-id").text(data["username"]);
                $("#add-friend-button").show();

                if(data["is_friend"]) {
                    if($("#add-friend-button").hasClass("btn-success")) {
                        $("#add-friend-button").removeClass("btn-success");
                    }

                    if(!$("#add-friend-button").hasClass("btn-secondary")) {
                        $("#add-friend-button").addClass("btn-secondary");
                    }

                    $("#add-friend-button").click(function() {

                    });
                } else {
                    if($("#add-friend-button").hasClass("btn-secondary")) {
                        $("#add-friend-button").removeClass("btn-secondary");
                    }

                    if(!$("#add-friend-button").hasClass("btn-success")) {
                        $("#add-friend-button").addClass("btn-success");
                    }

                    $("#add-friend-button").click(function() {
                        $.ajax({
                            type: 'post',
                            url:'/add-friend/',
                            async: false,
                            data: {
                                'username':data["username"],
                            },
                            success: (data) => {
                                if($("#modal-holder").hasClass("hidden")) {
                                    $("#modal-holder").removeClass("hidden");
                                }
                            
                                if(!$("#modal-username-search-holder").hasClass("hidden")) {
                                    $("#modal-username-search-holder").addClass("hidden");
                                }

                                fetchUsers();
                            }
                        });
                    });
                }

            }
        },
    })
}

$("#username-search-bar").on('keyup', (event) => {
    if(event.keyCode == 13) {
        find_matching($("#username-search-bar").val());
    }
});

/* Show search modal */
$("#search-new-btn").click(function() {
    $("#username-search-name").text("Search for User");
    $("#username-search-id").text("by username");
    $("#add-friend-button").hide();

    if(!$("#modal-holder").hasClass("hidden")) {
        $("#modal-holder").addClass("hidden");
    }

    if($("#modal-username-search-holder").hasClass("hidden")) {
        $("#modal-username-search-holder").removeClass("hidden");
    }
});

$("#cancel-search-username").click(function() {
    if($("#modal-holder").hasClass("hidden")) {
        $("#modal-holder").removeClass("hidden");
    }

    if(!$("#modal-username-search-holder").hasClass("hidden")) {
        $("#modal-username-search-holder").addClass("hidden");
    }
});