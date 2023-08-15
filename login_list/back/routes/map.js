const express = require('express');
const Map = require('../models/map');
//const User=require('../models/user');
const axios = require('axios');
const router = express.Router();

const KAKAO_API_KEY = process.env.KAKAO_API_KEY;

//카카오 지도 정보 검색
router.get('/', async (req, res, next) => {
    try {
        console.log('라우터 호출 확인');
        //const userId = req.body.userId;
        //console.log('userId from params:', userId);
        const { query } = req.query;
        //const userId=1;

        //const userId = req.user.id;

        // 카카오 키워드 장소 검색 API 호출
        const response = await axios.get('https://dapi.kakao.com/v2/local/search/keyword.json', {
            params: {
                query,
            },
            headers: {
                Authorization: `KakaoAK ${KAKAO_API_KEY}`,
            },
        });
        console.log('검색 완료')
        res.json(response.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 카카오 지도 정보 저장 API 요청
router.post('/', async (req, res, next) => {
    try {
        //const userId=req.params.userId;
        const userId = req.body.userId;
        console.log('userId', userId);
        //const userId = req.user.id;
        //const userId=1;
        
        if (!req.body.userId) {
            console.log(req.body);
            console.log('userId is missing'); // 조건 확인 로그
            res.status(400).send('userId is missing');
            return;
        }
        // 데이터베이스에 지도 정보 저장
        const map = await Map.create({
            userId,
            name: req.body.name,
            lng: req.body.lng,
            lat: req.body.lat,
        });

        console.log('데이터가 저장되었습니다.');
        console.log(map);
        res.status(201).json(map);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports=router;