import { useState, useEffect } from 'react';
import axios from 'axios';

/* The useApplicationData hook manages all of the application's state and its axios connections to the database API */

const useApplicationData = () => {

  const [state, setState] = useState({
    day: 'Monday',
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });

  const updateSpots = (day, days, appointments) => {

    const newDays = [ ...days ];

    const dayObj = newDays.find(d => d.name === day);
    const dayObjIndex = newDays.findIndex(d => d.name === day);

    const apptIds = dayObj.appointments;
    
    let spots = 0;
    for (const id of apptIds) {
      const appointment = appointments[id];
      if (!appointment.interview) spots++;
    }

    const newDayObj = { ...dayObj, spots };

    newDays.splice(dayObjIndex, 1, newDayObj);

    return newDays;
  }

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
  
  // Book Interview
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
        const days = updateSpots(state.day, state.days, appointments);
        setState({ ...state, appointments, days })
      })
    )
  };

  // Cancel Interview
  const cancelInterview = (id) => {

    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    return (axios.delete(`/api/appointments/${id}`)
      .then(() => {
        const days = updateSpots(state.day, state.days, appointments);
        setState({ ...state, appointments, days })
      })
    )
  };

  return { state, setDay, bookInterview, cancelInterview };
}

export default useApplicationData;
