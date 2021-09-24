import React, { useState, useEffect } from 'react';
import { Popover } from 'react-tiny-popover'

const FilterStatus = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState();

  return <div className="filters__item filter__status">
    <Popover
      isOpen={isPopoverOpen}
      positions={['bottom']}
      align="end"
      onClickOutside={() => setIsPopoverOpen(false)}
      content={<div>Hi! I'm popover content.</div>}
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)} className="filters__btn">
        Status
      </div>
    </Popover>
  </div>
}

export default FilterStatus;
