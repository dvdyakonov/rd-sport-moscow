import React from 'react';
import cx from 'classnames';
import './Button.scss';

const Button = ({ kind, size, className, children, ...otherProps}) => {
  return (
    <button className={cx('button', { [`button--${size}`]: size, [`button--${kind}`]: kind }, className)} {...otherProps}>
      {children}
    </button>
  )
}

export default Button;
