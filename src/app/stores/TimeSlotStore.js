'use strict';
import {ADD_TIME_SLOT, MOVE_TIME_SLOT, SET_DURATION_TIME_SLOT, SET_START_HOUR_TIME_SLOT} from '../constants/ActionTypes';
import moment from 'moment';

function createTimeSlot({project, subProject, activity, start, duration}) {
    return {
        id: Date.now(),
        project,
        subProject,
        activity,
        start,
        duration
    };
}

const initialState = {
    [moment().format('DD-MM-YYYY')]: [{
        id: Date.now(),
        project: 'P0000NOE',
        subProject: 'Framework',
        activity: "QA",
        start: 1,
        duration: 1.5
    }]
};

export default function timeSlots(state = initialState, action) {
    switch (action.type) {
        case ADD_TIME_SLOT:
            const newSlot = createTimeSlot(action);
            return {
                ...state,
                [action.date]: [...state[action.date] || [], newSlot]
            };
        case MOVE_TIME_SLOT:
            return {
                ...state,
                [action.from]: state[action.from].filter(timeSlot => timeSlot.id !== action.id),
                [action.to]: [
                    {
                        ...state[action.from].find(timeSlot => timeSlot.id === action.id),
                        start: action.start
                    },
                    ...state[action.to] || []
                ]
            }
            //return moveTimeSlot(action.id, action.from, action.to);
        case SET_DURATION_TIME_SLOT:
            return {
                ...state,
                [action.date]: state[action.date].map(timeSlot => timeSlot.id !== action.id ? timeSlot : {...timeSlot, duration: action.duration})
            }
        case SET_START_HOUR_TIME_SLOT:
            return {
                ...state,
                [action.date]: state[action.date].map(timeSlot => timeSlot.id === action.id ? {...timeSlot, start: action.startHour} : timeSlot)
            }
        default:
            return state;
    }
}
