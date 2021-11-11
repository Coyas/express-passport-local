const Sequelize = require('sequelize')

const sequelize = new Sequelize(
    'wifi',
    'root',
    'terrasystem',
    {
        host: "localhost",
        dialect: 'mysql'
    }
);

sequelize.authenticate().then( res => {
    console.log("conectado ao db com sucesso"+res);
}).catch((erro) => {
    console.log("Falha ao conectar com o db(teste) " + erro);
});

module.exports = sequelize;