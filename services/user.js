const pgp = require('pg-promise')({})
const db = pgp('postgres://localhost/blog')

const userService = {}

userService.create = (username,email,password) =>{
    return db.none('INSERT INTO users (username,email,password) VALUES (${username},${email},${password})',{username,email,password})

}

userService.read = (id) =>{
    return db.one('SELECT * FROM users WHERE id=${id}',{id}) 
    
}

userService.readName = (username) =>{
    return db.one('SELECT id FROM users WHERE username=${username}',{username})
}

userService.readUserIDWithToken = token =>{
    return db.one('SELECT id FROM users WHERE token=${token}',{token})
}

// userService.readUsername = (username)=>{
//     return db.one('SELECT * FROM users WHERE username=${username}',{username})   
// }

// userService.readEmail = (email)=>{
//     return db.one('SELECT * FROM users WHERE email=${email}',{email})   
// }

userService.update = (id,username,password,email,token=null) =>{
    const arr = [username,password,email,token]
    
    const arrString = ["username","password","email","token"]
    
    let sqlStr = 'UPDATE users SET ' + arr.reduce((acc,element,i)=>{
        if(element){
            acc += arrString[i] + '=${' + arrString[i] + '},'
            //console.log(acc)
            return acc 
            
        }
        return acc
    },'') 
    
    sqlStr = sqlStr.slice(0,sqlStr.length-1)
    sqlStr = sqlStr + ` WHERE id=${id}`
    console.log(sqlStr)

    return db.none(sqlStr,{id,username,password,email,token})
    
    //db.none('UPDATE users SET name=${name},email=${email},password=${password} WHERE id=${id}',{name,email,password})
}

userService.delete = (id) =>{
    return db.none('DELETE FROM users WHERE id=${id}',{id})
}


module.exports = userService;
