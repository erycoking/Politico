window.onload = load_candidates();

function load_candidates() {
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
                        var cand_url = "https://politico-api-version-2.herokuapp.com/api/v2/office/" + office.id + "/candidates";

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
                                        data.forEach(function (candidate) {
                                            var is_admin = sessionStorage.is_admin;
                                            if (is_admin == 'true') {
                                                cand_output += `
                                                    <thead>
                                                        <tr>
                                                            <th>Photo</th>
                                                            <th>Candidate</th>
                                                            <th>Party Logo</th>
                                                            <th>Party</th>
                                                            <th>Office</th>
                                                            <th>Action</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td class="icon">
                                                            <img src="${candidate.candidate_photo_url}" alt="passport_url">
                                                        </td>
                                                        <td>${candidate.candidate}</td>
                                                        <td class="icon">
                                                            <img src="${candidate.party_logo_url}" alt="jubilee_logo">
                                                        </td>
                                                        <td>${candidate.party}</td>
                                                        <td>${candidate.office}</td>
                                                        <td>
                                                            <a href="https://politico-api-version-2.herokuapp.com/api/v2/office/${office.id}/candidates/${candidate.id}" class="btn-delete">Delete</a>
                                                        </td>
                                                    </tr>
                                                    </tbody>
                                                `;
                                            } else {
                                                cand_output += `
                                                    <thead>
                                                        <tr>
                                                            <th>Photo</th>
                                                            <th>Candidate</th>
                                                            <th>Party Logo</th>
                                                            <th>Party</th>
                                                            <th>Office</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                    <tr>
                                                        <td class="icon">
                                                            <img src="${candidate.candidate_photo_url}" alt="passport_url">
                                                        </td>
                                                        <td>${candidate.candidate}</td>
                                                        <td class="icon">
                                                            <img src="${candidate.party_logo_url}" alt="jubilee_logo">
                                                        </td>
                                                        <td>${candidate.party}</td>
                                                        <td>${candidate.office}</td>
                                                    </tr>
                                                    </tbody>
                                                `;
                                            }
                                        });
                                    } else {
                                        // no candidates found
                                        var is_admin = sessionStorage.is_admin;
                                        if (is_admin == 'true') {
                                            cand_output += `
                                                <tr>
                                                    <td colspan='6'>No candidates is running for this office</td>
                                                </tr>
                                            `;
                                        } else {
                                            cand_output += `
                                                <tr>
                                                    <td colspan='5'>No candidates is running for this office</td>
                                                </tr>
                                            `;
                                        }
                                    }
                                    var table = document.createElement("table");
                                    var att = document.createAttribute("class"); // Create a "class" attribute
                                    att.value = "candidate-table";
                                    table.setAttributeNode(att);
                                    table.innerHTML = cand_output;

                                    cand_output_table = table;
                                    // console.log(cand_output_table)

                                    var type = typeof cand_output_table;
                                    // console.log(type);

                                    var div3 = document.createElement("div");
                                    var div = document.createElement("div");
                                    var inner_div = document.createElement("div");
                                    var h4 = document.createElement("h4");
                                    var txt = document.createTextNode(office.name);

                                    h4.appendChild(txt);
                                    inner_div.appendChild(h4);
                                    div.appendChild(inner_div);
                                    div3.appendChild(div);
                                    // console.log(div);

                                    div3.appendChild(cand_output_table);
                                    document.getElementById("candidate-list").appendChild(div3);

                                    var delete_link = document.getElementsByClassName("btn-delete");
                                    var numDelLink = delete_link.length;
                                    for (var i = 0; i < numDelLink; i++) {
                                        delete_link[i].addEventListener('click', deleteEventHandler, true);
                                    }

                                    var delete_msg = sessionStorage.delete_candidate_msg;
                                    if (delete_msg) {
                                        confirm(delete_msg);
                                        sessionStorage.removeItem("delete_candidate_msg");
                                    }

                                } else {
                                    // something went wrong while fetching candidates
                                    console.log(cand.error);
                                    // confirm(cand.error);
                                    cand_output_table = `
                                        <p>something went wrong while fetching candidates</p>
                                    `;
                                }

                            })
                            .catch(e => {
                                console.log(e);
                                // confirm(e.message);
                                cand_output_table = `
                                    <p>something went wrong while fetching candidates</p>
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

    // candidate-list
}

// 
// var text = link.firstChild.firstChild.nodeValue;



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
                    sessionStorage.delete_candidate_msg = "Candidate Successfully deleted";
                    location.reload();
                }
            })
            .catch(e => {
                console.log(e.message);
                elert(e.message);
            });
    }

}