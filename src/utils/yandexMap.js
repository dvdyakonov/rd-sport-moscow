import config from 'config/app.json';

const attachYandexMap = (callback) => {
    const { yandexMapConfig: { apikey } } = config;
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = `https://api-maps.yandex.ru/2.1/?lang=ru-RU&amp;apikey=${apikey}`;
    const x = document.getElementsByTagName('script')[0];
    s.onload = function(){
        callback();
    }
    x.parentNode.insertBefore(s, x);
};

export default attachYandexMap