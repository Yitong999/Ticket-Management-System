origin = window.location.origin
console.log('origin: ', origin)

var staff_list = []
Service = {
    fetchUser: async function(){
        var url = origin + '/user'
        console.log(url)
        const response = await fetch(url)
        var user = await response.json()
        
        return user
    },

    findAllStaff: async function(){
        var url = origin + '/staff/all'

        try{
            var response = await fetch(url)
            staff_list = await response.json()

            console.log(staff_list)
        }catch(err){
            window.alert("No staff found")
        }
    },

    retrieveStaffNameById: function(id){
        // staff_list.forEach((staff) => {
        //     if (staff.id == id){
        //         return staff.name
        //     }
        // })

        for (const staff of staff_list) {
            if (staff.id == id) {
                return staff.name;
            }
        }
        return null;
    },

    postData: async function (url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
            body: JSON.stringify(data) // body data type must match "Content-Type" header
            // body: data
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parses JSON response
        } else {
            return response.text(); // Returns text response
        }
    },

    putData: async function (url = '', data = {}) {
        const response = await fetch(url, {
            method: 'PUT', // Change method to PUT
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
            redirect: 'follow',
            referrerPolicy: 'no-referrer',
            body: JSON.stringify(data)
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parses JSON response
        } else {
            return response.text(); // Returns text response
        }
    },

    updateForm: function(id, form){
        var xhrRequest = new XMLHttpRequest()
        return new Promise((resolve, reject) => {
            url = origin + '/form/change/' + id

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

const dropBar = `
<div>
    <label for="nameSelect">Name:</label>
    <select id="nameSelect" name="name">
    <option value="option1">Option 1</option>
    <option value="option2">Option 2</option>
    <option value="option3">Option 3</option>
    <!-- Add more options here as needed -->
    </select>
</div>
`

const datePicker = `
<div class="date-picker">
    <label for="startDate">start date:</label>
    <input type="date" id="start_date" name="start-date">
    
    <label for="endDate">end date:</label>
    <input type="date" id="end_date" name="end-date">
</div>
`

const confirmButton = `
<div class="confirm-button">
    <button type="button" id="confirm-button">Confirm</button>
</div>
`

const analysisContent = `
<div>
    <div><strong>Shop:</strong> <span id="shop-name"><!-- Shop name goes here --></span></div>
    <div><strong># Tickets in progress:</strong> <span id="tickets-in-progress"><!-- Number of tickets in progress goes here --></span></div>
    <div><strong># Tickets completed:</strong> <span id="tickets-completed"><!-- Number of tickets completed goes here --></span></div>
    <div><strong>Average time cost:</strong> <span id="average-time"><!-- Average time cost goes here --></span></div>
</div>

`

const assignMenu = `
<ul id = "app-menu">
    <li class = "menu-item">
    <a href="#all">All</a>
    </li>
    <li class = "menu-item">
    <a href="#it">IT</a>
    </li>
    <li class = "menu-item">
        <a href="#elec">ELEC</a>
    </li>
    <li class = "menu-item">
        <a href="#mech">MECH</a>
    </li>
    <li class = "menu-item">
        <a href="#glass">GLASS</a>
    </li>
    <li class = "menu-item" style="color: blue;">
        <a href="#inprogress">In Progress Tickets</a>
    </li>
    <li class = "menu-item" style="color: green;">
        <a href="#finished">Completed Tickets</a>
    </li>
</ul>
`

// HTML of the table contents
const formHTML = `
    <form>
        <table>
            <tr>
                <td>Name *</td>
                <td><input type="text" name="customer_name" readonly></td>
            </tr>
            <tr>
                <td>Lab/Office Number</td>
                <td><input type="text" name="office_num" readonly></td>
            </tr>
            <tr>
                <td>Email *</td>
                <td><input type="text" name="email" readonly></td>
            </tr>
            <tr>
                <td>Phone Number</td>
                <td><input type="tel" name="phone_num" pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}" readonly></td>
            </tr>
            <tr>
                <td>Speed Chart *</td>
                <td><input type="text" name="speed_chart" readonly></td>
            </tr>
            <tr>
                <td>Supervisor Name *</td>
                <td><input type="text" name="supervisor_name" readonly></td>
            </tr>
            <tr>
                <td>Service Type *</td>
                <td><input type="text" name="service_type" readonly></td>
            </tr>
            <tr>
                <td>Request Description *</td>
                <td><input type="text" name="request_description" readonly></td>
            </tr>
            <tr>
                <td>Equipment Manufacturer and Model (If Applicable)</td>
                <td><input type="text" name="manufacturer" readonly></td>
            </tr>
        </table>
    </form>
`

// Pick up button
const formAssignButtonHTML = 
`
<button type="button" id="form-assign-button">Assign</button>
`

const formReassignButtonHTML = 
`
<button type="button" id="form-reassign-button">Re-assign</button>
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


class AssignView{
    
}


class TicketView{
    constructor(){
        this.menu_elem = document.querySelector('div.app-menu')
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')
    }

    setupMenu(){
        emptyDOM(this.content_elem)
        emptyDOM(this.control_elem)
        emptyDOM(this.menu_elem)

        this.menu_elem.append(createDOM(assignMenu))
    }

    setNoTicketFound(){
        emptyDOM(this.content_elem)

        var warning = createDOM(
            `
            <div> No tickets found! </div>
            `
        )

        this.content_elem.appendChild(warning)
    }

    // Set the title of
    // id  |  service type | open time
    setTicketsTitle(){
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

    // Set title of 
    // id  |  pickup time
    setInProgressTitle(){
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
                <th>staff</th>
                <th>pick up time</th>
            </tr>
            
            `
        ) 

        list_elem.appendChild(newList)
    }

    // Set title of 
    // id | pick up time | completed time
    setCompletedTitle(){
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
                <th>staff</th>
                <th>pick up time</th>
                <th>completed time</th>
            </tr>
            
            `
        ) 

        list_elem.appendChild(newList)
    }


    setTicket(ticket, mode){
        var list_elem = this.content_elem.querySelector('table.ticket-list')

        if (mode == 'not-assigned'){
            var newList = createDOM(
                // Set tickets in format
                // id | service type | open time
                `
                    <tr>
                        <th><a href="#ticket/${ticket.id}">${ticket.id}</a></th>
                        <th>${ticket.service_type}</th>
                        <th>${new Date(ticket.open_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                    </tr>
                
                `
            )
        }

        else if (mode == 'inprogress'){
            var newList = createDOM(
                // Set tickets in format
                // id || pick up time

// Service.retrieveStaffNameById(ticket.id)
                // console.log('name here: ')
                `
                    <tr>
                        <th><a href="#inprogress/${ticket.id}">${ticket.id}</a></th>
                        <th><a href="#analysis">${Service.retrieveStaffNameById(ticket.staff)}</a></th>
                        <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                    </tr>
                
                `
            )
        }else if (mode == 'completed'){
            var newList = createDOM(
                // Set tickets in format
                // id | pick up time | complete time
                `
                    <tr>
                        <th><a href="#completed/${ticket.id}">${ticket.id}</a></th>
                        <th><a href="#analysis">${Service.retrieveStaffNameById(ticket.staff)}</a></th>
                        <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                        <th>${new Date(ticket.close_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                    </tr>
                
                `
            )
        }

        list_elem.appendChild(newList)
    }

    async setAllTickets(){
        var url = origin + '/tickets/all_open'
        
        console.log('here: ', url)

        try{
            const response = await fetch(url)
            const tickets_list = await response.json()
            // console.log(tickets)
            this.setTicketsTitle()

            for (const ticket of tickets_list) {
                this.setTicket(ticket, 'not-assigned') // Same as above for 'this'
            }
        }catch(error){
            this.setNoTicketFound()
            window.alert("No open tickets found over all")
        }
        
    }

    async setAllTicketsInShop(shop){
        emptyDOM(this.control_elem)
        try{
            var url = origin + '/tickets/shop/' + shop
            console.log(url)

            const response = await fetch(url)
            const tickets_list = await response.json()
            // console.log(tickets)
            this.setTicketsTitle()

            for (const ticket of tickets_list) {
                this.setTicket(ticket, 'not-assigned') // Same as above for 'this'
            }
        }catch(error){
            // this.setTicketsTitle()
            this.setNoTicketFound()
            window.alert("No open tickets found in " + shop)
        }
    }

    async setInprogressTickets(){
        emptyDOM(this.control_elem)
        try{
            var url = origin + '/tickets/inprogress/'
            console.log(url)

            const response = await fetch(url)
            const tickets_list = await response.json()

            // const tickets_list = tickets_list_json.in_progress_tickets
            console.log(tickets_list)
            
            console.log('next: ', tickets_list.length)
            this.setInProgressTitle()

            if (tickets_list.length == 0){
                this.setNoTicketFound()
                window.alert("No in progress tickets found for you!")
            }else{
                for (const ticket of tickets_list) {
                    this.setTicket(ticket, 'inprogress') // Same as above for 'this'
                }
            }
            
        }catch{
            this.setTicketsTitle()
            window.alert("No in progress tickets found for you!")
        }
    }

    async setCompletedTickets(){
        emptyDOM(this.control_elem)
        try{
            var url = origin + '/tickets/completed/'
            console.log(url)

            const response = await fetch(url)
            const tickets_list = await response.json()

            // const tickets_list = tickets_list_json.in_progress_tickets
            console.log(tickets_list)
            console.log(tickets_list.length)

            this.setCompletedTitle()

            if (tickets_list.length == 0){
                this.setNoTicketFound()
                window.alert("No completed tickets found for you!")
            }
            for (const ticket of tickets_list) {
                this.setTicket(ticket, 'completed') // Same as above for 'this'
            }
        }catch{
            this.setNoTicketFound()
            window.alert("No completed tickets found for you!")
        }
    }

    setControl(){
        emptyDOM(this.control_elem)
    }
}





class AnalysisView{
    constructor(){
        this.menu_elem = document.querySelector('div.app-menu')
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')
        
        this.dropBarElement = null

        // this.staff_list = []
        this.select_name = ''
        this.startDateEpoch = 0
        this.endDateEpoch = 0

        
    }

    // * Call this function first after initialization
    // Find all staff in the system
    // async findAllStaff(){
    //     var url = origin + '/staff/all'

    //     try{
    //         var response = await fetch(url)
    //         this.staff_list = await response.json()
    //     }catch(err){
    //         window.alert("No staff found")
    //     }
    // }

    // Function to update the dropdown options
    updateDropdownOptions(dropBarHTML, newOptions) {
        this.dropBarElement = createDOM(dropBarHTML);
        
        // Get the select element from the newly created HTML element
        const selectElement = this.dropBarElement.querySelector('select');
        
        // Clear all existing options
        selectElement.innerHTML = '';
        
        // Loop through the new options and create option elements
        newOptions.forEach(name => {
            const optionElement = document.createElement('option')
            optionElement.textContent = name
            selectElement.appendChild(optionElement)
        });
        
        // Return the updated HTML element
        return this.dropBarElement;
    }

    // Function to read start and end date in epoch form
    getDateInEpoch(selector) {
        const dateInput = document.querySelector(selector);
        if (dateInput && dateInput.value) {
          const date = new Date(dateInput.value);
          return date.getTime(); // This returns the timestamp (epoch)
        }
        return null; // Return null if the input is not found or the value is empty
    }

    logStartAndEndDates() {
        this.startDateEpoch = this.getDateInEpoch('#start_date');
        this.endDateEpoch = this.getDateInEpoch('#end_date');
        
        console.log('Start Date (Epoch):', this.startDateEpoch);
        console.log('End Date (Epoch):', this.endDateEpoch);
    }

    findCompletedTickets(staffArray, name) {
        // Find the staff member with the given name
        const staff = staffArray.find(member => member.name === name);
        if (staff) {
            // Parse the completed tickets JSON string into an array
            const completedTickets = JSON.parse(staff.completed_tickets);

            return completedTickets;
        } else {
            return []; // Return an empty array if the staff member is not found
        }
    }

    findInProgressTickets(staffArray, name) {
        // Find the staff member with the given name
        const staff = staffArray.find(member => member.name === name);
        if (staff) {
            // Parse the in progress tickets JSON string into an array
            const inprogressTickets = JSON.parse(staff.in_progress_tickets);
            return inprogressTickets;
        } else {
            return []; // Return an empty array if the staff member is not found
        }
    }

     // Count number of in progress tickets in range between A and B
     countInProgressTicketsInRange(ticketsArray, A, B) {
        // Use the filter method to find tickets with complete_time within the range
        const filteredTickets = ticketsArray.filter(ticket =>
          ticket.pickup_time >= A && ticket.pickup_time <= B
        );

        
        // Return the count of such filtered tickets
        return filteredTickets.length
      }

    // Count number of completed tickets in range between A and B
    countCompletedTicketsInRange(ticketsArray, A, B) {
        // Use the filter method to find tickets with complete_time within the range
        const filteredTickets = ticketsArray.filter(ticket =>
          ticket.complete_time >= A && ticket.complete_time <= B
        );

        let total_time = 0
        filteredTickets.forEach((ticket) => {
            total_time += (ticket.complete_time - ticket.pickup_time)
        })
        
        // Return the count of such filtered tickets
        return {
            count: filteredTickets.length,
            avgTime: total_time / filteredTickets.length
        }
    
      }

    // Find epoch time to minutes
    getDifferenceInHours(epoch) {
        return epoch / (1000 * 60) // Convert milliseconds to minutes
    }

    setContent(){
        emptyDOM(this.menu_elem)
        emptyDOM(this.content_elem)
    }
    async setupControl(){
        emptyDOM(this.control_elem)
        
        let staff_name_list = staff_list.map(member => member.name)

        // Update dropbar with all staff's name
        const updatedDropBar = this.updateDropdownOptions(dropBar, staff_name_list)
        
        this.control_elem.appendChild(updatedDropBar)

        this.control_elem.appendChild(
            createDOM(datePicker)
        )

        this.control_elem.appendChild(
            createDOM(confirmButton)
        )

        // Confirm with the choice
        this.ticket_confirm_button_elem = this.control_elem.querySelector('#confirm-button')
        this.ticket_confirm_button_elem.addEventListener('click', () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            if(this.dropBarElement){
                const selectElement = this.dropBarElement.querySelector('select');
                this.select_name = selectElement.value


                this.setupContent(this.select_name)
            }

            

        })
    }

    async setupContent(select_name){
        const staffInfo = staff_list.find(staff => staff.name === select_name);
        const shop_name = staffInfo ? staffInfo.shop : 'Not found';



        var completed_tickets_list = this.findCompletedTickets(staff_list, select_name)

        var in_progress_tickets_list = this.findInProgressTickets(staff_list, select_name)

        var in_progress_count = this.countInProgressTicketsInRange(in_progress_tickets_list, this.startDateEpoch, this.endDateEpoch)


        var results = this.countCompletedTicketsInRange(completed_tickets_list, this.startDateEpoch, this.endDateEpoch)
        var completed_count = results.count
        
        var avg_time = results.avgTime //Average time cost

        const analysisContent = `
        <div>
            <div><strong>Shop:</strong> <span id="shop-name">${shop_name}</span></div>
            <div><strong># Tickets in progress:</strong> <span id="tickets-in-progress">${in_progress_count}</span></div>
            <div><strong># Tickets completed:</strong> <span id="tickets-completed">${completed_count}</span></div>
            <div><strong>Average time cost:</strong> <span id="average-time">${this.getDifferenceInHours(avg_time) + ' mins'}</span></div>
        </div>
        `;

        // Convert the string to an HTML element
        const contentElement = createDOM(analysisContent);

        // Empty the content element before appending new content
        emptyDOM(this.content_elem);

        // Append the new content
        this.content_elem.appendChild(contentElement);

    }
}



class TrackFormView{
    constructor(){  
        this.menu_elem = document.querySelector('div.app-menu')
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


        this.dropBarElement = null
    }

    setForm(){
        emptyDOM(this.menu_elem)
        emptyDOM(this.content_elem)
        this.content_elem.appendChild(createDOM(formHTML))
    }

    async displayFilled(id){
        emptyDOM(this.content_elem)
        var form_dom = createDOM(formHTML)
        this.content_elem.appendChild(form_dom)

        var url = origin + '/form/retrieve/id/' + id
        console.log(url)

        const response = await fetch(url)
        const ticket = await response.json()

        console.log(ticket)

        this.content_elem.querySelector('input[name="customer_name"]').value = ticket.customer_name
        this.content_elem.querySelector('input[name="office_num"]').value = ticket.office_num
        this.content_elem.querySelector('input[name="email"]').value = ticket.email
        this.content_elem.querySelector('input[name="phone_num"]').value = ticket.phone_num
        this.content_elem.querySelector('input[name="speed_chart"]').value = ticket.speed_chart
        this.content_elem.querySelector('input[name="supervisor_name"]').value = ticket.supervisor_name
        this.content_elem.querySelector('input[name="service_type"]').value = ticket.service_type
        this.content_elem.querySelector('input[name="request_description"]').value = ticket.request_description
        this.content_elem.querySelector('input[name="manufacturer"]').value = ticket.manufacturer

    }

    async displayNoteBlock(IsReadOnly, ticket_id){
        // Message block to let staff can leave some messages to the tickets
        var messageBox = document.createElement('textarea');
        messageBox.id = 'user_message';
        messageBox.rows = 5;
        messageBox.cols = 50;
        messageBox.placeholder = 'Enter your note here...';

        if (IsReadOnly == true){ // Track completed list

            // Assign note content to messageBox
            var url = origin + '/tickets/note/' + ticket_id
            try{
                const response = await fetch(url)
                const ticket = await response.json()

                console.log('ticket note: ', ticket.note)
                if (ticket.note == '' || ticket.note == null){
                    messageBox.value = "You haven't leave any message"
                }else{
                    messageBox.value = ticket.note
                }
                
            }catch(err){
                messageBox.value = 'nothing'
            }

            messageBox.readOnly = true;
            
        }

        // Append the new textarea to the form
        this.content_elem.appendChild(messageBox);
    }



    async setPickUpControl(staff_id, ticket_id){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)
        this.control_elem.appendChild(createDOM(formPickHTML))
       

        this.control_elem.addEventListener('click', () => {
            // Pass all error checkers
            

            // Pick up a ticket
            var url = origin + '/pickup/' + staff_id +'/' + ticket_id
            
            Service.postData(url)
                .then(data => {
                    console.log(data); // JSON data parsed by `response.json()` call
                })
                .catch((error) => {
                    console.log('Error:', error);
                })
            
        })
    }

    setControlNull(){
        emptyDOM(this.control_elem)
    }

    setId(id){
        this.id = id
    }

    // Function to update the dropdown options
    updateDropdownOptions(dropBarHTML, newOptions) {
        this.dropBarElement = createDOM(dropBarHTML);
        
        // Get the select element from the newly created HTML element
        const selectElement = this.dropBarElement.querySelector('select');
        
        // Clear all existing options
        selectElement.innerHTML = '';
        
        // Loop through the new options and create option elements
        newOptions.forEach(name => {
            const optionElement = document.createElement('option')
            optionElement.textContent = name
            selectElement.appendChild(optionElement)
        });
        
        // Return the updated HTML element
        return this.dropBarElement;
    }

    async setupControl(mode){
        emptyDOM(this.control_elem)
        var url = origin + '/staff/all'
        
        let staff_name_list = staff_list.map(member => member.name)

        // Update dropbar with all staff's name
        const updatedDropBar = this.updateDropdownOptions(dropBar, staff_name_list)
        
        this.control_elem.appendChild(updatedDropBar)

        if (mode == 'assign'){
            this.control_elem.appendChild(
                createDOM(formAssignButtonHTML)
            )
            this.ticket_assign_button_elem = this.control_elem.querySelector('#form-assign-button')
        }else if (mode == 'reassign'){
            this.control_elem.appendChild(
                createDOM(formReassignButtonHTML)
            )
            this.ticket_assign_button_elem = this.control_elem.querySelector('#form-reassign-button')
        }
        

        // Assign the ticket
        



        this.ticket_assign_button_elem.addEventListener('click', () => {

            // if (this.startDateEpoch == null || this.endDateEpoch == null) {
            //     window.alert('Please select both start and end dates before confirming.');
            //     return; // Stop the function from proceeding further
            // }

            if(this.dropBarElement){
                const selectElement = this.dropBarElement.querySelector('select');
                var select_name = selectElement.value
                var selected_id = null

                console.log('selected name: ', select_name)
                
                staff_list.forEach((staff) => {
                    if (staff.name == select_name){
                        selected_id = staff.id
                    }
                })

                if (mode == 'assign'){
                    // Pick up a ticket
                    var url = origin + '/pickup/' + selected_id + '/' + this.id
                } else if (mode == 'reassign'){
                    // Reassign
                    var url = origin + '/reassign/' + selected_id + '/' + this.id
                }
                
                
                Service.postData(url)
                    .then(data => {
                        console.log(data); // JSON data parsed by `response.json()` call
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    })
                // this.setupContent(this.select_name)
            }

            

        })
    }


}




async function main(){
    var analysisView = new AnalysisView()
    // await analysisView.findAllStaff() // find all staffs and their info and store them in a local buffer
    await Service.findAllStaff()
    console.log('staff list: ', staff_list)


    var ticketView = new TicketView()

    var formView = new TrackFormView()
    
    function renderRoute(){
        var url = window.location.hash
        console.log('url: ', url)


        var ticket_id_pattern = "#ticket/[0-9]+"
        var ticket_id = url.substring(8)

        var inprogrewss_ticket_id_pattern = "#inprogress/[0-9]+"
        var inprogress_ticket_id = url.substring(12)

        var complete_ticket_id_pattern = "#completed/[0-9]+"
        var complete_ticket_id = url.substring(11)


        if (url == '#assign'){
            ticketView.setupMenu()
        }

        else if (url == '#analysis'){
            analysisView.setContent()
            analysisView.setupControl()
        }

        else if (url == '#all'){
            ticketView.setupMenu()
            ticketView.setAllTickets()
            ticketView.setControl()
        }else if (url == '#it'){
            ticketView.setupMenu()
            let shop = 'it'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#elec'){
            ticketView.setupMenu()
            let shop = 'elec'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#mech'){
            ticketView.setupMenu()
            let shop = 'mech'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#glass'){
            ticketView.setupMenu()
            let shop = 'glass'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }
        
        else if (url.match(ticket_id_pattern)){
            ticketView.setupMenu()

            console.log('ticket_id: ', ticket_id)
            formView.id = ticket_id
            // ticketView.setId(ticket_id)

            formView.displayFilled(ticket_id)

            formView.setupControl('assign')
            // formView.setPickUpControl(0, ticket_id)
        }

        else if (url.match(inprogrewss_ticket_id_pattern)){
            ticketView.setupMenu()

            formView.id = inprogress_ticket_id
            console.log('inprogress id: ', inprogress_ticket_id)
            // ticketView.setId(ticket_id)

            formView.displayFilled(inprogress_ticket_id)

            // TODO: reassign
            formView.setupControl('reassign')
        }


        else if (url == '#inprogress'){
            ticketView.setupMenu()

            ticketView.setInprogressTickets()

        }else if (url == '#finished'){
            ticketView.setupMenu()

            ticketView.setCompletedTickets()
        }
        

    }

    window.addEventListener('hashchange', renderRoute)
    renderRoute()
}

















window.addEventListener('load', main)