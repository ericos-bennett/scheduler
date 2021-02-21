import { useState, useEffect } from 'react';
import axios from 'axios';

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

    return (axios.put(`/api/appointments/${id}`, appointment)
      .then(() => axios.get('/api/appointments'))
      .then(appts => {
        const days = updateSpots(
          state.day, 
          state.days, 
          appts.data)
        setState({ ...state, appointments: appts.data, days: days })
      })
    )
  };

  // Cancel Interview
  const cancelInterview = (id) => {

    return (axios.delete(`/api/appointments/${id}`)
      .then(() => axios.get('/api/appointments'))
      .then(appts => {
        const days = updateSpots(
          state.day, 
          state.days, 
          appts.data)
        setState({ ...state, appointments: appts.data, days: days })
      })
    )
  };

  return { state, setDay, bookInterview, cancelInterview };
}

export default useApplicationData;
