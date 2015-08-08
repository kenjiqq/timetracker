import {init as projectInit} from './ProjectActions';
import {init as timeslotInit} from './TimeSlotActions';

export function init(store, userRef) {
    projectInit(store, userRef);
    timeslotInit(store, userRef);
}
