'use strict';
import {WEEK_CHANGE} from '../constants/actionTypes';
import { loadTimeSlots } from './TimeSlotActions';
import moment from 'moment';

let stores;

export function init(_stores) {
    stores =  _stores;
}

export function changeWeek(weekNumber) {
    stores.dispatch({type: WEEK_CHANGE, week: weekNumber});
    loadTimeSlots(moment().week(weekNumber).startOf('week'), moment().week(weekNumber).endOf('week'));
}
