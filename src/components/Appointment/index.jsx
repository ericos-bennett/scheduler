import React from 'react';

import './styles.scss';
import useVisualMode from 'hooks/useVisualMode';

import Header from './Header';
import Show from './Show';
import Empty from './Empty';
import Status from './Status';
import Form from './Form';
import Confirm from './Confirm';
import Error from './Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETE = "DELETE"
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

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
      .then(() => transition(SHOW))
      .catch(() => transition(ERROR_SAVE, true));
  }

  const cancel = () => {
    transition(DELETE, true);
    cancelInterview(id)
      .then(() => transition(EMPTY))
      .catch(() => transition(ERROR_DELETE, true));
  };

  return (
    <article className="appointment" data-testid="appointment">
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
      {mode === ERROR_SAVE && (
        <Error
          message="Save problem!"
          onClose={() => back()}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Delete problem!"
          onClose={() => back()}
        />
      )}
    </article>
  );
};

export default Appointment;
