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
function addContactToUI(name, email, contactUserID) {
    const contactsList = document.getElementById("contactsList");

    const btn = document.createElement("button");
    btn.classList.add("contact-btn");
    btn.textContent = name;

    btn.dataset.contactId = contactUserID;

    btn.addEventListener("click", () => {
        console.log("Selected contact ID:", contactUserID);
        popupLabel.textContent = name;

        // Set the selected contact
        selectedContactID = contactUserID;

        // Optionally enable the send button if it was disabled
        document.getElementById("sendBtn").disabled = false;

        // Clear or load previous messages if needed
        document.getElementById("chatBox").innerHTML = `<h2>Chat with ${name}</h2>`;
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
    if (!selectedContactID) {
        alert("Please select a contact first!");
        return;
    }

    const message = userInput.value.trim();
    if (!message) return;

    // Send the message to backend
    try {
        await axios.post(URLS.chats + "/create", {
            senderID: userId,
            receiverID: selectedContactID,
            text: message
        });

        // Optionally display the message immediately in the chat UI
        const chatBox = document.getElementById("chatBox");
        const div = document.createElement("div");
        div.classList.add("my-message");
        div.textContent = message;
        chatBox.appendChild(div);

        userInput.value = ""; // clear input
        chatBox.scrollTop = chatBox.scrollHeight;
    } catch (err) {
        console.error("Error sending message:", err);
    }
});
