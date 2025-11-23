const addContact = document.getElementById("addContact");
const addContactPopup = document.getElementById("addContactPopup");
const saveContact = document.getElementById("saveContact");
const closePopup = document.getElementById("closePopup");
const popup = document.getElementById("contactPopup");
const popupLabel = document.getElementById("popupLabel");
const deletePopup = document.getElementById("deletePopup");
const saveNewContact = document.getElementById("saveNewContact");
const closeNewPopup = document.getElementById("closeNewPopup");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");

let selectedContactID = null;
let currentConversationID = null;

console.log("Initialized with userId:", userId);

addContact.addEventListener("click", () => {
    addContactPopup.classList.remove("hidden");
    contactName.value = "";
    contactEmail.value = "";
});

closeNewPopup.addEventListener("click", () => {
    addContactPopup.classList.add("hidden");
});

saveNewContact.addEventListener("click", () => { addNewContact() });

document.addEventListener("DOMContentLoaded", () => {
    initializeChat();
});

async function addNewContact() {
    try {
        console.log("Adding new contact with userId:", userId);

        if (!contactName.value || !contactEmail.value) {
            alert("All fields must be filled");
            return;
        }

        const name = contactName.value;
        const email = contactEmail.value;
        
        console.log("Searching for user with email:", email);
        const url = URLS.users + "/email";
        const contactResponse = await axios.get(`${url}?email=${email}`);
        
        if (!contactResponse.data.payload || contactResponse.data.payload.length === 0) {
            alert("User with this email not found");
            return;
        }

        const contactUserID = contactResponse.data.payload[0].userID;
        console.log("Found contact user ID:", contactUserID);

        const response = await axios.post(URLS.contacts + "/create", {
            userID: userId,
            contactUserID: contactUserID,
            contactName: name,
            contactEmail: email
        });
        
        console.log("Contact created:", response);
        addContactToUI(name, email, contactUserID);
        addContactPopup.classList.add("hidden");

    } catch (error) {
        console.error("Error adding contact:", error);
        alert("Error adding contact: " + (error.response?.data?.message || error.message));
    }
}

function addContactToUI(name, email, contactUserID) {
    const contactsList = document.getElementById("contactsList");

    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.textContent = name;
    btn.dataset.contactId = contactUserID;

    btn.addEventListener("click", async () => {
        console.log("Selected contact ID:", contactUserID);
        localStorage.setItem('contactUserID', contactUserID);
        popupLabel.textContent = name;
        selectedContactID = contactUserID;

        try {
            const response = await axios.post(URLS.conversations + "/create", {
                user1ID: userId,
                user2ID: contactUserID,
                subject: ""
            });
            
            console.log("Conversation response:", response);
            document.getElementById("sendBtn").disabled = false;

            await getConversation(contactUserID);

        } catch (err) {
            console.error("Error creating conversation:", err);
        }
    });

    contactsList.appendChild(btn);
}

async function loadContacts() {
    try {
        const response = await axios.get(`${URLS.contacts}?userID=${userId}`);
        let contacts = response.data.payload;

        console.log("Loaded contacts:", contacts);

        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = "";

        if (!Array.isArray(contacts)) {
            contacts = contacts ? [contacts] : [];
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
    if (!selectedContactID) {
        alert("Select a contact!");
        return;
    }

    const message = userInput.value.trim();
    if (!message) return;

    try {
        const response = await axios.post(URLS.messages + "/create", {
            senderID: userId,
            recipientID: selectedContactID,
            conversationID: currentConversationID,
            content: message
        });
        
        console.log("Message sent:", response);

        const chatBox = document.getElementById("chatBox");

        const div = document.createElement("div");
        div.classList.add("my-message");

        const text = document.createElement("span");
        text.textContent = message;

        const img = document.createElement("img");
        img.src = "/client/images/check.png";  
        img.classList.add("sent-icon");

        div.appendChild(text);
        div.appendChild(img);

        chatBox.appendChild(div);

        userInput.value = "";
        chatBox.scrollTop = chatBox.scrollHeight;

    } catch (err) {
        console.error("Error sending message:", err);
    }
});


userInput.addEventListener("keypress", (e) => {
    if (e.key === 'Enter') {
        sendBtn.click();
    }
});

async function getConversation(contactID) {
    try {
        const response = await axios.post(URLS.conversations + "/chat", {
            user1ID: userId,
            user2ID: contactID,
        });

        currentConversationID = response.data.payload.conversationID;
        console.log("Current Conversation ID:", currentConversationID);

        await markAllDelivered();
        await markConversationRead(currentConversationID);
        await loadMessages(currentConversationID); 
    } catch (err) {
        console.error("Error getting conversation:", err);
    }
}

async function loadMessages(conversationID) {
    if (!conversationID) {
        console.log("No conversation ID provided");
        return;
    }

    try {
        const response = await axios.get(`${URLS.messages}?conversationID=${conversationID}`);
        let messages = response.data.payload;

        console.log("Raw messages response:", messages);

        if (!Array.isArray(messages)) {
            messages = messages ? [messages] : [];
        }

        const chatBox = document.getElementById("chatBox");
        
        const messageElements = chatBox.querySelectorAll('.my-message, .other-message');
        messageElements.forEach(el => el.remove());
        
        let header = chatBox.querySelector('h2');
        if (!header) {
            header = document.createElement('h2');
            chatBox.prepend(header);
        }
        header.textContent = `Chat with ${popupLabel.textContent}`;

        console.log(`Loading ${messages.length} messages for user:`, userId);

        messages.sort((a, b) => new Date(a.timestamp || a.createdAt) - new Date(b.timestamp || b.createdAt));
        console.log(messages);
        messages.forEach(msg => {
            const div = document.createElement("div");
            div.classList.add(msg.senderID == userId ? "my-message" : "other-message");

            const text = document.createElement("span");
            text.textContent = msg.content;
            div.appendChild(text);
            if (msg.senderID == userId) {
                const img = document.createElement("img");
                img.classList.add("sent-icon");

                if (msg.status =="read") {
                    img.src = "/client/images/read.png";  
                } else if (msg.status =="delivered") {
                    img.src = "/client/images/two-ticks.png";
                } else {
                    img.src = "/client/images/check.png";
                }

                div.appendChild(img);
            }

            chatBox.appendChild(div);
        });


        chatBox.scrollTop = chatBox.scrollHeight;
        await markConversationRead(conversationID);

    } catch (err) {
        console.error("Error loading messages:", err);
    }
}


async function initializeChat() {
    if (!userId) {
        userId = localStorage.getItem('userId');
        if (!userId) {
            console.error("User ID not found in localStorage");
            return;
        }
    }
    
    console.log("Initializing chat with userId:", userId);
    await loadContacts();
    
    const savedContactID = localStorage.getItem('contactUserID');
    if (savedContactID) {
        console.log("Found saved contact ID:", savedContactID);
    }
    
    document.getElementById("sendBtn").disabled = true;
}

async function markAllDelivered() {
    try {
        await axios.post(URLS.messages + "/markedD");
        console.log("All messages marked delivered");
    } catch (err) {
        console.error("Error marking delivered:", err);
    }
}

async function markConversationRead(conversationID) {
    if (!conversationID) return;

    try {
        await axios.post(URLS.messages + "/markedR", {
            conversationID,
            recipientID: userId
        });
        console.log("Messages marked as read");
    } catch (error) {
        console.error("Error marking messages as read:", error);
    }
}


document.addEventListener("DOMContentLoaded", () => {
    initializeChat();
    markAllDelivered();
});
