'use strict';
import {ADD_PROJECT, EDIT_PROJECT, ADD_SUB_PROJECT, EDIT_SUB_PROJECT, ADD_PROJECT_BATCH, ADD_SUB_PROJECT_BATCH} from '../constants/actionTypes';
import {fromFirebaseList} from '../firebase/utils';

let projectsRef;
let subProjectsRef;

export function init (stores, userRef) {
    projectsRef = userRef.child('projects');
    subProjectsRef = userRef.child('subProjects');

    projectsRef.once('value', snapshot => {
        const projectObj = snapshot.val() || {};
        const projects = Object.keys(projectObj).map(id => {
            return {
                id,
                ...projectObj[id],
                subProjects: fromFirebaseList(projectObj[id].subProjects)
            };
        });
        stores.dispatch({type: ADD_PROJECT_BATCH, payload: projects});
    });

    subProjectsRef.once('value', snapshot => {
        const subProjectsObj = snapshot.val() || {};
        const subProjects = Object.keys(subProjectsObj).map(id => ({ id, ...subProjectsObj[id] }));
        stores.dispatch({type: ADD_SUB_PROJECT_BATCH, payload: subProjects});
    });
}

export default {
    addProject, editProject, addSubProject, editSubProject
};

function addProject (code, name, color) {
    return dispatch => {
        const newRef = projectsRef.push();
        const project = {id: newRef.key(), code, name, color};
        newRef.set(project, error => {
            !error && dispatch({ type: ADD_PROJECT, payload: project });
        });
    };
}

function editProject (id, code, name, color) {
    return dispatch => {
        const projectRef = projectsRef.child(id);
        const project = {id, code, name, color};
        projectRef.update(project, error => {
            !error && dispatch({type: EDIT_PROJECT, payload: project});
        });
    };
}

function addSubProject (projectId, name, color) {
    return dispatch => {
        const newRef = subProjectsRef.push();
        const subProject = {id: newRef.key(), projectId, name, color};
        projectsRef.child(projectId + '/subProjects/' + subProject.id).set(true);
        newRef.set(subProject, error => {
            !error && dispatch({type: ADD_SUB_PROJECT, payload: subProject});
        });
    };
}

function editSubProject (id, projectId, name, color) {
    return dispatch => {
        const subProjectRef = subProjectsRef.child(id);
        const subProject = {name, color, projectId, id};
        subProjectRef.update(subProject, error => {
            !error && dispatch({type: EDIT_SUB_PROJECT, payload: subProject});
        });
    };
}
