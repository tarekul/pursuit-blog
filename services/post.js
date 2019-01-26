const pgp = require('pg-promise')({})
const db = pgp('postgres://localhost/blog')

const postService = {}

postService.create = (author,title,body) =>{
    return db.none('INSERT INTO posts (author,title,body) VALUES (${author},${title},${body})',{author,title,body})

}

postService.read = (author) =>{
    return db.any('SELECT * FROM posts WHERE author=${author}',{author}) 
    
}

postService.readPost = (id) =>{
    return db.one('SELECT * FROM posts WHERE id=${id}',{id})
}


postService.update = (id,title,body) =>{
    const arr = [title,body]
    
    const arrString = ["title","body"]
    
    let sqlStr = 'UPDATE posts SET ' + arr.reduce((acc,element,i)=>{
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

    return db.none(sqlStr,{id,title,body})
    
    //db.none('UPDATE users SET name=${name},body=${body},title=${title} WHERE id=${id}',{name,body,title})
}

postService.delete = (id) =>{
    return db.none('DELETE FROM posts WHERE id=${id}',{id})
}

postService.deletePostWithUserID = (author) =>{
    return db.none('DELETE FROM posts WHERE author=author',{author})
} 


module.exports = postService;
