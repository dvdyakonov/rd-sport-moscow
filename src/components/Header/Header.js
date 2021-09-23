import React from 'react';
import Button from '../Button';
import { Link } from "react-router-dom";
import {ReactComponent as ArrowIcon} from './arrow.svg';
import './Header.scss';

const Header = ({setMapData, setStep}) => {
  return (
    <header className="header">
      <div className="header__logo" onClick={()=> {
        setMapData({
          coords: [55.751244, 37.618423],
          name: 'Москва',
          zoom: 10,
          distance: 1,
        });
        setStep(0);
      }}>QRNTN</div>
    <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item">
          <Link to="/profile">Профиль</Link>
        </li>
      </ul>
    </nav>
    </header>
  )
}

export default Header;
