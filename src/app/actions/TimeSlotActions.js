'use strict';

var McFly = require('../flux/McFly');

var TimeSlotActions = McFly.createActions({
    moveDay: function(id, from, to) {
        return {
            actionType: 'MOVE_TIME_SLOT',
            id: id,
            to: to,
            from: from
        };
    },
    setDuration: function (id, newDuration) {
        return {
            actionType: 'SET_DURATION_TIME_SLOT',
            id: id,
            duration: newDuration
        };
    },
    setStartHour: function (id, newStart) {
        return {
            actionType: 'SET_START_HOUR_TIME_SLOT',
            id: id,
            startHour: newStart
        };
    },
    addTimeSlot: function(projectId, date, startHour, duration) {
        return {
            actionType: 'ADD_TIME_SLOT',
            project: projectId,
            date: date,
            startHour: startHour,
            duration: duration
        };
    }
});

module.exports = TimeSlotActions;
