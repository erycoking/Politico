window.onload = load_profile();

function load_profile(){
    var current_user = JSON.parse(sessionStorage.current_user);

    document.getElementById("fullname").innerHTML = current_user.fullname;
    document.getElementById("email").innerHTML = current_user.email;
    document.getElementById("id_no").innerHTML = current_user.id_no;
    document.getElementById("passport_url").innerHTML = current_user.passport_url;
    document.getElementById("username").innerHTML = current_user.username;
}
