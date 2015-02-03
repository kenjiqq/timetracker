'use strict';

var McFly = require('../flux/McFly');

var _projects = {};

function addProject(project) {
    _projects[project.code] = project;
}

addProject({
    code: 'P0000NOE',
    color: 'green'
});

var ProjectStore = McFly.createStore({
    get: function(code) {
        return _projects[id];
    },
    getAll: function () {
        return _projects;
    }
}, function(payload) {
    switch (payload.actionType) {
        case 'ADD_PROJECT':
            addProject(payload);
            break;
        default:
            return true;
    }

    ProjectStore.emitChange();
    return true;
});

module.exports = ProjectStore;
