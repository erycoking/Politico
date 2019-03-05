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
                    option.value = d.id;
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

function load_candidates_for_voting() {

    var office = document.forms.vote.office;

    if (office.selectedIndex < 1) {
        office.focus();
        alert("Office type is required");
        return false;
    }

    var office_text = office.options[office.selectedIndex].text;
    sessionStorage.current_office = office_text;

    var cand_url = "https://politico-api-version-2.herokuapp.com/api/v2/office/" + office.value + "/candidates";
    var token = sessionStorage.token;

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
                var cand_output = '';
                data = cand.data;
                if (data.length > 0) {
                    var tbody = document.createElement("tbody");
                    data.forEach(function (candidate) {
                        var is_admin = sessionStorage.is_admin;
                        cand_output += `
                            <tr>
                                <!--<td class="icon">
                                    <img src="${candidate.candidate_photo_url}" alt="passport_url">
                                </td>-->
                                <td>${candidate.candidate}</td>
                                <!--<td class="icon">
                                    <img src="${candidate.party_logo_url}" alt="jubilee_logo">
                                </td>-->
                                <td>${candidate.party}</td>
                                <td>${candidate.office}</td>
                                <td>
                                    <a href="#" id="${candidate.id}" class="btn-edit btn-vote">Vote</a>
                                </td>
                            </tr>
                        `;
                        tbody.innerHTML = cand_output;
                        // cand_output = tbody;
                    });
                    var table = document.createElement("table");
                    var att = document.createAttribute("class"); // Create a "class" attribute
                    att.value = "candidate-table";
                    table.setAttributeNode(att);

                    var thead = `
                        <thead>
                            <tr>
                                <!-- <th>Photo</th> -->
                                <th>Candidate</th>
                                <!-- <th>Party Logo</th> -->
                                <th>Party</th>
                                <th>Running for</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                    `;
                    table.innerHTML = thead;
                    table.appendChild(tbody);
                    document.getElementById("candidate-list").appendChild(table);

                } else {
                    // no candidates found
                    confirm("No candidates is running for the office of "+office_text);
                }



                var voting = document.getElementsByClassName("btn-vote");
                var numLink = voting.length;
                for (var i = 0; i < numLink; i++) {
                    voting[i].addEventListener('click', vote, true);
                }

                return false;

            } else {
                // something went wrong while fetching candidates
                console.log(cand.error);
                // confirm(cand.error);
                cand_output_table = `
                    <p>something went wrong while fetching candidates. try again later</p>
                `;
                var div2 = document.createElement("div");
                div2.innerHTML = cand_output_table;
                document.getElementById("candidate-list").appendChild(div2);

                return false;
            }

        })
        .catch(e => {
            console.log(e);
            // confirm(e.message);
            cand_output_table = `
                <p>something went wrong while fetching candidates. try again later</p>
            `;
            var div = document.createElement("div");
            div.innerHTML = cand_output_table;
            document.getElementById("candidate-list").appendChild(div);

            return false;
        });

    return false;

}

function vote(e) {
    e.preventDefault();
    var del = confirm("If you are satisfied with you choice click 'ok', if not you can cancel by clicking 'cancel'???");

    if (del) {
        var href = "https://politico-api-version-2.herokuapp.com/api/v2/votes";
        var office = sessionStorage.current_office;
        var candidate_id = e.target.id;
        var token = sessionStorage.token;

        var vote_data = {
            "office": office,
            "candidate": candidate_id
        };

        fetch(href, {
                method: 'POST',
                mode: "cors",
                body: JSON.stringify(vote_data),
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => res.json())
            .then(result => {
                if (result.status == 201) {
                    var msg = result.data.message;
                    sessionStorage.delete_candidate_msg = "Vote Successfully cast";
                    location.reload();
                } else {
                    console.log(result.error);
                    confirm(result.error);
                }
            })
            .catch(e => {
                console.log(e.message);
                elert(e.message);
            });
    }

}