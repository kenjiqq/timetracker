'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS, ADD_TIME_SLOT_BATCH, REMOVE_TIME_SLOT} from '../constants/ActionTypes';
import {Map, fromJS, List} from 'immutable';

function initialState () {
    return fromJS({
        items: {},
        dates: {}
    });
}

function createTimeSlot ({id, project, subProject, activity, start, duration, date}) {
    return Map({
        id,
        project,
        subProject,
        activity,
        start,
        duration,
        date
    });
}

export default function timeSlots (state = initialState(), action) {
    if (!action) {
        return state;
    }
    const {payload, type} = action;
    switch (type) {
    case ADD_TIME_SLOT_BATCH:
        return state.withMutations(state => {
            payload.forEach(timeSlot => {
                state.updateIn(['dates', timeSlot.date], List(), date => date.push(timeSlot.id));
                state.setIn(['items', timeSlot.id], createTimeSlot(timeSlot));
            });
        });
    case ADD_TIME_SLOT:
        const newSlot = createTimeSlot(payload);
        return state.withMutations(state => {
            state.updateIn(['dates', newSlot.get('date')], List(), date => date.push(newSlot.get('id')));
            state.setIn(['items', newSlot.get('id')], newSlot);
        });
    case EDIT_TIME_SLOT:
        const curSlot = state.getIn(['items', payload.id]);
        return state.withMutations(state => {
            if (payload.date && payload.date !== curSlot.get('date')) {
                state.updateIn(['dates', curSlot.get('date')], List(), date => date.delete(date.indexOf(payload.id)));
                state.updateIn(['dates', payload.date], List(), date => date.push(payload.id));
            }
            state.updateIn(['items', payload.id], timeSlot => timeSlot.merge(payload));
        });
    case REMOVE_TIME_SLOT:
        return state.withMutations(state => {
            var curDate = state.getIn(['items', payload.id, 'date']);
            state.updateIn(['dates', curDate], List(), date => date.delete(date.indexOf(payload.id)));
            state.deleteIn(['items', payload.id]);
        });

    case CLEAR_TIME_SLOTS:
        return initialState();
    default:
        return state;
    }
}
