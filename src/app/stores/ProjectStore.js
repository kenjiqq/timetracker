'use strict';

import {ADD_PROJECT} from '../constants/ActionTypes';

const initialState = [{
    code: 'P0000NOE',
    color: 'green',
    name: 'SmartBank'
}];

export default function projects(state = initialState, action) {
    switch (action.type) {
    case ADD_PROJECT:
        const {code, color, name} = action;
        return [
            {
                code,
                color,
                name
            },
            ...state
        ];
    default:
        return state;
    }
}
