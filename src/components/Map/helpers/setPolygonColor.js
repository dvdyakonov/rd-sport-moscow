const setPolygonColor = (polygon, square) => {
    const colors = [
        {
            min: 1000000,
            max: 10000000,
            color: "#025e29",
        },
        {
            min: 500000,
            max: 999999,
            color: "#025e29",
        },
        {
            min: 250000,
            max: 499999,
            color: "#00883c",
        },
        {
            min: 125000,
            max: 249999,
            color: "#05ac4b",
        },
        {
            min: 100000,
            max: 124999,
            color: "#5fcd56",
        },
        {
            min: 75000,
            max: 99999,
            color: "#b1e36e",
        },
        {
            min: 50000,
            max: 74999,
            color: "#e5f597",
        },
        {
            min: 25000,
            max: 49999,
            color: "#ffed98",
        },
        {
            min: 12500,
            max: 24999,
            color: "#ffc76c",
        },
        {
            min: 8000,
            max: 12499,
            color: "#ff914a",
        },
        {
            min: 5000,
            max: 7999,
            color: "#ff5631",
        },
        {
            min: 2500,
            max: 4999,
            color: "#eb2320",
        },
        {
            min: 0,
            max: 2499,
            color: "#b6001d",
        }
    ];

    const currentColor = colors.find(item => square >= item.min && square <= item.max).color;

    polygon.options.set("strokeColor", currentColor);
    polygon.options.set("fillColor", currentColor);
} 

export default setPolygonColor;