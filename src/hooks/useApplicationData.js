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
      .then(appts => setState({ ...state, appointments: appts.data }))
    )
  };

  // Cancel Interview
  const cancelInterview = (id) => {

    return (axios.delete(`/api/appointments/${id}`)
      .then(() => axios.get('/api/appointments'))
      .then(appts => setState({ ...state, appointments: appts.data }))
    )
  };

  return { state, setDay, bookInterview, cancelInterview };
}

export default useApplicationData;
