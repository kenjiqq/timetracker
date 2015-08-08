'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS} from '../constants/ActionTypes';
import moment from 'moment';
import Immutable, {Map, List} from 'immutable';

function createTimeSlot({id, project, subProject, activity, start, duration}) {
    return Map({
        id,
        project,
        subProject,
        activity,
        start,
        duration
    });
}

const initialState = Map();

export default function timeSlots(state = initialState, action) {
    if(!action) {
        return state;
    }
    switch (action.type) {
        case ADD_TIME_SLOT:
            const newSlot = createTimeSlot(action);
            return state.update(action.date, List(), date => date.push(newSlot));
        case EDIT_TIME_SLOT:
            let slotIndex;
            let date;
            state.forEach((list, _date) => {
                slotIndex = list.findIndex(timeSlot => timeSlot.get('id') === action.id);
                if(slotIndex !== -1) {
                    date = _date;
                    return false;
                }
            });
            if(date !== action.date) {
                return state.withMutations(map => {
                    map.deleteIn([date, slotIndex]).update(action.date, List(), dateList => dateList.push(createTimeSlot(action)));
                });
            }
            return state.setIn([action.date, state.get(action.date).findIndex(timeSlot => timeSlot.get('id') === action.id)], createTimeSlot(action));
        case CLEAR_TIME_SLOTS:
            return Map();
        default:
            return state;
    }
}
