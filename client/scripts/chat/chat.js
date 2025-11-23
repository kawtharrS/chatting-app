const addContact = document.getElementById("addContact");
const addContactPopup = document.getElementById("addContactPopup");
const saveContact = document.getElementById("saveContact");
const closePopup = document.getElementById("closePopup");
const popup = document.getElementById("contactPopup");
const popupLabel = document.getElementById("popupLabel");
const deletePopup = document.getElementById("deletePopup");
const saveNewContact  = document.getElementById("saveNewContact");
const closeNewPopup = document.getElementById("closeNewPopup");
const contactName = document.getElementById("contactName");
const contactEmail= document.getElementById("contactEmail");

console.log("hi");
let selectedContactID = null;
addContact.addEventListener("click", () =>
    addContactPopup.classList.remove("hidden")
);
closeNewPopup.addEventListener("click", ()=>{
    addContactPopup.classList.add("hidden");

});

document.addEventListener("DOMContentLoaded", () => {
    loadContacts();
});

saveNewContact.addEventListener("click", ()=>{addNewContact()});
console.log(userId);
async function addNewContact(){
    try{
        console.log(userId);

        if(!contactName.value || !contactEmail.value)
        {
            alert("All fieds must be filled");
            return;
        }
        const name = contactName.value;
        const email = contactEmail.value;
        console.log(email);
        console.log("add new contact function")
        const url = URLS.users +"/email";
        const contactResponse = await axios.get(`${url}?email=${email}`);
        console.log(contactResponse.data.payload[0].userID);
        const contactUserID = contactResponse.data.payload[0].userID;
        console.log(contactUserID);

        const response = await axios.post(URLS.contacts+"/create", {
            userID: userId,
            contactUserID: contactUserID, 
            contactName:name, 
            contactEmail: email
        });
        console.log(response);
        addContactToUI(name, email, contactUserID);

    }
    catch(error){
        console.log(error);
    }
}
function addContactToUI(name,email, contactUserID) {
    const contactsList = document.getElementById("contactsList");

    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.textContent = name;

    btn.dataset.contactId = contactUserID;

    btn.addEventListener("click", async () => {
        console.log("Selected contact ID:", contactUserID);
        localStorage.setItem('contactUserID',contactUserID); 
        popupLabel.textContent = name;
        const response = await axios.post(URLS.conversations +"/create", {user1ID: userId, user2ID: contactUserID, subject: ""});
        console.log(response);
        selectedContactID = contactUserID;
        document.getElementById("sendBtn").disabled = false;

        document.getElementById("chatBox").innerHTML = `<h2>Chat with ${name}</h2>`;

        await getConversation(contactUserID);
    });


    contactsList.appendChild(btn);
}


async function loadContacts() {
    try {
        const response = await axios.get(`${URLS.contacts}?userID=${userId}`);
        let contacts = response.data.payload;

        console.log("contacts", contacts);

        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = ""; 

        if (!Array.isArray(contacts)) {
            contacts = [contacts];
        }

        contacts.forEach(contact => {
            addContactToUI(contact.contactName, contact.contactEmail, contact.contactUserID);
        });

    } catch (error) {
        console.log("Error loading contacts:", error);
    }
}

const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");

sendBtn.addEventListener("click", async () => {
    if (!selectedContactID) { alert("Select a contact!"); return; }

    const message = userInput.value.trim();
    if (!message) return;

    try {
        const response = await axios.post(URLS.messages + "/create", {
            senderID: userId,
            recipientID: selectedContactID,
            conversationID: currentConversationID,
            content: message
        });
        console.log(response);

        const chatBox = document.getElementById("chatBox");
        const div = document.createElement("div");
        div.classList.add("my-message");
        div.textContent = message;
        chatBox.appendChild(div);

        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error(err);
    }
});

let currentConversationID = null;

async function getConversation(contactID) {
    try {
        const response = await axios.post(URLS.conversations + "/chat", {
            user1ID: userId,
            user2ID: contactID,
        });

        currentConversationID = response.data.payload.conversationID;
        console.log("Current Conversation ID:", currentConversationID);

        loadMessages(currentConversationID);

    } catch (err) {
        console.error("Error getting conversation:", err);
    }
}

async function loadMessages(conversationID) {
    if (!conversationID) return;

    try {
        const response = await axios.get(`${URLS.messages}?conversationID=${conversationID}`);
        let messages = response.data.payload;

        if (!Array.isArray(messages)) {
            messages = messages ? [messages] : [];
        }

        const chatBox = document.getElementById("chatBox");
        chatBox.innerHTML = `<h2>Chat with ${popupLabel.textContent}</h2>`;

        messages.forEach(msg => {
            const div = document.createElement("div");
            div.textContent = msg.content;
            div.classList.add(msg.senderID === userId ? "my-message" : "other-message");
            chatBox.appendChild(div);
        });

        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error("Error loading messages:", err);
    }
}


