registerBtn.addEventListener("click", register);

async function register()
{
    const username= name.value.trim();
    const useremail = email.value.trim()
    const userpsw = psw.value;
    if(!username || !useremail ||!psw)
    {
        alert("all fields should be added");
        return;
    }
    try{
        if(validateName(username) && validateEmail(useremail))
        {
            const response = await axios.post(URLS.users+"/create", {
                userName:username, 
                email:useremail, 
                password:userpsw, 
            });

            console.log(response);
            alert("You registered, You can login now!")
        }
        else{
            alert("Enter valid Fields");
        }
    }
    catch(error)
    {
        console.log(error)
    }   
}