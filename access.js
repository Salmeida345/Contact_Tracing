// C:\Users\ronca\WebstormProjects\SmallProj\
// 161.35.48.46 for PuTTY use
var urlBase = 'http://contacttracing-4331.com';
var extension = 'php';

var userId = 0;
var firstName = "";
var lastName = "";
var accessIdForEdit = "";
var accessIdForDeletion = "";

function doLogin() {

    userId = 0;
    firstName = "";
    lastName = "";

    // Grab the data we need from the HTML fields
    var login = document.getElementById("loginName").value;
    var password = document.getElementById("loginPW").value;

    document.getElementById("login").innerHTML = "";


    var jsonPayload = JSON.stringify({login: login, password: password});
    var url = urlBase + '/LAMPAPI/login.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                var jsonObject = JSON.parse(xhr.responseText);

                userId = jsonObject.id;
                console.log(xhr.response);


                if (userId < 1) {
                    document.getElementById("login").innerHTML = "User/Password combination incorrect";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;


                saveCookie();

                window.location.href = "afterLogin.html";

            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("login").innerHTML = err.message;
    }

}

// will add new user to the database and sign them into their new account (so that they don't login after signing up)
function doRegister()
{
    userId = 0;
    firstName = "";
    lastName = "";

    firstName = document.getElementById("registerFName").value;
    lastName = document.getElementById("registerLName").value;

    var login = document.getElementById("registerUser").value;
    var email = document.getElementById("registerEmail").value;
    var password = document.getElementById("registerPW").value;
    var confirmPassword = document.getElementById("registerConfirmPW").value;

    document.getElementById("registration").innerHTML = "";

    if (password !== confirmPassword)
    {
        document.getElementById("registration").innerHTML = "Passwords do not match";
        return;
    }

    var jsonPayload = JSON.stringify({firstName: firstName,
        lastName: lastName,email: email, login: login, password: password });
    var url = urlBase + '/LAMPAPI/register.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {


                var jsonObject = JSON.parse(xhr.responseText);

                userId = jsonObject.id;


                if (userId < 1) {
                    document.getElementById("registration").innerHTML = "Registration failed";
                    return;
                }

                firstName = jsonObject.firstName;
                lastName = jsonObject.lastName;

                saveCookie();

                window.location.href = "afterLogin.html";
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("registration").innerHTML = err.message;
    }

}


function saveCookie()
{
    var minutes = 20;
    var date = new Date();
    date.setTime(date.getTime()+(minutes*60*1000));
    document.cookie = "firstName=" + firstName + ",lastName=" + lastName + ",userID=" + userId + ";expires" + date.toGMTString();
}

function readCookie()
{
    userId = -1;
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
            userId = parseInt( tokens[1].trim() );
        }
    }

    if( userId < 0 )
    {
        window.location.href = "index.html";
    }
    else
    {
        document.getElementById("userName").innerHTML = "Logged in as " + firstName + " " + lastName ;
    }
}

function doLogout()
{
    userId = 0;
    firstName = "";
    lastName = "";
    document.cookie = "firstName= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
    window.location.href = "index.html";
}

function displayChange(show, hide)
{
    document.getElementById(show).style.display="block";
    document.getElementById(hide).style.display="none";
}


function addContacts() {

    readCookie();
    // Grab values from HTML
    var addedFName = document.getElementById("newContactFName").value;
    var addedLName = document.getElementById("newContactLName").value;
    var addedEmail = document.getElementById("newContactEmail").value;
    var addedPhone = document.getElementById("newContactPhone").value;

    // checks that info is good
    if (addedFName === null || addedFName === "" || addedLName === "" || addedLName === null){
        document.getElementById("added").innerHTML = "Please type in your First and/or Last Name";
        return;
    }
    if (addedEmail === null || addedEmail === "" ||addedPhone === null || addedPhone === "")
    {
        document.getElementById("added").innerHTML = "Please enter a correct Email or Number";
        return;
    }

    var tag = document.createElement("p"); // <p></p>
    var text = document.createTextNode(addedFName + " " + addedLName + " " + addedEmail + " " + addedPhone);
    tag.appendChild(text); // <p>TEST TEXT</p>
    var element = document.getElementById("searchList");
    element.appendChild(tag);

    document.getElementById("added").innerHTML = "";

    var jsonPayload = JSON.stringify({firstName: addedFName,
        lastName: addedLName, emailAddress: addedEmail, phoneNumber: addedPhone, userId: userId });

    var url = urlBase + '/LAMPAPI/add.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");

    try
    {
        xhr.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {

                document.getElementById("added").innerHTML = "Contact has been added";

            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("added").innerHTML = err.message;
    }

}
// function callSearch()
// {
//     displayChange('goToAddContactsButton','addContactsButton');
//     displayChange('goToAddContactsButton', 'confirmEditButton');
//     displayChange('searchContactsDiv', 'addContactsDiv');
//
//     accessIdForEdit = "";
//
//     doSearch();
//
// }

function doSearch()
{
    readCookie();
    accessIdForEdit = "";
    var lookUp = document.getElementById("searchText").value;

    var searchList = "";


    var jsonPayload = JSON.stringify({search:lookUp, userId:userId});
    var url = urlBase + '/LAMPAPI/search.' + extension;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {

                document.getElementById("contactSearchResult").innerHTML = "Search has been retrieved";
                var jsonObject = JSON.parse(xhr.responseText);

                window.addEventListener("load", function(){
                    // (B) ATTACH KEY UP LISTENER TO SEARCH BOX
                    document.getElementById("contactSearchResult").addEventListener("keyup", function(){
                        // (C) GET THE SEARCH TERM
                        var search = this.value.toLowerCase();

                        // (D) GET ALL LIST ITEMS
                        var all = document.querySelectorAll("#searchList p");s

                        // (E) LOOP THROUGH LIST ITELS - ONLY SHOW ITEMS THAT MATCH SEARCH
                        for (let i of all) {
                            let item = i.innerHTML.toLowerCase();
                            if (item.indexOf(search) === -1) { i.classList.add("hide"); }
                            else { i.classList.remove("hide"); }
                        }
                    });

                document.getElementsByTagName("p")[0].innerHTML = searchList;
                });
            }
        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("contactSearchResult").innerHTML = err.message;
    }
}


// another function called from html that finalizes changes
function doEdit(contactId)
{

    // finalizes changes
    var newContactsFirstName = document.getElementById("newContactFName").value;
    var newContactsLastName = document.getElementById("newContactLName").value;
    var newContactsEmail = document.getElementById("newContactEmail").value;
    var newContactsPhone = document.getElementById("newContactPhone").value;


    document.getElementById("added").innerHTML = "";

    var jsonPayload = JSON.stringify({FirstName: newContactsFirstName, LastName: newContactsLastName,
        EmailAddress: newContactsEmail, PhoneNumber: newContactsPhone, UserID: userId, ContactID: contactId});
    var url = urlBase + '/LAMPAPI/update.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
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

    document.getElementById("userName").innerHTML = "Contact has been updated";
}


// called by HTML and commits deletion
function doDelete(contactId)
{
    var jsonPayload = JSON.stringify({ ContactID: contactId, UserID: userId});
    var url = urlBase + '/LAMPAPI/delete.' + extension;

    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
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