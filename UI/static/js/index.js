/**
 * patterns for validation
 */
var name_pattern = /^[A-Za-z]{3,25}$/;
var fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;
var address_pattern = /^[a-zA-Z0-9]{2,25}([.,]?( [a-zA-Z0-9]{2,25})*.?)*$/;
var username_pattern = /^\w{3,25}$/;
var email_pattern = /^[^@]+@[^@]+\.[^@]+$/;
var phone_pattern = /^(2547|07)\d{8}$/;
var idNo_pattern = /^\d{4,20}$/;
var image_url_pattern = /^https?:\/\/(www\.)?(\w+)(\.\w+)\/(\w+\/)*(\w+\.)(jpeg|png|jpg)$/;
var passwd_pattern = /^.{8,}$/;

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

    console.log(user_data);

    location.replace("dashboard.html");

}

/**
 * office registration
 */

function registerOffice(){
    var office_name = document.forms.office.office_name;
    var office_type = document.forms.office.office_type;

    if (!fullname_pattern.test(office_name.value)){
        office_name.focus();
        alert("Invalid name.\nName should only contain alphabets and spaces if needed.\nName name should not be less than three characters.");
        return false;
    }

    if (office_type.selectedIndex < 1){
        office_type.focus();
        alert("Office type is required");
        return false;
    }

    var office_data = {
        "type": office_type.value, 
	    "name": office_name.value
    };

    console.log(office_data);

    history.back();
}

/**
 * party registration
 */

function registerParty(){
    var party_name = document.forms.party.party_name;
    var party_address = document.forms.party.party_address;
    var party_logo = document.forms.party.party_logo;

    if (!fullname_pattern.test(party_name.value)){
        party_name.focus();
        alert("Invalid name.\nName should only contain alphabets and spaces if needed.\nName name should not be less than three characters.");
        return false;
    }

    if (!address_pattern.test(party_address.value)){
        party_address.focus();
        alert("Invalid address.\nAddress should only contain alphabets, comma, perion and spaces if needed.\nAddress name should not be less than three characters.");
        return false;
    }

    if (!image_url_pattern.test(party_logo.value)){
        party_logo.focus();
        alert("Invalid logo url.\nLogo url should contain a valid domain and end with either jpg, jpeg or png.");
        return false;
    }

    var party_data = {
        "hq_address": party_address.value,
        "logo_url": party_logo.value,
        "name": party_name.value
    };

    console.log(party_data);

    history.back();
}


