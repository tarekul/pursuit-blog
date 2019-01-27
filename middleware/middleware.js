const userService = require('../services/user')

//localhost:5000/user/3
const loginChecker = (req,res,next) =>{
    //const {user_id} = req.params
    const {id} = req.headers
    
    userService.read(id)  //resolve(response) or reject
    .then((response)=>{
        const headersToken = req.headers['token']
        const dbToken = response.token
        if(headersToken === dbToken)
            next()
        else if(dbToken === null) throw new Error('user not logged in')   
        else res.json('token incorrect')    
    },err=>{throw new Error(`user with id: ${id} does not exist`)})
    .catch(err=>{
        res.json(err.toString())
    })

}

module.exports = {
    loginChecker
}