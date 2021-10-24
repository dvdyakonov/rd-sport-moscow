const getSquare = (array) => {
    return array._objects.reduce((res, cur) => {
        res += cur.properties.get('square');
        return res;
    }, 0)
}

export default getSquare;