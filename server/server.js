const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const sqlite3 = require('sqlite3').verbose()
const port = 3000;
const path = require('path')
const passport = require('passport')
const methodOverride = require('method-override')

app.use(express.json()) 						// to parse application/json
app.use(express.urlencoded({ extended: true }))

let sql

const initializePassport = require('./passport-config')

initializePassport(
    passport,
    async (email) => {
        // Fetch user by email from the SQLite database
        const sql = "SELECT * FROM staff WHERE email = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [email], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    },
    async (id) => {
        // Fetch user by id from the SQLite database
        const sql = "SELECT * FROM staff WHERE id = ?";
        return new Promise((resolve, reject) => {
            db.get(sql, [id], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });
    }
)

app.set('view-engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    // secret: process.env.SESSION_SECRET,
    secret: 'secret', //TODO: move secrete into .env
    resave: false,
    saveUninitialized: false
  }))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))



//connect to DB
const db = new sqlite3.Database('./database.db', sqlite3.OPEN_READWRITE, (err)=>{
    if (err) return console.error(err.message)
})

const clientApp = path.join(__dirname, '/../client')

const Request_Form_Module = require('./RequestFormModule')
const Dashboard_Modole = require('./DashboardModule')

const exp = require('constants')
var request_form_module = new Request_Form_Module()
var dashboard_module = new Dashboard_Modole()


// app.use('/form', express.static(clientApp + '/request_form.html'))
app.use('/+', express.static(clientApp + '/index.html'))
app.use('/app.js', express.static(clientApp + '/app.js'))
app.use('/dashboard', checkAuthenticated, express.static(clientApp + '/dashboard.html'))
app.use('/superdashboard', express.static(clientApp + '/supervisor_dashboard.html'))


app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login.ejs')
})

// app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
//     successRedirect: '/dashboard',
//     failureRedirect: '/login',
//     failureFlash: true
// }))

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    // Store user details in session
    req.session.user = {
        email: req.user.email,
        id: req.user.id
    };

    console.log(req.session.user)
    res.redirect('/dashboard');
});

app.get('/user', checkAuthenticated, (req, res) => {
    if (req.session.user) {
        var id = req.session.user.id
        // Read user's name from database
        sql = `SELECT name FROM staff WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err) {console.log(err)}
            else{
                req.session.user.name = result.name
                res.json(req.session.user)
            }
        })
        
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
});


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register.ejs')
})

// Registration Page
app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        _name = req.body.name
        email = req.body.email
        role = req.body.role
        shop = req.body.shop
        password = hashedPassword

        sql = `INSERT INTO staff(name, email, role, shop, password, in_progress_tickets, completed_tickets) VALUES (?, ?, ?, ?, ?, ?, ?)`
        db.run(sql, [_name, email, role, shop, password, JSON.stringify([]), JSON.stringify([])], (err) => {
            if (err) {console.log(err)}
            })
        console.log(users)
        res.redirect('/login')
    } catch {
        res.redirect('/register')
    }
  })

// Logout
app.get('/logout', (req, res, next) => {
    req.logout(function(err) {
    if (err) {return next(err)}
        res.redirect('/login')
    })
})

// Submit a request
app.post('/form/submit', (req, res) => {
    var input = req.body
    console.log('input: ', input)

    //TODO: auto generate a password
    password = '123'

    request_form_module.create_request(db, input.customer_name, input.office_num, input.email, input.phone_num, input.speed_chart,
                                            input.supervisor_name, input.service_type, input.request_description, input.manufacturer, password)
    .then((message) => {
        res.status(200).send(message)
    }).catch((message) => {
        console.log(message)
        res.status(400).send(message)
    })
})

// Change and update a request
app.put('/form/change/:id', (req, res) => {
    var input = req.body
    var id = parseInt(req.params.id, 10)

    request_form_module.update_request(db, id, input.customer_name, input.office_num, input.email, input.phone_num, input.speed_chart,
        input.supervisor_name, input.service_type, input.request_description, input.manufacturer)
    .then((message) => {
        res.status(200).send(message)
    }).catch((message) => {
        console.log(message)
        res.status(400).send(message)
    })
})

// Retrieve request from with ticket id @id
app.get('/form/retrieve/id/:id', (req, res) => {
    var id = parseInt(req.params.id, 10)

    request_form_module.track_request_by_id(db, id).then((message) => {
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrieve request from person @name
app.get('/form/retrieve/name/:name', (req, res) => {
    var name = req.params.name
    request_form_module.track_request_by_name(db, name).then((message) => {
        res.status(200).send(message)
    }).catch((err) => {[]
        console.log(err)
        res.status(400).send(err)
    })
})


// -------------- Staff Module --------------------
// TODO: extra protection in this module
// Staff @id pick up the ticket with @ticket_id
app.post('/pickup/:id/:ticket_id', (req, res) => {
    var id = req.params.id
    var ticket_id = req.params.ticket_id
    dashboard_module.pickup(db, id, ticket_id).then((message) => {
        console.log(message)
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Staff @id finishes the ticket with @ticket_id
app.post('/complete/:id/:ticket_id', (req, res) => {
    var id = req.params.id
    var ticket_id = req.params.ticket_id
    var note = req.body.note

    console.log('server note: ', note)
    dashboard_module.finish(db, id, ticket_id, note).then((message) => {
        console.log(message)
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrive all open tickets in the system
app.get('/tickets/all_open', (req, res) => {
    request_form_module.track_all_opening_tickets(db).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrive all open tickets within the shop @shop_name
app.get('/tickets/shop/:shop_name', (req, res) => {
    var shop = req.params.shop_name
    // TODO: if shop is not within four shops, ignore the request

    request_form_module.track_open_tickets_in_shop(db, shop).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrive all in progress tickets under staff @id
app.get('/tickets/myinprogress/:id', (req, res) => {
    var id = req.params.id

    request_form_module.track_all_my_inprogress_tickets(db, id).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrieve all completed tickets under staff @id
app.get('/tickets/mycompleted/:id', (req, res) => {
    var id = req.params.id

    request_form_module.track_all_my_completed_tickets(db, id).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})


// Retrieve ticket @ticket_id 's note
app.get('/tickets/note/:ticket_id', (req, res) => {
    var id = req.params.ticket_id

    request_form_module.find_note_of_ticket(db, id).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})


// -------------- Supervisor Module --------------------
// TODO: extra protection in this module

// Track staff @id 's completed tickets within a time range
app.get('/completed/staff/:id', (req, res) => {
    let id = req.params.id
    let start_time = req.body.start_time
    let end_time = req.body.end_time

    console.log(start_time, ' | ', end_time)

    request_form_module.track_all_my_completed_tickets(db, id).then((tickets) => {

        tickets_list = JSON.parse(tickets.completed_tickets)
        output_list = []

        for (let ticket of tickets_list){
            console.log(ticket)
            if (ticket.pickup_time > start_time && ticket.pickup_time < end_time){
                output_list.append(ticket)
            }
            console.log('finish')
        }

        res.status(200).send(tickets)
    }).catch((err) => {
        res.status(400).send(err)
    })

})

// Retrive all in progress tickets
app.get('/tickets/inprogress/', (req, res) => {

    request_form_module.track_all_inprogress_tickets(db).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrieve all completed tickets
app.get('/tickets/completed/', (req, res) => {

    request_form_module.track_all_completed_tickets(db).then((tickets) => {
        console.log(tickets)
        res.status(200).send(tickets)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Retrive all staff's name from database
app.get('/staff/all', (req, res) => {
    dashboard_module.getAllStaffNames(db).then((names) => {
        res.status(200).send(names)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

// TODO: extra protection in this module
// Reassign ticket @ticket_id to staff @id
app.post('/reassign/:id/:ticket_id', (req, res) => {
    var id = req.params.id
    var ticket_id = req.params.ticket_id
    dashboard_module.reassign(db, id, ticket_id).then((message) => {
        console.log(message)
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})












// ------------ middleware -------------------
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
  
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard')
    }
    next()
  }





app.use('/', express.static(clientApp, { extensions: ['html'] }))
// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})