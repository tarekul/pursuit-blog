const express = require('express');
const bodyParse = require('body-parser')
const {userApp} = require('./routes/user')
const {postApp} = require('./routes/post')
const {commentApp} = require('./routes/comment')

const app = express();
const port = 5001;

//middlware
app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json())

//route

app.use('/user',userApp) 
app.use('/post',postApp)
app.use('/comment',commentApp)



app.listen(port,()=>{
    console.log(`listening on port: ${port}`)
})

