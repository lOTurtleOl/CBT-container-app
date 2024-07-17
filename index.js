const URL = "https://6697cb7502f3150fb66f086d.mockapi.io/cbt_container_API/:endpoint";

//this function takes an object object and POSTs that into the API using ajax
function createObject(object) {
    console.log("createObject object:", object); //logs the object object to be POSTED

    return $.ajax({ //return the ajax request
        url: URL, //pass the url of the food group to be created
        data: JSON.stringify(object), // pass the object data to be created and turns it into JSON data
        dataType: "json", // set the data type to be json
        type: "POST", //set the type of request to be a POST request
        contentType: "application/json", //set the content type to be json
        crossDomain: true, //set the cross domain to be true
    });
}

//this function GETs object data from the API using jQuery
function getObjectList() {
    console.log("Should return an array of my object data", URL) //logs the URL where data is READ
    return $.get(URL); //get the list of objects from the URL
}

function updateObject(objectData) {
    console.log("createObject object:", objectData);
    let newObjectName = objectData.objectName;
    console.log("updateObject object name:", newObjectName)
    let newObjectId = parseInt(objectData.objectId);
    console.log("updateObject object name ID:" newObjectId)
    return $.ajax({
        url:`${URL}/${newObjectId}`,
        dataType: "json",
        data: JSON.stringify({ objectName: newObjectName}),
        contentType: "application/json",
        crossDomain: true,
        type: "PUT",
    })
}

function deleteFoodGroup(objectId) {
    console.log("deleteObject object name ID:", parseInt(objectId.id));

    return $.ajax({
        url: `${URL}/${parseInt(objectId.id)}`,
        type: "DELETE",
    })
}