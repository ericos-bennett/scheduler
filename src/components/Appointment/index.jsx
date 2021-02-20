import React from 'react';

import 'components/Appointment/styles.scss';
import useVisualMode from 'hooks/useVisualMode';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Status from 'components/Appointment/Status';
import Form from './Form';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";

const Appointment = props => {

  const { id, time, interview, interviewers, bookInterview, cancelInterview } = props;

  const initial = interview ? SHOW : EMPTY;
  const { mode, transition, back } = useVisualMode(initial);

  const save = (name, interviewer) => {
    transition(SAVING);
    
    const interview = {
      student: name,
      interviewer
    };

    bookInterview(id, interview)
      .then(() => transition(SHOW));
  }

  const cancel = () => {
    // transition(DELETE);

    cancelInterview(id)

  };
 
  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={cancel}
        />
      )}
      {mode === CREATE && (
        <Form  
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === SAVING && (
        <Status message="Saving..." />
      )}
    </article>
  );
};

export default Appointment;
