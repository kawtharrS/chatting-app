const cmn ="http://localhost/chat/server"
URLS={
    login: cmn + "/services/loginService.php",
    users : cmn + "/users",
    contacts: cmn + "/contacts", 
<<<<<<< HEAD
    messages: cmn + "/messages",
    conversations: cmn + "/conversations"
=======
    conversations:cmn + "/conversations",
    messages : cmn +"/messages"
>>>>>>> 9ada0b5
}
const userId = localStorage.getItem("user-id");
const contactUserID= localStorage.getItem("contactUserID");
function validateName (name)
{
    const namePattern  = /^[a-zA-Z\s-]+$/; 

    if(name === null || name.trim() === ""){
        return "Name can not be empty!"
    }

    if(!namePattern.test(name))
    {
        return "Name can only contain letters, spaces & hyphens";
    }

    return true;
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}
