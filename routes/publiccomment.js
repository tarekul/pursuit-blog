const express = require('express')
const commentService =  require('../services/comment')
const app = express();

app.get('/:comment_id',(req,res)=>{
    const {comment_id} = req.params
    commentService.readCommentWithID(comment_id)
    .then(response=>{
        res.json(response)
    })
    .catch(err=>{res.json(err.toString())})
})

module.exports = {
    publiccommentApp: app
}