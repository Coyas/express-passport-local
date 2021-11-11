const express = require('express')
const handle = require('express-handlebars')
const bodyParser = require('body-parser')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const LocalStrategy = require('passport-local').Strategy
const logger = require('morgan');
const passport = require('passport')
const bcrypt = require('bcrypt')
let MySQLStore = require('express-mysql-session')(session)


const app = express()
app.use(logger('dev'))
// inportar rotas
const home = require('./routes/home')

// create a database sessionStorage
let options = {
    host: 'localhost',
    user: 'root',
    password: 'terrasystem',
    database: 'wifi',
    // database: 'wifianywhere',
    // socketPath: '/var/lib/mysql/mysql.sock'  //use isso, se houver error connrefused
};
/*********** cria uma tabela para guardar sessao no banco de dados **********/
let sessionStore = new MySQLStore(options);
//inportar models
const User = require('./models/user')

app.engine('handlebars', handle({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(cookieParser());

app.use(session({
    key: 'locallogin-cookie',
    secret: 'qsqdqsjhqsdjkdq',
    resave: false,
    store: sessionStore,
    saveUninitialized: false,
    // cookie: { secure: true}  //for https
}));
// Passport init 
app.use(passport.initialize());
app.use(passport.session());


passport.use(new LocalStrategy(
    // {
    //     usernameField: 'email'
    //     passwordField: 'password'
    // },
    function(username, password, done) {
        console.log('local estrategy');
        console.log(username);
        console.log(password);
        // return done(null, false);
        console.log('encima do user.findone');
        User.findOne({
            where: {
                email: username,
            }
        }).then( user => {
            if (!user) {
                return done(null, false, { message: 'Este email parece nao existir.' });
            }
            console.log('if.bcrypt  do user.findone');
            if (!bcrypt.compareSync(password, user.password)) {
                console.log('erro ao compara o password com bcrypt')
                return done(null, false, { message: 'Incorrect password.' });
            }
        
            return done(null, user);
        }).catch( err => {
            console.log('dentro do callback do user.findone');
            return done(err);
        })
    }
))


    


passport.serializeUser((user, done) => {
    console.log('serialize user: '+user)
    done(null, user.id);
});
  
passport.deserializeUser((id, done) => {
    User.findByPk(id).then( user => {
        console.log('deserialize user: '+user)
        done(null, user)
    }).catch( err => {
        console.log('erro no deserialize user: '+err)
    })
})


app.use('/', home)
app.post('/login', passport.authenticate('local', {
    successRedirect: '/dash',
    failureRedirect: '/login' 
}))


const port = 3000
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
