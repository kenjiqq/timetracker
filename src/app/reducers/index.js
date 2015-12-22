import { combineReducers } from 'redux';

import projects from './ProjectReducer';
import subProjects from './SubProjectReducer';
import timeSlots from './TimeSlotReducer';
import calendar from './CalendarReducer';

const rootReducer = combineReducers({
    projects,
    subProjects,
    timeSlots,
    calendar
});

export default rootReducer;
