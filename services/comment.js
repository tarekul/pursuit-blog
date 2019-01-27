const pgp = require('pg-promise')({})
const db = pgp('postgres://localhost/blog')

const commentService = {}

commentService.create = (author,post_id,title,body) =>{
    return db.none('INSERT INTO comments (author,post_id,title,body) VALUES (${author},${post_id},${title},${body})',{author,post_id,title,body})

}

commentService.readCommentWithID = (id) =>{
    return db.one('SELECT * FROM comments WHERE id=${id}',{id}) 
    
}

commentService.readCommentsOnPost = (post_id) =>{
    return db.any('SELECT * FROM comments WHERE post_id=${post_id}',{post_id})
} 

commentService.readToken = (id) =>{
    return db.one('SELECT author FROM comments WHERE id=${id}',{id})
    .then((response)=>{
        const user_id = response.author
            return db.one(`SELECT u.token 
                FROM users u JOIN comments c 
                ON u.id=$[user_id] AND c.author=$[user_id]`,{user_id})
    })
    
}


commentService.update = (id,post_id,title,body) =>{
    const arr = [post_id,title,body]
    
    const arrString = ["post_id","title","body"]
    
    let sqlStr = 'UPDATE comments SET ' + arr.reduce((acc,element,i)=>{
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

    return db.none(sqlStr,{id,post_id,title,body})
    

}

commentService.delete = (id) =>{
    return db.none('DELETE FROM comments WHERE id=${id}',{id})
}

commentService.deleteCommentsWithID = (author) =>{
    return db.none('DELETE FROM comments WHERE author=${author}',{author})
}

commentService.deleteCommentsWithPostID = (post_id) =>{
    return db.none('DELETE FROM comments WHERE post_id=${post_id}',{post_id})
}




module.exports = commentService;
