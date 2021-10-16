const attachYandexHeatmap = (ymaps) => {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js`;
    const x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);

    const l = () => {
        window.ymaps = ymaps || [];
    };

    if (document.readyState === 'complete') {
        l();
    } else if (window.attachEvent) {
        window.attachEvent('onload', l);
    } else {
        window.addEventListener('load', l, false);
    }
};

export default attachYandexHeatmap