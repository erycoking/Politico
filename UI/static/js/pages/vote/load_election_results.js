window.onload = load_votes();

function load_votes() {
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
                    document.getElementById("candidate-list").innerHTML = '';
                    var cand_output_table = '';
                    data.forEach(function (office) {

                        var div3 = document.createElement("div");
                        var div = document.createElement("div");
                        var inner_div = document.createElement("div");
                        var h4 = document.createElement("h4");
                        var txt = document.createTextNode(office.name);

                        h4.appendChild(txt);
                        inner_div.appendChild(h4);
                        div.appendChild(inner_div);
                        div3.appendChild(div);

                        var att = document.createAttribute("class");
                        att.value = "candidate-table";

                        var election_result_url = "https://politico-api-version-2.herokuapp.com/api/v2/offices/" + office.id + "/result";

                        fetch(election_result_url, {
                                method: 'GET',
                                mode: "cors",
                                headers: {
                                    'Content-type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                }
                            })
                            .then(res => res.json())
                            .then(results => {
                                

                                if (results.status == 200) {
                                    var results_output = '';
                                    data = results.data;
                                    if (data.length > 0) {
                                        data.forEach(function (rs) {
                                            results_output += `
                                               
                                                <tbody>
                                                <tr>
                                                    <td>${rs.candidate}</td>
                                                    <td>${rs.result}</td>
                                                </tr>
                                                </tbody>
                                            `;
                                        });

                                        var results_output_2 = '';
                                        results_output_2 += `
                                            <thead>
                                                <tr>
                                                    <th>Candidate's Name</th>
                                                    <th>Votes</th>
                                                </tr>
                                            </thead>
                                        `;
                                        results_output_2 += results_output;
                                        results_output = results_output_2;

                                    } else {
                                        // no candidates found
                                        var is_admin = sessionStorage.is_admin;
                                        if (is_admin == 'true') {
                                            results_output += `
                                                <tr>
                                                    <td colspan='6'>No candidates is running for this office</td>
                                                </tr>
                                            `;
                                        } else {
                                            results_output += `
                                                <tr>
                                                    <td colspan='5'>No candidates is running for this office</td>
                                                </tr>
                                            `;
                                        }
                                    }

                                    var table = document.createElement("table");
                                    table.setAttributeNode(att);
                                    table.innerHTML = results_output;

                                    cand_output_table = table;
                                    div3.appendChild(cand_output_table);
                                    document.getElementById("candidate-list").appendChild(div3);

                                } else {
                                    // No results found
                                    console.log(results.error);
                                    cand_output_table = `
                                        <p>${results.error}</p>
                                    `;
                                    var div2 = document.createElement("div");
                                    div2.innerHTML = cand_output_table;
                                    div2.setAttributeNode(att);
                                    div3.appendChild(div2);
                                    document.getElementById("candidate-list").appendChild(div3);
                                }

                            })
                            .catch(e => {
                                console.log(e.message);
                                // confirm(e.message);
                                cand_output_table = `
                                        <p>${results.error}</p>
                                    `;

                                var div2 = document.createElement("div");
                                div2.innerHTML = cand_output_table;
                                div2.setAttributeNode(att);
                                div3.appendChild(div2);
                                document.getElementById("candidate-list").appendChild(div3);
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
            console.log(e.message);
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