const express = require("express");
const authRouter = express.Router();
path = require('path');

authRouter.get('/', (req, res) => {
    const user = req.session?.user
    if (user) {
        res.redirect('/index.html')
    } else {
    res.sendFile(path.join(__dirname, '../public', 'login.html'));
    }
})

authRouter.post('/', (req, res) => {
    req.session.user = req.body.user
    user = req.session.user
    console.log(req.session.user)
    res.redirect('/')
})

authRouter.get('/logout', (req, res) => {
    const user = 'anonimo'
    req.session.destroy()
    res.redirect('/')
    })

module.exports = authRouter;