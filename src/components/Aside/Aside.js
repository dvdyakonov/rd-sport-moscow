import React, { useState } from 'react';
import Filters from '../Filters';
import './Aside.scss';

import {ReactComponent as ArrowIcon} from 'assets/icons/arrow.svg';

const Aside = () => {
  const [hide, setHide] = useState(false);
  const toggle = () => setHide(!hide);
  return (
    <aside className={`aside ${hide ? 'aside--hidden' : ''}`}>
      <Filters />
      <div className="aside__btn" onClick={toggle}>
        <ArrowIcon />
      </div>
    </aside>
  )
}

export default Aside;
