'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS, ADD_TIME_SLOT_BATCH} from '../constants/Actiontypes';
import moment from 'moment';

let timeslotsRef;
let weekRef;

export function init (_stores, userRef) {
    timeslotsRef = userRef.child('timeslots');
    loadTimeSlots(moment().week(_stores.getState().calendar.get('week')).startOf('week'), moment().week(_stores.getState().calendar.get('week')).endOf('week'));
}

export default {
    loadTimeSlots, moveDay, setDuration, setStartHour, addTimeSlot
};

export function loadTimeSlots (start, end) {
    return dispatch => {
        dispatch({type: CLEAR_TIME_SLOTS});
        weekRef = timeslotsRef.orderByChild('date').startAt(start.format('DD-MM-YYYY')).endAt(end.format('DD-MM-YYYY'));
        weekRef.once('value', snapshot => {
            const timeSlotObj = snapshot.val() || {};
            const timeSlots = Object.keys(timeSlotObj).map(id => ({ id, ...timeSlotObj[id] }));
            dispatch({type: ADD_TIME_SLOT_BATCH, items: timeSlots});
        });
    };
}

function checkOverlap (start1, end1, start2, end2) {
    return ((start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2)) ||
        ((start2 >= start1 && start2 < end1) || (end2 > start1 && end2 <= end1));
}

function moveDay (id, from, to, start) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const end = start + timeSlots[from].find(timeSlot => timeSlot.id === id).duration;
        const toSlots = timeSlots[to];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            return previous || checkOverlap(start, end, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);

        if (conflict || start < 0) {
            return false;
        }
        const timeSlot = {
            date: to,
            start
        };
        timeslotsRef.child(id).update(timeSlot, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, id, ...timeSlot});
        });
    };
}

function setDuration (id, date, duration) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const start = timeSlots[date].find(timeSlot => timeSlot.id === id).start;
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            if (timeSlot.id === id) {
                return previous;
            }
            return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);
        if (conflict || start < 0) {
            return false;
        }
        timeslotsRef.child(id).update({duration}, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, id, duration});
        });
    };
}

function setStartHour (id, date, startHour) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const end = startHour + timeSlots[date].find(timeSlot => timeSlot.id === id).duration;
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            if (timeSlot.id === id) {
                return previous;
            }
            return previous || checkOverlap(startHour, end, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);
        if (conflict || startHour < 0) {
            return false;
        }

        const timeSlot = {
            start: startHour
        };
        timeslotsRef.child(id).update(timeSlot, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, id, ...timeSlot});
        });
    };
}

function addTimeSlot (project, subProject, activity, date, start, duration) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const toSlots = timeSlots[date];
        const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
            return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);
        if (conflict || start < 0) {
            return false;
        }
        const newRef = timeslotsRef.push();
        const timeSlot = {id: newRef.key(), project, subProject, activity, date, start, duration};
        newRef.set(timeSlot, error => {
            !error && dispatch({type: ADD_TIME_SLOT, ...timeSlot});
        });
    };
}
