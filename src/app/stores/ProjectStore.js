'use strict';

var McFly = require('../flux/McFly');

var _projects = {},
    _projectList = [];

function addProject(project) {
    _projects[project.code] = project;
    _projectList.push(project);
}

addProject({
    code: 'P0000NOE',
    color: 'green',
    name: 'SmartBank'
});

var ProjectStore = McFly.createStore({
    get: function(code) {
        return _projects[code];
    },
    getAll: function () {
        return _projects;
    },
    getList: function () {
        return _projectList;
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
