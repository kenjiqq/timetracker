import {createSelector} from 'reselect';

export const timeSlotsSelector = createSelector(
    [state => state.timeSlots],
    timeSlots => ({timeSlots: timeSlots.toJS()})
);
