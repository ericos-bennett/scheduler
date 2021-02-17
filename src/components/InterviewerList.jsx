import React from 'react';

import 'components/InterviewerList.scss';

import InterviewerListItem from 'components/InterviewerListItem';

const InterviewerList = props => {

  const { interviewers, value, onChange } = props;

  const InterviewerListItems = interviewers.map(person => {
    return (
      <InterviewerListItem 
        key = {person.id}
        name = {person.name}
        avatar = {person.avatar}
        selected = {person.id === value}
        setInterviewer = {() => onChange(person.id)}
      />
    );
  });

  return (
    <section className="interviewers">
      <h4 className="interviewers__header text--light">Interviewer</h4>
      <ul className="interviewers__list">
        {[InterviewerListItems]}
      </ul>
    </section>
  );
};

export default InterviewerList;
