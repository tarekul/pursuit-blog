const express = require('express')
const bcrypt = require('bcrypt')
const userService =  require('../services/user')
const postService =  require('../services/post')
const commentService =  require('../services/comment')
const app = express();



app.put('/:user_id',(req,res)=>{
    const {user_id} = req.params
    if(parseInt(user_id) != parseInt(req.headers.id)) {
        res.json({Error:'params not matching header id'})
        return
    }
    const {username,email,password} = req.body
    //console.log('email entered : ', email)
    if(!password){
        userService.update(user_id,username,password,email)
        .then(()=>{
            return userService.read(user_id)
        })
        .then((response)=>{
            delete response.token
            res.json(response)
        })
        .catch(err=>{
            res.json(err.toString())
        })
        
    }
    else if(password){
        bcrypt.hash(password,10)
        .then((encryptedPassword)=>{
            userService.update(user_id,username,encryptedPassword,email)
            .then(()=>{
                return userService.read(user_id)
            },err=>{
                throw new Error('could not update')
            })
            .then((response)=>{
                delete response.token
                res.json(response)
            },err=>{
                throw new Error('could not read')
            })
        })
        .catch(err=>{
            res.json(err.toString())
        })
    }
})

app.delete('/:user_id',(req,res)=>{
    const {user_id} = req.params
    console.log(user_id)
    console.log(req.headers['id'])
    if(parseInt(user_id) != parseInt(req.headers['id'])) {
        res.json({Error:'params not matching header id'})
        return
    }
    commentService.deleteCommentsWithID(user_id)
    .then(()=>{
        return postService.deletePostWithUserID(user_id)
        
    },err=>{
        return postService.deletePostWithUserID(user_id)
    })
    .then(()=>{
        return userService.delete(user_id)
    },err=>{
        return userService.delete(user_id)
    })
    .then(()=>{
        res.json({
            user: `Deleted user with ID: ${user_id} `,
            posts: `Deleted all posts with ID: ${user_id}`,
            comments:`Deleted all comments with ID: ${user_id}`
        })
    })
})

module.exports = {
    privateuserApp :app
}