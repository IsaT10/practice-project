import { TSchedule } from './offeredCourse.interface';

const parseTime = (time: string) => {
  const [timePart, period] = time.split(' ');
  let [hours, minutes] = timePart.split(':').map(Number);
  if (period === 'PM' && hours !== 12) hours += 12;

  if (period === 'AM' && hours === 12) hours = 0;
  return hours * 60 + minutes;
};

export const hasTimeConflict = (
  assignedSchedules: TSchedule[],
  newSchedules: TSchedule
) => {
  for (const schedules of assignedSchedules) {
    const existingStartTime = parseTime(schedules.startTime);
    const existingEndTime = parseTime(schedules.endTime);
    const newStartTime = parseTime(newSchedules.startTime);
    const newEndTime = parseTime(newSchedules.endTime);

    if (newStartTime < existingEndTime && newEndTime > existingStartTime) {
      return true;
    }
  }

  return false;
};
