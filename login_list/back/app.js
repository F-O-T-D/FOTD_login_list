const express = require('express');
const {sequelize}=require('./models');
const bodyParser=require('body-parser');
const cors=require('cors');
const userController = require('./controllers/UserController'); 


require('dotenv').config();
require('dotenv').config({ path: 'mysql/.env' });

const userRouter=require('./routes/user');
const mapRouter=require('./routes/map');

const app = express();
const PORT=3000;

app.use(cors());
app.use(bodyParser.json());

app.use(
    express.json({
        limit: '50mb',
    })
);

app.use('/api/user_table/:userId/map', mapRouter);
app.use('/api/user_table', userRouter);

sequelize.sync({ force: false })
    .then(() => {
        console.log('success');
    })
    .catch((error) => {
        console.error('db sync error ', error);
    });


app.use((req, res, next) => {
    const error=new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    next(error);
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
