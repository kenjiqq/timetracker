import {createSelector} from 'reselect';

export const timeSlotsSelector = createSelector(
    [state => state.timeSlots.get('items')],
    timeSlots => ({timeSlots: timeSlots.toJS()})
);

export const timeSlotsDatesSelector = createSelector(
    [state => state.timeSlots.get('dates')],
    dates => ({dates: dates.toJS()})
);

export const timeSlotsByDateSelector = createSelector(
    [timeSlotsSelector, timeSlotsDatesSelector],
    ({timeSlots}, {dates}) => {
        return {
            timeSlots: Object.keys(dates).reduce((res, date) => {
                res[date] = dates[date].map(id => timeSlots[id]);
                return res;
            }, {})
        };
    }
);
