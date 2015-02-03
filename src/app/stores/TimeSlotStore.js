'use strict';

var McFly = require('../flux/McFly');

var _timeSlots = {};
var _timeSlotById = {};

function addTimeSlot(date, timeslot) {
    _timeSlotById[timeslot.id] = timeslot;
    if (_timeSlots[date]) {
        _timeSlots[date].push(timeslot);
    } else {
        _timeSlots[date] = [timeslot];
    }
}

function moveTimeSlot(id, from, to) {
    var fromDaySlots = _timeSlots[from];
    for (var i = 0; i < fromDaySlots.length; i++) {
        if (fromDaySlots[i].id === id) {
            var timeslot = fromDaySlots.splice(i, 1);
            addTimeSlot(to, timeslot[0]);
            break;
        }
    }
}

function setDuration(id, duration) {
    _timeSlotById[id].duration = duration;
}

function setStartHour(id, startHour) {
    _timeSlotById[id].startHour = startHour;
}

addTimeSlot(moment().format('DD-MM-YYYY'), {
    id: Date.now(),
    startHour: 1,
    duration: 1.5,
    project: 'P0000NOE'
});

var TimeSlotStore = McFly.createStore({
    getTimeSlotsForDate: function(date) {
        if (_timeSlots[date]) {
            return _timeSlots[date];
        } else {
            return [];
        }
    }
}, function(payload) {
    switch (payload.actionType) {
        case 'ADD_TIME_SLOT':
            addTimeSlot();
            break;
        case 'MOVE_TIME_SLOT':
            moveTimeSlot(payload.id, payload.from, payload.to);
            break;
        case 'SET_DURATION_TIME_SLOT':
            setDuration(payload.id, payload.duration);
            break;
        case 'SET_START_HOUR_TIME_SLOT':
            setStartHour(payload.id, payload.startHour);
            break;
        default:
            return true;
    }

    TimeSlotStore.emitChange();
    return true;
});

module.exports = TimeSlotStore;
