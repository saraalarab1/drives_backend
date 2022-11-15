import { Sequelize } from 'sequelize';

const db = new Sequelize('loginDB', 'root', 'YOUR_PASSWORD', {
    dialect: 'mysql',
    host: 'localhost', 
});

export default db;