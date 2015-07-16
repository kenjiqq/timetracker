'use strict';
var React = require('react'),
    CalendarSection = require('./CalendarSection'),
    ProjectSection = require('./ProjectSection');

var TimeTrackerApp = React.createClass({

    render: function() {
        return (
            <div className="app">
                <ProjectSection />
                <CalendarSection />
            </div>
        );
    }
});

module.exports = TimeTrackerApp;
