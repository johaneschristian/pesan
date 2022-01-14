window.addEventListener('load', update_chat);

var scroll_down = false;

const to_send_input = document.getElementById('to-sent-input');
const chat_ctr = document.getElementById("chat-container");

to_send_input.addEventListener('keyup', (event) => {
    if(event.keyCode == 13) {  
        add_message(
           to_send_input.value,
           active_user_id_stored,
        );
        to_send_input.value = "";
    }
})

const chat_container = $(".chat-container")[0]

/* Sample Message JSON */
/* (sender=x and receiver=y) or (sender=y and receiver=x) */

// $('#user-account-id').on('change', update_chat);

var message_timeout;

var previous_length = 0;
var previous_sent_messages_length = 0;

function update_chat(pushdown=false) {
    user_account_id = user_account_id_stored;
    chatter_account_id = active_user_id_stored;

    var sent_messages_length = 0;

    if(message_timeout != undefined) {
        clearTimeout(message_timeout);
    }

    if(pushdown) {
        chat_container.innerHTML = "";
    }

    $.ajax({
        type: 'GET',
        url: '/get-messages/?corresponding-id='+chatter_account_id,
        success: (data) => {
            message_timeout = setTimeout(update_chat, 800);
            messages = data;
            var holder = document.createElement('div');

            for(let i=0; i < messages.length; i++) {
                var iterated_message = messages[i]["fields"]

                if(iterated_message["receiver"] == chatter_account_id || iterated_message["sender"] == chatter_account_id) {
                    if(iterated_message["sender"] == user_account_id) {
                        message_row = document.createElement('div');
                        message_row.className = "message-row outgoing";
            
                        message = document.createElement('div');
                        message.className = "message-outgoing";

                        sent_messages_length++;

                    } else {
                        message_row = document.createElement('div');
                        message_row.className = "message-row incoming";
            
                        message = document.createElement('div');
                        message.className = "message-incoming";
                    }
            
                    message_body = document.createElement('div');
                    message_body.className = "message-body";
                    message_body.innerText = iterated_message["content"];
            
            
                    message_timestamp = document.createElement('div');
                    message_timestamp.className = "message-timestamp";
                    message_timestamp.innerText = iterated_message["timestamp"];
            
                    message.appendChild(message_body)
                    message.appendChild(message_timestamp)
            
                    message_row.appendChild(message)
            
                    holder.appendChild(message_row)
                }

                if(previous_sent_messages_length <= sent_messages_length) {
                    chat_container.innerHTML = holder.innerHTML;
                    previous_sent_messages_length = sent_messages_length;
                } 
            }       
            
            if(scroll_down || pushdown || previous_length < messages.length) {
                chat_ctr.scrollTop = chat_ctr.scrollHeight;
                scroll_down = false;
            }
            previous_length = messages.length;
        },
    });
}

function add_message(new_message, corresponding_account_id) {
    previous_sent_messages_length++;

    message_row = document.createElement('div');
    message_row.className = "message-row outgoing";

    message = document.createElement('div');
    message.className = "message-outgoing";
    

    message_body = document.createElement('div');
    message_body.className = "message-body";
    message_body.innerText = new_message;


    message_timestamp = document.createElement('div');
    message_timestamp.className = "message-timestamp";
    message_timestamp.innerText = '🕐';

    message.appendChild(message_body);
    message.appendChild(message_timestamp);

    message_row.appendChild(message);

    chat_container.appendChild(message_row);

    chat_ctr.scrollTop = chat_ctr.scrollHeight;
    
    scroll_down = true;

    $.ajax({
        type:'post',
        url:'/add-message/',
        data: {
            'corresponding-id':corresponding_account_id,
            'content':new_message,
        },
        success: function(data) {
            scroll_down = true;
        }   
    }); 
}