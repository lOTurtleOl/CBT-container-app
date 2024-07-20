

class Topic {
    constructor(id, topicName) {
        this.id = id;
        this.topicName = topicName;
        this.subTopics = [];
    }

    static addSubTopic(name, comment) {
        const subTopicId = this.subTopics.length ?
            Math.max(...this.subTopics.map(sub => sub.id)) + 1 :
            1;
        this.subTopics.push(new SubTopic(subTopicId, name, comment));
    }
}

class SubTopic {
    constructor(id, name, comment) {
        this.id = id;
        this.name = name;
        this.comment = comment;
    }
}

class TopicService {
    static url = 'https://6697cb7502f3150fb66f086d.mockapi.io/cbt_container_API/topicData';

    static getAllTopics() {
        return $.get(this.url);
    }

    static getTopic(id) {
        return $.get(this.url + `/${id}`);
    }

    static createTopic(topic) {
        return $.post(this.url, topic);
    }
    static updateTopic(topic) {
        return $.ajax({
            url: this.url + `/${topic.id}`,
            dataType: "json",
            data: JSON.stringify(topic),
            contentType: "application/json",
            type: 'PUT'
        })
    }
    
    static deleteTopic(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}

class DOMManager {
    static topics;

    static getAllTopics() {
        TopicService.getAllTopics().then(topics => this.render(topics));
    }

    static createTopic(topicName) {
        TopicService.createTopic(new Topic(null, topicName))
        .then(() => {
            return TopicService.getAllTopics();
        })
        .then((topics) => this.render(topics));
    }

    static deleteTopic(id) {
        TopicService.deleteTopic(id)
        .then(() => {
            return TopicService.getAllTopics();
        })
        .then((topics) => this.render(topics));
    }

    static addSubTopic(id) {
        for (let topic of this.topics) {
            if (topic.id == id) {
                let subTopicName = $(`#${topic.id}-subTopic-name`).val();
                let subTopicComment = $(`#${topic.id}-subTopic-comment`).val();
                Topic.addSubTopic(subTopicName, subTopicComment);
                TopicService.updateTopic(topic)
                .then(() => {
                    return TopicService.getAllTopics();
                })
                .then((topics) => this.render(topics));
            }
        }
    }

    static deleteSubTopic(topicId, subTopicId) {
        for (let topic of this.topics) {
            if (topic.id == topicId) {
                for (let subTopic of topic.subTopics) {
                    if (subTopic.id == subTopicId) {
                        topic.subTopics.splice(topic.subTopics.indexOf(subTopic), 1);
                        TopicService.updateTopic(topic)
                        .then(() => {
                            return TopicService.getAllTopics();
                        })
                        .then((topics) => this.render(topics));
                    }
                }
            }
        }
    }

    static render(topics) {
        this.topics = topics;
        $('#app').empty();
        for (let topic of topics) {
            $('#app').prepend(
                `<div id="${topic.id}" class="card">
                    <div class="card-header">
                        <h2>${topic.topicName}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTopic('${topic.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${topic.id}-subTopic-name" class="form-control" placeholder="Sub-Topic Name">
                                </div>
                                <div class="col-sm">
                                    <input type="text" id="${topic.id}-subTopic-comment" class="form-control" placeholder="Comment">
                                </div>
                            </div>
                            <button id="${topic.id}-new-SubTopic" onclick="DOMManager.addSubTopic('${topic.id}')" class="btn btn-primary form-control">Add</button>
                        </div>
                    </div>
                </div><br>`         
            );
            for (let subTopic of topic.subTopics) {
                $(`#${topic.id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${subTopic.name}"><strong>Name: </strong> ${subTopic.name}</span>
                    <span id="name-${subTopic.comment}"><strong>Comment: </strong> ${subTopic.comment}</span>
                    <button class="btn btn-danger" onclick="DOMManager.deleteSubTopic('${topic.id}', '${subTopic.id}')">Delete Sub topic</button>`
                )
            }
        }
    }
}

$(document).on("click", '#create-new-topic', () => {
    DOMManager.createTopic($('#new-topic-name').val());
    $('#new-topic-name').val('');
})

DOMManager.getAllTopics();




// //this function takes an topic topic and POSTs that into the API using ajax
// function createtopic(topic) {
//     console.log("createtopic topic:", topic); //logs the topic topic to be POSTED

//     return $.ajax({ //return the ajax request
//         url: URL, //pass the url of the food group to be created
//         data: JSON.stringify(topic), // pass the topic data to be created and turns it into JSON data
//         dataType: "json", // set the data type to be json
//         type: "POST", //set the type of request to be a POST request
//         contentType: "application/json", //set the content type to be json
//         crossDomain: true, //set the cross domain to be true
//     });
// }

// //this function GETs topic data from the API using jQuery
// function gettopicList() {
//     console.log("Should return an array of my topic data", URL) //logs the URL where data is READ
//     return $.get(URL); //get the list of Topics from the URL
// }

// function updatetopic(topicData) {
//     console.log("createtopic topic:", topicData);
//     let newtopicName = topicData.topicName;
//     console.log("updatetopic topic name:", newtopicName)
//     let newtopicId = parseInt(topicData.topicId);
//     console.log("updatetopic topic name ID:" newtopicId)
//     return $.ajax({
//         url:`${URL}/${newtopicId}`,
//         dataType: "json",
//         data: JSON.stringify({ topicName: newtopicName}),
//         contentType: "application/json",
//         crossDomain: true,
//         type: "PUT",
//     })
// }

// function deleteFoodGroup(topicId) {
//     console.log("deleteTopic topic name ID:", parseInt(topicId.id));

//     return $.ajax({
//         url: `${URL}/${parseInt(topicId.id)}`,
//         type: "DELETE",
//     })
// }