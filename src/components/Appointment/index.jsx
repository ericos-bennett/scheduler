import React from 'react';

import 'components/Appointment/styles.scss';
import useVisualMode from 'hooks/useVisualMode';

import Header from 'components/Appointment/Header';
import Show from 'components/Appointment/Show';
import Empty from 'components/Appointment/Empty';
import Status from 'components/Appointment/Status';
import Form from './Form';
import Confirm from './Confirm';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE"
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

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
    transition(DELETE);
    cancelInterview(id)
      .then(() => transition(EMPTY))
  };

  return (
    <article className="appointment">
      <Header time={time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show
          student={interview.student}
          interviewer={interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
      )}
      {mode === CREATE && (
        <Form  
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
        />
      )}
      {mode === EDIT && (
        <Form  
          interviewers={interviewers}
          onCancel={() => back()}
          onSave={save}
          name={interview.student}
          interviewer={interview.interviewer.id}
        />
      )}
      {mode === SAVING && (
        <Status message="Saving..." />
      )}
      {mode === DELETE && (
        <Status message="Deleting..." />
      )}
      {mode === CONFIRM && (
        <Confirm 
          message="Are you sure you want to delete this?" 
          onCancel={() => back()} 
          onConfirm={cancel}
        />
      )}
    </article>
  );
};

export default Appointment;
