import React, { useState, useEffect } from "react";
import axios from 'axios';

import "components/Application.scss";

import DayList from 'components/DayList';
import Appointment from 'components/Appointment';

import getAppointmentsForDay from 'helpers/selectors';

const Application = props => {
  
  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: []
  });

  const setDay = day => setState({ ...state, day });

  useEffect(() => {
    
    const daysRequest = axios.get('/api/days');
    const appointmentsRequest = axios.get('/api/appointments');
    
    Promise.all([daysRequest, appointmentsRequest])
      .then((responses) => {
    
      const [daysResponse, appointmentsRespose] = responses;
  
      const daysData = daysResponse.data;
      const appointmentsObj = appointmentsRespose.data;

      const apptsData = [];
      for (let appt in appointmentsObj) {
        apptsData.push(appointmentsObj[appt]);
      }

      setState(current => ({
        ...current, 
        days: daysData, 
        appointments: apptsData
      }));

    });

  }, [])

  const appointmentsForDay = getAppointmentsForDay(state, state.day);

  const appointmentList = appointmentsForDay.map(appt => {
    return (
      <Appointment key={appt.id} {...appt} />
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
