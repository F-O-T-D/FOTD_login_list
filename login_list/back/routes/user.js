const express = require('express');
const User=require('../models/user');
const Map=require('../models/map');
const UserController = require('../controllers/UserController');

const router = express.Router();

router.post('/insert', UserController.insert);
router.get('/checkEmail/:email', UserController.checkEmail);
router.post('/login', UserController.login);
router.put('/update', UserController.update);
router.delete('/delete/:id', UserController.delete);

router.get('/:userId/store', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log('userId from params:', userId);
        const storeId = req.params.storeId;
        console.log('storeId from params:', storeId);

        // 데이터베이스에서 해당 사용자의 가게 정보 조회
        const maps = await Map.findAll({
            where: { userId },
        });

        res.json(maps);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/:userId/store/:storeId', async (req, res, next) => {
    try {
        const userId=req.params.userId;
        console.log('userId from params:', userId);
        const storeId=req.params.storeId;
        console.log('storeId from params:', storeId);

        console.log('사용자 데이터 조회 중');

        const user=await User.findByPk(userId, {
            include: {
                model: Map,
                as:'maps',
            }
        });

        if (!user) {
            res.status(404).json({message: 'User not found'})
            return;
        }

        console.log('가게 데이터 조회 중');

        const selectedStore = user.maps.find(store => store.storeId === Number(storeId));
        console.log('selectedStore:', selectedStore);

        if (!selectedStore) {
            return res.status(404).json({ message: 'Store not found for this user' });
        }
        const selectedSotreInfo = {
            storeId: selectedStore.storeId,
            name: selectedStore.name, //가게 이름
            latitude: selectedStore.lat, //위도
            longitude: selectedStore.lng, //경도
            
        };
        console.log('선택된 가게 정보', selectedSotreInfo);

        console.log('가게 정보 전송 중');
        
        res.json({store:selectedSotreInfo});

        console.log('전송 완료');
    } catch(error) {
        console.error(error);
        next(error);
    }
});


// 특정 사용자의 특정 가게를 삭제
router.delete('/:userId/store/:storeId', async (req, res, next) => {
    try {
        const userId = req.params.userId;
        console.log('userId from params:', userId);
        const storeId = req.params.storeId;
        console.log('storeId from params:', storeId);

        // 사용자와 가게 모두 존재하는지 확인
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const store = await Map.findByPk(storeId);
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        // storeId에 해당하는 가게를 삭제
        await Map.destroy({
            where: {
                storeId: storeId, 
            },
        });        
        res.json({ message: 'Store removed from user' });
        console.log('삭제 완료');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

 module.exports=router;