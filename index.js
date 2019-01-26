const express = require('express');
const bodyParse = require('body-parser')
const {loginChecker} = require('./middleware/middleware')

//const userApp = require('./routes/user').userApp
const {publicuserApp} = require('./routes/publicuser')
const {publicpostApp} = require('./routes/publicpost')
const {publiccommentApp} = require('./routes/publiccomment')
const {privateuserApp} = require('./routes/privateuser')
const {privatepostApp} = require('./routes/privatepost')
const {privatecommentApp} = require('./routes/privatecomment')

const app = express();
const port = 5001;

//middlware
app.use(bodyParse.urlencoded({extended:false}))
app.use(bodyParse.json())

//route
app.use('/user',publicuserApp) 
app.use('/post',publicpostApp)
app.use('/comment',publiccommentApp)
//middleware
app.use(loginChecker) //headers

//route
app.use('/user',privateuserApp)  
app.use('/post',privatepostApp)
app.use('/comment',privatecommentApp)

app.listen(port,()=>{
    console.log(`listening on port: ${port}`)
})

