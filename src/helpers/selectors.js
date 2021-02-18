const getAppointmentsForDay = (state, weekday) => {
  const dayObj = state.days.filter(day => day.name === weekday);

  if (dayObj.length === 0) return [];

  const apptIds = dayObj[0].appointments;

  const appts = apptIds
    .map(apptId => state.appointments
      .find(appt => appt.id === apptId));

  return appts;
};

const getInterview = (state, interview) => {
  if (interview) {
    const thisInterviewer = state.interviewers[interview.interviewer]
    return {...interview, interviewer: thisInterviewer};
  } else {
    return null;
  }
};

export { getAppointmentsForDay, getInterview };
