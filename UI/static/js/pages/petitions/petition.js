window.onload = loadOffices();

function loadOffices() {
    var office_url = "https://politico-api-version-2.herokuapp.com/api/v2/offices";

    fetch(office_url, {
            method: 'GET',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(offices => {
            if (offices.status == 200) {
                var data = offices.data;
                data.forEach(function (d) {
                    var x = document.getElementById("office");
                    var option = document.createElement("option");
                    option.text = d.name;
                    option.value = d.name;
                    x.add(option);
                });

            } else {
                confirm("No offices available yet. Kindly check later or contact admin or contact admin");
                history.back();
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
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

function save_petition(){
    var office = document.forms.petition.office;
    var complain = document.forms.petition.complain;
    var evidence = document.forms.petition.evidence;

    if (office.selectedIndex < 1){
        alert("office required");
        return false;
    }

    if (!complain.value){
        alert("complain required");
        return false;
    }

    if (!evidence.value){
        alert("evidence required");
        return false;
    }

    var evi = [evidence.value];

    var petition_data = {
        "office": office.value, 
        "body": complain.value, 
        "evidence": evi
    };

    var save_petition_url = "https://politico-api-version-2.herokuapp.com/api/v2/petitions";

    fetch(save_petition_url, {
        method: 'POST', 
        mode: "cors",
        body: JSON.stringify(petition_data), 
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(petition => {
        if (petition.status == 201){
            alert("petition added with id: "+ petition.data[0].id);
            location.replace("user_view_petitions.html");
        }else{
            console.log(petition.error);
            confirm(petition.error);
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

function goBack(){
    history.back();
}