import React from 'react';

import DayListItem from 'components/DayListItem';

const DayList = (props) => {

  const daysListItems = props.days.map((day, index) => {
    return (
      <DayListItem 
        key={index}
        name={day.name} 
        spots={day.spots}
        selected={day.name === props.day}
        setDay={props.setDay}  
      />
    );
  });

  return (
    [daysListItems]
  );
};

export default DayList;
