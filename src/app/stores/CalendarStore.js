'use strict';

import {WEEK_CHANGE} from '../constants/ActionTypes';
import Immutable, {Map} from 'immutable';
import moment from 'moment';

const initialState = Map({week: moment().week()});

export default function projects(state = initialState, action) {
    if(!action) {
        return state;
    }
    const {week} = action;
    switch (action.type) {
    case WEEK_CHANGE:
        return state.set('week', week);
    default:
        return state;
    }
}
