export default function asyncWrapper(callback: Function) {
    return (req:any, res:any, next:any) => {
        callback(req, res, next)
            .catch(next);
    }
}