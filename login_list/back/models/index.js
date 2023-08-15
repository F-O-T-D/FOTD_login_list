const Sequelize=require('sequelize');

const env=process.env.NODE_ENV || 'development';
const config=require('../config/config')[env];
const User=require('./user');
const Map=require('./map');
const db={};
const sequelize=new Sequelize(config.database, config.username, config.password, config);


db.sequelize=sequelize;

db.User=User;
db.Map=Map;

User.init(sequelize);
Map.init(sequelize);

User.associate(db);
Map.associate(db);

module.exports=db;

