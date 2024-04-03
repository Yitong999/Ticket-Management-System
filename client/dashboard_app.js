
// const btnEl = document.getElementById('btn')
origin = window.location.origin

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

    // postData: async function (url = '', data = {}) {
    //     // Default options are marked with *
    //     const response = await fetch(url, {
    //         method: 'POST', // *GET, POST, PUT, DELETE, etc.
    //         mode: 'cors', // no-cors, *cors, same-origin
    //         cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    //         credentials: 'same-origin', // include, *same-origin, omit
    //         headers: {
    //             'Content-Type': 'application/json'
    //             // 'Content-Type': 'application/x-www-form-urlencoded',
    //         },
    //         redirect: 'follow', // manual, *follow, error
    //         referrerPolicy: 'no-referrer', // no-referrer, *client
    //         body: JSON.stringify(data) // body data type must match "Content-Type" header
    //         // body: data
    //     });
    //     const contentType = response.headers.get("content-type");
    //     if (contentType && contentType.includes("application/json")) {
    //         return response.json(); // Parses JSON response
    //     } else {
    //         return response.text(); // Returns text response
    //     }
    // },

    // putData: async function (url = '', data = {}) {
    //     const response = await fetch(url, {
    //         method: 'PUT', // Change method to PUT
    //         mode: 'cors',
    //         cache: 'no-cache',
    //         credentials: 'same-origin',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         redirect: 'follow',
    //         referrerPolicy: 'no-referrer',
    //         body: JSON.stringify(data)
    //     });
    //     const contentType = response.headers.get("content-type");
    //     if (contentType && contentType.includes("application/json")) {
    //         return response.json(); // Parses JSON response
    //     } else {
    //         return response.text(); // Returns text response
    //     }
    // },

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
            return { status: response.status, data: await response.json() }; // Parses JSON response and includes status
        } else {
            return { status: response.status, data: await response.text() }; // Returns text response and includes status
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
            return { status: response.status, data: await response.json() }; // Parses JSON response and includes status
        } else {
            return { status: response.status, data: await response.text() }; // Returns text response and includes status
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

const processedTicketHTML = `
    <div>

    <form>
        <table id="processed_table">
        client-type
            <tr>
                <td>Client Type</td>
                <td>
                <select name="client-type" required>
                    <option value="ubc-chem-exempt">UBC Chem Exempt</option>
                    <option value="ubc-chem">UBC Chem</option>
                    <option value="ubc-non-chem">UBC Non Chem</option>
                    <option value="non-ubc">Non UBC</option>
                </select>
                </td>
            </tr>
            <tr>
                <td>Hours *</td>
                <td><input type="number" step="0.01" name="number-hours"></td>
            </tr>
            <tr>
                <td>rate</td>
                <td><input type="number" step="0.01" name="rate"></td>
            </tr>
            <tr>
                <td>research/teaching</td>
                <td>
                <select name="research-or-teach" required>
                    <option value="research">Research</option>
                    <option value="teaching">Teaching</option>
                </select>
                </td>
            </tr>

            <tr>
                <td>new equipment/maintenance</td>
                <td>
                <select name="new-or-maintenance" required>
                    <option value="new equipment">New Quipment</option>
                    <option value="maintenance">Maintenance</option>
                </select>
                </td>
            </tr>

            
        </table>
    </form>

    <button id="add_field">Add</button>

    </div>
`

const summaryTicketHTML = `
    <form>

        <table id="table_summary">
            <tr>
                <td>totol hours cost</td>
                <td> </td>
            </tr>
            <tr>
                <td>totol parts cost</td>
                <td> </td>
            </tr>
            <tr>
                <td>totol cost</td>
                <td> </td>
            </tr>
    </form>
`



// Pick up button
const formPickHTML = 
`
<div class="search-row">
    <button type="button" id="form-pick-button">Pick</button>
</div>
`

// Close ticket button
const formCloseHTML = 
`
<div class="search-row">
    <button type="button" id="form-close-button">Close</button>
</div>
`

// Save ticket button
const formSaveButtonHTML = 
`
<div class="search-row">
    <button type="button" id="form-save-button">Save</button>
</div>
`

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


const formReassignButtonHTML = 
`
<button type="button" id="form-reassign-button">Share</button>
`

class FAQView{
    constructor(){
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')

        this.classifications = []
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

    // Fetch classifications from the /get-all-faqs API
    async fetchClassifications() {
        try {
            let url = origin + '/get-all-faqs'
            const response = await fetch(url);
            const faqs = await response.json();
            // Extract unique classifications
            const classifications = [...new Set(faqs.map(faq => faq.classification))];
            // Update the this.classifications property
            this.classifications = classifications;
            console.log('Classifications updated:', this.classifications);
        } catch (error) {
            console.error('Error fetching classifications:', error);
        }
    }
    
    setAddFAQPrompt(){
        emptyDOM(this.content_elem);
    
        // Create a form
        let form = document.createElement('form');
        form.setAttribute('id', 'addFaqForm');
    
        // Create dropdown for Classification
        let classificationSelect = document.createElement('select');
        classificationSelect.setAttribute('id', 'classificationSelect');
        classificationSelect.setAttribute('name', 'classification');

        this.classifications.forEach(classification => {
            let option = document.createElement('option');
            option.value = classification;
            option.textContent = classification;
            classificationSelect.appendChild(option);
        });
    
        // Option for custom classification
        let customOption = document.createElement('option');
        customOption.value = "custom";
        customOption.textContent = "Other (Please specify)";
        classificationSelect.appendChild(customOption);
    
        // Input for custom or unlisted Classification
        let classificationInput = document.createElement('input');
        classificationInput.setAttribute('type', 'text');
        classificationInput.setAttribute('id', 'customClassification');
        classificationInput.setAttribute('name', 'customClassification');
        classificationInput.setAttribute('placeholder', 'Enter classification');
        classificationInput.style.display = 'none'; // Initially hide this input
    
        // Event listener to toggle custom classification input
        classificationSelect.onchange = function() {
            if (this.value === "custom") {
                classificationInput.style.display = 'block';
            } else {
                classificationInput.style.display = 'none';
            }
        };
    
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
    
        // Append inputs, dropdown, and button to the form
        form.appendChild(classificationSelect);
        form.appendChild(classificationInput); // Append custom input for classification
        form.appendChild(questionInput);
        form.appendChild(solutionInput);
        form.appendChild(submitButton);
    
        // Append the form to content_elem
        this.content_elem.appendChild(form);
    
        // Handle form submission
        form.onsubmit = async (e) => {
            e.preventDefault(); // Prevent default form submission behavior
    
            // Determine the classification: use the dropdown's value unless it's set to custom, in which case use the input's value
            let classification = classificationSelect.value !== "custom" ? classificationSelect.value : classificationInput.value;
    
            let faq = {
                classification: classification,
                question: questionInput.value,
                solution: solutionInput.value
            };
    
            // Call the addFaq function from Service
            try {
                let response = await this.addFaq(faq);
                if (response && response.status == 201) { // Assuming the response includes an ok property to indicate success
                    window.alert('New FAQ is added');
                    // Optionally, reset the form or specific fields here
                    form.reset();
                    classificationInput.style.display = 'none'; // Hide custom input again
                } else {
                    // Handle failure
                    window.alert('Failed to add the FAQ. Please try again.');
                }
            } catch (error) {
                console.error('Error adding FAQ:', error);
                window.alert('An error occurred. Please try again.');
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

class UserView{
    constructor(user){
        this.menu_elem
        this.user = user
        this.title = document.querySelector('h1')
    }

    setName(){
        console.log(this.user)
        
        this.title.textContent = "Hi, " + this.user['name']

        console.log('role: ', this.user.role)
        if (this.user.role === 'supervisor') {
            this.addSupervisorButton();
        }
    }

    addSupervisorButton() {
        let button = document.createElement("button");
        button.textContent = "Supervisor Dashboard";
        button.className = "btn btn-primary"; // Assuming you're using a framework like Bootstrap
        button.onclick = function() {
            window.location.href = origin + "/supervisor_dashboard#analysis";
        };

        // Select the <h1> element
        const title = document.querySelector('h1');

        // Append the button next to the <h1> element
        if (title) {
            title.insertAdjacentElement('afterend', button);
        }
    }
}

class TicketView{
    constructor(){
        this.content_elem = document.querySelector('div.content')
        this.control_elem = document.querySelector('div.page-control')
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
    setMyInProgressTitle(){
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
                <th>pick up time</th>
            </tr>
            
            `
        ) 

        list_elem.appendChild(newList)
    }

    // Set title of 
    // id | pick up time | completed time
    setMyCompletedTitle(){
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
                        <th><a href="#mine-inprogress/${ticket.ticket_id}">${ticket.ticket_id}</a></th>
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
                        <th><a href="#mine-completed/${ticket.ticket_id}">${ticket.ticket_id}</a></th>
                        <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                        <th>${new Date(ticket.complete_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
                    </tr>
                
                `
            )
        }

        list_elem.appendChild(newList)
    }


    // setMyInProgressTicket(ticket, mode){
    //     var list_elem = this.content_elem.querySelector('table.ticket-list')

    //     if (mode == 'not-assigned'){
    //         var newList = createDOM(
    //             `
                
    //                 <tr>
    //                     <th><a href="#ticket/${ticket.id}">${ticket.id}</a></th>
    //                     <th>${ticket.service_type}</th>
    //                     <th>${new Date(ticket.open_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
    //                 </tr>
                
    //             `
    //         )
    //     }

    //     else if (mode == 'inprogress'){
    //         var newList = createDOM(
    //             `
    //                 <tr>
    //                     <th><a href="#mine-inprogress/${ticket.ticket_id}">${ticket.ticket_id}</a></th>
    //                     <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
    //                 </tr>
                
    //             `
    //         )
    //     }else if (mode == 'completed'){
    //         var newList = createDOM(
    //             `
    //                 <tr>
    //                     <th><a href="#mine-completed/${ticket.ticket_id}">${ticket.ticket_id}</a></th>
    //                     <th>${new Date(ticket.pickup_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
    //                     <th>${new Date(ticket.complete_time).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</th>
    //                 </tr>
                
    //             `
    //         )
    //     }

    //     list_elem.appendChild(newList)
    // }


    async setAllTickets(){
        var url = origin + '/tickets/all_open'
        
        console.log(url)

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


    async setMyInprogressTickets(id){
        try{
            var url = origin + '/tickets/myinprogress/' + id
            console.log(url)

            const response = await fetch(url)
            const tickets_list_json = await response.json()

            // const tickets_list = tickets_list_json.in_progress_tickets
            console.log(tickets_list_json)

            const tickets_list = JSON.parse(tickets_list_json.in_progress_tickets)
            console.log(tickets_list)
            console.log(tickets_list.length)
            this.setMyInProgressTitle()

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

    async setMyCompletedTickets(id){
        try{
            var url = origin + '/tickets/mycompleted/' + id
            console.log(url)

            const response = await fetch(url)
            const tickets_list_json = await response.json()

            // const tickets_list = tickets_list_json.in_progress_tickets
            console.log(tickets_list_json)

            const tickets_list = JSON.parse(tickets_list_json.completed_tickets)
            console.log(tickets_list)
            console.log(tickets_list.length)
            this.setMyCompletedTitle()

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

    

    async displayFilled(id, isPicked, isCompleted){
        emptyDOM(this.content_elem)
        var form_dom = createDOM(formHTML)
        this.content_elem.appendChild(form_dom)

        let url = origin + '/form/retrieve/id/' + id
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


        if (isPicked == true){ // The ticket is picked, render processed info
            this.content_elem.appendChild(createDOM(processedTicketHTML))
            const table = this.content_elem.querySelector('#processed_table tbody');

            url = origin + '/get_processed_ticket/' + id

            try{
                const processed_response = await fetch(url)
                if (processed_response.status === 404) {
                    // If the response is a 404, do nothing
                    console.log('Ticket not found, doing nothing.');

                    var parts_and_costs = []
                    var research_or_teach = null

                    table.querySelector('select[name="client-type"]').value = null
                    table.querySelector('input[name="number-hours"]').value = null
                    table.querySelector('input[name="rate"]').value = null
                    table.querySelector('select[name="research-or-teach"]').value = null
                    table.querySelector('select[name="new-or-maintenance"]').value = null
                    
                } else if (processed_response.status == 200){
                    const processed_ticket = await processed_response.json()

                    console.log(processed_ticket)

                    var parts_and_costs = JSON.parse(processed_ticket.parts_and_costs)

                    var research_or_teach = processed_ticket.research_or_teach
                    console.log(research_or_teach)

                    table.querySelector('select[name="client-type"]').value = processed_ticket.client_type
                    table.querySelector('input[name="number-hours"]').value = processed_ticket.hours
                    table.querySelector('input[name="rate"]').value = processed_ticket.rate
                    table.querySelector('select[name="research-or-teach"]').value = processed_ticket.research_or_teach
                    table.querySelector('select[name="new-or-maintenance"]').value = processed_ticket.type





                    let num_of_parts = parts_and_costs.length

                    table.append(
                        createDOM(
                            `
                            
                            <tr>
                                <td>Part Description</td>
                                <td>Quantity</td>
                                <td>Unit Price</td>
                            </tr>
                            `
                        )
                    )
                    
                    for (let i = 0; i < num_of_parts; i++){

                        const newRow = document.createElement('tr');

                        
                        if (!isCompleted){
                            newRow.innerHTML = `
                            <td><input type="text" placeholder="description" name="part"></td>
                            <td><input type="number" placeholder="quantity" name="quantity"></td>
                            <td><input type="number" placeholder="unit price" name="part_price"></td>
                            <td><button class="remove-btn">Remove</button></td>
                        `
                        } else {
                            newRow.innerHTML = `
                            <td><input type="text" placeholder="description" name="part"></td>
                            <td><input type="number" placeholder="quantity" name="quantity"></td>
                            <td><input type="number" placeholder="unit price" name="part_price"></td>
                        `;
                        }
                        

                        newRow.querySelector('input[name="part"]').value = parts_and_costs[i].part
                        newRow.querySelector('input[name="quantity"]').value = parts_and_costs[i].partQuantity
                        newRow.querySelector('input[name="part_price"]').value = parts_and_costs[i].partPrice

                        let removeBtn = newRow.querySelector('.remove-btn');
                        removeBtn.addEventListener('click', function() {
                            newRow.remove();
                        });

                        table.appendChild(newRow);
                    }

                    // Append the new row to the table
                    table.appendChild(newRow);

                }
            } catch (error){
                console.error('Network error')
            }
        

            if (isCompleted == true){
                table.querySelector('input[name="number-hours"]').setAttribute('readonly', true); 
                table.querySelector('input[name="rate"]').setAttribute('readonly', true); 
                table.querySelector('select[name="research-or-teach"]').setAttribute('disabled', true); 
                table.querySelector('select[name="new-or-maintenance"]').setAttribute('disabled', true); 
               
                var hours_cost = 0
                var parts_cost = 0
            
                hours_cost += table.querySelector('input[name="number-hours"]').value * table.querySelector('input[name="rate"]').value

                let num_of_parts = parts_and_costs.length

                table.append(
                    createDOM(
                        `
                        
                        <tr>
                            <td>Part Description</td>
                            <td>Quantity</td>
                            <td>Unit Price</td>
                        </tr>
                        `
                    )
                )
                for (let i = 0; i < num_of_parts; i++){
                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `
                        <td><input type="text" placeholder="description" name="part"></td>
                        <td><input type="number" placeholder="quantity" name="quantity"></td>
                        <td><input type="number" placeholder="unit price" name="part_price"></td>
                    `;

                    newRow.querySelector('input[name="part"]').value = parts_and_costs[i].part
                    newRow.querySelector('input[name="quantity"]').value = parts_and_costs[i].partQuantity
                    newRow.querySelector('input[name="part_price"]').value = parts_and_costs[i].partPrice

                    parts_cost += parts_and_costs[i].partPrice * parts_and_costs[i].partQuantity

                    if (isCompleted){
                        newRow.querySelector('input[name="part"]').setAttribute('readonly', true); 
                        newRow.querySelector('input[name="part_price"]').setAttribute('readonly', true); 
                    }
                    table.appendChild(newRow);
                }
                console.log('number of part: ', parts_and_costs.length)

                this.content_elem.appendChild(createDOM(summaryTicketHTML))
                const summary_table = this.content_elem.querySelector('#table_summary');
                const rows = summary_table.querySelectorAll('tr')

            
            var total_cost = hours_cost + parts_cost
            var values = [hours_cost, parts_cost, total_cost]

            rows.forEach((row, index) => {
                if (index < values.length){
                    let cell = row.querySelector('td:nth-child(2)');
                    // Update its text content with the corresponding value
                    cell.textContent = '$' + values[index]
                }
            })

            // Add a Reopen button
            const reopenButton = document.createElement('button');
            reopenButton.textContent = 'Reopen Ticket';
            reopenButton.setAttribute('id', 'reopenButton');
            this.content_elem.appendChild(reopenButton); // Append button to the DOM

            // Event listener for the Reopen button
            reopenButton.addEventListener('click', function() {
                
                let url = origin + '/reopen/' + id
            

                console.log(url)
                // Make an HTTP request to reopen the ticket

                Service.postData(url)
                .then(response => {
                    console.log('status: ', response.status)
                    if (response.status == 200) {
                        return response // Assuming the server response is JSON
                    } else {
                        throw new Error();
                    }
                })
                
            })

        }

            if (isCompleted == false){ // in progress mode
                // Add event listener to the "Add" button
                const addButton = this.content_elem.querySelector('#add_field');
                addButton.addEventListener('click', (event) => {
                    // Your code for what happens when the button is clicked
                    console.log('Add button clicked');

                    const newRow = document.createElement('tr');
                    newRow.innerHTML = `

                        <td><input type="text" placeholder="description" name="part"></td>
                        <td><input type="number" placeholder="quantity" name="quantity"></td>
                        <td><input type="number" placeholder="unit price" name="part_price"></td>
                    `;

                    // Append the new row to the table
                    table.appendChild(newRow);
                });

            }

        } else {
            // TODO: start from here
            console.log('is not picked up')

        }

        if (isCompleted == false){
            
        } else{ // my completed tickets
            console.log('is completed')
            // Get the "Add" button by its ID and remove it
            var addButton = document.getElementById('add_field');
            if (addButton) {
                addButton.remove();
            }

        }
        
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
            let url = origin + '/tickets/note/' + ticket_id
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
            
        } else{
            let url = origin + '/tickets/note/' + ticket_id
            try{
                const response = await fetch(url)
                const ticket = await response.json()

                console.log('ticket note: ', ticket.note)
                if (ticket.note == '' || ticket.note == null){
                    
                }else{
                    messageBox.value = ticket.note
                }
                
            }catch(err){
                messageBox.value = 'nothing'
            }
        }

        // Append the new textarea to the form
        this.content_elem.appendChild(messageBox);
    }
    
    async displayChatBlock(ticket_id){
        // Message block to let staff can leave some messages to the tickets
        var chatBox = document.createElement('textarea');
        chatBox.id = 'chat';
        chatBox.rows = 5;
        chatBox.cols = 50;

        // Assign note content to messageBox
        var url = origin + '/tickets/chat/' + ticket_id
        try{
            const response = await fetch(url)
            const ticket = await response.json()

            console.log('ticket note: ', ticket.note)
            if (ticket.chat == '' || ticket.chat == null){
                chatBox.value = "You haven't leave any message"
            }else{
                chatBox.value = ticket.chat
            }
            
        }catch(err){
            chatBox.value = 'nothing'
        }
            
        // Append the new textarea to the form
        this.content_elem.appendChild(chatBox);
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

    async setReassignControl(){
        var url = origin + '/staff/all'
        
        let staff_name_list = staff_list.map(member => member.name)
        
        console.log('staff list: ', staff_name_list)
        // Update dropbar with all staff's name
        const updatedDropBar = this.updateDropdownOptions(dropBar, staff_name_list)

        this.control_elem.appendChild(updatedDropBar)

        this.control_elem.appendChild(
            createDOM(formReassignButtonHTML)
        )
        this.ticket_assign_button_elem = this.control_elem.querySelector('#form-reassign-button')

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

               
                var url = origin + '/reassign/' + selected_id + '/' + this.id


                Service.postData(url)
                .then(response => {
                    console.log('status: ', response.status)
                    if (response.status == 200) {
                        return response // Assuming the server response is JSON
                    } else {
                        throw new Error();
                    }
                })
                .then(data => {
                    console.log(data); // JSON data parsed by `response.json()` call
                    window.alert('Ticket is reassigned successfully!');
                })
                .catch((error) => {
                    window.alert('ticket cannot be reassigned to the same person')
                })
            }
        })

    }

    async setPickUpControl(staff_id, ticket_id){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)
        this.control_elem.appendChild(createDOM(formPickHTML))
        const pick_up_button_elem = this.control_elem.querySelector('#form-pick-button')

        pick_up_button_elem.addEventListener('click', () => {
            // Pass all error checkers
                    

            let url = origin + '/process_ticket'
            console.log(url)

            let ticketData = {
                id: ticket_id,
                hours: null,
                rate: null,
                parts_and_costs: null,
                
                research_or_teach: null,
                type: null,
                client_type: null
            }

            console.log(ticketData)
            Service.postData(url, ticketData)
                .then(response => {
                    return response
                }).then(data => {
                    console.log("$$$$$$$$$: ", data)
                })
            

            // Pick up a ticket
            url = origin + '/pickup/' + staff_id +'/' + ticket_id
            console.log('url pick up: ', url)
            
            Service.postData(url)
                .then(response => {
                    console.log('status: ', response.status)
                    if (response.status == 200) {
                        return response // Assuming the server response is JSON
                    } else {
                        throw new Error('Request failed');
                    }
                })
                .then(data => {
                    console.log(data); // JSON data parsed by `response.json()` call
                    window.alert('Ticket is picked up by you successfully!');
                })
                .catch((error) => {
                    window.alert(error)
                    console.log('Error:', error);
                });
        })
    }

    readPartsInformation() {
        const parts = [];
        const table = document.querySelector('#processed_table tbody');

        console.log(table)

        console.log('number of row: ', table.rows.length)

        for (let i = 6; i < table.rows.length; i++) { // Start from the first row with part information
            const row = table.rows[i];
            console.log('row: ', row)
            const part = row.querySelector('input[name="part"]').value;
            const partQuantity = row.querySelector('input[name="quantity"]').value;
            const partPrice = row.querySelector('input[name="part_price"]').value;
            if (part && partQuantity && partPrice) { // Make sure both values are filled
                parts.push({ part, partQuantity: parseFloat(partQuantity), partPrice: parseFloat(partPrice) });
            }
        }
        console.log("parts: ", parts);
        return parts;
    }

    

    // Finish a in-progressed ticket @ticket_id by @staff_id
    async setControl(staff_id, ticket_id){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)

        await this.setReassignControl()
        console.log('#######')
        this.control_elem.appendChild(createDOM(formCloseHTML))
        this.control_elem.appendChild(createDOM(formSaveButtonHTML))

        const close_button = this.control_elem.querySelector('#form-close-button')
        const save_button = this.control_elem.querySelector('#form-save-button')

        // Attach event listener to the save button
        save_button.addEventListener('click', () => {
            this.saveChanges(staff_id, ticket_id).then(() => {
                console.log('Changes saved successfully');
            }).catch(error => {
                console.error('Failed to save changes:', error);
            });
        });

        // Attach event listener to the close button
        close_button.addEventListener('click', () => {
            this.saveChanges(staff_id, ticket_id).then(() => {
                // After successfully saving, proceed to close the ticket
                var url = origin + '/complete/' + ticket_id;
                Service.postData(url, {})
                    .then(response => {
                        if (response.status >= 200 && response.status < 300) {
                            console.log(response.data); // `data` contains the parsed JSON response
                            window.alert('Ticket is closed successfully!');
                        } else {
                            throw new Error('Fail to close ticket. Status: ' + response.status);
                        }
                    })
                    .catch((error) => {
                        console.log('Error:', error);
                    });
            }).catch(error => {
                console.error('Failed to save changes before closing:', error);
            });
        });
    }

    saveChanges(staff_id, ticket_id) {
        return new Promise((resolve, reject) => {
            // Save note
            var noteContent = document.getElementById('user_message').value;
            console.log('note content: ', noteContent);
    
            // Define the URL for saving the note
            var url = origin + '/save/' + staff_id + '/' + ticket_id;
    
            // Attempt to save the note
            Service.postData(url, { note: noteContent })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response.data); // `data` contains the parsed JSON response
                    } else {
                        throw new Error('Fail in save change. Status: ' + response.status);
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                    reject(error); // Reject the promise if there's an error
                });
    
            url = origin + '/tickets/chat/update/' + ticket_id;

            var chatContent = document.getElementById('chat').value;
            var staff = staff_list.find(staff => staff.id == staff_id);

            console.log('test: ', staff.name)
            // chatContent += ' (from ' + staff.name + Date         ')'
            chatContent += ` (from ${staff.name} ${new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })})`;

            Service.putData(url, { chat: chatContent })
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response.data); // `data` contains the parsed JSON response
                    } else {
                        throw new Error('Fail in save change. Status: ' + response.status);
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                    reject(error); // Reject the promise if there's an error
                });

            // Save processed info
            const table = document.querySelector('#processed_table tbody');
            let hours = table.querySelector('input[name="number-hours"]').value;
            let rate = table.querySelector('input[name="rate"]').value;
            let research_or_teach = table.querySelector('select[name="research-or-teach"]').value;
            let type = table.querySelector('select[name="new-or-maintenance"]').value;
            let client_type = table.querySelector('select[name="client-type"]').value;
    
            let parts_and_prices = this.readPartsInformation();
    
            // Define the URL for processing the ticket
            url = origin + '/process_ticket/' + ticket_id;
            let processed_info = {
                "hours": hours,
                "rate": rate,
                "parts_and_costs": JSON.stringify(parts_and_prices),
                "research_or_teach": research_or_teach,
                "type": type,
                "client_type": client_type
            };
    
            console.log('processed info: ', processed_info);
    
            // Attempt to save processed info
            Service.putData(url, processed_info)
                .then(response => {
                    if (response.status >= 200 && response.status < 300) {
                        console.log(response.data); // `data` contains the parsed JSON response
                        window.alert('Change is saved successfully!');
                        resolve(); // Resolve the promise after successful save
                    } else {
                        throw new Error('Fail in save change. Status: ' + response.status);
                    }
                })
                .catch((error) => {
                    console.log('Error:', error);
                    reject(error); // Reject the promise if there's an error
                });
        });
    }
    

   
    setControlNull(){
        emptyDOM(this.control_elem)


        console.log('control elem: ', this.control_elem)
        function addPrintOption(controlElem) {
            let printButton = document.createElement("button");
            printButton.innerHTML = "Print";
            printButton.className = "btn btn-success";
            printButton.onclick = function() {
                window.print();
            };
            controlElem.appendChild(printButton);
        }
        


        // Add print option
        addPrintOption(this.control_elem);

    }

    setId(id){
        this.id = id
    }
}


async function main(){
    await Service.findAllStaff()
    console.log('staff list: ', staff_list)

    var user = await Service.fetchUser()

    var faqView = new FAQView()
    var userView = new UserView(user)
    var ticketView = new TicketView()
    var formView = new TrackFormView()
    
    userView.setName()
   
    
    console.log('info: ', user )

    async function renderRoute(){
        var url = window.location.hash
        console.log('url: ', url)

        var ticket_id_pattern = "#ticket/[0-9]+"
        var ticket_id = url.substring(8)

        var inprogrewss_ticket_id_pattern = "#mine-inprogress/[0-9]+"
        var inprogress_ticket_id = url.substring(17)

        var complete_ticket_id_pattern = "#mine-completed/[0-9]+"
        var complete_ticket_id = url.substring(16)

        if (url == '#faq'){
            faqView.setContent()
        }else if (url == '#add-faq'){
            await faqView.fetchClassifications()
            faqView.setAddFAQPrompt()
        }
        // Submit Form Page
        else if (url == '#all'){
            ticketView.setAllTickets()
            ticketView.setControl()
        }else if (url == '#it'){
            let shop = 'it'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#elec'){
            let shop = 'elec'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#mech'){
            let shop = 'mech'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }else if (url == '#glass'){
            let shop = 'glass'
            ticketView.setAllTicketsInShop(shop)
            ticketView.setControl()
        }


        else if (url.match(ticket_id_pattern)){
            console.log('ticket_id: ', ticket_id)

            formView.id = ticket_id
            // ticketView.setId(ticket_id)

            formView.displayFilled(ticket_id, false, false)
            formView.setPickUpControl(user.id, ticket_id)
        }

        else if (url == '#mine-inprogress'){
            let id = user.id
            ticketView.setMyInprogressTickets(id)

        }else if (url == '#mine-finished'){
            let id = user.id
            ticketView.setMyCompletedTickets(id)
        }


        else if (url.match(inprogrewss_ticket_id_pattern)){
            formView.id = inprogress_ticket_id
            console.log('inprogress id: ', inprogress_ticket_id)
            // ticketView.setId(ticket_id)

            await formView.displayFilled(inprogress_ticket_id, true, false)
            formView.displayNoteBlock(false, inprogress_ticket_id)
            formView.displayChatBlock(inprogress_ticket_id)
    

            formView.readPartsInformation()

            formView.setControl(user.id, inprogress_ticket_id)
        }

        else if (url.match(complete_ticket_id_pattern)){
            formView.id = complete_ticket_id
            console.log('completed id: ', complete_ticket_id)
            // ticketView.setId(ticket_id)

            formView.displayFilled(complete_ticket_id, true, true)
            formView.displayNoteBlock(true, complete_ticket_id)
            formView.setControlNull()
        }
    }

    window.addEventListener('hashchange', renderRoute)
    renderRoute()
}

window.addEventListener('load', main)