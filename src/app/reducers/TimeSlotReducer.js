'use strict';
import {ADD_TIME_SLOT, EDIT_TIME_SLOT, CLEAR_TIME_SLOTS, ADD_TIME_SLOT_BATCH} from '../constants/ActionTypes';
import {Map, List} from 'immutable';

function createTimeSlot ({id, project, subProject, activity, start, duration}) {
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

export default function timeSlots (state = initialState, action) {
    if (!action) {
        return state;
    }
    switch (action.type) {
    case ADD_TIME_SLOT_BATCH:
        return action.items.reduce((state, timeSlot) => {
            return state.update(timeSlot.date, List(), date => date.push(createTimeSlot(timeSlot)));
        }, state);
    case ADD_TIME_SLOT:
        const newSlot = createTimeSlot(action);
        return state.update(action.date, List(), date => date.push(newSlot));
    case EDIT_TIME_SLOT:
        let slotIndex;
        let date;
        let timeSlot;
        state.forEach((list, _date) => {
            slotIndex = list.findIndex(timeSlot => timeSlot.get('id') === action.id);
            if (slotIndex !== -1) {
                date = _date;
                timeSlot = list.get(slotIndex);
                return false;
            }
        });
        if (action.date && date !== action.date) {
            return state.withMutations(map => {
                map.deleteIn([date, slotIndex]).update(action.date, List(), dateList => dateList.push(timeSlot));
            });
        }
        const {id, type, ...changes} = action;
        return state.updateIn([date, state.get(date).findIndex(timeSlot => timeSlot.get('id') === action.id)],
        Map(), timeSlot => timeSlot.merge(changes));
    case CLEAR_TIME_SLOTS:
        return Map();
    default:
        return state;
    }
}
