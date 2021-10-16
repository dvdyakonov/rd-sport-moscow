import React from 'react';
import Button from 'components/Button';
import './Header.scss';

import firebase from "firebase/compat/app";

const Header = ({user, showAuthPopup}) => {
  return (
    <header className="header">
      <div className="header__logo">MOSSPORT</div>
      <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item">
          {user.email ? (
            <>
            {user.email}
            <Button className="header__nav-link" onClick={() => firebase.auth().signOut()}>Выход</Button>
            </>
          ) : (
            <Button className="header__nav-link" onClick={() => showAuthPopup(true)}>Авторизоваться</Button>
          )}
        </li>
      </ul>
    </nav>
    </header>
  )
}

export default Header;
