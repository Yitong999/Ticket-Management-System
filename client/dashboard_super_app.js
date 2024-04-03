origin = window.location.origin
console.log('origin: ', origin)
// const Supervisor = require('./Supervisor')
// import { Supervisor } from './Supervisor'


class Supervisor {
    constructor(name) {
      this.name = name;
      this.tickets_map = new Map(); // key is speed chart, value is a list of tickets
    }
  
    // Method to add a speed chart with its corresponding couple of tickets
    addSpeedChart(speedChart, ticket) {
      //
      this.tickets_map[speedChart].push(ticket)

      // Check if the speed chart already exists in the map
      if (!this.tickets_map.has(speedChart)) {
        // If not, initialize it with an empty array
        this.tickets_map.set(speedChart, []);
      }
      // Add the ticket to the corresponding speed chart
      this.tickets_map.get(speedChart).push(ticket);
    }
  
    // Method to get all speed charts and their corresponding tickets
    getSpeedCharts() {
        return Array.from(this.tickets_map.entries());
    }
  }

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

    retrieveStaffNamesByIds: function(idList) {
        // Assuming staff_list is defined elsewhere and accessible here
        let names = [];
    
        idList.forEach(id => {
            const name = this.retrieveStaffNameById(parseInt(id));
            if (name) { // Make sure a name was found before adding it
                names.push(name);
            }
        });
    
        // Join all the names found with ', ' and return the resulting string
        return names.join(', ');
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

    patchData: async function (url = '', data = {}) {
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'PATCH', // Change method to PATCH
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
        });
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            return response.json(); // Parses JSON response into JavaScript object
        } else {
            return response.text(); // Returns text response if not JSON
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

const statusSwitchButton = `
<div class="switch-button">
    <button type="button" id="switch-button">Switch Status</button>
</div>
`


const getCSVButton = `
<div class="get-general-csv-button">
    <button type="button" id="get-csv-button">Download CSV</button>
</div>
`

const getInvoiceCSVButton = `
<div class="get-invoice-csv-button">
    <button type="button" id="get-invoice-csv-button">Download Invoice CSV</button>
</div>
`

const getGeneralReportCSVButton = `
<div class="get-general-csv-button">
    <button type="button" id="get-general-csv-button">Download General CSV</button>
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
    <a href="#faq">FAQ</a>
    </li>
    <li class = "menu-item">
    <a href="#add-faq">Add a FAQ</a>
    </li>
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


class FAQView{
    constructor(){
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')

        this.faq = []
        // this.faqs = [
        //     {
        //         "Q_id": 1,
        //         "classification": "IT",
        //         "question": "How to factory reset win10 OS?",
        //         "solution": "To reset your PC, go to Start"
        //     },
        //     {
        //         "Q_id": 2,
        //         "classification": "IT",
        //         "question": "How to install linux ?",
        //         "solution": "Windows Subsystem for Linux (WSL), Bare metal Linux; or create a Virtual Machine (VM) to run Linux locally or in the cloud."
        //     },
        //     {
        //         "Q_id": 3,
        //         "classification": "CHEM",
        //         "question": "How to install linux ?",
        //         "solution": "Windows Subsystem for Linux (WSL), Bare metal Linux; or create a Virtual Machine (VM) to run Linux locally or in the cloud."
        //     }
        // ]
    }
    
    setAddFAQPrompt(){
        emptyDOM(this.content_elem);

        // Create a form
        let form = document.createElement('form');
        form.setAttribute('id', 'addFaqForm');
    
        // Create input for Classification
        let classificationInput = document.createElement('input');
        classificationInput.setAttribute('type', 'text');
        classificationInput.setAttribute('placeholder', 'Classification (e.g., CHEM)');
        classificationInput.setAttribute('name', 'classification');
    
        // Create input for Question
        let questionInput = document.createElement('input');
        questionInput.setAttribute('type', 'text');
        questionInput.setAttribute('placeholder', 'Question');
        questionInput.setAttribute('name', 'question');
    
        // Create textarea for Solution
        let solutionInput = document.createElement('textarea');
        solutionInput.setAttribute('placeholder', 'Solution');
        solutionInput.setAttribute('name', 'solution');
    
        // Create a submit button
        let submitButton = document.createElement('button');
        submitButton.setAttribute('type', 'submit');
        submitButton.textContent = 'Add FAQ';
    
        // Append inputs and button to the form
        form.appendChild(classificationInput);
        form.appendChild(questionInput);
        form.appendChild(solutionInput);
        form.appendChild(submitButton);
    
        // Append the form to content_elem
        this.content_elem.appendChild(form);
    
        // Handle form submission
        form.onsubmit = async (e) => {
            e.preventDefault(); // Prevent default form submission behavior
    
            let faq = {
                classification: classificationInput.value,
                question: questionInput.value,
                solution: solutionInput.value
            };
    
            // Call the addFaq function from Service
            try {
                let response = await this.addFaq(faq);
                window.alert('new FAQ is added')
                // TODO: clean the field
                // TODO: alert only if the status == 200
                console.log(response); // Handle the response as needed
            } catch (error) {
                console.error('Error adding FAQ:', error);
            }
        };
    }

    async addFaq(faq){
        let url = origin + '/add-faq';
        try {
            const response = await Service.postData(url, faq);
            return response; // The response from the server
        } catch (error) {
            console.error('Error adding FAQ:', error);
        }

    }

    async setContent(){
        let url = origin + '/get-all-faqs'
        const response = await fetch(url)
        const faqs = await response.json()
        emptyDOM(this.content_elem)

        var prompt_dom = createDOM(
            `
            <h1>
            Please check FAQs to most common questions!
            <br>
            <br>
            </h1>
            `
        )

        this.content_elem.appendChild(prompt_dom)

        // Clear the content element first
        // this.content_elem.innerHTML = '';
        
        // Group faqs by classification
        const faqsByClassification = faqs.reduce((acc, faq) => {
            if (!acc[faq.classification]) acc[faq.classification] = [];
            acc[faq.classification].push(faq);
            return acc;
        }, {});

        // Create HTML for each classification
        Object.entries(faqsByClassification).forEach(([classification, faqs]) => {
            // Create the classification element
            let classificationElem = document.createElement('div');
            classificationElem.textContent = classification;
            classificationElem.classList.add('classification');

            // Add click event listener for classification
            classificationElem.addEventListener('click', () => {
                // Toggle the display of the FAQ questions under this classification
                const isVisible = classificationElem.classList.contains('expanded');
                classificationElem.classList.toggle('expanded', !isVisible);
                questionContainer.style.display = isVisible ? 'none' : 'block';
            });

            // Create a container for the questions
            let questionContainer = document.createElement('div');
            questionContainer.style.display = 'none'; // Start with it not displayed

            // Create HTML for each question under this classification
            faqs.forEach(faq => {
                let questionElem = document.createElement('div');
                questionElem.textContent = 'Q: ' + faq.question;
                questionElem.classList.add('question');

                // Add click event listener for question
                questionElem.addEventListener('click', () => {
                    // Toggle the display of the solution
                    const isVisible = solutionElem.style.display === 'block';
                    solutionElem.style.display = isVisible ? 'none' : 'block';
                });

                // Create the solution element
                let solutionElem = document.createElement('div');
                solutionElem.textContent = 'A: ' + faq.solution;
                solutionElem.style.display = 'none'; // Start with it not displayed
                solutionElem.classList.add('solution');

                // Append the question and solution elements
                questionContainer.appendChild(questionElem);
                questionContainer.appendChild(solutionElem);
            });

            // Append the classification and its questions container
            this.content_elem.appendChild(classificationElem);
            this.content_elem.appendChild(questionContainer);
        });
    }
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
                `
                    <tr>
                        <th><a href="#inprogress/${ticket.id}">${ticket.id}</a></th>
                        <th><a href="#analysis">${Service.retrieveStaffNamesByIds(JSON.parse(ticket.staff))}</a></th>
                        <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                    </tr>
                
                `
            )
        }else if (mode == 'completed'){
            console.log('names: ', JSON.parse(ticket.staff))
            var newList = createDOM(
                // Set tickets in format
                // id | pick up time | complete time
                `
                    <tr>
                        <th><a href="#completed/${ticket.id}">${ticket.id}</a></th>
                        <th><a href="#analysis">${Service.retrieveStaffNamesByIds(JSON.parse(ticket.staff))}</a></th>
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
            console.log('here')
            // Parse the completed tickets JSON string into an array
            const completedTickets = JSON.parse(staff.completed_tickets);

            // console.log(completedTickets)
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
            total_time += ticket.hours;
            total_time += (ticket.complete_time - ticket.pickup_time)
        })
        
        // Return the count of such filtered tickets
        return {
            count: filteredTickets.length,
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

    async setupIndividualControl(){
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

        this.control_elem.appendChild(
            createDOM(statusSwitchButton)
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
                console.log('name: ', this.select_name)

                this.setupContent(this.select_name)
            }
        })

        //Switch Status of a staff
        
        this.status_switch_button_elem = this.control_elem.querySelector('#switch-button')
        
        this.status_switch_button_elem.addEventListener('click', () => {
            const selectElement = this.dropBarElement.querySelector('select');
            this.select_name = selectElement.value;
        
            let staffInfo = staff_list.find(staff => staff.name === this.select_name);
            
            let status = !staffInfo.status;

            let url = `${window.location.origin}/change-status/${staffInfo.id}/status`;
            const data = { status: status };
        
            console.log('data: ', data)
            Service.patchData(url, data)
            .then(data => {
                console.log('updated status: ', data); // JSON data parsed by `response.json()` call
                
                window.alert(this.select_name + "'s status is updated to " + status)
            })
            .catch((error) => {
                console.log('Error:', error);
            });
        });
    }

    setupGeneralReport(){
        // TODO: 
        // console.log('staff_list: ', staff_list)

        emptyDOM(this.control_elem)
        

        this.control_elem.appendChild(
            createDOM(datePicker)
        )

        this,this.control_elem.appendChild(
            createDOM(getCSVButton)
        )

        // Download CSV for general descriptions to tickets
        this.download_csv_button_elem = this.control_elem.querySelector('#get-csv-button')
        this.download_csv_button_elem.addEventListener('click', async () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            let data = await this.getTicketsForGeneralReport()

            console.log('data: ', data)

            // TODO: Apr. 3, implement the function
            this.downloadGeneralReportCSV(data)
                // this.setupShopAnalysisContent(this.select_name)
        })

    }

    // TODO: Apr. 3, implement the function
    async downloadGeneralReportCSV(tickets) {
        
        console.log(tickets)
        // Convert data to CSV string
        // let csvContent = 'data:text/csv;charset=utf-8,';
        // Sort tickets by supervisor_name
        tickets.sort((a, b) => a.supervisor_name.localeCompare(b.supervisor_name));
        let csvContent = `ID, Project/Grant Mana, SpeedCgart, Shop, Service By, Description, Price\n`
        
        
        // ticket id, Owner, Officer Room, Email, Phone#, Speed Chart, Supervisor Name, Service Type, Manufacturer, Open Time, Close Time, Note, Staff Working on this Ticket\n`;
      
        
        tickets.forEach(data => {
            // let open_date = new Date(data.open_time).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }, {
            //     month: 'numeric',
            //     day: 'numeric',
            //     year: 'numeric'
            // })

            // let close_date = new Date(data.close_time).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }, {
            //     month: 'numeric',
            //     day: 'numeric',
            //     year: 'numeric'
            // })

            let staff_list = ''
            JSON.parse(data['staff']).forEach(each => {
                staff_list += each
                staff_list += '; '
            })    

            csvContent += `${data['id']},${data['supervisor_name']},${data['speed_chart']},${data['service_type']}, ${staff_list},${data['note']},${data['price']}\n`;
          });
        
          // Create a Blob from the CSV string
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          
          // Create a link element for download
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', `general_reports.csv`);
          
          // Append link to the body
          document.body.appendChild(link);
          
          // Programmatically click the link to trigger the download
          link.click();
          
          // Remove the link after download
          document.body.removeChild(link);
    }

    // analysis to shops
    async downloadShopCSV(tickets, shop) {
        
        console.log(tickets)
        // Convert data to CSV string
        // let csvContent = 'data:text/csv;charset=utf-8,';
        let csvContent = `ticket id, Owner, Officer Room, Email, Phone#, Speed Chart, Supervisor Name, Service Type, Manufacturer, Open Time, Close Time, Note, Staff Working on this Ticket\n`;
      
        
        tickets.forEach(data => {
            let open_date = new Date(data.open_time).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }, {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            })

            let close_date = new Date(data.close_time).toLocaleDateString('en-US', { timeZone: 'America/Los_Angeles' }, {
                month: 'numeric',
                day: 'numeric',
                year: 'numeric'
            })

            
            let staff_string = "";
            try {
                JSON.parse(data.staff).forEach(each => {
                    console.log("staff: ", each);
                    let staff_info = staff_list.find(staff => staff.id.toString() === each);
                    console.log("staff info: ", staff_info);
                    if (staff_info) staff_string += staff_info.name + ", ";
                });
            } catch (e) {
                console.error("Error parsing staff information", e);
            }
                

            csvContent += `${data['id']},${data['customer_name']},${data['office_num']},${data['email']},${data['phone_num']},${data['speed_chart']}, ${data.supervisor_name}, ${data.service_type}, ${data.manufacturer}, ${open_date}, ${close_date}, ${data.note}, ${staff_string}\n`;
          });
        
          // Create a Blob from the CSV string
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          
          // Create a link element for download
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', `ticket_${shop}.csv`);
          
          // Append link to the body
          document.body.appendChild(link);
          
          // Programmatically click the link to trigger the download
          link.click();
          
          // Remove the link after download
          document.body.removeChild(link);
    }

    async downloadInvoiceCSV() {
        let csvContent = `Shop Name,SpeedChart,Amount,Charges,Project/Grant Manager\n`;
    
        // Step 1: Initialize an empty object for aggregation
        let aggregation = {};
    
        for (let ticket of this.uniqueTicketIdsList) {
            let url = `${origin}/request/invoice/${ticket}`;
    
            try {
                const response = await fetch(url);
                const data = await response.json(); // Assuming the data structure is as described
                console.log("Response data for ticket", ticket, ":", data);
    
                // Process the data
                let partsAndCosts = JSON.parse(data.ticket.parts_and_costs);
                let amount = partsAndCosts.reduce((acc, item) => acc + (item.partQuantity * item.partPrice), 0);
                let laborCost = data.ticket.hours * data.ticket.rate;
                amount += laborCost; // Total amount including parts and labor
    
                let shopName = data.ticket.service_type; // Assuming this represents the shop name
                let speedChart = data.ticket.speed_chart;
                let projectManager = data.ticket.supervisor_name;
    
                // Step 2: Aggregate amounts for the same Shop Name and SpeedChart
                let key = `${shopName}_${speedChart}`; // Create a unique key for aggregation
                if (!aggregation[key]) {
                    aggregation[key] = { shopName, speedChart, amount, projectManager };
                } else {
                    aggregation[key].amount += amount; // Accumulate the amount
                }
    
            } catch (error) {
                console.error("Error fetching or processing data for ticket: ", ticket, error);
            }
        }
    
        // Step 3: Build the CSV content from the aggregation object
        Object.values(aggregation).forEach(({ shopName, speedChart, amount, projectManager }) => {
            csvContent += `${shopName},${speedChart},${amount},Parts/Labour,${projectManager}\n`;
        });
    
        // Continue to Blob creation and downloading part...
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
        // Create a link element for download
        const link = document.createElement('a');
        link.setAttribute('href', URL.createObjectURL(blob));
        link.setAttribute('download', `invoice.csv`);
    
        // Append link to the body
        document.body.appendChild(link);
    
        // Programmatically click the link to trigger the download
        link.click();
    
        // Remove the link after download
        document.body.removeChild(link);
    }
    
    async downloadGeneralCSV() {
        let csvContent = "Supervisor,SpeedChart,Shop,Quantity,Unit Price,Labor Hours,Hour Rate,Total Price\n";
        let aggregation = {};
    
        for (let ticket of this.uniqueTicketIdsList) {
            let url = `${origin}/request/invoice/${ticket}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                let partsAndCosts = JSON.parse(data.ticket.parts_and_costs);
                let totalPartsCost = partsAndCosts.reduce((acc, {partQuantity, partPrice}) => acc + (partQuantity * partPrice), 0);
                let laborCost = data.ticket.hours * data.ticket.rate;
                let totalAmount = totalPartsCost + laborCost;
                
                let shopName = data.ticket.service_type;
                let speedChart = data.ticket.speed_chart;
                let supervisor = data.ticket.supervisor_name;
    
                // Unique key based on speed chart and shop
                let key = `${speedChart}_${shopName}`;
                if (!aggregation[key]) {
                    aggregation[key] = { supervisor, speedChart, shopName, tickets: [] };
                }
                // Aggregate ticket details
                aggregation[key].tickets.push({
                    quantity: partsAndCosts.length, // Assuming one part per ticket for simplicity
                    unitPrice: totalPartsCost / partsAndCosts.length, // Average unit price
                    laborHours: data.ticket.hours,
                    hourRate: data.ticket.rate,
                    totalPrice: totalAmount
                });
            } catch (error) {
                console.error("Error fetching or processing data for ticket: ", ticket, error);
            }
        }
    
        // Build the CSV from the aggregated data
        Object.values(aggregation).forEach(({ supervisor, speedChart, shopName, tickets }) => {
            tickets.forEach(({ quantity, unitPrice, laborHours, hourRate, totalPrice }) => {
                csvContent += `${supervisor},${speedChart},${shopName},${quantity},${unitPrice.toFixed(2)},${laborHours},${hourRate.toFixed(2)},${totalPrice.toFixed(2)}\n`;
            });
        });
    
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "invoice.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    


    async setupShopControl(){
        emptyDOM(this.control_elem)
        
        let shop_list = [...new Set(staff_list.map(member => member.shop))];
        
        // Update dropbar with all staff's name
        const updatedDropBar = this.updateDropdownOptions(dropBar, shop_list)
        
        this.control_elem.appendChild(updatedDropBar)

        this.control_elem.appendChild(
            createDOM(datePicker)
        )

        this.control_elem.appendChild(
            createDOM(confirmButton)
        )

        this,this.control_elem.appendChild(
            createDOM(getCSVButton)
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


                this.setupShopAnalysisContent(this.select_name)
            }
        })

        // Download CSV for general descriptions to tickets
        this.download_csv_button_elem = this.control_elem.querySelector('#get-csv-button')
        this.download_csv_button_elem.addEventListener('click', async () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            if(this.dropBarElement){
                const selectElement = this.dropBarElement.querySelector('select');
                this.select_name = selectElement.value

                console.log('shop: ', this.select_name)

                let data = await this.getTicketsInfo(this.select_name)

                console.log('data: ', data)

                this.downloadShopCSV(data, this.select_name)
                // this.setupShopAnalysisContent(this.select_name)
            }
        })
    }

    async setupGeneralInvoiceControl(){
        emptyDOM(this.control_elem)

        this.control_elem.appendChild(
            createDOM(datePicker)
        )

        this.control_elem.appendChild(
            createDOM(confirmButton)
        )

        this.control_elem.appendChild(
            createDOM(getInvoiceCSVButton)
        )

        this.control_elem.appendChild(
            createDOM(getGeneralReportCSVButton)
        )

        // Confirm with the choice
        this.ticket_confirm_button_elem = this.control_elem.querySelector('#confirm-button')
        this.ticket_confirm_button_elem.addEventListener('click', () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            this.setupGeneralAnalysisContent()
        })

        // Download Invocie CSV
        this.download_csv_button_elem = this.control_elem.querySelector('#get-invoice-csv-button')
        this.download_csv_button_elem.addEventListener('click', async () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            this.downloadInvoiceCSV()
        })


        // Download General CSV
        this.download_csv_button_elem = this.control_elem.querySelector('#get-general-csv-button')
        this.download_csv_button_elem.addEventListener('click', async () => {
            this.logStartAndEndDates()

            if (this.startDateEpoch == null || this.endDateEpoch == null) {
                window.alert('Please select both start and end dates before confirming.');
                return; // Stop the function from proceeding further
            }

            this.downloadGeneralCSV()
        })
    }

    async setupContent(select_name){
        const staffInfo = staff_list.find(staff => staff.name === select_name);
        const shop_name = staffInfo ? staffInfo.shop : 'Not found';

        console.log('staff list: ', staff_list)

        var completed_tickets_list = this.findCompletedTickets(staff_list, select_name)
        var in_progress_tickets_list = this.findInProgressTickets(staff_list, select_name)

        var in_progress_count = this.countInProgressTicketsInRange(in_progress_tickets_list, this.startDateEpoch, this.endDateEpoch)


        var results = this.countCompletedTicketsInRange(completed_tickets_list, this.startDateEpoch, this.endDateEpoch)
        var completed_count = results.count

        const analysisContent = `
        <div>
            <div><strong>Shop:</strong> <span id="shop-name">${shop_name}</span></div>
            <div><strong># Tickets in progress:</strong> <span id="tickets-in-progress">${in_progress_count}</span></div>
            <div><strong># Tickets completed:</strong> <span id="tickets-completed">${completed_count}</span></div>
        </div>
        `;

        // Convert the string to an HTML element
        const contentElement = createDOM(analysisContent);

        // Empty the content element before appending new content
        emptyDOM(this.content_elem);

        // Append the new content
        this.content_elem.appendChild(contentElement);

    }

    async setupShopAnalysisContent(shop_name) {
        console.log('staff list: ', staff_list);
    
        // Filter staff_list for members in the given shop
        const staffInShop = staff_list.filter(staff => staff.shop === shop_name);
    
        let in_progress_count = 0;
        let completed_count = 0;
    
        // Use Sets to track unique ticket IDs
        const countedInProgressTickets = new Set();
        const countedCompletedTickets = new Set();
    
        // Iterate through each staff member in the shop
        for (const staff of staffInShop) {
            const completed_tickets_list = this.findCompletedTickets(staff_list, staff.name);
            const in_progress_tickets_list = this.findInProgressTickets(staff_list, staff.name);
    
            // Filter tickets to only count those not already counted
            const uniqueInProgress = in_progress_tickets_list.filter(ticket => !countedInProgressTickets.has(ticket.id));
            const uniqueCompleted = completed_tickets_list.filter(ticket => !countedCompletedTickets.has(ticket.id));
    
            // Update counts
            in_progress_count += this.countInProgressTicketsInRange(uniqueInProgress, this.startDateEpoch, this.endDateEpoch);
            const results = this.countCompletedTicketsInRange(uniqueCompleted, this.startDateEpoch, this.endDateEpoch);
            completed_count += results.count;
    
            // Add the IDs of the newly counted tickets to the Sets
            uniqueInProgress.forEach(ticket => countedInProgressTickets.add(ticket.id));
            uniqueCompleted.forEach(ticket => countedCompletedTickets.add(ticket.id));
        }
    
        const analysisContent = `
        <div>
            <div><strong>Shop:</strong> <span id="shop-name">${shop_name}</span></div>
            <div><strong># Tickets in progress:</strong> <span id="tickets-in-progress">${in_progress_count}</span></div>
            <div><strong># Tickets completed:</strong> <span id="tickets-completed">${completed_count}</span></div>
        </div>
        `;
    
        // Convert the string to an HTML element
        // Assuming createDOM and emptyDOM are defined elsewhere in your code
        const contentElement = createDOM(analysisContent);
    
        // Empty the content element before appending new content
        emptyDOM(this.content_elem);
    
        // Append the new content
        this.content_elem.appendChild(contentElement);
    }

    async setupGeneralAnalysisContent() {
        console.log('staff list: ', staff_list);
    
        // Use Sets to track unique ticket IDs
        let countedCompletedTickets = new Set();
    
        // Iterate through each staff member in the shop
        for (let staff of staff_list) {
            const completed_tickets_list = this.findCompletedTickets(staff_list, staff.name);
    
            // Filter tickets to only count those not already counted
            const uniqueCompleted = completed_tickets_list.filter(ticket => !countedCompletedTickets.has(ticket.id));
    
            // Add the IDs of the newly counted tickets to the Sets
            uniqueCompleted.forEach(ticket => countedCompletedTickets.add(ticket.ticket_id));

            console.log('uniqueCompleted: ', uniqueCompleted)
        }

        // TODO: store unique ticket id to a list
        this.uniqueTicketIdsList = Array.from(countedCompletedTickets);
        console.log('Unique Ticket IDs List: ', this.uniqueTicketIdsList);
    





        const analysisContent = `
        <div>
            <div><strong># Tickets completed:</strong> <span id="tickets-completed">${this.uniqueTicketIdsList.length}</span></div>
        </div>
        `;
    
        // Convert the string to an HTML element
        // Assuming createDOM and emptyDOM are defined elsewhere in your code
        const contentElement = createDOM(analysisContent);
    
        // Empty the content element before appending new content
        emptyDOM(this.content_elem);
    
        // Append the new content
        this.content_elem.appendChild(contentElement);
    }
    
    

    async getTicketsInfo(shop){
        let url = origin + '/requests/condition?service_type=' + shop + '&start_time=' + this.startDateEpoch + '&end_time=' + this.endDateEpoch

        console.log(url)
        const ticketsListResponse = await fetch(url)
        const ticketsListData = await ticketsListResponse.json()

        console.log('ticket list data: ', ticketsListData)

        return ticketsListData.data
    }

    //
    async getTicketsForGeneralReport(){
        let url = origin + '/request/general_report/' 
        // + this.startDateEpoch + '&end_time=' + this.endDateEpoch

        console.log(url)
        const ticketsListResponse = await fetch(url)
        const ticketsListData = await ticketsListResponse.json()

        console.log('ticket list data: ', ticketsListData)

        return ticketsListData.data
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

    async getTicketData(ticketId) {
        try {
            var url = origin + `/get_processed_ticket/${this.id}`
            // Call the '/get_processed_ticket/:id' endpoint
            const processedTicketResponse = await fetch(url);
            const processedTicketData = await processedTicketResponse.json();
            
            url = origin + `/form/retrieve/id/${this.id}`
            // Call the '/form/retrieve/id/:id' endpoint
            const retrieveFormResponse = await fetch(url);
            const retrieveFormData = await retrieveFormResponse.json();
            
            // Now you have both data objects and you can use them as needed
            // Log them to the console to check
            console.log('Processed Ticket Data:', processedTicketData);
            console.log('Retrieved Form Data:', retrieveFormData);
    
            // Use the data here to create the CSV or to do any other processing

            let labol_cost = processedTicketData.hours * processedTicketData.rate
            let parts = JSON.parse(processedTicketData.parts_and_costs)
            let parts_cost = 0
            
            parts.forEach(part => {
                parts_cost += part.partPrice * part.partQuantity
            })

            const data = {
                'ticket id': this.id,
                'client type': processedTicketData.client_type,
                'research/teaching': processedTicketData.research_or_teach,
                'maintenance/new equipment': processedTicketData.type,
                'labor cost': labol_cost,
                'part cost': parts_cost,
                'total cost': labol_cost + parts_cost,
                'labor hours': processedTicketData.hours,
                'labor hours rate': processedTicketData.rate,
                'parts': JSON.parse(processedTicketData.parts_and_costs)
            }
    
            console.log('data: ', data)
            return data
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    

    async downloadIndividualTicketCSV() {
        var data = await this.getTicketData()

          
        // Convert data to CSV string
        // let csvContent = 'data:text/csv;charset=utf-8,';
        let csvContent = `ticket id,client type,research/teaching,maintenance/new equipment,labor cost,part cost,total cost\n`;
        csvContent += `${data['ticket id']}, ${data['client type']}, ${data['research/teaching']},${data['maintenance/new equipment']},${data['labor cost']},${data['part cost']},${data['total cost']}\n`;

        csvContent += `\n`

        csvContent += `labor hours,labor hours rate\n`;
        csvContent += `${data['labor hours']},${data['labor hours rate']}\n`;

        csvContent += `\n`

        csvContent += `part,quantity,unit price\n`;
      
        data.parts.forEach(part => {
            csvContent += `${part.part},${part.partQuantity},${part.partPrice}\n`;
          });
        
          // Create a Blob from the CSV string
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          
          // Create a link element for download
          const link = document.createElement('a');
          link.setAttribute('href', URL.createObjectURL(blob));
          link.setAttribute('download', `ticket_${this.id}.csv`);
          
          // Append link to the body
          document.body.appendChild(link);
          
          // Programmatically click the link to trigger the download
          link.click();
          
          // Remove the link after download
          document.body.removeChild(link);
    }

}




async function main(){
    var analysisView = new AnalysisView()
    // await analysisView.findAllStaff() // find all staffs and their info and store them in a local buffer
    await Service.findAllStaff()
    console.log('staff list: ', staff_list)


    var ticketView = new TicketView()
    var faqView = new FAQView()
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
            analysisView.setupIndividualControl()
        }

        else if (url == '#analysis-shops'){
            analysisView.setContent()
            analysisView.setupShopControl()
            
        }

        else if (url == '#analysis-general-report'){
            analysisView.setContent()
            analysisView.setupGeneralReport()
        }

        else if (url == '#analysis-to-finance-team'){
            analysisView.setContent()
            analysisView.setupGeneralInvoiceControl()
        }


        else if (url == '#faq'){
            faqView.setContent()
        }else if (url == '#add-faq'){
            faqView.setAddFAQPrompt()
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
        
        else if (url.match(complete_ticket_id_pattern)){
            formView.id = complete_ticket_id
            console.log('completed id: ', complete_ticket_id)

            formView.downloadIndividualTicketCSV()
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