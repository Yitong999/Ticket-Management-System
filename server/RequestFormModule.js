let sql

function request_form_module(){
    console.log('initializing request form module')
}

// ***** insert a new request record into a database table.
request_form_module.prototype.create_request = function(db, name, room_id, email, phone, sp_chart, 
                                                        supervisor_name, service_type, work_request, model, id){

    return new Promise((resolve, reject) => {
        //Insert data into table
        sql = `INSERT INTO requests(id, customer_name, office_num, email, phone_num, speed_chart, 
            supervisor_name, service_type, request_description, manufacturer, status, open_time, close_time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
        
        time = Date.now()

        db.run(sql, [id, name, room_id, email, phone, sp_chart, 
            supervisor_name, service_type, work_request, model, 'open', time, 0], (err) => {
            if (err){
                reject(err)
            } else {
                resolve('successfully insert a request')
            }
        })
    })
}

// ***** update an existing request record in a database table.
request_form_module.prototype.update_request = function(db, id, name, room_id, email, phone, sp_chart, 
                                                        supervisor_name, service_type, work_request, model){
    return new Promise((resolve, reject) => {
        //update data
        sql = `SELECT * FROM requests WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                console.log(result)
                if(result.status == 'closed'){
                    console.log('status: ', result.status)
                    console.log(result.close_time)
                    reject('The ticket has closed at ' + result.close_time)
                }else{
                    time = Date.now()
        
                    sql = `UPDATE requests 
                           SET customer_name = ?, office_num = ?, email = ?, phone_num = ?, speed_chart = ?, supervisor_name = ?, 
                               service_type = ?, request_description = ?, manufacturer = ?, open_time = ?
                           WHERE id = ?`
            
                    db.run(sql, [name, room_id, email, phone, sp_chart, 
                        supervisor_name, service_type, work_request, model, time, id], (err) => {
                        if (err){
                            reject(err)
                        } else {
                            resolve('successfully update a request')
                        }
                    })
                }
            } else {
                reject('Request not found. ')
            }
        })

    })
}

// ***** update an existing request record in a database table.
request_form_module.prototype.update_request = function(db, id, name, room_id, email, phone, sp_chart, 
                                                        supervisor_name, service_type, work_request, model){
    return new Promise((resolve, reject) => {
        //update data
        sql = `SELECT * FROM requests WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                console.log(result)
                if(result.status == 'closed'){
                    console.log('status: ', result.status)
                    console.log(result.close_time)
                    reject('The ticket has closed at ' + result.close_time)
                }else{
                    time = Date.now()
        
                    sql = `UPDATE requests 
                           SET customer_name = ?, office_num = ?, email = ?, phone_num = ?, speed_chart = ?, supervisor_name = ?, 
                               service_type = ?, request_description = ?, manufacturer = ?, open_time = ?
                           WHERE id = ?`
            
                    db.run(sql, [name, room_id, email, phone, sp_chart, 
                        supervisor_name, service_type, work_request, model, time, id], (err) => {
                        if (err){
                            reject(err)
                        } else {
                            resolve('successfully update a request')
                        }
                    })
                }
            } else {
                reject('Request not found. ')
            }
        })

    })
}


request_form_module.prototype.update_request = function(db, id, name, room_id, email, phone, sp_chart, 
                                                        supervisor_name, service_type, work_request, model){
    return new Promise((resolve, reject) => {
        //update data
        sql = `SELECT * FROM requests WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                console.log(result)
                if(result.status == 'closed'){
                    console.log('status: ', result.status)
                    console.log(result.close_time)
                    reject('The ticket has closed at ' + result.close_time)
                }else{
                    time = Date.now()
        
                    sql = `UPDATE requests 
                           SET customer_name = ?, office_num = ?, email = ?, phone_num = ?, speed_chart = ?, supervisor_name = ?, 
                               service_type = ?, request_description = ?, manufacturer = ?, open_time = ?
                           WHERE id = ?`
            
                    db.run(sql, [name, room_id, email, phone, sp_chart, 
                        supervisor_name, service_type, work_request, model, time, id], (err) => {
                        if (err){
                            reject(err)
                        } else {
                            resolve('successfully update a request')
                        }
                    })
                }
            } else {
                reject('Request not found. ')
            }
        })

    })
}


request_form_module.prototype.track_request_by_id = function(db, id){
    return new Promise ((resolve, reject) => {
        sql = `SELECT * FROM requests WHERE id = ?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                resolve(result)
            } else {
                reject('Request not found. ')
            }
        })
    })
}

request_form_module.prototype.track_request_by_name = function(db, name){
    return new Promise ((resolve, reject) => {
        sql = `SELECT * FROM requests WHERE customer_name = ?`
        db.all(sql, [name], (err, result) => {
            if (err){
                reject(err)
            } else if (result.length > 0){
                resolve(result)
            } else {
                reject('Request not found. ')
            }
        })
    })
}

// TODO: extra protection
request_form_module.prototype.track_all_opening_tickets = function(db){
    return new Promise ((resolve, reject) => {
        // sql = `SELECT * FROM requests WHERE close_time != ?`
        sql = `SELECT * FROM requests WHERE close_time = 0 and status = 'open'`
        db.all(sql, (err, result) => {
            if (err){
                reject(err)
            } else if (result.length > 0){
                resolve(result)
            } else{
                reject('Request not found')
            }
        })
    })
}

// TODO: extra protection
request_form_module.prototype.track_open_tickets_in_shop = function(db, shop){
    return new Promise ((resolve, reject) => {
        sql = `SELECT * FROM requests WHERE close_time = 0 AND status = 'open' AND service_type = ?`
        db.all(sql, [shop], (err, result) => {
            if (err){
                reject(err)
            } else if (result.length > 0){
                resolve(result)
            } else{
                console.log('result: ', result)
                reject('Request not found')
            }
        })
    })
}

// TODO: extra protection
request_form_module.prototype.track_all_inprogress_tickets = function(db){
    return new Promise ((resolve, reject) => {
        sql = `SELECT * FROM requests WHERE status = 'inprogress'`
        db.all(sql, (err, result) => {
            if (err){
                reject(err)
            } else if (result.length > 0){
                resolve(result)
            } else{
                console.log('result: ', result)
                reject('Request not found')
            }
        })
    })
}

// TODO: extra protection
request_form_module.prototype.track_all_completed_tickets = function(db){
    return new Promise ((resolve, reject) => {
        sql = `SELECT * FROM requests WHERE status = 'complete'`
        db.all(sql, (err, result) => {
            if (err){
                reject(err)
            } else if (result.length > 0){
                resolve(result)
            } else{
                console.log('result: ', result)
                reject('Request not found')
            }
        })
    })
}

request_form_module.prototype.track_all_my_inprogress_tickets = function(db, id){
    return new Promise ((resolve, reject) => {
        // sql = `SELECT * FROM requests WHERE close_time != ?`
        sql = `SELECT in_progress_tickets FROM staff WHERE id=?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                resolve(result)
            } else {
                reject('Request not found. ')
            }
        })
    })
}

request_form_module.prototype.track_all_my_completed_tickets = function(db, id){
    return new Promise ((resolve, reject) => {
        // sql = `SELECT * FROM requests WHERE close_time != ?`
        sql = `SELECT completed_tickets FROM staff WHERE id=?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                resolve(result)
            } else {
                reject('Request not found. ')
            }
        })
    })
}


request_form_module.prototype.find_note_of_ticket = function(db, id){
    return new Promise ((resolve, reject) => {
        sql = `SELECT note FROM requests WHERE id=?`
        db.get(sql, [id], (err, result) => {
            if (err){
                reject(err)
            } else if (result){
                resolve(result)
            } else{
                reject('Request not found. ')
            }
        })
    })
}

request_form_module.prototype.isUniqueId = function(db, id){
    return new Promise((resolve, reject) => {
        sql = 'SELECT COUNT(*) AS count FROM requests WHERE id = ?'
        db.get(sql, [id], (err, row) => {
          if (err) {
            reject(err);
          } else {
            resolve(row.count === 0);
          }
        });
      });
}

module.exports = request_form_module