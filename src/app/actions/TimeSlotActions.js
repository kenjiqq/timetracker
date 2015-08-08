'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS} from '../constants/Actiontypes';
import Ref from '../constants/AsyncAdapter';

let timeslotsRef;
let stores, weekRef, childAddedCallback, childChangedCallback;

export function init(_stores, userRef) {
    timeslotsRef = userRef.child('timeslots');

    stores = _stores;
}

export function loadTimeSlots(start, end) {
    stores.dispatch({type: CLEAR_TIME_SLOTS});
    if(weekRef) {
        weekRef.off('child_added', childAddedCallback);
        weekRef.off('child_changed', childChangedCallback);
    }
    weekRef = timeslotsRef.orderByChild('date').startAt(start.format('DD-MM-YYYY')).endAt(end.format('DD-MM-YYYY'));
    childAddedCallback = snapshot => stores.dispatch({type: ADD_TIME_SLOT, id: snapshot.key(), ...snapshot.val()});
    childChangedCallback = snapshot => stores.dispatch({type: EDIT_TIME_SLOT, id: snapshot.key(), ...snapshot.val()});
    weekRef.on('child_added', childAddedCallback);
    weekRef.on('child_changed', childChangedCallback);
}

function checkOverlap(start1, end1, start2, end2) {
    return ((start1 >= start2 && start1 < end2) || (end1 > start2 && end1 <= end2)) ||
        ((start2 >= start1 && start2 < end1) || (end2 > start1 && end2 <= end1));
}

export function moveDay(id, from, to, start) {
    const timeSlots = stores.getState()['timeSlots'].toJS();
    const end = start + timeSlots[from].find(timeSlot => timeSlot.id === id).duration;
    const toSlots = timeSlots[to];
    const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
         return previous || checkOverlap(start, end, timeSlot.start, timeSlot.start + timeSlot.duration);
     }, false);

    if(conflict || start < 0) {
        return false;
    }
    timeslotsRef.child(id).update({
        date: to,
        start
    });
}

export function setDuration(id, date, duration) {
    const timeSlots = stores.getState()['timeSlots'].toJS();
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
    timeslotsRef.child(id).update({
        duration
    });
}

export function setStartHour(id, date, startHour) {
    const timeSlots = stores.getState()['timeSlots'].toJS();
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
    timeslotsRef.child(id).update({
        start: startHour
    });
}

export function addTimeSlot(project, subProject, activity, date, start, duration) {
    const timeSlots = stores.getState()['timeSlots'].toJS();
    const toSlots = timeSlots[date];
    const conflict = toSlots && toSlots.reduce(function (previous, timeSlot) {
         return previous || checkOverlap(start, start + duration, timeSlot.start, timeSlot.start + timeSlot.duration);
     }, false);
    if(conflict || start < 0) {
        return false;
    }
    timeslotsRef.push({project, subProject, activity, date, start, duration})
}
