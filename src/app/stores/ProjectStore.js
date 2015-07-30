'use strict';

import {ADD_PROJECT} from '../constants/ActionTypes';

const initialState = [{
    code: 'P0000NOE',
    color: 'green',
    name: 'SmartBank',
    subProjects: [
        {
            name: 'Framework',
            color: undefined
        }
    ]
}];

export default function projects(state = initialState, action) {
    switch (action.type) {
    case ADD_PROJECT:
        const {code, color, name} = action;
        return [
            {
                code,
                color,
                name,
                subProjects: []
            },
            ...state
        ];
    default:
        return state;
    }
}
