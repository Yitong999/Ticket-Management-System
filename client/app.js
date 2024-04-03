
var Service = {
    origin: window.location.origin,

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



}



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

    // Generate 5 digits ID
    async IDgenerator(){
        let uniqueId = Math.floor(10000 + Math.random() * 90000);
        
        let isUnique = await this.isUniqueId(uniqueId)
        while (!isUnique){
            uniqueId = Math.floor(10000 + Math.random() * 90000);
            isUnique = true;
        }

        console.log('after ID: ', uniqueId)

        return uniqueId;
            
    }

    async isUniqueId(id) {
        try{
            let url = Service.origin + '/ticket/checkId?id=' + id

            console.log('url: ' + url)
            const response = await fetch(url)

            const data = await response.json()
            console.log('data: ', data)

            return data.unique
            // return data.unique
        } catch (error) {
            console.error('Error checking ID:', error);
            throw error; // Optional: depends on how you want to handle errors
        }
        

    }

    setControl(instruction){
        // if (instruction == 'submit'){
        //     emptyDOM(this.content_elem)
        // }
        emptyDOM(this.control_elem)
        if (instruction == 'submit'){
            this.control_elem.appendChild(createDOM(formSubmitHTML))
        }
        
        
        
        this.control_elem.addEventListener('click', async () => {
            console.log('clicking ' + instruction)
            const uniqueId = await this.IDgenerator()
            const formFields = this.content_elem.querySelectorAll('input, select, textarea');
                formFields.forEach(field => {
                    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
                        // field.readOnly = true; // TODO: Do this only if all input fields meet the requirement
                    } else if (field.tagName === 'SELECT') {
                        field.disabled = true;
                    }
                })

            this.customer_name = this.content_elem.querySelector('input[name="customer_name"]').value
            this.office_num = this.content_elem.querySelector('input[name="office_num"]').value
            this.email = this.content_elem.querySelector('input[name="email"]').value
            this.phone_num = this.content_elem.querySelector('input[name="phone_num"]').value
            this.speed_chart = this.content_elem.querySelector('input[name="speed_chart"]').value
            this.supervisor_name = this.content_elem.querySelector('input[name="supervisor_name"]').value
            this.service_type = this.content_elem.querySelector('select[name="service_type"]').value
            this.request_description = this.content_elem.querySelector('textarea[name="request_description"]').value
            this.manufacturer = this.content_elem.querySelector('input[name="manufacturer"]').value
            
            console.log("id: ", uniqueId)
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
                    "id": uniqueId,
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
                                console.log('unique ID: ', uniqueId)
                                successMessage.innerHTML = `<strong style='color:green;' >Ticket #${uniqueId} is submitted successfully! Please print the page for reference. We will email you once the ticket is solved or we need further information. Thanks.</strong>`;
                                
                                
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
    var faqView = new FAQView()
    var formView = new TrackFormView()

    function renderRoute(){
        var url = window.location.hash

        // Submit Form Page
        if (url == '#form'){
            formView.setForm()
            formView.setControl('submit')
        }

        // FAQ page
        else {
            faqView.setContent()
        }
    }
    window.addEventListener('hashchange', renderRoute)
    renderRoute()
}

window.addEventListener('load', main)