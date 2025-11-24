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
    markAllDelivered();
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
        addContactToUI(name, contactUserID);
        addContactPopup.classList.add("hidden");

    } catch (error) {
        console.log(error);
    }
}

function addContactToUI(name, contactUserID) {
    const contactsList = document.getElementById("contactsList");

    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.dataset.contactId = contactUserID;

    const text = document.createElement("span");
    text.textContent = name;
    text.style.marginRight = "8px";

    const badge = document.createElement("span");
    badge.classList.add("unread-badge");

    btn.appendChild(text);
    btn.appendChild(badge);

    btn.addEventListener("click", async () => {
        selectedContactID = contactUserID;
        popupLabel.textContent = name;
        badge.textContent = ""; 
        try {
            const response = await axios.post(URLS.conversations + "/create", {
                user1ID: userId,
                user2ID: contactUserID,
                subject: ""
            });

            currentConversationID = response.data.payload.conversationID;
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

        const contactsList = document.getElementById("contactsList");
        contactsList.innerHTML = "";

        if (!Array.isArray(contacts)) contacts = contacts ? [contacts] : [];

        contacts.forEach(contact => {
            addContactToUI(contact.contactName, contact.contactUserID);
        });
        await updateUnreadCounts();
    } catch (error) {
        console.log("Error loading contacts:", error);
    }
}


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

    } catch (error) {
        console.log(error);
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
    } catch (error) {
        console.log(error);
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

    } catch (error) {
        console.log(error);
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
    } catch (error) {
        console.log(error);
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
        console.log(error);
    }
}

async function updateUnreadCounts() {
    try {
        const response = await axios.get(`${URLS.messages}/receive?recipientID=${userId}`);
        let messages = response.data.payload;

        if (!Array.isArray(messages)) messages = messages ? [messages] : [];

        const buttons = document.querySelectorAll(".contact-btn");
        for (const btn of buttons) {
            const contactID = btn.dataset.contactId;
            const badge = btn.querySelector(".unread-badge");

            const unreadMessages = messages.filter(msg => msg.senderID == contactID && msg.status === "delivered");
            const unreadCount = unreadMessages.length;

            if (unreadCount > 0) {
                badge.style.display = "inline-block";
                if (unreadCount > 3) {
                    badge.textContent = "3+";
                } else {
                    badge.textContent = unreadCount;
                }
                if (unreadCount > 0) {
                    let contents = unreadMessages.map(msg => msg.content).join("\n");
                    try {
                        const summaryResponse = await axios.post(URLS.apis, { contents });
                        console.log("AI summary:", summaryResponse.data);
                        const reply = summaryResponse.data.reply;
                        console.log(reply);
                        alert(reply);
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else {
                badge.textContent = "";
                badge.style.display = "none";
            }
        }
    } catch (error) {
        console.log(error);
    }
}



