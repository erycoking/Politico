window.onload = load_petition();

function load_petition() {
    var petition = JSON.parse(sessionStorage.retrieved_petition);

    var office = document.forms.petition.office;
    var complain = document.forms.petition.complain;
    var evidence = document.forms.petition.evidence;

    office.value = petition.office;
    complain.value = petition.body;
    evidence.value = petition.evidence;

}

function addEvidenceInput() {
    var textarea = document.createElement("textarea");
    var class_att = document.createAttribute("class");
    class_att.value = "evidence";
    var name_att = document.createAttribute("name");
    name_att.value = "evidence";

    textarea.setAttributeNode(class_att);
    textarea.setAttributeNode(name_att);

    document.getElementById("evidence_div").appendChild(textarea);
}

function save_petition() {
    var office = document.forms.petition.office;
    var complain = document.forms.petition.complain;
    var evidence = document.forms.petition.evidence;

    if (!complain.value) {
        alert("complain required");
        return false;
    }

    if (!evidence.value) {
        alert("evidence required");
        return false;
    }

    var evi = [evidence.value];

    var petition_data = {
        "office": office.value,
        "body": complain.value,
        "evidence": evi
    };

    var petition = JSON.parse(sessionStorage.retrieved_petition);
    var save_petition_url = "https://politico-api-version-2.herokuapp.com/api/v2/petitions/"+petition.id;

    fetch(save_petition_url, {
            method: 'PATCH',
            mode: "cors",
            body: JSON.stringify(petition_data),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(pet => {
            if (pet.status == 200) {
                confirm("petition updated successfully");
                location.replace("admin_view_petitions.html");
            } else {
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

function goBack(){
    var is_admin = sessionStorage.is_admin;
    if (is_admin == 'true') {
        location.replace("admin_view_petitions.html");
    }else{
        location.replace("user_view_petitions.html");
    }
}