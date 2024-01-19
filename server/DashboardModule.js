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
                                    
                                    db.run(sql, ['inprogress', pickup_time, staff_id, ticket_id], (err) => {
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
dashboard_module.prototype.finish = function(db, staff_id, ticket_id, note){
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
                                    
                                    // Update the in progress tickets
                                    sql = `UPDATE staff 
                                            SET in_progress_tickets = ?
                                            WHERE id = ?`
                                    
                                    db.run(sql, [JSON.stringify(new_in_progress_tickets), staff_id], (err) => {
                                    
                                        if (err){
                                            console.log('fail')
                                            reject(err)
                                        } else {
                                            console.log('success')
                                            console.log(staff_id + ' successfully remove ticket ' + ticket_id + ' from in progress list')
                
                                            // Insert the ticket to complete tickets list
                                            sql = `UPDATE staff
                                                    SET completed_tickets = ?
                                                    WHERE id = ?`
                
                                            var complete_time = Date.now()
                                            
                           
                                            complete_list = JSON.parse(result.completed_tickets)
                                            complete_list.push({
                                                "pickup_time": pickup_time,
                                                "complete_time": complete_time,
                                                "ticket_id": ticket_id
                                            })
                
                                            db.run(sql, [JSON.stringify(complete_list), staff_id], (err) => {
                                                if (err){
                                                    reject(err)
                                                }else{
                                                    resolve(staff_id + ' successfully complete ticket ' + ticket_id)
                                                }
                                            })
                                        }
                                    })

                                    // Leave the note and update the status of the ticket to 'complete'
                                    sql = `UPDATE requests 
                                            SET note = ?,
                                                status = ?
                                            WHERE id = ?`
                                    
                                    db.run(sql, [note, 'complete', ticket_id], (err) => {
                                        if (err){
                                            console.log('fail')
                                            reject(err)
                                        } else {
                                            console.log('success')
                                            resolve(staff_id + " successfully update ticket's status to [complete], and leave note '" + note + "' on " + ticket_id)
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
dashboard_module.prototype.reassign = function(db, staff_id, ticket_id){
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
                            if (ticket.staff == staff_id){ // it is not reassign
                                reject('you cannot reassign the ticket to the same person')
                            }
                            else if (ticket.status !== 'inprogress'){
                                reject('ticket is NOT in progress. You cannot reassign it!')
                            }else{
                                
                                var in_progress_list = []
                                sql = `SELECT * FROM staff WHERE id = ?`
                                db.get(sql, [ticket.staff], (err, old_staff) => {
                                    if(err){
                                        reject(err)
                                    } else if (old_staff){ // find old staff from staff database
                                        
                                        in_progress_list = JSON.parse(old_staff.in_progress_tickets)
                                        
                                        in_progress_list = in_progress_list.filter((ticket) => {
                                            return ticket.ticket_id != ticket_id
                                        })

                                        console.log('old staff in progress ticket after: ', in_progress_list )

                                        // delete this ticket from original staff
                                    sql = `UPDATE staff 
                                            SET in_progress_tickets = ?
                                            WHERE id = ?`

                                    console.log('here: ', in_progress_list)
                                    db.run(sql, [JSON.stringify(in_progress_list), ticket.staff], (err) => {
                                        if (err){
                                            reject(err)
                                        } else {
                                            resolve(staff_id + ' successfully remove ticket ' + ticket_id + ' from staff ' + ticket.staff)
                                        }
                                    })


                                    // add this ticket to staff @staff_id

                                    console.log('result:', result)
                    
                                    var pickup_time = Date.now()

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
                                        
                                        db.run(sql, ['inprogress', pickup_time, staff_id, ticket_id], (err) => {
                                            if (err){
                                                console.log('fail')
                                                reject(err)
                                            } else {
                                                console.log('success')
                                                resolve(staff_id + " successfully update ticket's status to [inprogress], and leave note on " + ticket_id)
                                            }
                                        })
                                            
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


module.exports = dashboard_module