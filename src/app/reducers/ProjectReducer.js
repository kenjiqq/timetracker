'use strict';

import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, ADD_PROJECT_BATCH} from '../constants/ActionTypes';
import {Map, List, fromJS} from 'immutable';

function makeProject ({id, code, color, name, subProjects}) {
    return fromJS({id, code, color, name, subProjects: subProjects || []});
}

export default function projects (state = Map(), action) {
    if (!action) {
        return state;
    }
    const {type, payload} = action;
    switch (type) {
    case ADD_PROJECT_BATCH:
        return payload.reduce((state, project) => {
            return state.set(project.id, makeProject(project));
        }, state);
    case ADD_PROJECT:
        return state.set(payload.id, makeProject({...payload, subProjcts: []}));
    case EDIT_PROJECT:
        return state.update(payload.id, project => project.merge(payload));
    case ADD_SUB_PROJECT:
        return state.updateIn([payload.projectId, 'subProjects'], List(), subProjects => subProjects.push(payload.id));
    default:
        return state;
    }
}
