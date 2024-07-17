

class MyObject {
    constructor(id, objectName, dateCreated, description) {
        this.objectName = objectName;
        this.id = id;
        this.dateCreated = dateCreated;
        this.description = description;
        this.subObjects = [];
    }

    addSubObject(name, comment) {
        this.subObjects.push(new SubObject(name, comment));
    }
}

class SubObject {
    constructor(name, comment) {
        this.name = name;
        this.comment = comment;
    }
}

class ObjectService {
    static url = 'https://6697cb7502f3150fb66f086d.mockapi.io/cbt_container_API/objectData';

    static getAllObjects() {
        return $.get(this.url);
    }

    static getObject(id) {
        return $.get(this.url + `/${id}`);
    }

    static createObject(object) {
        return $.post(this.url, object);
    }
    static updateObject(object) {
        return $.ajax({
            url: this.url + `/${object._id}`,
            dataType: "json",
            data: JSON.stringify(object),
            contentType: "application/json",
            type: 'PUT'
        })
    }
    
    static deleteObject(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}

class DOMManager {
    static objects;

    static getAllObjects() {
        ObjectService.getAllObjects().then(objects => this.render(objects));
    }

    static render(objects) {
        this.objects = objects;
        $('#app').empty();
        for (let object of objects) {
            $('#app').prepend(
                `<div id="${object._id}" class="card">
                    <div class="card-header">
                        <h2>${object.name}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteObject('${object._id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${object._id}-subObject-name" class="form-control" placeholder="Sub Object Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${object._id}-subObject-comment" class="form-control" placeholder="Comment">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `
            )
        }
    }
}

DOMManager.getAllObjects();




// //this function takes an object object and POSTs that into the API using ajax
// function createObject(object) {
//     console.log("createObject object:", object); //logs the object object to be POSTED

//     return $.ajax({ //return the ajax request
//         url: URL, //pass the url of the food group to be created
//         data: JSON.stringify(object), // pass the object data to be created and turns it into JSON data
//         dataType: "json", // set the data type to be json
//         type: "POST", //set the type of request to be a POST request
//         contentType: "application/json", //set the content type to be json
//         crossDomain: true, //set the cross domain to be true
//     });
// }

// //this function GETs object data from the API using jQuery
// function getObjectList() {
//     console.log("Should return an array of my object data", URL) //logs the URL where data is READ
//     return $.get(URL); //get the list of objects from the URL
// }

// function updateObject(objectData) {
//     console.log("createObject object:", objectData);
//     let newObjectName = objectData.objectName;
//     console.log("updateObject object name:", newObjectName)
//     let newObjectId = parseInt(objectData.objectId);
//     console.log("updateObject object name ID:" newObjectId)
//     return $.ajax({
//         url:`${URL}/${newObjectId}`,
//         dataType: "json",
//         data: JSON.stringify({ objectName: newObjectName}),
//         contentType: "application/json",
//         crossDomain: true,
//         type: "PUT",
//     })
// }

// function deleteFoodGroup(objectId) {
//     console.log("deleteObject object name ID:", parseInt(objectId.id));

//     return $.ajax({
//         url: `${URL}/${parseInt(objectId.id)}`,
//         type: "DELETE",
//     })
// }