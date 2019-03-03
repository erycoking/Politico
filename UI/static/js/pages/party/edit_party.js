window.onload = load_party();

function load_party() {
    var party = JSON.parse(sessionStorage.retrieved_party);

    if (party) {

        var update_msg = sessionStorage.update_party_msg;
        if (update_msg) {
            confirm(update_msg);
            sessionStorage.removeItem("update_party_msg");
        }

        var party_name = document.forms.editPartyForm.party_name;
        var party_address = document.forms.editPartyForm.party_address;
        var party_logo = document.forms.editPartyForm.party_logo;

        party_name.value = party.name;
        party_address.value = party.hq_address;
        party_logo.value = party.logo_url;


    } else {
        confirm("Retrived party is null. Contact admin.");
        history.back();
    }
}

/**
 * patterns for validation
 */
const fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;
const address_pattern = /^[a-zA-Z0-9]{2,25}([.,]?( [a-zA-Z0-9]{2,25})*.?)*$/;
const image_url_pattern = /^https?:\/\/(www\.)?(\w+)(\.\w+)\/(\w+\/)*(\w+\.)(jpeg|png|jpg)$/;

function editParty() {
    var party_name = document.forms.editPartyForm.party_name;
    var party_address = document.forms.editPartyForm.party_address;
    var party_logo = document.forms.editPartyForm.party_logo;

    if (!fullname_pattern.test(party_name.value)) {
        party_name.focus();
        alert("Invalid name.\nName should only contain alphabets and spaces if needed.\nName name should not be less than three characters.");
        return false;
    }

    if (!address_pattern.test(party_address.value)) {
        party_address.focus();
        alert("Invalid address.\nAddress should only contain alphabets, comma, perion and spaces if needed.\nAddress name should not be less than three characters.");
        return false;
    }

    if (!image_url_pattern.test(party_logo.value)) {
        party_logo.focus();
        alert("Invalid logo url.\nLogo url should contain a valid domain and end with either jpg, jpeg or png.");
        return false;
    }

    var party_data = {
        "hq_address": party_address.value,
        "logo_url": party_logo.value,
        "name": party_name.value
    };

    var party_id = JSON.parse(sessionStorage.retrieved_party);
    var url = "https://politico-api-version-2.herokuapp.com/api/v2/parties/" + party_id.id;
    var token = sessionStorage.token;

    fetch(url, {
            method: "PATCH",
            mode: "cors",
            body: JSON.stringify(party_data),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result.data);
            if (result.status == 200) {
                var updated_party = result.data[0];
                var party_data_2 = {
                    "id": updated_party.id,
                    "name": updated_party.name, 
                    "hq_address": updated_party.hq_address, 
                    "logo_url": updated_party.logo_url 
                };
                sessionStorage.retrieved_party = JSON.stringify(party_data_2);
                sessionStorage.update_party_msg = "Party Successfully updated";
                console.log(updated_party);
                location.reload();
                return true;
            }
        })
        .catch(e => {
            console.log(e);
            elert(e.message);
            return false;
        });

    return false;
}

var back = document.getElementById("btn-view-parties");
back.addEventListener('click', goBack, true);

function goBack(e){
    location.replace("admin_view_parties.html");
}