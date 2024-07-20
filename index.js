
// topic class with basic constructor
class Topic {
    constructor(id, topicName) {
        this.id = id;
        this.topicName = topicName;
        this.subTopics = [];
    }

    // method to grab id for new subtopic. use tertiary operator and grab max id, return new id
    addSubTopic() {
        const subTopicId = this.subTopics.length ?
            Math.max(...this.subTopics.map(sub => sub.id)) + 1 :
            1;
        return subTopicId;
    }
    
}

// subtopic class
class SubTopic {
    constructor(id, name, comment) {
        this.id = id;
        this.name = name;
        this.comment = comment;
    }
}

// class for working with topic data
class TopicService {
    static url = 'https://6697cb7502f3150fb66f086d.mockapi.io/cbt_container_API/topicData'; // mock API

    // get request for topics
    static getAllTopics() {
        return $.get(this.url);
    }

    // get request for specific topic
    static getTopic(id) {
        return $.get(this.url + `/${id}`);
    }

    // create new topic and post
    static createTopic(topic) {
        return $.post(this.url, topic);
    }

    // update topic method
    static updateTopic(topic) {
        return $.ajax({
            url: this.url + `/${topic.id}`,
            dataType: "json",
            data: JSON.stringify(topic),
            contentType: "application/json",
            type: 'PUT'
        })
    }
    
    // delete topic method
    static deleteTopic(id) {
        return $.ajax({
            url: this.url + `/${id}`,
            type: 'DELETE'
        })
    }
}

// class for affecting the DOM
class DOMManager {
    static topics;

    // call getAllTopics and then render
    static getAllTopics() {
        TopicService.getAllTopics().then(topics => this.render(topics));
    }

    // call create topic and then render
    static createTopic(topicName) {
        TopicService.createTopic(new Topic(null, topicName))
        .then(() => {
            return TopicService.getAllTopics();
        })
        .then((topics) => this.render(topics));
    }

    // call delete topic, pass id to delete, render page
    static deleteTopic(id) {
        TopicService.deleteTopic(id)
        .then(() => {
            return TopicService.getAllTopics();
        })
        .then((topics) => this.render(topics));
    }

    // static method, pass id, find subId, push new subTopic using user input for parameters to subTopics array
    static addSubTopic(id) {
        for (let topic of this.topics) {
            if (topic.id == id) {
                let findSubId = this.addSubTopic();
                topic.subTopics.push(new SubTopic($(findSubId), $(`#${topic.id}-subTopic-name`).val(), $(`#${topic.id}-subTopic-comment`).val()));
                TopicService.updateTopic(topic)
                .then(() => {
                    return TopicService.getAllTopics();
                })
                .then((topics) => this.render(topics));
            }
        }
    }

    // delete subTopic. check ids, splice index of id, render
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

    // render method, take topics argument
    static render(topics) {
        this.topics = topics;
        $('#app').empty(); // pull app id from document and empty
        for (let topic of topics) {
            $('#app').prepend( // prepend to app id a card with the topic name as header, delete button, inputs and add subTopic button
                `<div id="${topic.id}" class="card">
                    <div class="card-header">
                        <h2>${topic.topicName}</h2>
                        <button class="btn btn-danger" onclick="DOMManager.deleteTopic('${topic.id}')">Delete</button>
                    </div>
                    <div class="card-body">
                        <div class="card">
                            <div class="row">
                                <div class="col-sm">
                                    <input type="text" id="${topic.id}-subTopic-name" class="form-control mb-3" placeholder="Sub-Topic Name">
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
            // for each subTopic in array, find the card body and append a grid of subTopic information with delete button
            for (let subTopic of topic.subTopics) {
                $(`#${topic.id}`).find('.card-body').append(
                    `<p class="mt-4 row">
                    <span class="col-4" id="name-${subTopic.id}"><strong>Name: </strong> ${subTopic.name}</span>
                    <span class="col-4" id="comment-${subTopic.id}"><strong>Comment: </strong> ${subTopic.comment}</span>
                    <button class="col-4 btn btn-danger" onclick="DOMManager.deleteSubTopic('${topic.id}', '${subTopic.id}')">Delete Sub topic</button>`
                )
            }
        }
    }
}

// on click, create new topic id with new topic name using the value entered, then reset value to empty string
$(document).on("click", '#create-new-topic', () => {
    DOMManager.createTopic($('#new-topic-name').val());
    $('#new-topic-name').val('');
})

// call initial render
DOMManager.getAllTopics();

