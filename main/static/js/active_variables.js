var user_account_id_stored = document.getElementById('user-account-id').value;
var active_user_id_stored;

function setUserAccountID(id) {
    user_account_id_stored = id;
    $("#user-account-id").val(user_account_id_stored);
}

function setActiveUserID(id) {
    active_user_id_stored = id;
    $("#active-user-id").val(active_user_id_stored);
}

// Check validity every n seconds