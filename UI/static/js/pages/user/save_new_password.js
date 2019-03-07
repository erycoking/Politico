function save_new_password() {

    var email = document.forms.passwd.email;
    var password = document.forms.passwd.password;
    var cpassword = document.forms.passwd.cpassword;

    if (email.value == '') {
        alert('Email is required');
        return false;
    }

    if (password.value == '') {
        alert('Password is required');
        return false;
    }

    if (cpassword.value == '') {
        alert('Confirm password is required');
        return false;
    }

    if (password.value != cpassword.value) {
        alert('Passwords do not match');
        return false;
    }

    var spinner = '';
    spinner = `
        <p><img src="static/img/gifs/Spinner-1s-200px.gif"></p>
    `;
    document.getElementById("main-content").innerHTML = spinner;

    var passwd_body = {
        "email": email.value, 
        "password": password.value
    };
    var reset_url = "https://politico-api-version-2.herokuapp.com/api/v2/auth/password";

    fetch(reset_url, {
            method: 'POST',
            mode: "cors",
            body: JSON.stringify(passwd_body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                alert("Password updated successfully");
                location.replace("user_login.html");
            }else{
                alert(result.error);
                return false;
            }
        })
        .catch(e => {
            console.log(e);
            confirm(e.message);
        });

    return false;
}