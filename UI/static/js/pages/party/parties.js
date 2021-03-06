/**
 * patterns for validation
 */
const fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;
const address_pattern = /^[a-zA-Z0-9]{2,25}([.,]?( [a-zA-Z0-9]{2,25})*.?)*$/;
const image_url_pattern = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/|www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

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

    var url = "https://politico-api-version-2.herokuapp.com/api/v2/parties";
    var token = sessionStorage.token;

    fetch(url, {
        method: 'POST', 
        mode: "cors",
        body: JSON.stringify(party_data), 
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(party => {
        if (party.status == 201){
            confirm("party added with id: "+ party.data[0].id);
            history.back();
            return true;
        }else{
            return false;
        }
    })
    .catch(e => {
        console.log(e);
        confirm(e.message);
        return false;
    });

    return false;
}