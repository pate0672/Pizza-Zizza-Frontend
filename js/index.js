var app = {
    STORAGE_KEY : 'pizza-shop-auth-token',
    BASE_URL : 'http://gond0017.edumedia.ca',
    UserData : "",
    init: function () {
        console.log("ready to go...");
        document.addEventListener('DOMContentLoaded', app.pageReady);
    },
    pageReady: function(ev){
        let bodyPage =  document.querySelector('body')
        
        let token = localStorage.getItem(app.STORAGE_KEY)

        if(bodyPage.id == "pizzaListBody"){
            app.getLogedInUser(ev)
            if(localStorage.getItem(app.STORAGE_KEY) == null){
                window.location.href = "index.html"
                return false
            }
            app.GetPizzaList(ev)
            app.clearStorage(ev)
        }

        if(bodyPage.id == "forgotPassBody"){
            console.log("forgot pass page")
            
            let curUser = JSON.parse(localStorage.getItem(app.UserData))
            console.log(curUser.firstName);

            document.getElementById("fNameFPass").innerHTML = "<p>" + curUser.firstName + "</p>"
            document.getElementById("lNameFPass").innerHTML = "<p>" + curUser.lastName + "</p>"

            document.getElementById('checkBox').addEventListener("click",app.showPassword)
            document.getElementById('resetPasswordBtn').addEventListener("click",(ev)=>{
                ev.preventDefault();
                let pas = document.getElementById("myInput").value
                app.validatePass(ev,curUser.email,pas)
            })


            app.clearStorage(ev)
        }

        if(bodyPage.id == "logInpage"){
            document.getElementById("LogInBtn").addEventListener("click",app.doLoginMethod);
        }
        

    },
    validatePass : function(ev,email,passs){
        var password1= document.getElementById("myInput").value;
        
        var password2= document.getElementById("MYInput").value;
        if (password1 != password2) {

            alert("Passwords do not match.");
            
            return false;
        }
        app.userResetPassword(ev,email,passs)
        return true;
    },
    showPassword : function(ev){
        var showPass = document.getElementById("myInput");
               
        if (showPass.type === "password") {
            showPass.type = "text";
        } else {
            showPass.type = "password";
        }

        var showRepPass = document.getElementById("MYInput");

        if (showRepPass.type === "password") {
            showRepPass.type = "text";
        } else {
            showRepPass.type = "password";
        }
    },
    clearStorage : function(ev){
        document.getElementById('logoutBtn').addEventListener("click",app.logOutUser)
    },
    logOutUser : function(ev){
        if(localStorage.getItem(app.STORAGE_KEY) != null){
            localStorage.removeItem(app.STORAGE_KEY)
            window.location.href = "index.html"
        }
    },
    GetPizzaList : function(ev){
        ev.preventDefault()
        // Define the resource end-point for the request
        const url = `${app.BASE_URL}/api/Pizzas`
        // Retrieve the token from localStorage
        const authToken = localStorage.getItem(app.STORAGE_KEY)

        // Create a Headers object with the 'Content-Type' set to JSON
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')
        
        // Set the 'Authorization' header if we have a token
        if (authToken) {
            headers.append('Authorization', 'Bearer ' + authToken)
        }

        // Create the Request Object
        const request = new Request(url, {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        })

        // Send the fetch request
        fetch(request)
        .then(response => response.json())
        .then(result => {
        // Check for validation errors
        if (result.errors) {
                const error = result.errors[0]
                const message = `${error.code} ${error.status}:
                ${error.detail}`
                throw new Error(message)
            }

            let tbody = document.querySelector(".pizzaTable tbody")
            //console.log(tbody)
            tbody.innerHTML = "";
            let i = 1;
            result.data.forEach(item => {

                let tr = document.createElement("tr")

                console.log(item)

                let idTd = document.createElement('td')
                idTd.innerHTML = i;

                let nametd = document.createElement("td")
                nametd.innerHTML = item.name

                let priceTd = document.createElement("td")
                priceTd.innerHTML = "$ "+ (item.price/100)

                let sizeTd = document.createElement("td")
                sizeTd.innerHTML = item.size

                let glutenTd = document.createElement('td')
                glutenTd.innerHTML = item.isGlutenFree

                let imgUrlTd = document.createElement('td')
                // let img = document.createElement('img')
                // img.src = item.imageUrl
                imgUrlTd.innerHTML = item.imageUrl

                let actionTd = document.createElement('td')
                let editIbtn = document.createElement('i')
                editIbtn.setAttribute("class","fas fa-edit")
                editIbtn.setAttribute("data-id",item._id)
                editIbtn.addEventListener("click",app.getEditPizzaPage)

                let dltIbtn = document.createElement('i')
                dltIbtn.setAttribute("class","fas fa-trash")
                dltIbtn.setAttribute("data-id",item._id)
                dltIbtn.addEventListener("click",app.deletePizza)

                actionTd.append(editIbtn)
                actionTd.append(dltIbtn)

                tr.append(idTd)
                tr.append(nametd)
                tr.append(priceTd)
                tr.append(sizeTd)
                tr.append(glutenTd)
                tr.append(imgUrlTd)
                tr.append(actionTd)

                tbody.append(tr)

                i++
            })

            // // All is good, display results
            // const html = `<pre><code>${JSON.stringify(result.data, null, 2)}</code></pre>`
            // //document.getElementById('output').innerHTML = html
            // console.log(html);
            // //return JSON.stringify(result.data, null, 2)
        })
        .catch(error => {
            //document.getElementById('output').textContent = error.message
            console.error(error.message)
        })
    },
    getEditPizzaPage : function(ev){
        let c = ev.currentTarget
        let pId = c.getAttribute('data-id')
        
        ev.preventDefault()
    },
    deletePizza : function(ev){
        let c = ev.currentTarget
        let pId = c.getAttribute('data-id')
        
        ev.preventDefault()
        // Define the resource end-point for the request
        const url = `${app.BASE_URL}/api/Pizzas/`+pId

        console.log(url)
        // Retrieve the token from localStorage
        const authToken = localStorage.getItem(app.STORAGE_KEY)

        // Create a Headers object with the 'Content-Type' set to JSON
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')
        
        // Set the 'Authorization' header if we have a token
        if (authToken) {
            headers.append('Authorization', 'Bearer ' + authToken)
        }

        // Create the Request Object
        const request = new Request(url, {
            headers: headers,
            method: 'DELETE',
            mode: 'cors'
        })

        // Send the fetch request
        fetch(request)
        .then(response => response.json())
        .then(result => {
        // Check for validation errors
        if (result.errors) {
                const error = result.errors[0]
                const message = `${error.code} ${error.status}:
                ${error.detail}`
                throw new Error(message)
            }
            app.GetPizzaList(ev)

        })
        .catch(error => {
            //document.getElementById('output').textContent = error.message
            console.error(error.message)
        })
    },
    doLoginMethod : function(ev){
        ev.preventDefault()
        // Collect form input values
        // we are just going to fake that part
        const USERNAME = document.getElementById("userEmail").value;
        const PASSWORD = document.getElementById("userPass").value;

        // Prepare the JSON payload for the body of the request
        const jsonData = JSON.stringify({
            email: USERNAME,
            password: PASSWORD
        })

        if(USERNAME == "" || PASSWORD == ""){
            let d = document.createElement("div");
            d.setAttribute("class","alert alert-danger");
            d.textContent = "Please enter email and password "
            
            setTimeout(function(){ 
                document.querySelector(".card").prepend(d);
            }, 600);

            return false
        }

        // Create a Headers object with the 'Content-Type' set to JSON
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')

        // Create the Request Object
        const request = new Request(`${app.BASE_URL}/auth/tokens`, {
            headers: headers,
            method: 'POST',
            mode: 'cors',
            body: jsonData
        })

        // Send the login request
        fetch(request)
        .then(response => response.json())
        .then(result => {
            if (result.errors) {
                const error = result.errors[0]
                console.log({error})
                throw new Error(error.detail)
            }
            const authToken = result.data.token
            console.log({authToken})
            // Save the token to localStorage
            localStorage.setItem(app.STORAGE_KEY, authToken)
            //document.getElementById('output').textContent =
            //'Successfully authenticated. Token received'
            console.log("saved in session storage!!");
            app.getLogedInUser(ev)

            window.location.href = "pizzas.html"
        })
        .catch(error => {
            //document.getElementById('output').textContent = error.message
            console.log(error.message)
        })
    },
    getLogedInUser : function(ev){
        ev.preventDefault()
        // Define the resource end-point for the request
        const url = `${app.BASE_URL}/auth/users/me`

        // Retrieve the token from localStorage
        const authToken = localStorage.getItem(app.STORAGE_KEY)

        // Create a Headers object with the 'Content-Type' set to JSON
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')
        
        // Set the 'Authorization' header if we have a token
        if (authToken) {
            headers.append('Authorization', 'Bearer ' + authToken)
        }

        // Create the Request Object
        const request = new Request(url, {
            headers: headers,
            method: 'GET',
            mode: 'cors'
        })

        // Send the fetch request
        fetch(request)
        .then(response => response.json())
        .then(result => {
        // Check for validation errors
        if (result.errors) {
                const error = result.errors[0]
                const message = `${error.code} ${error.status}:
                ${error.detail}`
                throw new Error(message)
            }

            // All is good, display results
            //const html = `<pre><code>${JSON.stringify(result.data, null, 2)}</code></pre>`
            localStorage.setItem(app.UserData,JSON.stringify(result.data))

            //document.getElementById('output').innerHTML = html
            //console.log(html);
            //return JSON.stringify(result.data, null, 2)
        })
        .catch(error => {
            //document.getElementById('output').textContent = error.message
            console.error(error.message)
        })
    },
    userResetPassword: function(ev,email,pass){

        const USERNAME = email
        const PASSWORD = pass

        // Prepare the JSON payload for the body of the request
        const jsonData = JSON.stringify({
            email: USERNAME,
            password: PASSWORD
        })

        // Create a Headers object with the 'Content-Type' set to JSON
        const headers = new Headers()
        headers.append('Content-Type', 'application/json;charset=UTF-8')

        const authToken = localStorage.getItem(app.STORAGE_KEY)
        
        // Set the 'Authorization' header if we have a token
        if (authToken) {
            headers.append('Authorization', 'Bearer ' + authToken)
        }

        // Create the Request Object
        const request = new Request(`${app.BASE_URL}/auth/users/me`, {
            headers: headers,
            method: 'PATCH',
            mode: 'cors',
            body: jsonData
        })

        // Send the login request
        fetch(request)
        .then(response => response.json())
        .then(result => {
            if (result.errors) {
                const error = result.errors[0]
                console.log({error})
                throw new Error(error.detail)
            }
            // const authToken = result.data.token
            // console.log({authToken})
            // // Save the token to localStorage
            // localStorage.setItem(app.STORAGE_KEY, authToken)
            console.log(result.data)
            localStorage.setItem(app.UserData,result.data)

            app.getLogedInUser(ev)
        })
        .catch(error => {
            //document.getElementById('output').textContent = error.message
            console.log(error.message)
        })
    }
};

app.init();