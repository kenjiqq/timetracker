'use strict';

import {ADD_PROJECT} from '../constants/ActionTypes';
import Immutable, {Map, List} from 'immutable';

const initialState = Immutable.fromJS([{
    code: 'P0000NOE',
    color: 'green',
    name: 'SmartBank',
    subProjects: [
        {
            name: 'Framework',
            color: undefined
        }
    ]
}]);

export default function projects(state = initialState, action) {
    switch (action.type) {
    case ADD_PROJECT:
        const {code, color, name} = action;
        return state.push(Map({
            code,
            color,
            name,
            subProjects: List()
        }));
    default:
        return state;
    }
}
