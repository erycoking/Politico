window.onload = load_petitions();

function load_petitions() {
    var url = "https://politico-api-version-2.herokuapp.com/api/v2/offices";
    var token = sessionStorage.token;



    var office_output = '';
    fetch(url, {
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
                var final_cand_output = '';
                var data = offices.data;

                if (data.length > 0) {
                    var cand_output_table = '';
                    data.forEach(function (office) {
                        // console.log(office);
                        // var office_name = office.name;
                        var petition_url = "https://politico-api-version-2.herokuapp.com/api/v2/petitions";

                        fetch(petition_url, {
                                method: 'GET',
                                mode: "cors",
                                headers: {
                                    'Content-type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })
                            .then(res => res.json())
                            .then(petitions => {
                                if (petitions.status == 200) {
                                    var cand_output = '';
                                    data = petitions.data;
                                    if (data.length > 0) {
                                        data.forEach(function (pet) {
                                            sessionStorage.petition_count = "data available";

                                            if (office.name == pet.office) {
                                                var office_name = office.name;

                                                var is_admin = sessionStorage.is_admin;
                                                if (is_admin == 'true') {
                                                    cand_output += `
                                                            <div class="candidate-table">
                                                                <div>
                                                                    <h2>Petitions for the ${office_name} office</h2>
                                                                </div>
                                                                <div>
                                                                    <p><strong>Filed By: </strong> ${pet.created_by}</p>
                                                                    <p><strong>On: </strong>${pet.created_on}</p>
                                                                    <div>
                                                                        <h4>Complain</h4>
                                                                        <div>${pet.body}</div>
                                                                    </div>
                                                                    <div>
                                                                        <h4>Evidence</h4>
                                                                        <div>${pet.evidence[0]}</div>
                                                                    </div>
                                                                    <div>
                                                                        <a href="https://politico-api-version-2.herokuapp.com/api/v2/petitions/${pet.id}" class="btn-edit">Edit</a>
                                                                        <a href="https://politico-api-version-2.herokuapp.com/api/v2/petitions/${pet.id}" class="btn-delete">Delete</a>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    `;
                                                } else {
                                                    cand_output += `
                                                            <div class="candidate-table">
                                                                <div>
                                                                    <h2>Petitions for the ${office_name} office</h2>
                                                                </div>
                                                                <div>
                                                                    <p><strong>Filed By: </strong> ${pet.created_by}</p>
                                                                    <p><strong>On: </strong>${pet.created_on}</p>
                                                                    <div>
                                                                        <h4>Complain</h4>
                                                                        <div>${pet.body}</div>
                                                                    </div>
                                                                    <div>
                                                                        <h4>Evidence</h4>
                                                                        <div>${pet.evidence[0]}</div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    `;
                                                }
                                            }

                                        });
                                        var div = document.createElement("div");
                                        div.innerHTML = cand_output;
                                        document.getElementById("candidate-list").appendChild(div);

                                    } else {
                                        // no petitions found
                                        // petition count will remain zero
                                    }

                                    var edit_link = document.getElementsByClassName("btn-edit");
                                    var numLink = edit_link.length;
                                    for (var i = 0; i < numLink; i++) {
                                        edit_link[i].addEventListener('click', editEventHandler, true);
                                    }

                                    var delete_link = document.getElementsByClassName("btn-delete");
                                    var numDelLink = delete_link.length;
                                    for (var i = 0; i < numDelLink; i++) {
                                        delete_link[i].addEventListener('click', deleteEventHandler, true);
                                    }

                                } else {
                                    // something went wrong while fetching petitions
                                    console.log(cand.error);
                                    // confirm(cand.error);
                                    cand_output_table = `
                                        <p>something went wrong while fetching petitions</p>
                                    `;
                                    var div = document.createElement("div");
                                    div.innerHTML = cand_output_table;
                                    document.getElementById("candidate-list").appendChild(div);
                                }

                                var petition_count = sessionStorage.petition_count;
                                var petition_print_count = sessionStorage.petition_print_count;
                                console.log(petition_count);
                                if (!petition_count) {
                                    if (!petition_print_count) {
                                        var petition_output = '';
                                        petition_output += `
                                            <div class="candidate-table">
                                                <p>No petition filed</p>
                                            </div>
                                        `;
                                        var div = document.createElement("div");
                                        div.innerHTML = petition_output;
                                        document.getElementById("candidate-list").appendChild(div);

                                        sessionStorage.petition_print_count = 1;
                                    }
                                } else {
                                    sessionStorage.removeItem("petition_count");
                                    
                                }

                            })
                            .catch(e => {
                                console.log(e);
                                // confirm(e.message);
                                cand_output_table = `
                                    <p>something went wrong while fetching petitions</p>
                                `;
                                var div = document.createElement("div");
                                div.innerHTML = cand_output_table;
                                document.getElementById("candidate-list").appendChild(div);
                            });


                    });

                } else {
                    // No offices found
                    final_cand_output = `
                        <div>
                            <p>No office found</p>
                        </div>
                    `;
                    var div = document.createElement("div");
                    div.innerHTML = final_cand_output;
                    document.getElementById("candidate-list").appendChild(div);
                }

            } else {
                // something went wrong while fetching offices
                console.log(offices.error);
                // confirm(offices.error);
                office_output = `
                        <div>
                            <p>something went wrong while fetching offices</p>
                        </div>
                    `;
                var div2 = document.createElement("div");
                div2.innerHTML = office_output;
                document.getElementById("candidate-list").appendChild(div2);
            }



            // var delete_msg = sessionStorage.delete_petition_msg;
            // if (delete_msg) {
            //     confirm(delete_msg);
            //     sessionStorage.removeItem("delete_petition_msg");
            // }
        })
        .catch(e => {
            console.log(e);
            // confirm(e.message);
            office_output = `
                        <div>
                            <p>something went wrong while fetching offices</p>
                        </div>
                    `;
            var div = document.createElement("div");
            div.innerHTML = office_output;
            document.getElementById("candidate-list").appendChild(div);
        });


        sessionStorage.removeItem("petition_print_count");
    // candidate-list
}

// 
// var text = link.firstChild.firstChild.nodeValue;

function editEventHandler(e) {
    e.preventDefault();

    var href = e.target.href;

    fetch(href, {
            method: 'GET',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(result => {
            if (result.status == 200) {
                var petition_data = result.data[0];
                console.log(petition_data.evidence);
                var evid = petition_data.evidence[0];
                console.log(evid);
                var petition = {
                    "id": petition_data.id,
                    "created_by": petition_data.created_by,
                    "created_on": petition_data.created_on,
                    "body": petition_data.body,
                    "evidence": evid,
                    "office": petition_data.office
                };
                sessionStorage.retrieved_petition = JSON.stringify(petition);
                location.replace("edit_petition.html");
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
}

function get_evidence(pet) {
    var evidence_output = '';
    var evidence = pet.evidence;
    var ul = document.createElement("ul");
    evidence.forEach(function (ev) {
        evidence_output += `
            <p>${pet.evidence}</p>
        `;
        var li = document.createElement("li");
        li.innerHTML = evidence_output;
        ul.appendChild(li);
    });

    return ul;
}


function deleteEventHandler(e) {
    e.preventDefault();
    var del = confirm("Are you sure you want to delete???");

    if (del) {
        var href = e.target.href;

        fetch(href, {
                method: 'DELETE',
                mode: "cors",
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            })
            .then(res => res.json())
            .then(result => {
                if (result.status == 200) {
                    var msg = result.data.message;
                    // sessionStorage.delete_petition_msg = "Petition Successfully deleted";
                    // location.replace("admin_view_petitions.html");
                    location.reload();
                }
            })
            .catch(e => {
                console.log(e.message);
                elert(e.message);
            });
    }

}