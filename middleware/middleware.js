const userService = require('../services/user')
const commentService = require('../services/comment')
const postService = require('../services/post')

//localhost:5000/user/3
const userAuth = (req,res,next) =>{
    //const {user_id} = req.params
    const {user_id} = req.params
    return userService.read(user_id)  //resolve(response) or reject
    .then((response)=>{
        const dbToken = response.token
        if(dbToken === null) {
            res.json({Error:'User not logged in'})
            return
        }
        
        const headersToken = req.headers['token']
        if(headersToken === dbToken) next()
        
        else res.json('token incorrect')    
    },err=>{throw new Error(`user with id: ${id} does not exist`)})
    .catch(err=>{
        res.json(err.toString())
    })

}

const postAuth = (req,res,next)=>{
    const {post_id} = req.params
    
    if(post_id === undefined){
        if(req.headers['token']) {
            //console.log('here')
            next()
        }
        else res.json({Error:'Need token to put comment'})
    }
    else{
        return postService.readPost(post_id)
        .then(response=>{
            console.log(response.author)
            return userService.read(response.author)
        })
        //resolve(response) or reject
        .then((response)=>{
            console.log(response)
            const headersToken = req.headers['token']
            const dbToken = response.token
            if(headersToken === dbToken)
                next()
            else if(dbToken === null) throw new Error('user not logged in')   
            else res.json('token incorrect')    
        })
        .catch(err=>{
            res.json(err.toString())
        })
    }
}

const commentAuth = (req,res,next) =>{
    const {comment_id} = req.params
    //const {id} = req.headers
    if(comment_id === undefined){
        if(req.headers['token']) {
            //console.log('here')
            next()
        }
        else res.json({Error:'Need token to put comment'})

    }
    else{
        return commentService.readCommentWithID(comment_id)
        .then(response=>{
            console.log(response.author)
            return userService.read(response.author)
        })
        //resolve(response) or reject
        .then((response)=>{
            console.log(response)
            const headersToken = req.headers['token']
            const dbToken = response.token
            if(headersToken === dbToken)
                next()
            else if(dbToken === null) throw new Error('user not logged in')   
            else res.json('token incorrect')    
        })
        .catch(err=>{
            res.json(err.toString())
        })
    }
    

}

module.exports = {
    userAuth,
    commentAuth,
    postAuth
}