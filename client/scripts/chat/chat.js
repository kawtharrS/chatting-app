// DOM elements
const addContact = document.getElementById("addContact");
const addContactPopup = document.getElementById("addContactPopup");
<<<<<<< HEAD
=======
const saveContact = document.getElementById("saveContact");
const closePopup = document.getElementById("closePopup");
const popup = document.getElementById("contactPopup");
const popupLabel = document.getElementById("popupLabel");
const deletePopup = document.getElementById("deletePopup");
>>>>>>> 9ada0b5
const saveNewContact = document.getElementById("saveNewContact");
const closeNewPopup = document.getElementById("closeNewPopup");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
<<<<<<< HEAD
const contactsList = document.getElementById("contactsList");
const popupLabel = document.getElementById("popupLabel");
const sendBtn = document.getElementById("sendBtn");
const userInput = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

let selectedConversationID = null;
let selectedContactID = null;
let selectedContactName = null;

addContact.addEventListener("click", () => addContactPopup.classList.remove("hidden"));
closeNewPopup.addEventListener("click", () => {
    addContactPopup.classList.add("hidden");
=======

let selectedContactID = null;
let currentConversationID = null;

console.log("Initialized with userId:", userId);

addContact.addEventListener("click", () => {
    addContactPopup.classList.remove("hidden");
>>>>>>> 9ada0b5
    contactName.value = "";
    contactEmail.value = "";
});

<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", () => loadContacts());

saveNewContact.addEventListener("click", addNewContact);

async function addNewContact() {
    try {
=======
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

>>>>>>> 9ada0b5
        if (!contactName.value || !contactEmail.value) {
            alert("All fields must be filled");
            return;
        }

<<<<<<< HEAD
        const name = contactName.value.trim();
        const email = contactEmail.value.trim();

        // Fetch the user by email
        const contactResponse = await axios.get(`${URLS.users}/email?email=${email}`);
        
        if (!contactResponse.data.payload || contactResponse.data.payload.length === 0) {
            alert("User not found with this email");
=======
        const name = contactName.value;
        const email = contactEmail.value;
        
        console.log("Searching for user with email:", email);
        const url = URLS.users + "/email";
        const contactResponse = await axios.get(`${url}?email=${email}`);
        
        if (!contactResponse.data.payload || contactResponse.data.payload.length === 0) {
            alert("User with this email not found");
>>>>>>> 9ada0b5
            return;
        }

        const contactUserID = contactResponse.data.payload[0].userID;
        console.log("Found contact user ID:", contactUserID);

<<<<<<< HEAD
        // Check if contact already exists
        const existingContacts = await axios.get(`${URLS.contacts}?userID=${userId}`);
        const contacts = Array.isArray(existingContacts.data.payload) 
            ? existingContacts.data.payload 
            : [existingContacts.data.payload];
        
        const alreadyExists = contacts.some(c => c.contactUserID === contactUserID);
        if (alreadyExists) {
            alert("This contact already exists!");
            return;
        }

        // Create the contact
        await axios.post(`${URLS.contacts}/create`, {
=======
        const response = await axios.post(URLS.contacts + "/create", {
>>>>>>> 9ada0b5
            userID: userId,
            contactUserID: contactUserID,
            contactName: name,
            contactEmail: email
        });
<<<<<<< HEAD

        addContactToUI(name, email, contactUserID);
        addContactPopup.classList.add("hidden");
        contactName.value = "";
        contactEmail.value = "";
        
        alert("Contact added successfully!");
    } catch (error) {
        console.error("Error adding contact:", error);
        alert("Error adding contact. Please try again.");
    }
}
=======
        
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
>>>>>>> 9ada0b5

function addContactToUI(name, email, contactUserID) {
    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.textContent = name;
    btn.dataset.contactId = contactUserID;
    btn.dataset.contactName = name;

<<<<<<< HEAD
    btn.addEventListener("click", () => {
        // Remove active class from all contacts
        document.querySelectorAll('.contact-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        selectedContactID = contactUserID;
        selectedContactName = name;
        selectContact(contactUserID, name);
=======
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
>>>>>>> 9ada0b5
    });

    contactsList.appendChild(btn);
}

<<<<<<< HEAD
async function selectContact(contactUserID, name) {
    try {
        // Create or get existing conversation
        console.log("Creating/getting conversation between:", userId, "and", contactUserID);
        const res = await axios.post(`${URLS.conversations}/create`, {
            user1ID: userId,
            user2ID: contactUserID
        });
        
        console.log("Conversation response:", res.data);
        
        if (!res.data.payload) {
            throw new Error("No payload in conversation response");
        }
        
        // Handle both array and object responses
        const conversationData = Array.isArray(res.data.payload) 
            ? res.data.payload[0] 
            : res.data.payload;
            
        if (!conversationData || !conversationData.conversationID) {
            console.error("Invalid conversation data:", conversationData);
            throw new Error("No conversationID in response");
        }
        
        selectedConversationID = conversationData.conversationID;
        console.log("Selected conversation ID:", selectedConversationID);
        console.log("Type:", typeof selectedConversationID);

        popupLabel.textContent = name;
        sendBtn.disabled = false;
        userInput.disabled = false;

        // Clear and set up chat box
        chatBox.innerHTML = `<div class="chat-header"><h2>Chat with ${name}</h2></div><div id="messagesContainer"></div>`;
        
        // Load existing messages
        await loadMessages(selectedConversationID);
    } catch (err) {
        console.error("Error selecting contact:", err);
        alert("Error loading conversation. Please try again.");
    }
}

async function loadMessages(conversationID) {
    try {
        console.log("Loading messages for conversation:", conversationID);
        // Include both conversationID and recipientID (the current user)
        const res = await axios.get(`${URLS.messages}?conversationID=${conversationID}&recipientID=${userId}`);
        console.log("Messages response:", res.data);
        
        const messages = res.data.payload;
        const messagesContainer = document.getElementById("messagesContainer") || chatBox;
        
        // Clear existing messages
        messagesContainer.innerHTML = "";

        if (!messages || (Array.isArray(messages) && messages.length === 0)) {
            const emptyDiv = document.createElement("div");
            emptyDiv.classList.add("empty-chat");
            emptyDiv.style.textAlign = "center";
            emptyDiv.style.padding = "2rem";
            emptyDiv.style.color = "#999";
            emptyDiv.textContent = "No messages yet. Start the conversation!";
            messagesContainer.appendChild(emptyDiv);
            return;
        }

        // Ensure messages is an array
        const messageArray = Array.isArray(messages) ? messages : [messages];
        console.log("Processing messages:", messageArray);

        // Sort messages by messageID or timestamp
        messageArray.sort((a, b) => {
            if (a.messageID && b.messageID) {
                return a.messageID - b.messageID;
            }
            if (a.timestamp && b.timestamp) {
                return new Date(a.timestamp) - new Date(b.timestamp);
            }
            return 0;
        });

        // Display each message
        messageArray.forEach(msg => {
            console.log("Displaying message:", msg);
            const div = document.createElement("div");
            div.classList.add("message");
            
            // Compare as numbers to be safe
            const isMine = Number(msg.senderID) === Number(userId);
            div.classList.add(isMine ? "my-message" : "their-message");
            
            const content = document.createElement("span");
            content.textContent = msg.content;
            div.appendChild(content);
            
            messagesContainer.appendChild(div);
        });

        // Scroll to bottom
        setTimeout(() => {
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 100);
        
    } catch (err) {
        console.error("Error loading messages:", err);
        const messagesContainer = document.getElementById("messagesContainer") || chatBox;
        messagesContainer.innerHTML = "<p class='error-message' style='color: red; padding: 1rem;'>Error loading messages.</p>";
    }
}

sendBtn.addEventListener("click", sendMessage);

// Allow Enter key to send message
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

async function sendMessage() {
    if (!selectedConversationID) {
        alert("Please select a contact first!");
        return;
    }

    const message = userInput.value.trim();
    if (!message) {
        return;
    }

    try {
        console.log("Sending message with conversationID:", selectedConversationID);
        console.log("Type of conversationID:", typeof selectedConversationID);
        console.log("Sending message:", {
            conversationID: Number(selectedConversationID),
            senderID: Number(userId),
            recipientID: Number(selectedContactID),
            content: message
        });

        // Disable button to prevent double-sending
        sendBtn.disabled = true;

        const response = await axios.post(`${URLS.messages}/create`, {
            conversationID: Number(selectedConversationID),
            senderID: Number(userId),
            recipientID: Number(selectedContactID),
            content: message
        });

        console.log("Message sent successfully:", response.data);

        // Clear input
        userInput.value = "";

        // Reload all messages from database to ensure consistency
        await loadMessages(selectedConversationID);

        // Re-enable button and focus input
        sendBtn.disabled = false;
        userInput.focus();

    } catch (err) {
        console.error("Error sending message:", err);
        alert("Failed to send message. Please try again.");
        sendBtn.disabled = false;
    }
}

=======
>>>>>>> 9ada0b5
async function loadContacts() {
    try {
        console.log("Loading contacts for user:", userId);
        const response = await axios.get(`${URLS.contacts}?userID=${userId}`);
        let contacts = response.data.payload;

<<<<<<< HEAD
        console.log("Contacts loaded:", contacts);

=======
        console.log("Loaded contacts:", contacts);

        const contactsList = document.getElementById("contactsList");
>>>>>>> 9ada0b5
        contactsList.innerHTML = "";

        if (!contacts) {
            console.log("No contacts found");
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No contacts yet. Add one to start chatting!";
            emptyMsg.style.padding = "1rem";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#666";
            contactsList.appendChild(emptyMsg);
            return;
        }

        // Ensure contacts is an array
        if (!Array.isArray(contacts)) {
            contacts = contacts ? [contacts] : [];
        }

        if (contacts.length === 0) {
            const emptyMsg = document.createElement("p");
            emptyMsg.textContent = "No contacts yet. Add one to start chatting!";
            emptyMsg.style.padding = "1rem";
            emptyMsg.style.textAlign = "center";
            emptyMsg.style.color = "#666";
            contactsList.appendChild(emptyMsg);
            return;
        }

        contacts.forEach(contact => {
            addContactToUI(contact.contactName, contact.contactEmail, contact.contactUserID);
        });

    } catch (error) {
        console.error("Error loading contacts:", error);
        contactsList.innerHTML = "<p style='padding: 1rem; color: red;'>Error loading contacts</p>";
    }
<<<<<<< HEAD
}
=======
}
async function markConversationDelivered(conversationID) {
    if (!conversationID) return;

    try {
        const response = await axios.post(URLS.messages + "/markedD", {
            conversationID: conversationID,
            recipientID: userId 
        });

        console.log("Messages marked as delivered:", response.data);
    } catch (error) {
        console.error("Error marking messages as delivered:", error);
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
        div.textContent = message;
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

        await loadMessages(currentConversationID);
        await markAllDelivered();
        await markConversationRead(currentConversationID);

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

        messages.forEach(msg => {
            const div = document.createElement("div");
            div.textContent = msg.content;
            
            console.log("Message debug:", {
                content: msg.content,
                senderID: msg.senderID,
                userId: userId,
                isMyMessage: msg.senderID.toString() === userId.toString()
            });

            if (msg.senderID.toString() === userId.toString()) {
                div.classList.add("my-message");
            } else {
                div.classList.add("other-message");
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
        const response = await axios.post(URLS.messages + "/markedD");
        console.log("All messages marked delivered:", response.data);
    } catch (err) {
        console.error("Error marking all delivered:", err.response?.data || err.message);
    }
}

async function markConversationRead(conversationID) {
    if (!conversationID) return;

    try {
        const response = await axios.post(URLS.messages + "/markedR", {
            conversationID: conversationID,
            recipientID: userId 
        });

        console.log("Messages marked as read:", response.data);
    } catch (error) {
        console.error("Error marking messages as read:", error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    initializeChat();
    markAllDelivered();
});

>>>>>>> 9ada0b5
