window.onload = load_offices();

function load_offices() {
    var url = "https://politico-api-version-2.herokuapp.com/api/v2/offices";
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
        .then(offices => {
            document.getElementById("view_offices").innerHTML = '';
            if (offices.status == 200) {
                var output = '';
                data = offices.data;
                if (data.length > 0){
                    data.forEach(function (office) {
                        var is_admin = sessionStorage.is_admin;
                        if (is_admin == 'true') {
                            output += `
                            <tr>
                                <td>${office.name}</td>
                                <td>${office.type}</td>
                                <td class="link">
                                    <a href="https://politico-api-version-2.herokuapp.com/api/v2/offices/${office.id}" class="btn-edit">Edit</a>  
                                    <a href="https://politico-api-version-2.herokuapp.com/api/v2/offices/${office.id}" class="btn-delete">Delete</a>
                                </td>
                            </tr>
                        `;
                        } else {
                            output += `
                            <tr>
                                <td>${office.name}</td>
                                <td>${office.type}</td>
                            </tr>
                        `;
                        }
                    });
                }else{
                    output = `<p>No offices available<p>`;
                }
                document.getElementById("view_offices").innerHTML = output;

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

                var delete_msg = sessionStorage.delete_office_msg;
                if (delete_msg) {
                    confirm(delete_msg);
                    sessionStorage.removeItem("delete_office_msg");
                }

            }else{
                console.log(offices.error);
                confirm(offices.error);
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
                var office_data = result.data[0];
                var office = {
                    "id": office_data.id,
                    "name": office_data.name,
                    "type": office_data.type,
                };
                sessionStorage.retrieved_office = JSON.stringify(office);
                location.replace("edit_political_office.html");
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
                    sessionStorage.delete_office_msg = "Offices Successfully deleted";
                    location.reload();
                }
            })
            .catch(e => {
                console.log(e.message);
                elert(e.message);
            });
    }

}