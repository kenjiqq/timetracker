'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS, ADD_TIME_SLOT_BATCH} from '../constants/Actiontypes';
import moment from 'moment';

let timeslotsRef;
let weekRef;

export function init (_stores, userRef) {
    timeslotsRef = userRef.child('timeslots');
    _stores.dispatch(loadTimeSlots(moment().week(_stores.getState().calendar.get('week')).startOf('week'), moment().week(_stores.getState().calendar.get('week')).endOf('week')));
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
            dispatch({type: ADD_TIME_SLOT_BATCH, payload: timeSlots});
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
        const curTimeSlot = timeSlots.items[id];
        const conflict = (timeSlots.dates[to] || []).reduce(function (previous, timeSlotId) {
            const timeSlot = timeSlots.items[timeSlotId];
            return previous || checkOverlap(start, start + curTimeSlot.duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);

        if (conflict || start < 0) {
            return false;
        }
        const data = {
            date: to,
            start
        };
        timeslotsRef.child(id).update(data, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, payload: {id, ...data}});
        });
    };
}

function setDuration (id, date, duration) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const curTimeSlot = timeSlots.items[id];
        const conflict = (timeSlots[curTimeSlot.date] || []).reduce(function (previous, timeSlotId) {
            if (timeSlotId === id) {
                return previous;
            }
            const timeSlot = timeSlots.items[timeSlotId];
            return previous || checkOverlap(curTimeSlot.start, curTimeSlot.start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);
        if (conflict || curTimeSlot.start < 0) {
            return false;
        }
        timeslotsRef.child(id).update({duration}, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, payload: {id, duration}});
        });
    };
}

function setStartHour (id, date, startHour) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const curTimeSlot = timeSlots.items[id];
        const conflict = (timeSlots.dates[curTimeSlot.date] || []).reduce(function (previous, timeSlotId) {
            if (timeSlotId === id) {
                return previous;
            }
            const timeSlot = timeSlots.dates[date];
            return previous || checkOverlap(startHour, startHour + curTimeSlot.duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);
        if (conflict || startHour < 0) {
            return false;
        }

        const data = {
            start: startHour
        };
        timeslotsRef.child(id).update(data, error => {
            !error && dispatch({type: EDIT_TIME_SLOT, payload: {id, ...data}});
        });
    };
}

function addTimeSlot (project, subProject, activity, date, start, duration) {
    return (dispatch, getState) => {
        const timeSlots = getState()['timeSlots'].toJS();
        const conflict = (timeSlots.dates[date] || []).reduce(function (previous, timeSlotId) {
            const timeSlot = timeSlots.items[timeSlotId];
            return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
        }, false);

        if (conflict || start < 0) {
            return false;
        }
        const newRef = timeslotsRef.push();
        const timeSlot = {id: newRef.key(), project, subProject, activity, date, start, duration};
        newRef.set(timeSlot, error => {
            !error && dispatch({type: ADD_TIME_SLOT, payload: {...timeSlot}});
        });
    };
}
