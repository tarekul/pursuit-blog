const express = require('express')
const userService = require('../services/user')
const postService = require('../services/post')
const commentService = require('../services/comment')
const {postAuth} = require('../middleware/middleware')
const app = express();

//public routes
app.get('/:post_id',(req,res)=>{
    const {post_id} = req.params
    postService.readPost(post_id)
    .then((response)=>{
        res.json(response)
    })
    .catch(err=>{res.json(err.toString())})
})

app.get('/:post_id/comments',(req,res)=>{
    const {post_id} = req.params
    commentService.readCommentsOnPost(post_id)
    .then((response)=>{
        res.json(response)
    })
    .catch(err=>{res.json(err.toString())})
})

app.get('/:post_id/comments/:comment_id',(req,res)=>{
    const {post_id,comment_id} = req.params
    commentService.readCommentsOnPost(post_id)
    .then((response)=>{
        for(let i=0;i<response.length;i++){
            //console.log('id is ',typeof response[i].id)
            if(response[i].id === parseInt(comment_id)) {
                res.json(response[i])
                return
            }
        }
        res.json({})
    })
    .catch(err=>{res.json(err.toString())})
})

//private routes
app.post('/',postAuth,(req,res)=>{
    //in the headers client passes user_id and token
    //use user_id to create a post with title and body and author = user_id
    const {title,body} = req.body
    userService.readUserIDWithToken(req.headers['token'])
    .then(response=>{
        const author = response.id
        return postService.create(author,title,body)
    })
    .then(()=>{
        res.json({mssg: 'New Post created'})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.put('/:post_id',postAuth,(req,res)=>{
    const {post_id} = req.params
    const {title,body} = req.body
    postService.update(post_id,title,body)
    .then(()=>{
        return postService.readPost(post_id)
    },err=>{throw new Error('could not update')})
    .then(response =>{
        res.json(response)
    },err=>{throw new Error('could not read')})
    .catch(err=>{
        res.json(err.toString())
    })
})  

app.delete('/:post_id',postAuth,(req,res)=>{
    const {post_id} = req.params
    
    commentService.deleteCommentsWithPostID(post_id)
    .then(()=>{
        return postService.delete(post_id)
    },err=>{
        throw new Error('Could not delete')
    })
    .then(()=>{
        res.json({mssg: 'delete successful'})
    })
    .catch(err=>{res.json(err.toString())})
})

module.exports = {
    postApp: app
}