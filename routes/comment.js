const express = require('express')
const commentService =  require('../services/comment')
const userService =  require('../services/user')
const {loginChecker,commentAuth} = require('../middleware/middleware')

const app = express();

//public routes
app.get('/:comment_id',(req,res)=>{
    const {comment_id} = req.params
    commentService.readCommentWithID(comment_id)
    .then(response=>{
        res.json(response)
    })
    .catch(err=>{res.json(err.toString())})
})

//private routes
app.post('/',commentAuth,(req,res)=>{
    //in the headers client passes user_id and token
    //use user_id to create a post with title and body and author = user_id
    
    const {post_id,title,body} = req.body
    console.log(req.headers['token'])
    userService.readUserIDWithToken(req.headers['token'])
    .then(response=>{
        const author = response.id
        //console.log(author)
        return commentService.create(author,post_id,title,body) 
    })
    .then(()=>{
        res.json({mssg: `New comment for post_id: ${post_id} created`})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.put('/:comment_id',commentAuth,(req,res)=>{
    const {comment_id} = req.params
    const {post_id,title,body} = req.body
    
    commentService.readToken(comment_id)
    .then((response)=>{
        console.log(req.headers.token)
        console.log(response.token)
        if(response.token !== req.headers.token){
            console.log(0)
            return Promise.reject('User not authorized to perform this action')
        }
        return commentService.update(comment_id,post_id,title,body)
    })
    .then(()=>{
        console.log(1)
        return commentService.readCommentWithID(comment_id)
    })
    .then(response =>{
        console.log(2)
        res.json(response)
    })
    .catch(err=>{
        console.log(4, err.toString())
        res.json({response:'hello',err:err.toString()})
    })
})

app.delete('/:comment_id',commentAuth,(req,res)=>{
    const {comment_id} = req.params
    commentService.delete(comment_id)
    .then(()=>{
        res.json({mssg:'delete successful'})
    },err=>{
        throw new Error('Could not delete')
    })
    .catch(err=>{res.json(err.toString())})
})

module.exports = {
    commentApp: app
}