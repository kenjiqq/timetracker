import { combineReducers } from 'redux';

import projects from './ProjectReducer';
import timeSlots from './TimeSlotReducer';
import calendar from './CalendarReducer';

const rootReducer = combineReducers({
    projects,
    timeSlots,
    calendar
});

export default rootReducer;

