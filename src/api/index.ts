const router = require('express').Router();
const URI = require('./uri');
const USER_URI = require('uri').USER_URL;

router.get(URI.CHAT_ROOM_LIST, (req: any, res: any) => {
    res.send([{
        name: "test",
        limit: 100,
        current: 1
    }]);
});

export default router;