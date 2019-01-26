const express = require('express')
const postService = require('../services/post')
const commentService = require('../services/comment')
const app = express();

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

module.exports = {
    publicpostApp: app
}