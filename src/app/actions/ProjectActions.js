'use strict';
import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT} from '../constants/actionTypes';
import Ref from '../constants/AsyncAdapter';

let projectsRef;
let subProjectsRef;

export function init(stores, userRef) {
    projectsRef = userRef.child('projects');
    subProjectsRef = userRef.child('subProjects');
    
    projectsRef.on('child_added', snapshot => {
        stores.dispatch({type: ADD_PROJECT, id: snapshot.key(), ...snapshot.val()});
    });
    projectsRef.on("child_changed", snapshot => {
        stores.dispatch({type: EDIT_PROJECT, id: snapshot.key(), ...snapshot.val()});
    });
    subProjectsRef.on('child_added', snapshot => {
        stores.dispatch({type: ADD_SUB_PROJECT, id: snapshot.key(), ...snapshot.val()});
    });
    subProjectsRef.on("child_changed", snapshot => {
        stores.dispatch({type: EDIT_SUB_PROJECT, id: snapshot.key(), ...snapshot.val()});
    });
}

export function addProject(code, name, color) {
    projectsRef.push({code, name, color});
}

export function editProject(id, code, name, color) {
    const projectRef = projectsRef.child(id);
    projectRef.update({code, name, color});
}

export function addSubProject(projectId, name, color) {
    subProjectsRef.push({projectId, name, color});
}

export function editSubProject(subProjectId, projectId, name, color) {
    const subProjectRef = subProjectsRef.child(subProjectId);
    subProjectRef.update({name, color});
}
