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

    //    All functions before this point WORKING.  Past this point the may needs some fixing.

// performs a search from all contacts in database and assigns them to a table with style.display = "none"
// main objective is to build a table to work from in filterSearch() function.
function doSearch()
{
    readCookie();
    accessIdForEdit = "";
    var lookUp = document.getElementById("searchText").value;
    var searchList = document.getElementById("searchList").innerHTML;

    searchList = "";
    var contactSearchDiv = document.getElementById('contactSearchDiv');

    var jsonPayload = JSON.stringify({search:lookUp, userId:userId});
    var url = urlBase + '/LAMPAPI/search.' + extension;
    var xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try {
        xhr.onreadystatechange = function () {

            if (this.readyState === 4 && this.status === 200) {

                var jsonObject = JSON.parse(xhr.responseText);

                var table= document.createElement('table'),
                    thead = document.createElement('thead'),
                    tbody = document.createElement('tbody'),
                    th,
                    tr,
                    td;
                th = document.createElement('th');
                    th.innerHTML="id";
                table.appendChild(th);
                th = document.createElement('th');
                table.id = "myTable"
                table.style.display = "none";
                th.innerHTML= "First Name";
                table.appendChild(th);
                th = document.createElement('th');
                th.innerHTML= "Last Name";
                table.appendChild(th);th = document.createElement('th');
                th.innerHTML= "Phone Number";
                table.appendChild(th);th = document.createElement('th');
                th.innerHTML= "Email";
                table.appendChild(th);
                table.appendChild(thead);
                table.appendChild(tbody);

                contactSearchDiv.appendChild(table);


                for (var i = 0; i <= jsonObject.results.length -1; i++) {
                    tr = document.createElement('tr'),

                    //for id
                    td= document.createElement('td');
                    searchList = jsonObject.results[i];
                    td.innerHTML=searchList.id;
                    tr.appendChild(td);

                    //for fName
                    td = document.createElement('td');
                    td.innerHTML=searchList.firstName;
                    tr.appendChild(td);

                    //for lName
                    td = document.createElement('td');
                    td.innerHTML=searchList.lastName;
                    tr.appendChild(td);

                    //for fName
                    td = document.createElement('td');
                    td.innerHTML=searchList.phone;
                    tr.appendChild(td);

                    //for fName
                    td = document.createElement('td');
                    td.innerHTML=searchList.email;
                    tr.appendChild(td);

                    var deleteButton = document.createElement("button");
                    deleteButton.type = "button";
                    deleteButton.id = searchList.id + " " + (i+1); // Embedding contact ID and row number info in button ID
                    deleteButton.className = "button";
                    deleteButton.addEventListener("onclick",  doDelete, false);
                    deleteButton.innerHTML = "Delete";
                    var editButton = document.createElement("button");
                    editButton.type = "button";
                    editButton.id = searchList.id + " " + (i+1); // Embedding contact ID and row number info in button ID
                    editButton.className = "button";
                    editButton.addEventListener("onclick", doEdit,false);
                    editButton.innerHTML = "Edit";

                    tr.appendChild(deleteButton);
                    tr.appendChild(editButton);
                    tbody.appendChild(tr);


                }
            }


        };
        xhr.send(jsonPayload);
    }
    catch(err)
    {
        document.getElementById("searchList").innerHTML = err.message;
    }

    // displayChange('contactSearchDiv', 'searchBox');
}

// an attempt to clear the table.  Is not currently working.
function clearTable(){
    var table = document.querySelector("#mySearchTable");

    while (table.firstChild){
        table.removeChild(table.firstChild);
    }
}

// clones (hidden table created in doSearch()) MyTable, attaches to "contactSearchDiv"
// and performs filter search on newly cloned table
function filterSearch() {
    var input, filter, table, div, tr, td, i;
    input = document.getElementById("searchText");
    filter = input.value.toUpperCase();
    table = document.getElementById("myTable");
    div = document.getElementById("contactSearchDiv");
    var cloneTable = table.cloneNode(true);
    div.appendChild(cloneTable);
    cloneTable.style.display = "";
    cloneTable.id = "mySearchTable";
    tr = cloneTable.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td") ;
        for(j=0 ; j<td.length ; j++)
        {
            let tdata = td[j] ;
            if (tdata) {
                if (tdata.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break ;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
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

    var jsonPayload = JSON.stringify({FirstName: newContactsFirstName, LastName: newContactsLastName,
        EmailAddress: newContactsEmail, PhoneNumber: newContactsPhone, UserID: userId, ContactID: this.id});
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
function doDelete()
{
    var jsonPayload = JSON.stringify({ ContactID: this.id, UserID: userId});
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

    // call search so that list refreshes
    doSearch();

    document.getElementById("userName").innerHTML = "Contact has been deleted";
}