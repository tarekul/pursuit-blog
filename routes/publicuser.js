const express = require('express')
const bcrypt = require('bcrypt')
const uuid = require('uuid/v1')
const userService =  require('../services/user')
const postService = require('../services/post')
const commentService = require('../services/comment')
const app = express();

app.get('/:id',(req,res)=>{
    const {id} = req.params
    userService.read(id).then(response=>{
        delete response.token
        res.json(response)
    },err=>{
        throw new Error('User does not exist')
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.get('/:user_id/posts',(req,res)=>{
    const {user_id} = req.params
    postService.read(user_id)
    .then((response)=>{
        res.json(response)
    })
    .catch(err=>{
        res.json(err.toString())
    })
    
})

app.get('/:user_id/posts/:post_id',(req,res)=>{
    const {user_id, post_id} = req.params
    postService.read(user_id)
    .then(response=>{
        //console.log('post_id is ',typeof post_id)
        for(let i=0;i<response.length;i++){
            //console.log('id is ',typeof response[i].id)
            if(response[i].id === parseInt(post_id)) {
                res.json(response[i])
                return
            }
        }
        res.json({})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.get('/:user_id/comments',(req,res)=>{
    const {user_id} = req.params
    commentService.read(user_id)
    .then((response)=>{
        res.json(response)
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.get('/:user_id/comments/:comment_id',(req,res)=>{
    const {user_id, comment_id} = req.params
    commentService.read(user_id)
    .then(response=>{
        //console.log('post_id is ',typeof post_id)
        for(let i=0;i<response.length;i++){
            //console.log('id is ',typeof response[i].id)
            if(response[i].id === parseInt(comment_id)) {
                res.json(response[i])
                return
            }
        }
        res.json({})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})

app.post('/',(req,res)=>{
    const {username,email,password} = req.body
    
    if(!username || !email || !password) res.json({Error: 'Missing username,email,or password'})
    bcrypt.hash(password,10)
        .then((encryptedPassword)=>{
            userService.create(username,email,encryptedPassword)
            .then(()=>{
                res.json({username,email,encryptedPassword})
            },err=>{
                res.json({Error:'username or email exists'})
            })
        })
})

app.post('/login',(req,res)=>{
    let {id,username,password} = req.body
    if(!id || !username || !password) res.json({Error: 'Must enter id,username,password'})
    userService.read(id)
    .then(data=>{   
        if(username != data.username) throw new Error('Incorrect username')
        return bcrypt.compare(password,data.password)
    },err=>{
        throw new Error('username does not exist')
    })
    .then(response=>{
        if(!response) throw new Error('Password is incorrect')
        return userService.read(id)
        
    })
    .then((data)=>{
        if(data.token) throw new Error('Already logged in')
        const tokenn = uuid();
        
        userService.update(id,username=null,password=null,email=null,tokenn)
        res.json({status:'login Success',tokenn})
    })
    .catch(err=>{
        res.json(err.toString())
    })
})



module.exports = {
    publicuserApp : app
}