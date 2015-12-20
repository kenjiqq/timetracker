'use strict';

import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT, ADD_PROJECT_BATCH, ADD_SUB_PROJECT_BATCH} from '../constants/ActionTypes';
import {Map, List} from 'immutable';

const initialState = List();

export default function projects (state = initialState, action) {
    if (!action) {
        return state;
    }
    const {id, projectId, code, color, name, items} = action;
    switch (action.type) {
    case ADD_PROJECT_BATCH:
        return items.reduce((state, project) => {
            return state.push(Map({
                ...project,
                subProjects: List()
            }));
        }, state);
    case ADD_PROJECT:
        return state.push(Map({
            id,
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
    case ADD_SUB_PROJECT_BATCH:
        return items.reduce((state, subProject) => {
            const {projectId, ...rest} = subProject;
            return state.updateIn([state.findIndex(project => project.get('id') === projectId), 'subProjects'], List(),
                subProjects => subProjects.push(Map({
                    ...rest
                })));
        }, state);
    case ADD_SUB_PROJECT:
        return state.updateIn([state.findIndex(project => project.get('id') === projectId), 'subProjects'], List(),
            subProjects => subProjects.push(Map({
                id,
                name,
                color
            })));
    case EDIT_SUB_PROJECT:
        const projectIndex = state.findIndex(project => project.get('id') === projectId);
        const subProjectIndex = state.get(projectIndex).get('subProjects').findIndex(subProject => subProject.get('id') === id);
        const newState = state.updateIn([projectIndex, 'subProjects', subProjectIndex], subProject => {
            return subProject.withMutations(map => {
                map.set('name', name).set('color', color);
            });
        });
        return newState;
    default:
        return state;
    }
}
