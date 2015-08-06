'use strict';
import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT} from '../constants/actionTypes';

export function addProject(code, name, color) {
    return {
        type: ADD_PROJECT,
        code,
        name,
        color
    };
}

export function editProject(id, code, name, color) {
    return {
        type: EDIT_PROJECT,
        id,
        code,
        name,
        color
    };
}

export function addSubProject(projectId, name, color) {
    return {
        type: ADD_SUB_PROJECT,
        projectId,
        name,
        color
    };
}

export function editSubProject(projectId, id, name, color) {
    return {
        type: EDIT_SUB_PROJECT,
        projectId,
        id,
        name,
        color
    };
}
