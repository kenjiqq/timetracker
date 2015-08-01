'use strict';
import {ADD_TIME_SLOT, MOVE_TIME_SLOT, SET_DURATION_TIME_SLOT, SET_START_HOUR_TIME_SLOT} from '../constants/ActionTypes';
import moment from 'moment';
import Immutable, {Map, List} from 'immutable';

function createTimeSlot({project, subProject, activity, start, duration}) {
    return Map({
        id: Date.now(),
        project,
        subProject,
        activity,
        start,
        duration
    });
}

const initialState = Immutable.fromJS({
    [moment().format('DD-MM-YYYY')]: [{
        id: Date.now(),
        project: 'P0000NOE',
        subProject: 'Framework',
        activity: 'QA',
        start: 1,
        duration: 1.5
    }]
});

export default function timeSlots(state = initialState, action) {
    switch (action.type) {
        case ADD_TIME_SLOT:
            const newSlot = createTimeSlot(action);
                return state.update(action.date, [], date => date.push(newSlot));
        case MOVE_TIME_SLOT:
            return state.withMutations(state => {
                state.update(action.to, List(), date => date.push(state.get(action.from).find(timeSlot => timeSlot.get('id') === action.id).set('start', action.start)))
                .update(action.from, date => date.filter(timeSlot => timeSlot.get('id') !== action.id));
            });
        case SET_DURATION_TIME_SLOT:
            return state.setIn([action.date, state.get(action.date).findIndex(timeSlot => timeSlot.get('id') === action.id), 'duration'], action.duration);
        case SET_START_HOUR_TIME_SLOT:
            return state.setIn([action.date, state.get(action.date).findIndex(timeSlot => timeSlot.get('id') === action.id), 'start'], action.startHour);
        default:
            return state;
    }
}
