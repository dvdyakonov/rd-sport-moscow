import React from 'react';
import {ReactComponent as FacebookIcon} from './icons/facebook.svg';
import {ReactComponent as VkIcon} from './icons/vk.svg';
import {ReactComponent as OkIcon} from './icons/ok.svg';
import {ReactComponent as TwitterIcon} from './icons/twitter.svg';
import {ReactComponent as TelegramIcon} from './icons/telegram.svg';
import {ReactComponent as WhatsAppIcon} from './icons/whatsapp.svg';
import firebase from "firebase/compat/app";
import "firebase/compat/analytics";
import './Share.scss';

const num2str = (n) => {
  const textForms = ['случай', 'случая', 'случаев'];
  n = Math.abs(n) % 100; var n1 = n % 10;
  if (n > 10 && n < 20) { return textForms[2]; }
  if (n1 > 1 && n1 < 5) { return textForms[1]; }
  if (n1 === 1) { return textForms[0]; }
  return textForms[2];
}

const Share = ({data, points, yourPoints}) => {
  const text = `Рядом со мной ${points} ${num2str(points)} заражения коронавирусом. Проверь, насколько ты в безопасности!`;
  const url = window.location.origin;
  const items = {
    vk: {
      url: `https://vk.com/share.php?url=${url}&comment=${text}`,
      icon: <VkIcon className="share__item-icon" />,
    },
    ok: {
      url: `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.shareUrl=${url}`,
      icon: <OkIcon className="share__item-icon" />
    },
    facebook: {
      url: `https://www.facebook.com/sharer.php?u=${url}`,
      icon: <FacebookIcon className="share__item-icon" />
    },
    whatsapp: {
      url: `https://wa.me/?text=${url} ${text}`,
      icon: <WhatsAppIcon className="share__item-icon" />
    },
    telegram: {
      url: `tg://msg?text=${text} ${url}`,
      icon: <TelegramIcon className="share__item-icon" />
    },
    twitter: {
      url: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
      icon: <TwitterIcon className="share__item-icon" />
    },
  };
  return (
    <>
      <div className="share">
        <p className="share__description">Поделитесь этой информацией с&nbsp;друзьями и близкими!</p>
        <div className="share__items">
          {Object.keys(items).map(name => {
            const item = items[name];
            return (
              <a
                key={name}
                href={item.url}
                className={`share__item share__item--${name}`}
                target="_blank"
                rel="noopener noreferrer"
                title={item.title}
                onClick={() => {
                  firebase.analytics().logEvent('result_share', {
                    source: name,
                  });
                }}
              >
                  {item.icon}
              </a>
            )
          })}
        </div>
      </div>
    </>
  )
}

export default Share;
