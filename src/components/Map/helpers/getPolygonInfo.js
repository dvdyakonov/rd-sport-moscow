const getPolygonInfo = (array) => {

    return {
        "square": array._objects.reduce((res, cur) => {
            res += cur.properties.get('square');
            return res;
        }, 0),
        "objects": array._objects.length,
        "areas": array._objects.reduce((res, cur) => {
            res += cur.properties.get('areas');
            return res;
        }, 0),
    }
}

export default getPolygonInfo;