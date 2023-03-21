require('dotenv').config();
const express = require('express');
request = require('request');
const {MongoClient, ObjectId} = require('mongodb');
const cors = require('cors');
const PORT = 5000;
const app = express();
//middlewares
app.use( cors() );
app.use( express.json() );

const DB_URL = process.env.DB_URL;
const client = new MongoClient(DB_URL);
async function startApp() {
    try {
        app.listen(PORT, () => {
            console.log('Сервер успешно запущен на 5000 порту');
        });
        await client.connect();
        console.log('Соединение с БД установлено');
    } catch(e) {
        console.log(e);
    }
}

// routers

// получение всех брендов авто (только название и id)
app.get('/brands', async (req, res) => {
    const bdDocument = client.db().collection('brands');
    const brands = [];
    // bdDocument.find возвращает курсор по 20 элементов поэтому нужно перебирать для обработки всех элементов
    await bdDocument.find({}, {projection: {brand: 1}})
        .forEach( brand => {
            brands.push(brand);
        })
        .then(() => {
            res.status(200).json(brands);
        })
        .catch((e) => {
            console.log(e);
        })
});

// получение всех марок авто выбранного бренда по id
app.get('/models', async (req, res) => {
    const bdDocument = client.db().collection('brands');
    const result = await bdDocument.findOne({_id: ObjectId(req.query.id)});
    const models = result.models;
    res.status(200).json(models);
});

// c фронтенда приходит массив уникальных материалов, для каждого материала нужно запросить актуальную цену с сайта https://stpshopnn.ru,
app.post('/materials', async (req, res) => {
    const {data} = req.body;
    const newData = await fetchMaterials(data);
    // самописное api на Wordpress
    request.post({ url: 'https://stpshopnn.ru/wp-json/calcjs/getprice/', form: {data: newData,} },
        (err, response, body) => {
            if (err) {
                return res.status(500).send({ message: err });
            } 
            // в качестве овтета получаем массив материалов с ценами и общей суммой.
            const resFromJSON = JSON.parse(body);
            // FIX: лучше проверять по статусу а не по ответу
            // Оператор опциональной цепочки не работает на старых версиях node
            if(resFromJSON.data?.status === 404){ //!!!
                return res.status(404).json(resFromJSON);
            }
            res.status(200).json(body);
        }
    );
// функция нужна чтобы у кажого материала запросить ссылку, чтобы  пользователь мог посмотреть каждый материал на сайте.
    async function fetchMaterials(data) {
        let materialsFullInfo = [];
        for(const element of data){
            const {materialId, count} = element;
            const bdDocument = client.db().collection('materials');
            const result = await bdDocument.findOne({_id: ObjectId(materialId)});
            const resultAddCount = {...result, count}
            materialsFullInfo.push(resultAddCount);
        }
        return materialsFullInfo;
    }
});

startApp();