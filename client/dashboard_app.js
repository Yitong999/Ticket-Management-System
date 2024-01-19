
// const btnEl = document.getElementById('btn')
origin = window.location.origin

Service = {
    fetchUser: async function(){
        var url = origin + '/user'
        console.log(url)
        const response = await fetch(url)
        var user = await response.json()
        
        return user
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

class UserView{
    constructor(user){
        this.user = user
        this.title = document.querySelector('h1')
    }

    setName(){
        console.log(this.user)
        
        this.title.textContent = "Hi, " + this.user['name']
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

    setForm(){
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

    // Finish a in-progressed ticket @ticket_id by @staff_id
    async setControlClose(staff_id, ticket_id){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)
        this.control_elem.appendChild(createDOM(formCloseHTML))

        this.control_elem.addEventListener('click', () => {
            var noteContent = document.getElementById('user_message').value
            console.log('note content: ', noteContent)

            // Pick up a ticket
            var url = origin + '/complete/' + staff_id +'/' + ticket_id

            Service.postData(url, {note: noteContent})
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


}


async function main(){
    var user = await Service.fetchUser()

    var userView = new UserView(user)
    var ticketView = new TicketView()
    var formView = new TrackFormView()
    
    userView.setName()
   
    
    console.log('info: ', user )

    function renderRoute(){
        var url = window.location.hash
        console.log('url: ', url)

        var ticket_id_pattern = "#ticket/[0-9]+"
        var ticket_id = url.substring(8)

        var inprogrewss_ticket_id_pattern = "#mine-inprogress/[0-9]+"
        var inprogress_ticket_id = url.substring(17)

        var complete_ticket_id_pattern = "#mine-completed/[0-9]+"
        var complete_ticket_id = url.substring(16)

        // Submit Form Page
        if (url == '#all'){
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

            formView.displayFilled(ticket_id)
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

            formView.displayFilled(inprogress_ticket_id)
            formView.displayNoteBlock(false, inprogress_ticket_id)
            formView.setControlClose(user.id, inprogress_ticket_id)
        }

        else if (url.match(complete_ticket_id_pattern)){
            formView.id = complete_ticket_id
            console.log('completed id: ', complete_ticket_id)
            // ticketView.setId(ticket_id)

            formView.displayFilled(complete_ticket_id)
            formView.displayNoteBlock(true, complete_ticket_id)
            formView.setControlNull()
        }
    }

    window.addEventListener('hashchange', renderRoute)
    renderRoute()
}

window.addEventListener('load', main)