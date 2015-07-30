'use strict';
import {MOVE_TIME_SLOT, SET_DURATION_TIME_SLOT, SET_START_HOUR_TIME_SLOT, ADD_TIME_SLOT} from '../constants/Actiontypes';

function checkOverlap(start1, end1, start2, end2) {
    return ((start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2)) ||
        ((start2 >= start1 && start2 < end1) || (end2 > start1 && end2 <= end1));
}

export function moveDay(id, from, to, start) {
    return (dispatch, getState) => {
        const { timeSlots } = getState();
        const end = start + timeSlots[from].find(timeSlot => timeSlot.id === id).duration;
        const toSlots = timeSlots[to];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
             return previous || checkOverlap(start, end, timeSlot.start, timeSlot.start + timeSlot.duration);
         }, false);

        if(conflict || start < 0) {
            return false;
        }
        dispatch({
            type: MOVE_TIME_SLOT,
            id,
            to,
            from,
            start
        });
    };
}

export function setDuration(id, date, duration) {
    return (dispatch, getState) => {
        const { timeSlots } = getState();
        const start = timeSlots[date].find(timeSlot => timeSlot.id === id).start;
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            if(timeSlot.id === id) {
                return previous;
            }
             return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
         }, false);
        if(conflict || start < 0) {
            return false;
        }
        dispatch({
            type: SET_DURATION_TIME_SLOT,
            id,
            duration,
            date
        });
    };
}

export function setStartHour(id, date, startHour) {
    return (dispatch, getState) => {
        const { timeSlots } = getState();
        const end = startHour + timeSlots[date].find(timeSlot => timeSlot.id === id).duration;
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            if(timeSlot.id === id) {
                return previous;
            }
             return previous || checkOverlap(startHour, end, timeSlot.start, timeSlot.start + timeSlot.duration);
         }, false);
        if(conflict || startHour < 0) {
            return false;
        }
        dispatch({
            type: SET_START_HOUR_TIME_SLOT,
            id,
            startHour,
            date
        });
    };
}

export function addTimeSlot(project, subProject, activity, date, start, duration) {
    return (dispatch, getState) => {
        const { timeSlots } = getState();
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
             return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
         }, false);
        if(conflict || start < 0) {
            return false;
        }
        dispatch({
            type: ADD_TIME_SLOT,
            project,
            subProject,
            activity,
            date,
            start,
            duration
        });
    };
}
