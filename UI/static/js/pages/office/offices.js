/**
 * patterns for validation
 */
const fullname_pattern = /^[a-zA-Z]{2,25}( [a-zA-Z]{2,25})*$/;


/**
 * office registration
 */

function registerOffice(){
    var office_name = document.forms.office.office_name;
    var office_type = document.forms.office.office_type;

    if (!fullname_pattern.test(office_name.value)){
        office_name.focus();
        alert("Invalid name.\nName should only contain alphabets and spaces if needed.\nName name should not be less than three characters.");
        return false;
    }

    if (office_type.selectedIndex < 1){
        office_type.focus();
        alert("Office type is required");
        return false;
    }

    var office_data = {
        "type": office_type.value, 
	    "name": office_name.value
    };

    console.log(office_data);

    var url = "https://politico-api-version-2.herokuapp.com/api/v2/offices";
    var token = sessionStorage.token;

    fetch(url, {
        method: 'POST', 
        mode: "cors",
        body: JSON.stringify(office_data), 
        headers: {
            'Content-type': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    })
    .then(res => res.json())
    .then(office => {
        if (office.status == 201){
            confirm("office added with id: "+ office.data[0].id);
            history.back();
            return true;
        }else{
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