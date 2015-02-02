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
    }
});

module.exports = TimeSlotActions;
