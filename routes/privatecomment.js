const express = require('express')
const commentService =  require('../services/comment')
const userService = require('../services/user')
const app = express();

app.post('/',(req,res)=>{
    //in the headers client passes user_id and token
    //use user_id to create a post with title and body and author = user_id
    const author = req.headers['id']
    const {post_id,title,body} = req.body
    commentService.create(author,post_id,title,body)
    .then(()=>{
        res.json({mssg: `New comment for post_id: ${post_id} created`})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.put('/:comment_id',(req,res)=>{
    const {comment_id} = req.params
    const {post_id,title,body} = req.body
    
    commentService.readToken(comment_id)
    .then((response)=>{
        if(response.token !== req.headers.token){
            throw new Error('User not authorized to perform this action')
        }
        return commentService.update(comment_id,post_id,title,body)
    })
    .then(()=>{
        return commentService.readCommentWithID(comment_id)
    })
    .then(response =>{
        res.json(response)
    },err=>{
        throw new Error('could not read')})
    .catch(err=>{
        res.json(err.toString())
    })
})

app.delete('/:comment_id',(req,res)=>{
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
    privatecommentApp: app
}