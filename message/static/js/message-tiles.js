window.addEventListener('load', function() {
    update_leading_tile();
});

const message_tiles = $(".message-tiles")[0];

var cached_message_tiles = [];

function update_leading_tile() {
    /* Sample Chats JSON */
    $.ajax({
        type: 'GET',
        url: '/get-latest-chat/',
        success: (data) => {
            cached_message_tiles = data;
            fillTiles(cached_message_tiles);
            setTimeout(update_leading_tile, 1000);
        },
        
    })
}

function fillTiles(latest_chats, filter=null) {
    message_tiles.innerText = "";

    for(let i=0; i < latest_chats.length; i++) {
        
        if(filter == null || (filter!=null && latest_chats[i]["fields"]["corresponding_account_name"].indexOf(filter) > -1)) {
            message_tile = document.createElement('button');
            message_tile.className = "message-tile";
            message_tile.onclick = function() {
                                        setActiveUserID(latest_chats[i]["fields"]["corresponding_account_id"]);
                                        update_chat(pushdown=true);
                                        $(".user-profile-name")[0].innerText = latest_chats[i]["fields"]["corresponding_account_name"];

                                        if($("#user-info-container").hasClass("on-start")) {
                                            $("#user-info-container").removeClass("on-start");
                                            $("#chat-container").removeClass("on-start");
                                            $("#sent-container").removeClass("on-start");
                                        }
                                        
                                    }

            tile_profile_name = document.createElement('span');
            tile_profile_name.className = "tile-profile-name";
            tile_profile_name.innerText = latest_chats[i]["fields"]["corresponding_account_name"] + " " + latest_chats[i]["fields"]["timestamp"];

            tile_last_message = document.createElement('span');
            tile_last_message.className = "tile-last-message";
            tile_last_message.innerText = latest_chats[i]["fields"]["content"];

            message_tile.appendChild(tile_profile_name);
            message_tile.appendChild(tile_last_message);

            message_tiles.appendChild(message_tile);
        }
    }
}


/* Implementation of search bar */
const search_bar = $('#search-bar')
search_bar.on(
    'input',
    function() {
        fillTiles(cached_message_tiles, search_bar.val());
    }
)