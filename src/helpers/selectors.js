const getAppointmentsForDay = (state, weekday) => {
  const dayObj = state.days.filter(day => day.name === weekday);

  if (dayObj.length === 0) return [];

  const apptIds = dayObj[0].appointments;

  const appts = apptIds
    .map(apptId => state.appointments[apptId]);

  return appts;
};

const getInterviewersForDay = (state, weekday) => {
  const dayObj = state.days.filter(day => day.name === weekday);

  if (dayObj.length === 0) return [];

  const interviewIds = dayObj[0].interviewers;

  const interviewers = interviewIds
    .map(interviewIds => state.interviewers[interviewIds]);

  return interviewers;
};

const getInterview = (state, interview) => {
  if (interview) {
    const thisInterviewer = state.interviewers[interview.interviewer]
    return {...interview, interviewer: thisInterviewer};
  } else {
    return null;
  }
};

export { getAppointmentsForDay, getInterviewersForDay, getInterview };
