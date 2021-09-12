var urlBase = 'http://contacttracing-4331.com';
var extension = 'php';

var userID = 0;
var firstName = "";
var lastName = "";
var accessIdForEdit = "";
var accessIdForDeletion = "";

function doLogin() {

    userID = 0;
    firstName = "";
    lastName = "";

    // Grab the data we need from the HTML fields
    let login = document.getElementById("loginName").value;
    let password = document.getElementById("loginPW").value;

    document.getElementById("login").innerHTML = "";


    var jsonPayload = JSON.stringify({login: login, password: password});
    var url = urlBase + '/LAMPAPI/Login.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var jsonObject = JSON.parse(xhr.responseText);

                userID = jsonObject.id;
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                if (userID < 1) {
                    document.getElementById("login").innerHTML = "User/Password combination incorrect";
                    return;
                }


                saveCookie();

                window.location.href = "frontPage.html";

            }
        }
    xhr.send(jsonPayload);
        }
    catch(err)
    {
        document.getElementById("login").innerHTML = err.message;
    }

    document.getElementById('userName').innerHTML = "Welcome, " + firstName + " " + lastName + "!";
}

// will add new user to the database and sign them into their new account (so that they don't login after signing up)
function doRegister()
{
    userID = 0;
    firstName = "";
    lastName = "";

    firstName = document.getElementById("registerFName").value;
    lastName = document.getElementById("registerLName").value;

    let login = document.getElementById("registerUser").value;
    let password = document.getElementById("registerPW").value;
    let confirmPassword = document.getElementById("registerConfirmPW").value;

    document.getElementById("registration").innerHTML = "";

    //checks that login/password is valid and that passwords match
    if (login === null || login === "" || password === "" || password === null )
    {
        document.getElementById("registration").innerHTML = "Invalid Username or Password";
        return;
    }
    if (password !== confirmPassword)
    {
        document.getElementById("registration").innerHTML = "Passwords do not match";
        return;
    }

    var jsonPayload = JSON.stringify({firstName: firstName,
        lastName: lastName, login: login, password: password });
    var url = urlBase + '/LAMPAPI/register.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {


                var jsonObject = JSON.parse(xhr.responseText);

                userID = jsonObject.id;
                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                if (userID < 1) {
                    document.getElementById("registration").innerHTML = "Registration failed";
                    return;
                }

                saveCookie();

                window.location.href = "frontPage.html";
            }
        }
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("registration").innerHTML = err.message;
    }

    document.getElementById('userName').innerHTML = "Welcome, " + firstName + " " + lastName + "!";
}


function saveCookie()
{
    var minutes = 20;
    var date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userID + ";expires" + date.toGMTString();
}

function readCookie()
{
    userID = -1;
    var data = document.cookie;
    var splits = data.split(",");
    for(var i = 0; i < splits.length; i++)
    {
        var thisOne = splits[i].trim();
        var tokens = thisOne.split("=");
        if( tokens[0] === "firstName" )
        {
            firstName = tokens[1];
        }
        else if( tokens[0] === "lastName" )
        {
            lastName = tokens[1];
        }
        else if( tokens[0] === "userID" )
        {
            userID = parseInt( tokens[1].trim() );
        }
    }

    if( userID < 0 )
    {
        window.location.href = "frontPage.html";
    }
    else
    {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName ;
    }
}

function doLogout()
{
    userID = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "frontPage.html";
}

function displayChange(show, hide)
{
    document.getElementById(show).style.display="block";
    document.getElementById(hide).style.display="none";
}

//next two functions are called from afterLogin.html. They serve to clear and prepare for input
function callAdd()
{
    displayChange('cancelAddContactButton', 'logoutButton');
    displayChange('addContactsButton', 'goToAddContactsButton');
    displayChange('addContactsDiv','searchContactsDiv');

    document.getElementById('userName').innerHTML = "Add contact's info";

    // clears all input
    document.getElementById("newContactFName").value = "";
    document.getElementById("newContactLName").value = "";
    document.getElementById("newContactEmail").value = "";
    document.getElementById("newContactPhone").value = "";

}

function callSearch()
{
    displayChange('logoutButton', 'cancelAddContactButton');
    displayChange('goToAddContactsButton','addContactsButton');
    displayChange('goToAddContactsButton', 'confirmEditButton');
    displayChange('searchContactsDiv', 'addContactsDiv');

    accessIdForEdit = "";

}

function addContacts()
{
    // Grab values from HTML
    var addedFName = document.getElementById("newContactFName").value;
    var addedLName = document.getElementById("newContactLName").value;
    var addedEmail = document.getElementById("newContactEmail").value;
    var addedPhone = document.getElementById("newContactPhone").value;

    document.getElementById("added").innerHTML = "";

    var jsonPayload = JSON.stringify({firstName: addedFName,
        lastName: addedLName, email: addedEmail, phone: addedPhone, userID: userID });

    var url = urlBase + '/LAMPAPI/add.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {


                document.getElementById("userName").innerHTML = "Contact has been added";
                callSearch();
            }
        }
    xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userName").innerHTML = err.message;
    }
    // call search so that it refreshes after adding.
    doSearch();
}

function doSearch()
{
    var lookUp = document.getElementById("searchText").value;

    document.getElementById("ContactsSearchResult").innerHTML = "";
    var clearList = document.getElementById("ContactsList");

    // Clear list
    while (clearList.hasChildNodes())
        clearList.removeChild(clearList.lastChild);


    var jsonPayload = JSON.stringify({search:lookUp, userID:userID});
    var url = urlBase + '/LAMPAPI/search.' + extension;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {

                var jsonObject = JSON.parse(xhr.responseText);

                // go through all current contacts
                for (var i = 0; i < jsonObject.results.length; i++) {

                    const contactId = jsonObject.results[i].ID;
                    const firstName = jsonObject.results[i].firstName;
                    const lastName = jsonObject.results[i].lastName;
                    const email = jsonObject.results[i].email;
                    const phone = jsonObject.results[i].phone;

                    // create content category of buttonElement type for future use
                    const buttonElement = document.createElement("button");
                    buttonElement.innerHTML = firstName + " " + lastName;
                    buttonElement.id = contactId + ":searchable";
                    buttonElement.className = "searchable";

                    //create two new content categories and establish parenthood
                    const divElement = document.createElement("divElement");
                    const numAndEmail = document.createElement("numAndEmail");
                    divElement.id = "" + contactId;
                    numAndEmail.innerHTML = "Phone: " + phone + " Email: " + email;
                    divElement.appendChild(numAndEmail);
                    divElement.className = "info";


                    // create edit and delete buttons
                    const editButton = document.createElement("button");
                    editButton.type = "button";
                    editButton.className = "gotoEditButton";
                    editButton.addEventListener("click", function(){
                        displayChange('cancelAddContactButton', 'logoutButton');
                        displayChange('confirmEditButton', 'goToAddContactsButton');
                        displayChange('addContactsDiv', 'searchContactsDiv');
                        document.getElementById('userName').innerHTML = "Edit your contact's information:";

                        var accessParentForEdit = this.parentNode;
                        accessIdForEdit = accessParentForEdit.id;

                        // search by id and send new user input for edit to server.
                        var jsonPayloadForEdit = JSON.stringify({ID: accessIdForEdit});
                        var urlForEdit = urlBase + '/LAMPAPI/search.' + extension;

                        var xhrForEdit = new XMLHttpRequest();
                        xhrForEdit.open("POST", urlForEdit, false);
                        xhrForEdit.setRequestHeader("Content-type", "application/json; charset=UTF-8");

                        try {

                            xhrForEdit.onreadystatechange = function() {
                                if (this.readyState === 4 && this.status === 200) {
                                    var jsonObject = JSON.parse(xhr.responseText);

                                    // contact vars
                                    var firstName = jsonObject.results[0].firstName;
                                    var lastName = jsonObject.results[0].lastName;
                                    var email = jsonObject.results[0].email;
                                    var phone = jsonObject.results[0].phone;


                                    // assign vars to newContacts to be stored
                                    document.getElementById("newContactFName").value = firstName;
                                    document.getElementById("newContactLName").value = lastName;
                                    document.getElementById("newContactEmail").value = email;
                                    document.getElementById("newContactEmail").value = phone;
                                }
                            }
                            xhr.send(jsonPayloadForEdit);
                        }

                        catch(err)
                        {
                            document.getElementById("userName").innerHTML = err.message;
                        }
                    });
                    editButton.innerHTML = "Edit";


                    const deleteButton = document.createElement("button");
                    deleteButton.type = "button";
                    deleteButton.className = "gotoDeleteButton";
                    deleteButton.addEventListener("click", function(){
                        var accessParentToDelete = this.parentNode;
                        accessIdForDeletion = accessParentToDelete.id;
                        const popup = document.getElementById("finalizeDelete");
                        popup.style.display = "block";
                    });
                    deleteButton.innerHTML = "Delete";

                    // add buttonElement options just created to search
                    divElement.appendChild(editButton);
                    divElement.appendChild(deleteButton);

                    //add the button with name and info back to id
                    document.getElementById("ContactsList").appendChild(buttonElement);
                    document.getElementById("ContactsList").appendChild(divElement);

                    let accessButtons = this.classList;

                    //sets height so that it isn't greater than it should be
                    buttonElement.addEventListener("click", function () {
                        accessButtons.toggle("active");
                        const content = this.nextElementSibling;
                        if (content.style.maxHeight) {
                            content.style.maxHeight = null;
                        } else {
                            content.style.maxHeight = content.scrollHeight + "%";
                        }
                    });
                }

                document.getElementById("userName").innerHTML = "Contact found";
            }
        }
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userName").innerHTML = err.message;
    }
}

// another function called from html that finalizes changes
function doEdit()
{
    // finalizes changes
    var newContactsFirstName = document.getElementById("newContactFName").value;
    var newContactsLastName = document.getElementById("newContactLName").value;
    var newContactsEmail = document.getElementById("newContactEmail").value;
    var newContactsPhone = document.getElementById("newContactPhone").value;


    document.getElementById("added").innerHTML = "";

    var jsonPayload = JSON.stringify({firstName: newContactsFirstName, lastName: newContactsLastName,
        email: newContactsEmail, phone: newContactsPhone, ID: accessIdForEdit});
    var url = urlBase + '/LAMPAPI/update.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userName").innerHTML = err.message;
    }

    // call search so list refreshes
    doSearch();

    // go back to search contacts
    callSearch();

    document.getElementById("userName").innerHTML = "Contact has been updated";
}

// called by HTML and commits deletion
function doDelete()
{
    var jsonPayload = JSON.stringify({ID:accessIdForDeletion});
    var url = urlBase + '/LAMPAPI/delete.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, false);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("userName").innerHTML = err.message;
    }

    // close popup
    var popup = document.getElementById("finalizeDelete");
    popup.style.display = "none";

    accessIdForDeletion = "";

    // call search so that list refreshes
    doSearch();

    document.getElementById("userName").innerHTML = "Contact has been deleted";
}
