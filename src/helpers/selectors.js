export function getAppointmentsForDay(state, weekday) {
  const dayObj = state.days.filter(day => day.name === weekday);

  if (dayObj.length === 0) return [];

  const apptIds = dayObj[0].appointments;
  const appts = apptIds.map(apt => state.appointments[apt]);
  return appts;
};