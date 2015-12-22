'use strict';

import {ADD_SUB_PROJECT, EDIT_SUB_PROJECT, ADD_SUB_PROJECT_BATCH} from '../constants/ActionTypes';
import {Map, fromJS} from 'immutable';

function makeSubProject ({id, color, name, projectId}) {
    return fromJS({
        id,
        projectId,
        color,
        name
    });
}

export default function projects (state = Map(), action) {
    if (!action) {
        return state;
    }
    const {type, payload} = action;
    switch (type) {
    case ADD_SUB_PROJECT_BATCH:
        return action.payload.reduce((state, subProject) => {
            return state.set(subProject.id, makeSubProject(subProject));
        }, state);

    case ADD_SUB_PROJECT:
        return state.set(payload.id, makeSubProject(payload));

    case EDIT_SUB_PROJECT:
        return state.update(payload.id, subProject => subProject.merge(payload));
    default:
        return state;
    }
}
