import {createSelector} from 'reselect';

export const calendarSelector = createSelector(
    [state => state.calendar],
    calendar => ({calendar: calendar.toJS()})
);
