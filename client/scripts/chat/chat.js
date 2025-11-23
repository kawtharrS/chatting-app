// DOM elements
const addContact = document.getElementById("addContact");
const addContactPopup = document.getElementById("addContactPopup");
const saveNewContact = document.getElementById("saveNewContact");
const closeNewPopup = document.getElementById("closeNewPopup");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
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
    contactName.value = "";
    contactEmail.value = "";
});

document.addEventListener("DOMContentLoaded", () => loadContacts());

saveNewContact.addEventListener("click", addNewContact);

async function addNewContact() {
    try {
        if (!contactName.value || !contactEmail.value) {
            alert("All fields must be filled");
            return;
        }

        const name = contactName.value.trim();
        const email = contactEmail.value.trim();

        // Fetch the user by email
        const contactResponse = await axios.get(`${URLS.users}/email?email=${email}`);
        
        if (!contactResponse.data.payload || contactResponse.data.payload.length === 0) {
            alert("User not found with this email");
            return;
        }

        const contactUserID = contactResponse.data.payload[0].userID;

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
            userID: userId,
            contactUserID: contactUserID,
            contactName: name,
            contactEmail: email
        });

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

function addContactToUI(name, email, contactUserID) {
    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.textContent = name;
    btn.dataset.contactId = contactUserID;
    btn.dataset.contactName = name;

    btn.addEventListener("click", () => {
        // Remove active class from all contacts
        document.querySelectorAll('.contact-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        selectedContactID = contactUserID;
        selectedContactName = name;
        selectContact(contactUserID, name);
    });

    contactsList.appendChild(btn);
}

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

async function loadContacts() {
    try {
        console.log("Loading contacts for user:", userId);
        const response = await axios.get(`${URLS.contacts}?userID=${userId}`);
        let contacts = response.data.payload;

        console.log("Contacts loaded:", contacts);

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
            contacts = [contacts];
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
}