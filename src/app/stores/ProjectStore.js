'use strict';

import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT} from '../constants/ActionTypes';
import Immutable, {Map, List} from 'immutable';

const initialState = Immutable.fromJS([{
    id: Date.now().toString(),
    code: 'P0000NOE',
    color: 'green',
    name: 'SmartBank',
    subProjects: [
        {
            id: Date.now().toString(),
            name: 'Framework',
            color: undefined
        }
    ]
}]);

export default function projects(state = initialState, action) {
    const {id, projectId, code, color, name} = action;
    switch (action.type) {
    case ADD_PROJECT:
        return state.push(Map({
            id: Date.now().toString(),
            code,
            color,
            name,
            subProjects: List()
        }));
    case EDIT_PROJECT:
        return state.map(project => {
            return project.get('id') !== id ? project : project.withMutations(map => {
                map.set('code', code).set('name', name).set('color', color);
            });
        });
    case ADD_SUB_PROJECT:
        return state.updateIn([state.findIndex(project => project.get('id') === projectId), 'subProjects'], List(),
            subProjects => subProjects.push(Map({
                id: Date.now().toString(),
                name,
                color
            })));
    case EDIT_SUB_PROJECT:
        const projectIndex = state.findIndex(project => project.get('id') === projectId);
        const subProjectIndex = state.get(projectIndex).get('subProjects').findIndex(subProject => subProject.get('id') === id);
        const newState= state.updateIn([projectIndex, 'subProjects', subProjectIndex], subProject => {
            return subProject.withMutations(map => {
                map.set('name', name).set('color', color);
            });
        });
        return newState;
    default:
        return state;
    }
}
