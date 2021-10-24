const getPopulation = (array) => {
    return array._objects.reduce((res, cur) => {
        res += cur.properties.get('residents');
        return res;
    }, 0)
}

export default getPopulation;