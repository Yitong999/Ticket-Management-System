
var Service = {
    origin: window.location.origin,
    getTicketById: function(id){
        var xhrRequest = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            url = this.origin + '/form/retrieve/id/' + id

            xhrRequest.open('GET', url)
            xhrRequest.onload = function(){
                if (xhrRequest.status == 200){
                    resolve(JSON.parse(xhrRequest.response))
                }else{
                    reject((new Error(xhrRequest.status)))
                }
            }
            xhrRequest.ontimeout = function() {
                reject((new Error(xhrRequest.status)))
            }
            xhrRequest.onerror = function() {
                reject((new Error(xhrRequest.status)))
            };  
            
            xhrRequest.timeout = 500
            xhrRequest.send()
        })
    },

    getTicketByName: function(name){
        var xhrRequest = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            url = this.origin + '/form/retrieve/name/' + name

            xhrRequest.open('GET', url)
            xhrRequest.onload = function(){
                if (xhrRequest.status == 200){
                    resolve(JSON.parse(xhrRequest.response))
                }else{
                    reject((new Error(xhrRequest.status)))
                }
            }
            xhrRequest.ontimeout = function() {
                reject((new Error(xhrRequest.status)))
            }
            xhrRequest.onerror = function() {
                reject((new Error(xhrRequest.status)))
            };  
            
            xhrRequest.timeout = 500
            xhrRequest.send()
        })
    },

    createForm: function(form){
        var xhrRequest = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            url = this.origin + '/form/submit'

            xhrRequest.open('POST', url);
            xhrRequest.setRequestHeader('Content-Type', 'application/json')
            xhrRequest.onload = function(){
                if (xhrRequest.status == 200){
                    resolve(xhrRequest.response)
                }else{
                    reject(new Error(xhrRequest.responseText))
                }
            }
            xhrRequest.ontimeout = function() {
                reject((new Error(xhrRequest.status)))
            }
            xhrRequest.onerror = function() {
                reject((new Error(xhrRequest.status)))
            };
            xhrRequest.send(JSON.stringify(form))
            xhrRequest.timeout = 500;
                
        })
    },

    updateForm: function(id, form){
        var xhrRequest = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            url = this.origin + '/form/change/' + id

            console.log('url: ', url)

            xhrRequest.open('PUT', url);
            xhrRequest.setRequestHeader('Content-Type', 'application/json')
            xhrRequest.onload = function(){
                if (xhrRequest.status == 200){
                    resolve(xhrRequest.response)
                }else{
                    reject(new Error(xhrRequest.responseText))
                }
            }
            xhrRequest.ontimeout = function() {
                reject((new Error(xhrRequest.status)))
            }
            xhrRequest.onerror = function() {
                reject((new Error(xhrRequest.status)))
            };
            console.log('form: ', form)
            xhrRequest.send(JSON.stringify(form))
            xhrRequest.timeout = 500;
                
        })
    }


}

const ticketHTML = `
<div id="login-container">
        <h1>Track tickets</h1>
        
            <!-- Track by ID -->
        <div class="form-row">
            <label for="track_id">Track by ID:</label>
            <input type="text" id="track_id" name="track_id" required>
            <input type="submit" name="track-by-id-button" value="track">
        </div>

        <!-- Track by Name -->
        <div class="form-row">
            <label for="track_name">Track by Name:</label>
            <input type="text" id="track_name" name="track_name" required>
            <input type="submit" name="track-by-name-button" value="track">
        </div>
</div>

<div class = "ticket-list">

</div>
`

const ticketSearchByIdButtonsHTML = `
              <div class="search-row">
                <input type="text" id="search-ticket-by-id" placeholder="Ticket ID">
                <button type="button" id="search-ticket-by-id-button" class="btn btn-primary btn-sm">Search</button>
              </div>

`

const ticketSearchByNameButtonsHTML = `
              <div class="search-row">
                <input type="text" id="search-ticket-by-customer-name" placeholder="Ticket Name">
                <button type="button" id="search-ticket-by-customer-name-button" class="btn btn-primary btn-sm">Search</button>
              </div>
`

const formHTML = `
    <form>
    <table>
        <tr>
            <td>Full Name *</td>
            <td><input type="text" name="customer_name" required></td>
        </tr>
        <tr>
            <td>Lab/Office Number</td>
            <td><input type="text" name="office_num"></td>
        </tr>
        <tr>
            <td>Email *</td>
            <td><input type="email" name="email" required></td>
        </tr>
        <tr>
            <td>Phone Number</td>
            <td><input type="tel" name="phone_num" id="phone_input" placeholder="(xxx) xxx-xxxx" maxlength="14"></td>
        </tr>
        <tr>
            <td>Speed Chart *</td>
            <td><input type="text" name="speed_chart" required></td>
        </tr>
        <tr>
            <td>Supervisor Name *</td>
            <td><input type="text" name="supervisor_name" required></td>
        </tr>
        <tr>
            <td>Service Type *</td>
            <td>
                <select name="service_type" required>
                    <option value="it">IT</option>
                    <option value="glass">Glass</option>
                    <option value="elec">Elec</option>
                    <option value="mech">Mech</option>
                </select>
            </td>
            
        </tr>
        <tr>
            <td>Request Description *</td>
            <td>
                <textarea name="request_description" rows="5" cols="19" required></textarea>
            </td>
        </tr>
        <tr>
            <td>Equipment Manufacturer and Model (If Applicable)</td>
            <td><input type="text" name="manufacturer"></td>
        </tr>
    </table>
    </form>

`

const formSubmitHTML = 
`
<div class="search-row">
    <button type="button" id="form-submit-button">Submit</button>
</div>
`

const formUpdateHTML = 
`
<div class="search-row">
    <button type="button" id="form-submit-button">Update</button>
</div>
`

// Removes the contents of the given DOM element (equivalent to elem.innerHTML = '' but faster)
function emptyDOM (elem){
    while (elem.firstChild) elem.removeChild(elem.firstChild);
}

// Creates a DOM element from the given HTML string
function createDOM (htmlString){
    let template = document.createElement('template');
    template.innerHTML = htmlString.trim();
    return template.content.firstChild;
}


class TicketView{
    constructor(){
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')
    }

    setPrompt(){
        emptyDOM(this.content_elem)

        var prompt_dom = createDOM(
            `
            <h1>
            Please check FAQs to most common questions!
            </h1>
            `
        )

        this.content_elem.appendChild(prompt_dom)
    }
    // id  |  service type | open time
    setTitle(){
        emptyDOM(this.content_elem)

        var ticket_list_dom = createDOM(
            `
            <table style="width:100%" class = "ticket-list">
            
            </table> 
            `
        )

        this.content_elem.appendChild(ticket_list_dom)

        var list_elem = this.content_elem.querySelector('table.ticket-list')
        var newList = createDOM(
            `
            <tr>
                <th>id</th>
                <th>service type</th>
                <th>open time</th>
            </tr>
            
            `
        ) 

        list_elem.appendChild(newList)
    }

    setTicket(ticket){
        var list_elem = this.content_elem.querySelector('table.ticket-list')

        var newList = createDOM(
            `
            
                <tr>
                    <th><a href="#ticket/${ticket.id}">${ticket.id}</a></th>
                    <th>${ticket.service_type}</th>
                    <th>${new Date(ticket.open_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                </tr>
            
            `
        )
        list_elem.appendChild(newList)
    }

    setControl(){
        emptyDOM(this.control_elem)
        this.control_elem.appendChild(createDOM(ticketSearchByIdButtonsHTML))
        this.control_elem.appendChild(createDOM(ticketSearchByNameButtonsHTML))

        // Search by ID modole
        this.ticket_id_input_elem = this.control_elem.querySelector('#search-ticket-by-id')
        this.ticket_id_search_button_elem = this.control_elem.querySelector('#search-ticket-by-id-button')

        this.ticket_id_search_button_elem.addEventListener('click', () => {
            var id = this.ticket_id_input_elem.value
            this.ticket_id_input_elem.value = ''

            if (id == ''){
                window.alert('Ticket ID is required!')
            }else{
                Service.getTicketById(id).then(
                (ticket) => {
                    console.log('find ticket with id: ', ticket.id)

                    this.setTitle()
                    this.setTicket(ticket)
                })
            }
            
        })

        // Search by Name module        
        this.ticket_name_input_elem = this.control_elem.querySelector('#search-ticket-by-customer-name')
        this.ticket_name_search_button_elem = this.control_elem.querySelector('#search-ticket-by-customer-name-button')

        this.ticket_name_search_button_elem.addEventListener('click', () => {
            var name = this.ticket_name_input_elem.value
            this.ticket_name_input_elem.value = ''

            if (name == ''){
                window.alert('Ticket name is requred!')
            }else{
                Service.getTicketByName(name).then(
                    (tickets_list) => {                    
                        this.setTitle()
                        console.log('find ', tickets_list.length, ' tickets')
                        for (const ticket of tickets_list){
                            this.setTicket(ticket)
                        }
                            
                    }
                )
            }
        }
    
        )

    }
}



class TrackFormView{
    constructor(){  
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')

        this.id = ''

        this.customer_name = ''
        this.office_num = ''
        this.email = ''
        this.phone_num = ''
        this.speed_chart = ''
        this.supervisor_name = ''
        this.service_type = ''
        this.request_description = ''
        this.manufacturer = ''
    }

    setForm(){
        emptyDOM(this.content_elem)
        this.content_elem.appendChild(createDOM(formHTML))

        var phoneInput = document.getElementById('phone_input');
            phoneInput.addEventListener('input', function () {
                var value = phoneInput.value.replace(/\D/g, '');
        
                
                // Add extra format to phone number 
                // 1234567890 => (123) 456-7890
                if (value.length === 10) {
                    var formattedValue = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6, 10);
                    phoneInput.value = formattedValue;
                }
               
            });
    }

    displayFilled(id){
        emptyDOM(this.content_elem)
        var form_dom = createDOM(formHTML)
        this.content_elem.appendChild(form_dom)

        Service.getTicketById(id).then(
            (ticket) => {
                console.log(ticket)

                this.content_elem.querySelector('input[name="customer_name"]').value = ticket.customer_name
                this.content_elem.querySelector('input[name="office_num"]').value = ticket.office_num
                this.content_elem.querySelector('input[name="email"]').value = ticket.email
                this.content_elem.querySelector('input[name="phone_num"]').value = ticket.phone_num
                this.content_elem.querySelector('input[name="speed_chart"]').value = ticket.speed_chart
                this.content_elem.querySelector('input[name="supervisor_name"]').value = ticket.supervisor_name
                this.content_elem.querySelector('select[name="service_type"]').value = ticket.service_type
                this.content_elem.querySelector('input[name="request_description"]').value = ticket.request_description
                this.content_elem.querySelector('input[name="manufacturer"]').value = ticket.manufacturer
            }
        )
    }

    setControl(instruction){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)
        if (instruction == 'submit'){
            this.control_elem.appendChild(createDOM(formSubmitHTML))
        }else{
            this.control_elem.appendChild(createDOM(formUpdateHTML))
        }
        
        console.log(this.control_elem)

        this.control_elem.addEventListener('click', () => {
            console.log('clicking ' + instruction)
            this.customer_name = this.content_elem.querySelector('input[name="customer_name"]').value
            this.office_num = this.content_elem.querySelector('input[name="office_num"]').value
            this.email = this.content_elem.querySelector('input[name="email"]').value
            this.phone_num = this.content_elem.querySelector('input[name="phone_num"]').value
            this.speed_chart = this.content_elem.querySelector('input[name="speed_chart"]').value
            this.supervisor_name = this.content_elem.querySelector('input[name="supervisor_name"]').value
            this.service_type = this.content_elem.querySelector('select[name="service_type"]').value
            this.request_description = this.content_elem.querySelector('textarea[name="request_description"]').value
            this.manufacturer = this.content_elem.querySelector('input[name="manufacturer"]').value
            

            console.log("customer_name:", this.customer_name)
            console.log("office_num:", this.office_num)
            console.log("email:", this.email)
            console.log("phone_num:", this.phone_num)
            console.log("speed_chart:", this.speed_chart)
            console.log("supervisor_name:", this.supervisor_name)
            console.log("service_type:", this.service_type)
            console.log("request_description:", this.work_request)
            console.log("manufacturer:", this.manufacturer)

            // Pass all error checkers
            if (this.errorCheck()){
                var form = {
                    "customer_name": this.customer_name,
                    "office_num": this.office_num,
                    "email": this.email,
                    "phone_num": this.phone_num,
                    "speed_chart": this.speed_chart,
                    "supervisor_name": this.supervisor_name,
                    "service_type": this.service_type,
                    "request_description": this.request_description,
                    "manufacturer": this.manufacturer,
                }

                if (instruction == 'submit'){
                    Service.createForm(form).then(
                        (resolve) => {
                            console.log(resolve)
                            
                            function showSuccessMessage() {
                                // You can customize this part as per your UI requirements
                                window.alert("You have successfully submitted the ticket. Please click the print button to print the page! ")
                                
                                let successMessage = document.createElement("div");
                                successMessage.innerHTML = "<strong style='color:green;' >Form submitted successfully!</strong>";
                                
                                
                                // <br><button onclick='printPage()'>Print this page</button>";
                                document.body.appendChild(successMessage);
                            }

                            function addPrintOption() {
                                let printButton = document.createElement("button");
                                printButton.innerHTML = "Print";
                                printButton.className = "btn btn-success";
                                printButton.onclick = function() {
                                    window.print();
                                };
                                document.body.appendChild(printButton);
                            }
                            
                            emptyDOM(this.control_elem)

                            // Pop successful submit window
                            showSuccessMessage();

                            // Add print option
                            addPrintOption();

                        },
                        (err) => {
                            console.log(err)
                        }
                    )
                } else{
                    Service.updateForm(this.id, form).then(
                        (resolve) => {
                            console.log('pass')
                            console.log(resolve)
                        },
                        (err) => {
                            console.log(err)
                        }
                    )
                }
                
            }
        })
    }

    setId(id){
        this.id = id
    }

    errorCheck(){
        const validations = [
            { field: this.customer_name, message: 'name is required!' },
            { field: this.email, message: 'email is required!' },
            { field: this.speed_chart, message: 'speed_chart is required!' },
            { field: this.supervisor_name, message: "supervisor's name is required" },
            { field: this.service_type, message: 'service type is required!' },
            { field: this.request_description, message: 'request description is required!' }
        ];
    
        for (const validation of validations) {
            if (!validation.field) {
                window.alert(validation.message)
                return false
            }
        }
    
        return true;
    }

}

function main(){
    var ticketView = new TicketView()
    var formView = new TrackFormView()

    function renderRoute(){
        var url = window.location.hash
        console.log('url: ', url)
        
        var ticket_id_pattern = "#ticket/[0-9]+"
        var ticket_id = url.substring(8)



        // Submit Form Page
        if (url == '#form'){
            console.log('form')

            formView.setForm()
            formView.setControl('submit')
        }

        // Update Form Page
        else if (url.match(ticket_id_pattern)){
            console.log('ticket_id: ', ticket_id)

            // Define a function to prompt for the password and check it
            function promptForPassword() {
                var userPassword = prompt("Please enter your one time password in your email to continue:");

                // If the prompt wasn't cancelled (user pressed OK)
                if (userPassword !== null) {
                    Service.getTicketById(ticket_id).then(
                        (ticket) => {
                            if (userPassword === ticket.password) {
                                formView.id = ticket_id
                                // ticketView.setId(ticket_id)

                                formView.displayFilled(ticket_id)
                                formView.setControl('update')
                            } else {
                                window.alert('Incorrect password, please try again.');
                                promptForPassword(); // Recursively call the promptForPassword function
                            }
                        }
                    ).catch((error) => {
                        // Handle potential errors, such as the ticket not being found
                        console.error(error);
                        window.alert('An error occurred while verifying the password.');
                    });
                } else {
                    // User cancelled the prompt, handle according to your needs
                    console.log('Password prompt cancelled by user.');
                }
            }

            // Call the function for the first time
            promptForPassword();
                    
        }

        // Track page
        else {
            ticketView.setPrompt()
            ticketView.setControl()
        }
    }
    window.addEventListener('hashchange', renderRoute)
    renderRoute()
}

window.addEventListener('load', main)