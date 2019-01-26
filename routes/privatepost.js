const express = require('express')
const postService =  require('../services/post')
const commentService =  require('../services/comment')
const app = express();

app.post('/',(req,res)=>{
    //in the headers client passes user_id and token
    //use user_id to create a post with title and body and author = user_id
    const {title,body} = req.body
    postService.create(req.headers['id'],title,body)
    .then(()=>{
        res.json({mssg: 'New Post created'})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.put('/:post_id',(req,res)=>{
    const {id} = req.headers
    postService.readPost(post_id)
    .then((response)=>{
        if(response.author !== id) {
            res.json({Error:'param and header dont match'})
            return
        }
    })
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

app.delete('/:post_id',(req,res)=>{
    const {post_id} = req.params
    postService.readPost(post_id)
    .then((response)=>{
        if(response.author !== id) {
            res.json({Error:'param and header dont match'})
            return
        }
    })
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
    privatepostApp: app
}