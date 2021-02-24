import React from "react";
import classNames from 'classnames';

import "components/DayListItem.scss";

const DayListItem = (props) => {
  
  const listItemClasses = classNames('day-list__item',
    {'day-list__item--full': props.spots === 0,
     'day-list__item--selected': props.selected});

  const formatSpots = (spots) => {
    if (spots === 0) return 'no spots';
    if (spots === 1) return '1 spot';
    if (spots >= 2) return `${spots} spots`;
  }

  return (
    <li
      className={listItemClasses}
      onClick={() => props.setDay(props.name)}
      data-testid='day'
    >
      <h2 className="text--regular">{props.name}</h2> 
      <h3 className="text--light">{formatSpots(props.spots)} remaining</h3>
    </li>
  );
};

export default DayListItem;
