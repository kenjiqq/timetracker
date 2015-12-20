'use strict';
import {
    WEEK_CHANGE
}
from '../constants/actionTypes';
import {
    loadTimeSlots
}
from './TimeSlotActions';
import moment from 'moment';

export function init (_stores) {
}

export default {
    changeWeek
};

function changeWeek (weekNumber) {
    return (dispatch, getState) => {
        loadTimeSlots(moment().week(weekNumber).startOf('week'), moment().week(weekNumber).endOf('week'))(dispatch, getState);
        dispatch({
            type: WEEK_CHANGE,
            week: weekNumber
        });
    };
}
