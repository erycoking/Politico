window.onload = load_parties();

function load_parties() {
    var url = "https://politico-api-version-2.herokuapp.com/api/v2/parties";
    var token = sessionStorage.token;

    fetch(url, {
            method: 'GET',
            mode: "cors",
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(parties => {
            document.getElementById("view_parties").innerHTML = '';
            if (parties.status == 200) {
                var output = '';
                data = parties.data;
                if (data.length > 0){
                    data.forEach(function (pty) {
                        var is_admin = sessionStorage.is_admin;
                        if (is_admin == 'true') {
                            output += `
                             <li>
                                <div class="party">
                                    <div class="icon">
                                        <!-- <img src="${pty.logo_url}" alt="jubilee_logo"> -->
                                        <img src="https://seeklogo.com/images/J/jubilee-party-kenya-logo-E83509A451-seeklogo.com.png" alt="jubilee_logo">
                                    </div>
                                    <div class="desc">
                                        <p><strong>Name :: <strong/> ${pty.name}</p>
                                        <p><strong>Address :: <strong/> ${pty.hq_address}</p> 
                                    </div>
                                    <div class="options">
                                        <a href="https://politico-api-version-2.herokuapp.com/api/v2/parties/${pty.id}" class="btn-edit">Edit</a>
                                        <a href="https://politico-api-version-2.herokuapp.com/api/v2/parties/${pty.id}" class="btn-delete">Delete</a> 
                                    </div>
                                </div>
                            </li>
                        `;
                        } else {
                            output += `
                             <li>
                                <div class="party">
                                    <div class="icon">
                                        <!-- <img src="${pty.logo_url}" alt="jubilee_logo"> -->
                                        <img src="https://seeklogo.com/images/J/jubilee-party-kenya-logo-E83509A451-seeklogo.com.png" alt="jubilee_logo">
                                    </div>
                                    <div class="desc">
                                        <p><strong>Name :: <strong/> ${pty.name}</p>
                                        <p><strong>Address :: <strong/> ${pty.hq_address}</p> 
                                    </div>
                                </div>
                            </li>
                        `;
                        }
                    });
                }else{
                    output = `<p>No Parties available<p>`;
                }
                document.getElementById("view_parties").innerHTML = output;

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

                var delete_msg = sessionStorage.delete_party_msg;
                if (delete_msg) {
                    confirm(delete_msg);
                    sessionStorage.removeItem("delete_party_msg");
                }

            }else{
                console.log(parties.error);
                confirm(parties.error);
            }

        })
        .catch(e => {
            console.log(e);
            confirm(e.message);
        });
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
                var party_data = result.data[0];
                var party = {
                    "id": party_data.id,
                    "name": party_data.name, 
                    "hq_address": party_data.hq_address, 
                    "logo_url": party_data.logo_url 
                };
                sessionStorage.retrieved_party = JSON.stringify(party);
                location.replace("edit_political_party.html");
            }
        })
        .catch(e => {
            console.log(e.message);
            confirm(e.message);
        });
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
                    sessionStorage.delete_party_msg = "Party Successfully deleted";
                    location.reload();
                }
            })
            .catch(e => {
                console.log(e.message);
                elert(e.message);
            });
    }

}