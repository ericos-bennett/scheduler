import React from "react";
import classNames from 'classnames';

import "components/InterviewerListItem.scss";

const InterviewerListItem = (props) => {

  const {name, avatar, selected, setInterviewer} = props;

  const listItemClasses = classNames('interviewers__item',
    {'interviewers__item--selected': selected});

  const imgClasses = classNames('interviewers__item-image',
    {'interviewers__item-image--selected': selected});

  return (
    <li className={listItemClasses} onClick={setInterviewer}>
      <img
        className={imgClasses}
        src={avatar}
        alt={name}
      />
      {selected && name}
    </li>
  );
};

export default InterviewerListItem;
