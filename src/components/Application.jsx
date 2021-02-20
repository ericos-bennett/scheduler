import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

import { getAppointmentsForDay, getInterviewersForDay, getInterview } from 'helpers/selectors';

const Application = () => {
  
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    
    const daysReq = axios.get('/api/days');
    const appointmentsReq = axios.get('/api/appointments');
    const interviewersReq = axios.get('/api/interviewers');
    
    Promise.all([daysReq, appointmentsReq, interviewersReq])
      .then((responses) => {
    
      const [daysRes, appointmentsRes, interviewersRes] = responses;
  
      const days = daysRes.data;
      const appointments = appointmentsRes.data;
      const interviewers = interviewersRes.data;

      setState(current => ({
        ...current, 
        days, 
        appointments,
        interviewers
      }));

    });

  }, [])
  
  const bookInterview = (id, interview) => {

    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (axios.put(`/api/appointments/${id}`, appointment)
      .then(() => {
        setState({ ...state, appointments });
    })
      .catch(err => console.log(err))
    )
  }

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
      />
    );
  });

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
