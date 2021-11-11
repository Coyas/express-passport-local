const router = require('express').Router()
const User = require('../models/user');
const bcrypt = require('bcrypt');
const saltRounds = 10;

router.get('/', authenticationMiddleware(), (req, res) => {
    console.log('user is: ' + req.user)
    console.log('user is autenticado: ' + req.isAuthenticated())
    
    res.render('index', {
        username: req.user.username,
        Email: req.user.email
    })
})

router.get('/login', (req, res) => {
    res.render("login")
})

router.get('/logout', (req, res) => {
    console.log('logout com sucesso');
    req.logout();
    req.session.destroy();//limpar a sessao do banco de dados
    res.redirect('/login');// e sera redirecionado para login
});

router.get('/dash', authenticationMiddleware(), (req, res) => {
    console.log('user is: ' + req.user)
    console.log('user is autenticado: ' + req.isAuthenticated())
    res.render("dashboard",{
        username: req.user.username,
        Email: req.user.email
    })
})



router.get('/cadastro', (req, res) => {
    console.log('user cadastro is: ' + req.user)
    console.log('user cadastro is autenticado: ' + req.isAuthenticated())
    res.render('cadastro')
})
router.post('/cadastro', (req, res) => {
    // tested e logs
    console.log('username: '+req.body.username)
    console.log('email: '+req.body.email)
    console.log('password: '+req.body.password)
 
    // criptografando a senha
    const password = req.body.password
    bcrypt.hash(password, saltRounds, function(err, hash) {
        // create user
        User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
        }).then( user => {
            console.log('cadastro feito com sucesso<br>*********** dados do cadastro **********************<br><br>username: '+req.body.username+'<br>email: '+req.body.email+'<br>password: '+req.body.password+'<br>password criptografado: '+hash)
            req.login(user, (err) => {
                console.log('login done com sucesso no registrar');
                res.redirect('dash');
            });
        }).catch((err) => {
            console.log('erro ao cadastrar o user: '+err)
        })

        // res.send('*********** dados do cadastro **********************<br><br>username: '+req.body.username+'<br>email: '+req.body.email+'<br>password: '+req.body.password+'<br>password criptografado: '+hash)
    })
})

/******* verifica se uma sessao esta ativa, isto é, se um user foi autenticado ***********/
function authenticationMiddleware(){
    return (req, res, next) => {
        console.log(` o middlewhere para sessao (req.session.passport.user): ${JSON.stringify(req.session.passport)}`);
        if(req.isAuthenticated()) return next();
        res.redirect('/login');
    };
}

module.exports = router