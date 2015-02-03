'use strict';

var McFly = require('../flux/McFly');

var ProjectActions = McFly.createActions({
    addProject: function() {
        return {
            actionType: 'ADD_PROJECT'
        };
    }
});

module.exports = ProjectActions;
