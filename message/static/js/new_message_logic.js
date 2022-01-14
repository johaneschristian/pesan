var cached_users = [];

$("#new-chat-button").click(function() {
    toggleModal();
});

$("#close-new-message").click(function() {
    toggleModal();
});

function toggleModal() {
    if($("#modal-holder").hasClass('hidden')) {
        fetchUsers();
        $("#modal-holder").removeClass('hidden');
    } else {
        $("#modal-holder").addClass('hidden');
    }
}

/* fetchUsers will be changed to AJAX */
function fetchUsers() {
    $.ajax({
        type: 'GET',
        url: '/get-user-friends/',
        success: (data) => {
            cached_users = data;
            fillUsers(cached_users);
        }
    });

    
}

$("#contact-search-bar").on('input', function() {
    fillUsers(cached_users, $("#contact-search-bar").val());
});

function fillUsers(users, filter=null) {
    overlay_container = document.getElementById("overlay-container");

    overlay_container.innerText = "";

    for(let i=0; i<users.length; i++) {
        if(filter == null || (filter != null && users[i]["profile_name"].indexOf(filter) > -1)) {
            profile_card = document.createElement("button");
            profile_card.className = "profile-card";
            profile_card.onclick = function() {
                setActiveUserID(users[i]["user_id"]);
                update_chat(pushdown=true);
                $(".user-profile-name")[0].innerText = users[i]["profile_name"];
                toggleModal();

                if($("#user-info-container").hasClass("on-start")) {
                    $("#user-info-container").removeClass("on-start");
                    $("#chat-container").removeClass("on-start");
                    $("#sent-container").removeClass("on-start");
                }

                previous_sent_messages_length = 0;
                previous_length = 0;
                
            };

            card_name = document.createElement("span");
            card_name.className = "card-name";
            card_name.innerText = users[i]["profile_name"];

            card_id = document.createElement("span");
            card_id.className = "card-id";
            card_id.innerText = users[i]["user_id"];

            profile_card.appendChild(card_name);
            profile_card.appendChild(card_id);
            overlay_container.appendChild(profile_card);
        }
    }
}