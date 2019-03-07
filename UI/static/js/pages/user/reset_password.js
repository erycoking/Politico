function send_reset_link() {

    
    var email = document.forms.passwd.email;
    if (email.value == '') {
        alert('Email is required');
        return false;
    }

    var email_body = {
        "email": email.value
    };
    var reset_url = "https://politico-api-version-2.herokuapp.com/api/v2/auth/reset";

    var spinner = '';
    spinner = `
        <p><img src="static/img/gifs/Spinner-1s-200px.gif"></p>
    `;
    document.getElementById("main-content").innerHTML = spinner;


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
                history.back();
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
            history.back();
        });

    return false;
}