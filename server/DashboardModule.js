let sql

function dashboard_module(){
    console.log('initializing dashboard module')
}

// ***** $staff pick up a ticket with $ticket_id
dashboard_module.prototype.pickup = function(db, staff_id, ticket_id){
    return new Promise((resolve, reject) => {
    //update data
        // Check if staff name is valid
        sql = `SELECT * FROM staff WHERE id = ?`
        db.get(sql, [staff_id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){

                sql = `SELECT * FROM requests WHERE id = ?`
                    db.get(sql, [ticket_id], (err, ticket) => {
                        if(err){
                            reject(err)
                        } else if (ticket){
                            // Pick up tickets only when the ticket is open
                            if (ticket.status !== 'open'){
                                reject('ticket is assigned already')
                            }else{
                                console.log('result:', result)
                
                                pickup_time = Date.now()

                                in_progress_list = JSON.parse(result.in_progress_tickets)
                                in_progress_list.push({
                                    "pickup_time": pickup_time,
                                    "ticket_id": ticket_id
                                })

                                console.log(in_progress_list)



                                sql = `UPDATE staff 
                                        SET in_progress_tickets = ?
                                        WHERE id = ?`

                                db.run(sql, [JSON.stringify(in_progress_list), staff_id], (err) => {
                                    if (err){
                                        reject(err)
                                    } else {
                                        resolve(staff_id + ' successfully pick up the ticket ' + ticket_id)
                                    }
                                })

                                sql = `UPDATE requests 
                                        SET status = ?,
                                            pickup_time = ?,
                                            staff = ?
                                        WHERE id = ?`
                                    
                                    db.run(sql, ['inprogress', pickup_time, JSON.stringify([staff_id]), ticket_id], (err) => {
                                        if (err){
                                            console.log('fail')
                                            reject(err)
                                        } else {
                                            console.log('success')
                                            resolve(staff_id + " successfully update ticket's status to [inprogress], and leave note on " + ticket_id)
                                        }
                                    })

                            }

                            


                        } else{
                            reject('ticket not found!')
                        }
                    })


            }else{
                reject('result not found')
            }
        
        })

    })
}

// ***** $staff complete a ticket with $ticket_id
dashboard_module.prototype.finish = function(db, ticket_id, note) {
    return new Promise((resolve, reject) => {
        // Fetch the ticket details to check its current status and assigned staff
        let sql = `SELECT * FROM requests WHERE id = ?`;
        db.get(sql, [ticket_id], (err, ticket) => {
            if (err) return reject(err);
            if (!ticket) return reject('Ticket not found!');
            if (ticket.close_time !== 0) return reject('Ticket is already closed');

            // Parse the staff list associated with the ticket
            let staffList = ticket.staff ? JSON.parse(ticket.staff) : [];


            // Process completion for all staff listed in the ticket
            let updates = staffList.map(staffId => updateStaffTickets(db, staffId, ticket_id, ticket));

            // Wait for all updates to complete
            Promise.all(updates)
                .then(() => {
                    // Leave the note and update the status of the ticket to 'complete'
                    sql = `UPDATE requests SET status = 'complete', close_time = ? WHERE id = ?`;
                    db.run(sql, [Date.now(), ticket_id], (err) => {
                        if (err) return reject(err);
                        resolve("Ticket " + ticket_id + " successfully marked as complete and note added.");
                    });
                })
                .catch(reject);
        });
    });
};

function updateStaffTickets(db, staffId, ticketId, ticket) {
    return new Promise((resolve, reject) => {
        // Fetch the current staff member's ticket lists
        let sql = `SELECT * FROM staff WHERE id = ?`;
        db.get(sql, [staffId], (err, staff) => {
            if (err) return reject(err);
            if (!staff) return reject('Staff not found');

            // Remove the ticket from the in-progress list
            let inProgressList = JSON.parse(staff.in_progress_tickets || '[]');
            inProgressList = inProgressList.filter(item => item.ticket_id !== ticketId);

            // Add the ticket to the completed list
            let completedList = JSON.parse(staff.completed_tickets || '[]');
            completedList.push({
                "pickup_time": ticket.pickup_time,
                "complete_time": Date.now(),
                "ticket_id": ticketId
            });

            // Update the staff's in-progress and completed lists
            sql = `UPDATE staff SET in_progress_tickets = ?, completed_tickets = ? WHERE id = ?`;
            db.run(sql, [JSON.stringify(inProgressList), JSON.stringify(completedList), staffId], err => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}

// Function to handle reopening of the ticket
dashboard_module.prototype.reopen = function(db, ticket_id, note) {
    return new Promise((resolve, reject) => {
        // Fetch the ticket details to check if it's already closed
        let sql = `SELECT * FROM requests WHERE id = ?`;
        db.get(sql, [ticket_id], (err, ticket) => {
            if (err) return reject(err);
            if (!ticket) return reject('Ticket not found!');
            if (ticket.close_time === 0) return reject('Ticket is not closed and cannot be reopened');

            // Parse the staff list associated with the ticket
            let staffList = ticket.staff ? JSON.parse(ticket.staff) : [];

            // Process reopening for all staff listed in the ticket
            let updates = staffList.map(staffId => updateStaffReopen(db, staffId, ticket_id, ticket));

            // Wait for all updates to complete
            Promise.all(updates)
                .then(() => {
                    // Update the ticket to be reopened, clear the close_time and optionally update the note
                    sql = `UPDATE requests SET status = 'inprogress', close_time = 0, note = ? WHERE id = ?`;
                    db.run(sql, [note, ticket_id], (err) => {
                        if (err) return reject(err);
                        resolve("Ticket " + ticket_id + " successfully reopened.");
                    });
                })
                .catch(reject);
        });
    });
};

function updateStaffReopen(db, staffId, ticketId, ticket) {
    return new Promise((resolve, reject) => {
        // Fetch the current staff member's ticket lists
        let sql = `SELECT * FROM staff WHERE id = ?`;
        db.get(sql, [staffId], (err, staff) => {
            if (err) return reject(err);
            if (!staff) return reject('Staff not found');

            // Remove the ticket from the completed list
            let completedList = JSON.parse(staff.completed_tickets || '[]');
            completedList = completedList.filter(item => item.ticket_id !== ticketId);

            // Add the ticket back to the in-progress list
            let inProgressList = JSON.parse(staff.in_progress_tickets || '[]');
            inProgressList.push({
                "pickup_time": ticket.pickup_time,
                // Assuming you're using the reopen time as the new pickup time
                "ticket_id": ticketId
            });

            // Update the staff's in-progress and completed lists
            sql = `UPDATE staff SET in_progress_tickets = ?, completed_tickets = ? WHERE id = ?`;
            db.run(sql, [JSON.stringify(inProgressList), JSON.stringify(completedList), staffId], err => {
                if (err) return reject(err);
                resolve();
            });
        });
    });
}


// ***** $staff complete a ticket with $ticket_id
dashboard_module.prototype.save = function(db, staff_id, ticket_id, note){
    return new Promise((resolve, reject) => {
    //update data

        // check is staff valid
        sql = `SELECT * FROM staff WHERE id = ?`
        db.get(sql, [staff_id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                console.log('result:', result)
                
                pickup_time = Date.now()

                var in_progress_list = JSON.parse(result.in_progress_tickets)

                // Check is ticket_id in in_progress_list
                var checker = false
                var new_in_progress_tickets = []

                // Check is ticket in in_progress list
                // Complete ticket only if ticket is picked up by that staff already
                for (each of in_progress_list){
                    console.log('each.ticket_id: ', each.ticket_id)
                    console.log('ticket_id: ', ticket_id)
                    if (each.ticket_id == ticket_id){
                        checker = true
                        var pickup_time = each.pickup_time
                    } else{
                        new_in_progress_tickets.push(each)
                    }
                }

                // Update in progress tickets
                // and Update complete tickets
                sql = `SELECT * FROM requests WHERE id = ?`
                    db.get(sql, [ticket_id], (err, ticket) => {
                        if(err){
                            reject(err)
                        } else if (ticket){
                            if (ticket.close_time !== 0){
                                reject('ticket is already closed')
                            } else{

                                if (checker == true){
                                    console.log('new list: ', new_in_progress_tickets)
                    

                                    // Leave the note
                                    sql = `UPDATE requests 
                                            SET note = ?
                                            WHERE id = ?`
                                    
                                    db.run(sql, [note, ticket_id], (err) => {
                                        if (err){
                                            console.log('fail')
                                            reject(err)
                                        } else {
                                            console.log('success')
                                            resolve(staff_id + " successfully leave note '" + note + "' on " + ticket_id)
                                        }
                                    })
                                } else{
                                    reject('ticket ' + ticket_id + ' is not picked by staff ' + staff_id)
                                }


                            }
                        } else{
                            reject('ticket not found!')
                        }
                    })

            }else{
                reject('result not found')
            }
        
        })

    })
}



dashboard_module.prototype.getAllStaffNames = function(db){
    return new Promise ((resolve, reject) => {
        // sql = `SELECT * FROM requests WHERE close_time != ?`
        sql = `SELECT * FROM staff`
        db.all(sql, (err, result) => {
            if (err){
                reject(err)
            } else{
                resolve(result)
            }
        })
    })
}


// ***** $staff pick up a ticket with $ticket_id
// dashboard_module.prototype.reassign = function(db, staff_id, ticket_id){
//     return new Promise((resolve, reject) => {
//     //update data
//         // Check if staff name is valid
//         sql = `SELECT * FROM staff WHERE id = ?`
//         db.get(sql, [staff_id], (err, result) => {
//             if (err){
//                 reject(err)
//             } else if (result){

//                 sql = `SELECT * FROM requests WHERE id = ?`
//                     db.get(sql, [ticket_id], (err, ticket) => {
//                         if(err){
//                             reject(err)
//                         } else if (ticket){

//                             if (ticket.staff == null){
//                                 var staff_list = []
//                             }else {
//                                 var staff_list = JSON.parse(ticket.staff) //get staff list of the ticket
//                             }
                           

//                             if (staff_list.includes(staff_id)){ // it is not reassign
//                                 reject('you cannot reassign the ticket to the same person')
//                             }
//                             else if (ticket.status !== 'inprogress'){
//                                 reject('ticket is NOT in progress. You cannot reassign it!')
//                             }else{
                                
//                                 var in_progress_list = []
//                                 sql = `SELECT * FROM staff WHERE id = ?`
//                                 db.get(sql, [ticket.staff], (err, old_staff) => {
//                                     if(err){
//                                         reject(err)
//                                     } else if (old_staff){ // find old staff from staff database
                                        
//                                         in_progress_list = JSON.parse(old_staff.in_progress_tickets)
                                        
//                                         in_progress_list = in_progress_list.filter((ticket) => {
//                                             return ticket.ticket_id != ticket_id
//                                         })

//                                         console.log('old staff in progress ticket after: ', in_progress_list )

//                                         // delete this ticket from original staff
                                        
//                                     // sql = `UPDATE staff 
//                                     //         SET in_progress_tickets = ?
//                                     //         WHERE id = ?`

//                                     // console.log('here: ', in_progress_list)
//                                     // db.run(sql, [JSON.stringify(in_progress_list), ticket.staff], (err) => {
//                                     //     if (err){
//                                     //         reject(err)
//                                     //     } else {
//                                     //         resolve(staff_id + ' successfully remove ticket ' + ticket_id + ' from staff ' + ticket.staff)
//                                     //     }
//                                     // })


//                                     // add this ticket to staff @staff_id

//                                     console.log('result:', result)
                    
//                                     var pickup_time = Date.now()

//                                     in_progress_list = JSON.parse(result.in_progress_tickets)
//                                     in_progress_list.push({
//                                         "pickup_time": pickup_time,
//                                         "ticket_id": ticket_id
//                                     })

//                                     console.log(in_progress_list)

//                                     sql = `UPDATE staff 
//                                             SET in_progress_tickets = ?
//                                             WHERE id = ?`

//                                     db.run(sql, [JSON.stringify(in_progress_list), staff_id], (err) => {
//                                         if (err){
//                                             reject(err)
//                                         } else {
//                                             resolve(staff_id + ' successfully pick up the ticket ' + ticket_id)
//                                         }
//                                     })

//                                     sql = `UPDATE requests 
//                                             SET status = ?,
//                                                 staff = ?
//                                             WHERE id = ?`

                                        
                                        
//                                         db.run(sql, ['inprogress', JSON.stringify(staff_list), ticket_id], (err) => {
//                                             if (err){
//                                                 console.log('fail')
//                                                 reject(err)
//                                             } else {
//                                                 console.log('success')
//                                                 resolve(staff_id + " successfully update ticket's status to [inprogress], and leave note on " + ticket_id)
//                                             }
//                                         })
                                            
//                                         }
//                                     })

                                

//                             }

                            


//                         } else{
//                             reject('ticket not found!')
//                         }
//                     })


//             }else{
//                 reject('result not found')
//             }
        
//         })

//     })
// }

dashboard_module.prototype.reassign = function(db, staff_id, ticket_id){
    return new Promise((resolve, reject) => {
        // Check if new staff ID is valid
        sql = `SELECT * FROM staff WHERE id = ?`;
        db.get(sql, [staff_id], (err, newStaff) => {
            if (err) return reject(err);
            if (!newStaff) return reject('New staff not found');

            // Check if the ticket exists and its current assignment
            sql = `SELECT * FROM requests WHERE id = ?`;
            db.get(sql, [ticket_id], (err, ticket) => {
                if (err) return reject(err);
                if (!ticket) return reject('Ticket not found');
                
                let staff_list = ticket.staff ? JSON.parse(ticket.staff) : [];

                if (!Array.isArray(staff_list)) {
                    console.error('staff_list is not an array:', staff_list);
                    return reject('Internal error: Staff list is in an unexpected format.');
                }


                if (staff_list.includes(staff_id)) return reject('You cannot reassign the ticket to the same person');
                if (ticket.status !== 'inprogress') return reject('Ticket is NOT in progress. You cannot reassign it!');

                // Add new staff to the ticket's staff list if not already included
                if (!staff_list.includes(staff_id)) {
                    staff_list.push(staff_id);
                }
                
                // Update the ticket with the new staff list and ensure the status is 'inprogress'
                sql = `UPDATE requests SET staff = ?, status = 'inprogress' WHERE id = ?`;
                db.run(sql, [JSON.stringify(staff_list), ticket_id], err => {
                    if (err) return reject(err);

                    // Now, update the new staff's in-progress list
                    let in_progress_list = newStaff.in_progress_tickets ? JSON.parse(newStaff.in_progress_tickets) : [];
                    in_progress_list.push({"pickup_time": Date.now(), "ticket_id": ticket_id});

                    sql = `UPDATE staff SET in_progress_tickets = ? WHERE id = ?`;
                    db.run(sql, [JSON.stringify(in_progress_list), staff_id], err => {
                        if (err) return reject(err);
                        resolve(`Ticket ${ticket_id} successfully reassigned to staff ${staff_id}`);
                    });
                });
            });
        });
    });
};



module.exports = dashboard_module