loginBtn.addEventListener("click", async () => {
    const email = uname.value.trim();
    const password = psw.value;

    if (!email || !password) {
        alert("Enter both email and password");
        return;
    }
    console.log("hi");
    try {

        const response = await axios.post(URLS.login, { email, password }, {
            headers: { "Content-Type": "application/json" }
        });

        console.log(response);

        //add user id to the local storage
        const userId = response.data.data.id;
        localStorage.setItem('user-id',userId); 
        console.log("User id saved:", userId);
        console.log("check");
        //add the user's role to the local storage 
        console.log (response.data.data[0].role);
        const userRole = response.data.data[0].role;
        localStorage.setItem('userRole', userRole);
        console.log("User's role :", userRole);
        console.log("hi check");

        let isLogin = false;
        if (response.status === 200) 
            isLogin=true;

        localStorage.setItem('isLogin', isLogin); 
        if (userRole === "admin")
        {
            window.location.href = "/client/pages/admin.html";
        }
        else{
            window.location.href = "/client/index.html";
        }
        alert("Welcome you are logged in");
    } catch (error) {
        console.log(error);
        console.error("Login failed:", error);
    }
});

const logoutBtn = document.getElementById("logout");

