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
        sql = `SELECT name, role FROM staff WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err) {console.log(err)}
            else{
                req.session.user.name = result.name
                req.session.user.role = result.role
                res.json(req.session.user)
            }
        })
        
    } else {
        res.status(401).json({ message: 'Unauthorized' })
    }
});


app.get('/register', (req, res) => {
    res.render('register.ejs', { query: req.query });
})

// Registration Page
app.post('/register', async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        _name = req.body.name
        email = req.body.email
        role = req.body.role
        shop = req.body.shop
        password = hashedPassword

        sql = `INSERT INTO staff(name, email, role, shop, password, in_progress_tickets, completed_tickets, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`

        db.run(sql, [_name, email, role, shop, password, JSON.stringify([]), JSON.stringify([]), true], (err) => {
            if (err) {
                console.log('error: ', err)
                return res.redirect('/register?error=true');
            }else {
                return res.redirect('/register?registered=true');
            }
            // res.redirect('/login?registered=true');
            
        });
        
    } catch {
        res.redirect('/register')
    }
  })

  app.get('/change-password', checkAuthenticated, (req, res) => {
    console.log('get: ', req.user)
    res.render('change-password.ejs', { user: req.user, error: req.query.error });
  });

  app.post('/change-password', checkAuthenticated, async (req, res) => {
    console.log('post: ', req.body)
    console.log('post user: ', req.user)
    try {
        const { currentPassword, newPassword } = req.body;
        const user = req.user; // Implement this function based on your user retrieval logic
        
        
        if (await bcrypt.compare(currentPassword, user.password)) {
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            // Update the user's password in your database
            updateUserPassword(req.user.email, hashedNewPassword); // Implement this function based on your database logic
            res.redirect('/dashboard');
        } else {
            console.log('not match')
            // window.alert('Current Password is Wrong!')
            res.redirect('/change-password?error=true');
        }
    } catch (error) {
        console.log('fail: ', error)
        res.redirect('/change-password?error=true');
    }
  });

  app.post('/change-status')

  app.patch('/change-status/:id/status', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // Expected to be either true or false

    if (typeof status !== 'boolean') {
        return res.status(400).send({ error: 'Status must be true or false.' });
    }

    try {
        // Assuming a function updateStaffStatus exists to update the status in your database
        await updateStaffStatus(id, status);
        res.send({ message: 'Staff status updated successfully to ' + status });
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Failed to update staff status.' });
    }
  });

  function updateStaffStatus(id, status) {
    return new Promise((resolve, reject) => {
        const sql = `UPDATE staff SET status = ? WHERE id = ?`;

        db.run(sql, [status, id], function(err) {
            if (err) {
                console.error('Error updating staff status:', err);
                reject(err);
            } else {
                console.log(`Staff status updated successfully, ${this.changes} row(s) changed`);
                resolve(this.changes); // or resolve(true) if you prefer not to use the number of changed rows
            }
        });
    });
}
/**
 * Updates the password for a user identified by email.
 * @param {string} email The email of the user whose password is to be updated.
 * @param {string} newPassword The new hashed password for the user.
 */
function updateUserPassword(email, newPassword) {
    // SQL query to update the user's password
    const sql = `UPDATE staff SET password = ? WHERE email = ?`;

    // Execute the SQL query with the new hashed password and the user's email
    db.run(sql, [newPassword, email], function(err) {
        if (err) {
            console.error("Error updating password for user:", email, err);
            // Handle error (e.g., by sending a response to the client indicating failure)
            // This might involve redirecting to an error page or sending back an error status
            // res.redirect('/change-password?error=true'); // Uncomment and adjust according to your routing and error handling strategy
        } else {
            // Success
            console.log(`Password updated successfully for user: ${email}`);
            // Handle success (e.g., by redirecting to a confirmation page or sending a success response)
            // res.redirect('/profile?passwordChanged=true'); // Uncomment and adjust according to your routing and success handling strategy
        }
    });
}


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

    request_form_module.create_request(db, input.customer_name, input.office_num, input.email, input.phone_num, input.speed_chart,
                                            input.supervisor_name, input.service_type, input.request_description, input.manufacturer, input.id)
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

// Process a ticket
// add hours, rate, parts and costs, research_or_teach, and type
app.post('/process_ticket', (req, res) => {
    const { id, hours, rate, parts_and_costs, research_or_teach, type, client_type } = req.body;
    
    // Prepare an SQL statement to prevent SQL injection
    const sql = `INSERT INTO requests_processed (id, hours, rate, parts_and_costs, research_or_teach, type, client_type) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    // Run the SQL statement with the parameters received from the request body
    db.run(sql, [id, hours, rate, parts_and_costs, research_or_teach, type, client_type], function(err) {
        if (err) {
            console.error(err.message);
            res.status(400).send(err.message);
        } else {
            res.status(200).json({ id: this.lastID });
        }
    });
});

// get info of processed ticket
// hours, rate, parts and costs, research_or_teach, and type
app.get('/get_processed_ticket/:id', (req, res) => {
    const id = req.params.id;
    
    // Prepare an SQL statement to prevent SQL injection
    const sql = 'SELECT * FROM requests_processed WHERE id = ?';
    
    // Run the SQL statement with the id parameter
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            if (row) {
                // If we have a JSON string for parts_and_costs, parse it to an array
                res.status(200).json(row);
            } else {
                res.status(404).send('Request not found');
            }
        }
    });
});

// update a processed ticket
app.put('/process_ticket/:id', (req, res) => {
    // Extract the ID from the request parameters
    const { id } = req.params;
    console.log('I am server $$$$$$$$$$')
    console.log('id in server: ', id)

    const { hours, rate, parts_and_costs, research_or_teach, type, client_type } = req.body;
    
    // Prepare an SQL statement to prevent SQL injection for updating an existing record
    const sql = `UPDATE requests_processed 
                 SET hours = ?, 
                     rate = ?, 
                     parts_and_costs = ?, 
                     research_or_teach = ?, 
                     type = ?,
                     client_type = ?
                 WHERE id = ?`;
    
    // Run the SQL statement with the parameters received from the request body to update the existing entry
    db.run(sql, [hours, rate, parts_and_costs, research_or_teach, type, client_type, id], function(err) {
        if (err) {
            console.error(err.message);
            res.status(400).send(err.message);
        } else {
            // Check if any row was affected
            if (this.changes > 0) {
                res.status(200).json({ message: "Ticket updated successfully", id: id });
            } else {
                res.status(404).json({ message: "Ticket not found with the provided ID", id: id });
            }
        }
    });
});


app.get('/request/invoice/:id', (req, res) => {
    const id = req.params.id;

    const sql = `
    SELECT r.id, r.service_type, r.supervisor_name, r.speed_chart, rp.hours, rp.rate, rp.parts_and_costs
    FROM requests r
    JOIN requests_processed rp ON r.id = rp.id
    WHERE r.id = ?
    `;

    db.get(sql, [id], (err, row) => {
        if (err) {
            res.status(400).json({"error":err.message});
            return;
        }
        res.json({
            "ticket": row
        })
    });
});

app.get('/request/general_report/', (req, res) => {
    const sql = `
        SELECT r.id, r.supervisor_name, r.speed_chart, r.service_type, r.staff, r.note, rp.rate, rp.hours, rp.parts_and_costs
        FROM requests r
        JOIN requests_processed rp ON r.id = rp.id
    `;

    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({"error": err.message});
            return;
        }

        const modifiedRows = rows.map(row => {
            // Default price to 0 if any necessary field is missing
            let price = 0;
            if (row.rate && row.hours) {
                price += row.rate * row.hours;
            }
            
            if (row.parts_and_costs) {
                // Attempt to parse the parts_and_costs JSON, safely
                try {
                    const parts = JSON.parse(row.parts_and_costs);
                    const partsPrice = parts.reduce((total, part) => {
                        return total + (part.partQuantity * part.partPrice);
                    }, 0);

                    price += partsPrice;
                } catch (e) {
                    console.error("Error parsing parts_and_costs JSON:", e);
                }
            }

            return {
                id: row.id,
                supervisor_name: row.supervisor_name,
                speed_chart: row.speed_chart,
                service_type: row.service_type,
                staff: row.staff,
                note: row.note,
                price: price
            };
        });

        res.json({
            "message": "success",
            "data": modifiedRows
        });
    });
});

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


app.get('/requests/condition', (req, res) => {
    const { service_type, start_time, end_time } = req.query;
    
    // Construct the SQL query
    const sql = `
        SELECT * FROM requests 
        WHERE service_type = ? AND status = 'complete' 
        AND close_time BETWEEN CAST(? AS INTEGER) AND CAST(? AS INTEGER)

    `;
    
    // Execute the SQL query
    db.all(sql, [service_type, start_time, end_time], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});


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

app.get('/ticket/checkId', async (req, res) => {
  const id = req.query.id;
  if (!id) {
    return res.status(400).send('ID is required');
  }

  try {
    const unique = await request_form_module.isUniqueId(db, id);
    res.send({ id, unique });
  } catch (err) {
    console.error(err);
    res.status(500).send('Error checking ID');
  }
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

// Staff @id save the change toward the ticket with @ticket_id
app.post('/save/:id/:ticket_id', (req, res) => {
    var id = req.params.id
    var ticket_id = req.params.ticket_id
    var note = req.body.note

    console.log('server note: ', note)
    dashboard_module.save(db, id, ticket_id, note).then((message) => {
        console.log(message)
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Staff finishes the ticket with @ticket_id
app.post('/complete/:ticket_id', (req, res) => {
    var ticket_id = req.params.ticket_id
    var note = req.body.note

    console.log('server note: ', note)
    dashboard_module.finish(db, ticket_id, note).then((message) => {
        console.log(message)
        res.status(200).send(message)
    }).catch((err) => {
        console.log(err)
        res.status(400).send(err)
    })
})

// Express endpoint to reopen a ticket
app.post('/reopen/:ticket_id', (req, res) => {
    var ticket_id = req.params.ticket_id;
    var note = req.body.note;

    console.log('server note: ', note);
    dashboard_module.reopen(db, ticket_id, note).then((message) => {
        console.log(message);
        res.status(200).send(message);
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});



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

app.get('/tickets/chat/:ticket_id', (req, res) => {
    const id = req.params.ticket_id

    const query = 'SELECT chat FROM requests WHERE id = ?'

    db.get(query, [id], (err, row) => {
        if (err) {
            console.error(err.message);
            res.status(500).send(err.message);
        } else {
            if (row) {
                // If we have a JSON string for parts_and_costs, parse it to an array
                res.status(200).json(row);
            } else {
                res.status(404).send('Request not found');
            }
        }
    });
})

app.put('/tickets/chat/update/:ticket_id', (req, res) => {
    const id = req.params.ticket_id;
    const { chat } = req.body; // Assuming the new chat content is sent in the request body

    if (!chat) {
        return res.status(400).send('Chat content is required');
    }

    const query = 'UPDATE requests SET chat = ? WHERE id = ?';

    db.run(query, [chat, id], function(err) {
        if (err) {
            console.error(err.message);
            return res.status(500).send(err.message);
        }
        if (this.changes > 0) {
            res.status(200).send('Chat updated successfully');
        } else {
            res.status(404).send('Request not found');
        }
    });
});


// Retrieve FAQ list
app.get('/get-all-faqs', (req, res) => {
    const selectQuery = 'SELECT * FROM FAQs';

    db.all(selectQuery, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ error: 'Database error' });
        }

        return res.status(200).json(rows);
    });
});

// Add a FAQ
app.post('/add-faq', (req, res) => {
    const { classification, question, solution } = req.body

    if (!classification || !question || ! solution) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const insertQuery = `
        INSERT INTO FAQs (classification, question, solution) VALUES (?, ?, ?)
    `

    db.run(insertQuery, [classification, question, solution], (err) => {
        if (err) {
            console.log('share')
            return res.status(500).json({ error: 'Database error' });
        }
        
        return res.status(201).json({ message: 'FAQ added successfully' });
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