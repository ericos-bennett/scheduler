import React from "react";
import classNames from 'classnames';

import "components/Button.scss";

const Button = (props) => {

  const buttonClasses = classNames('button', 
    {'button--confirm': props.confirm,
     'button--danger': props.danger})

  return (
    <button
      className={buttonClasses}
      disabled = {props.disabled}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};

export default Button;
