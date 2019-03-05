window.onload = loadData();

function loadData() {
    checkIfAlreadyAcandidate();
    loadParties();
    loadOffices();
}

function checkIfAlreadyAcandidate(){
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
                    var cand_url = "https://politico-api-version-2.herokuapp.com/api/v2/office/"+d.id+"/candidates";

                        fetch(cand_url, {
                                method: 'GET',
                                mode: "cors",
                                headers: {
                                    'Content-type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })
                            .then(res => res.json())
                            .then(cand => {
                                if (cand.status == 200) {
                                    data = cand.data;
                                    if (data.length > 0) {
                                        data.forEach(function (candidate) {
                                            current_user = JSON.parse(sessionStorage.current_user);
                                            if (candidate.candidate == current_user.fullname){
                                                confirm('You are alraedy a candidate');
                                                history.back();
                                            }
                                        });
                                    }
                                }
                            })
                            .catch(e => {
                                console.log(e.message);
                                confirm(e.message);
                            });
                });

            } else {
                confirm("No offices available yet. Kindly register some other time or contact admin");
                history.back();
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
}

function loadParties() {
    var party_url = "https://politico-api-version-2.herokuapp.com/api/v2/parties";

    fetch(party_url, {
            method: 'GET',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(parties => {
            if (parties.status == 200) {
                var data = parties.data;
                data.forEach(function (d) {
                    var x = document.getElementById("party");
                    var option = document.createElement("option");
                    option.text = d.name;
                    option.value = d.name;
                    x.add(option);
                });

            } else {
                confirm("No parties available yet. Kindly register some other time or contact admin");
                history.back();
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
}


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
                    option.value = d.id;
                    x.add(option);
                });

            } else {
                confirm("No offices available yet. Kindly register some other time or contact admin");
                history.back();
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
}


function registerOffice(){
    var office = document.forms.candidate.office;
    var party = document.forms.candidate.party;

    if (office.selectedIndex < 1){
        alert("office is required");
        return false;
    }

    if (party.selectedIndex < 1){
        alert("party is required");
        return false;
    }

    var candidate_registrtion_url = "https://politico-api-version-2.herokuapp.com/api/v2/office/"+office.value+"/register";
    var token = sessionStorage.token;
    var cand_data = {
        "party": party.value
    };

    fetch(candidate_registrtion_url, {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(cand_data),
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(cand => {
        if (cand.status == 201) {
            confirm("All the best. You are now a candidate.");
            location.replace("user_view_candidates.html");
        } else {
            confirm("something went wrong while trying to register you.");
            location.replace("user_view_candidates.html");
        }
    })
    .catch(e => {
        console.log(e.message);
        confirm(e.message);
        return false;
    });

    return false;
}