
var token = sessionStorage.token;
if (!token){
    location.assign("../user_login.html");
}

var signout = document.getElementById("signout");
signout.addEventListener('click', userSignOut);

function userSignOut(){
    sessionStorage.removeItem("token");
}



