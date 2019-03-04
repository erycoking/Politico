/**
 * patterns for validation
 */
const name_pattern = /^[A-Za-z]{3,25}$/;
const fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;
const address_pattern = /^[a-zA-Z0-9]{2,25}([.,]?( [a-zA-Z0-9]{2,25})*.?)*$/;
const username_pattern = /^\w{3,25}$/;
const email_pattern = /^[^@]+@[^@]+\.[^@]+$/;
const phone_pattern = /^(2547|07)\d{8}$/;
const idNo_pattern = /^\d{4,20}$/;
const image_url_pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;
const passwd_pattern = /^.{8,}$/;

/**
 * user registration
 */


function userSignUp() { 
    var fname = document.forms.user.fname;
    var mname = document.forms.user.mname;
    var lname = document.forms.user.lname;
    var email = document.forms.user.email;
    var username = document.forms.user.username;
    var password = document.forms.user.password;
    var confirm_password = document.forms.user.cpassword;
    var idNo = document.forms.user.idNo;
    var passport_url = document.forms.user.passport_url;
    var phone_number = document.forms.user.phone_number;
    

    if (!name_pattern.test(fname.value)){
        fname.focus();
        alert("Invalid first name.\nFirst name should only contain alpabets.\nFirst name should not be less than three characters.");
        return false;
    }

    if (!name_pattern.test(lname.value)){
        lname.focus();
        alert("Invalid last name.\nLast name should only contain alpabets.\nLast name should not be less than three characters.");
        return false;
    }

    if (mname.value != ""){
        if (!name_pattern.test(mname.value)){
            mname.focus();
            alert("Invalid middle name.\nMiddle name should only contain alpabets.\nMiddle name should not be less than three characters.");
            return false;
        }
    }

    if (!username_pattern.test(username.value)){
        username.focus();
        alert("Invalid username.\nUsername can only contain alpabets, numbers and underscore.\nUsername name should not be less than three characters.");
        return false;
    }

    if (!email_pattern.test(email.value)){
        email.focus();
        alert("Invalid email.\nPlease provide a valid email");
        return false;
    }

    if (!idNo_pattern.test(idNo.value)){
        idNo.focus();
        alert("Invalid ID number.\nPlease provide a valid ID Number");
        return false;
    }

    if (!image_url_pattern.test(passport_url.value)){
        passport_url.focus();
        alert("Invalid passport url.\nPassport url should contain a valid domain and end with either jpg, jpeg or png.");
        return false;
    }

    if (!phone_pattern.test(phone_number.value)){
        phone_number.focus();
        alert("Invalid phone number.\nPhone number should start with either '2547' or '07' followed by 8 digits. ");
        return false;
    }

    if (!passwd_pattern.test(password.value)){
        password.focus();
        alert("Invalid password.\nPassword should be more than 8 characters long");
        return false;
    }

    if (password.value != confirm_password.value){
        confirm_password.focus();
        alert("Passwords do not match!!!");
        return false;
    }

    var user_data = {
        "email": email.value,
        "firstname": fname.value,
        "id_no": idNo.value,
        "lastname": lname.value,
        "othername": mname.value,
        "passport_url": passport_url.value,
        "password": password.value,
        "phone_number": phone_number.value,
        "username": username.value
    };

    signup_url = "https://politico-api-version-2.herokuapp.com/api/v2/auth/signup";
    fetch(signup_url, {
        method: 'POST', 
        mode: "cors",
        body: JSON.stringify(user_data), 
        headers: {
            'Content-type': 'application/json'
        }
    })
    .then(res => res.json())
    .then(user => {
        if(user.status == 200){
            sessionStorage.setItem('token', user.data[0].token);
            sessionStorage.setItem('is_admin', user.data[0].user.is_admin);
            location.replace("dashboard.html");
        }else{
            alert(user.error);
            return false;
        }
    })
    .catch(e => {
        console.log(e);
        alert(e.message);
        return false;
    });

    return false;

}


/**
 * User login
 */

function userLogin(){
    username = document.forms.login.username;
    password = document.forms.login.password;

    if (username && password){
        var user_credentials = {
            "username": username.value,
            "password": password.value
        };

        login_url = "https://politico-api-version-2.herokuapp.com/api/v2/auth/login";
        fetch(login_url, {
            method: 'POST', 
            mode: "cors",
            body: JSON.stringify(user_credentials), 
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(user => {
            if(user.status == 200){
                sessionStorage.setItem('token', user.data[0].token);
                var current_user = JSON.stringify(user.data[0].user);
                console.log(current_user);
                sessionStorage.setItem('current_user', current_user);
                var is_admin = user.data[0].user.is_admin;
                sessionStorage.setItem('is_admin', is_admin);
                if (is_admin){
                    location.replace("admin/admin_dashboard.html");
                }else{
                    location.replace("voters/dashboard.html");
                }
            }else{
                alert(user.error);
                return false;
            }
        })
        .catch(e => {
            console.log(e);
            confirm(e.message);
        });
        return false;
    }else{
        alert("Both username and password are required");
        return false;
    }
}