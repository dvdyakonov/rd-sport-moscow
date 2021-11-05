import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import Button from 'components/Button';
import './Header.scss';

import firebase from "firebase/compat/app";



const Header = ({user, showAuthPopup}) => {
  const menuRef = useRef(null);

  useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
          if (menuRef.current && !menuRef.current.contains(event.target)) {
              setOpen(false);
          }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
          // Unbind the event listener on clean up
          document.removeEventListener("mousedown", handleClickOutside);
      };
  }, [menuRef]);
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);

  return (
    <header className="header">
      <div className="header__logo">MOSSPORT</div>
      <nav className="header__nav">
      <ul className="header__nav-list">
        <li className="header__nav-item">
          {user.email ? (
            <>
            <Button className="header__nav-link" onClick={toggle}>
              <img src={user.photo} alt={user.email} className="header__photo" />
            </Button>
            {
              open && <div className="header__nav-menu" ref={menuRef}>
                <Link to="/" className="header__nav-menu-link">Карта</Link>
                <Link to="/reports" className="header__nav-menu-link">Отчеты</Link>
                <Button className="header__nav-menu-link" onClick={() => firebase.auth().signOut()}>Выход</Button>
              </div>
            }
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
