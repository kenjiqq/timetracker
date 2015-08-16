import {init as projectInit} from './ProjectActions';
import {init as timeslotInit} from './TimeSlotActions';
import {init as calendarInit} from './CalendarActions';

export function init(store, userRef) {
    projectInit(store, userRef);
    timeslotInit(store, userRef);
    calendarInit(store, userRef);
}
