import React from "react";

// Styling
import "./Application.scss";

// Selectors
import { 
  getAppointmentsForDay, 
  getInterviewersForDay, 
  getInterview 
} from 'helpers/selectors';

// Custom Hooks
import useApplicationData from 'hooks/useApplicationData';

// Components
import DayList from './DayList';
import Appointment from './Appointment';

const Application = () => {
  
  // Deconstruct the state management module
  const {
    state, setDay, bookInterview, cancelInterview
  } = useApplicationData();

  // Return the appointment JSX for the selected day
  const appointmentsForDay = getAppointmentsForDay(state, state.day);
  const interviewersForDay = getInterviewersForDay(state, state.day);
  const appointmentList = appointmentsForDay.map(appt => {
    const interview = getInterview(state, appt.interview);
    return (
      <Appointment
        key={appt.id}
        id={appt.id}
        time={appt.time}
        interview={interview}
        interviewers={interviewersForDay}
        bookInterview={bookInterview}
        cancelInterview={cancelInterview}
      />
    );
  });

  // Return the entire app's JSX
  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
        <DayList
          days={state.days}
          day={state.day}
          setDay={setDay}
        />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {[appointmentList]}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
};

export default Application;
