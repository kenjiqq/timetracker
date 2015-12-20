'use strict';
import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT, ADD_PROJECT_BATCH, ADD_SUB_PROJECT_BATCH} from '../constants/actionTypes';

let projectsRef;
let subProjectsRef;

export function init (stores, userRef) {
    projectsRef = userRef.child('projects');
    subProjectsRef = userRef.child('subProjects');

    projectsRef.once('value', snapshot => {
        const projectObj = snapshot.val();
        const projects = Object.keys(projectObj).map(id => ({ id, ...projectObj[id] }));
        stores.dispatch({type: ADD_PROJECT_BATCH, items: projects});
    });

    subProjectsRef.once('value', snapshot => {
        const subProjectsObj = snapshot.val();
        const subProjects = Object.keys(subProjectsObj).map(id => ({ id, ...subProjectsObj[id] }));
        stores.dispatch({type: ADD_SUB_PROJECT_BATCH, items: subProjects});
    });
}

export default {
    addProject, editProject, addSubProject, editSubProject
};

function addProject (code, name, color) {
    return dispatch => {
        const project = {code, name, color};
        const newRef = projectsRef.push(project, error => {
            !error && dispatch({type: ADD_PROJECT, id: newRef.key(), ...project});
        });
    };
}

function editProject (id, code, name, color) {
    return dispatch => {
        const projectRef = projectsRef.child(id);
        const project = {code, name, color};
        projectRef.update(project, error => {
            !error && dispatch({type: EDIT_PROJECT, id: id, ...project});
        });
    };
}

function addSubProject (projectId, name, color) {
    return dispatch => {
        const subProject = {projectId, name, color};
        const newRef = subProjectsRef.push(subProject, error => {
            !error && dispatch({type: ADD_SUB_PROJECT, id: newRef.key(), ...subProject});
        });
    };
}

function editSubProject (subProjectId, projectId, name, color) {
    return dispatch => {
        const subProjectRef = subProjectsRef.child(subProjectId);
        const subProject = {name, color};
        subProjectRef.update(subProject, error => {
            !error && dispatch({type: EDIT_SUB_PROJECT, id: subProjectId, projectId: projectId, ...subProject});
        });
    };
}
