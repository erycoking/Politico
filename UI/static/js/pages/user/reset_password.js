function send_reset_link() {

    var email = document.forms.password_reset.email;
    if (email.value == '') {
        alert('Email is required')
        return false;
    }

    var email_body = {
        "email": email.value
    };
    var reset_url = "https://politico-api-version-2.herokuapp.com/api/v2/auth/reset";

    fetch(reset_url, {
            method: 'POST',
            mode: "cors",
            body: JSON.stringify(email_body),
            headers: {
                'Content-type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                alert(result.data[0].message);
                history.back();
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