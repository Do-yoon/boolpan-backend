import mongoose from "mongoose"
import process from "process";

const {MONGO_ID, MONGO_PASSWORD, NODE_ENV} = process.env
const MONGO_URL = NODE_ENV === 'production'
    ? `mongodb://mongo:27017`
    : 'mongodb://localhost:27017'

const connect = () => {
    if (NODE_ENV !== 'production')
        mongoose.set('debug', true)
    mongoose.connect(`${MONGO_URL}/my_database`,{
        dbName: 'chat'
    })
        .then(() => console.log("database link success"))
        .catch((err) => console.log(err));
};

mongoose.connection.on('error', (error) => {
    console.error("몽고디비 연결 에러")
})

mongoose.connection.on