'use strict';
var React = require('react'),
    CalendarSection = require('./CalendarSection')

var TimeTrackerApp = React.createClass({

    render: function() {
        return (
            <div className="app">
                <CalendarSection />
            </div>
        );
    }
});

module.exports = TimeTrackerApp
