'use strict';
import {MOVE_TIME_SLOT, SET_DURATION_TIME_SLOT, SET_START_HOUR_TIME_SLOT, ADD_TIME_SLOT} from '../constants/Actiontypes';

export function moveDay(id, from, to, start) {
    return {
        type: MOVE_TIME_SLOT,
        id,
        to,
        from,
        start
    };
}

export function setDuration(id, date, duration) {
    return {
        type: SET_DURATION_TIME_SLOT,
        id,
        duration,
        date
    };
}

export function setStartHour(id, date, startHour) {
    return {
        type: SET_START_HOUR_TIME_SLOT,
        id,
        startHour,
        date
    };
}

export function addTimeSlot(project, date, start, duration) {
    return {
        type: ADD_TIME_SLOT,
        project,
        date,
        start,
        duration
    };
}
