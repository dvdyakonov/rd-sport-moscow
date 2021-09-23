import React from 'react';
import Button from '../Button';
import {ReactComponent as ArrowIcon} from './arrow.svg';
import './Header.scss';

const Header = ({setMapData, setStep, isResultsHidden, toggleResults}) => {
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
      <div className="header__info">
        <Button kind="info" className="header__action" onClick={() => toggleResults(!isResultsHidden)}>
          <ArrowIcon className={isResultsHidden ? 'icon--rotate' : undefined}/>
        </Button>
        {/* <Button kind="info"><span>i</span></Button> */}
      </div>
    </header>
  )
}

export default Header;
