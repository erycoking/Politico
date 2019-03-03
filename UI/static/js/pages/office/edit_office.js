window.onload = load_office();

function load_office() {
    var office = JSON.parse(sessionStorage.retrieved_office);

    if (office) {

        var update_msg = sessionStorage.update_office_msg;
        if (update_msg) {
            confirm(update_msg);
            sessionStorage.removeItem("update_office_msg");
        }

        var office_name = document.forms.office.office_name;
        var office_type = document.forms.office.office_type;

        office_name.value = office.name;
        office_type.value = office.office_type;


    } else {
        confirm("Retrived office is null. Contact admin.");
        history.back();
    }
}

/**
 * patterns for validation
 */
const fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;

function editOffice() {
    var office_name = document.forms.office.office_name;
    var office_type = document.forms.office.office_type;

    if (!fullname_pattern.test(office_name.value)) {
        office_name.focus();
        alert("Invalid name.\nName should only contain alphabets and spaces if needed.\nName name should not be less than three characters.");
        return false;
    }

    if (office_type.selectedIndex < 1) {
        office_type.focus();
        alert("Office type is required");
        return false;
    }

    var office_data = {
        "type": office_type.value,
        "name": office_name.value
    };

    var office_id = JSON.parse(sessionStorage.retrieved_office);
    var url = "https://politico-api-version-2.herokuapp.com/api/v2/offices/" + office_id.id;
    var token = sessionStorage.token;

    fetch(url, {
            method: "PATCH",
            mode: "cors",
            body: JSON.stringify(office_data),
            headers: {
                'Content-type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
        .then(res => res.json())
        .then(result => {
            console.log(result.data);
            if (result.status == 200) {
                var updated_office = result.data[0];
                var office_data_2 = {
                    "id": updated_office.id,
                    "name": updated_office.name,
                    "type": updated_office.type
                };
                sessionStorage.retrieved_office = JSON.stringify(office_data_2);
                sessionStorage.update_office_msg = "office Successfully updated";
                console.log(updated_office);
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

var back = document.getElementById("btn-view-offices");
back.addEventListener('click', goBack, true);

function goBack(e) {
    location.replace("admin_view_offices.html");
}