var React = require('react'),
    ProjectList = require('./ProjectList'),
    ProjectStore = require('../stores/ProjectStore');

function getStoreState() {
    var projects = ProjectStore.getList();
    return {
        projects: projects
    }
}

var ProjectSection = React.createClass({
    mixins: [ProjectStore.mixin],
    getInitialState: function() {
        return getStoreState();
    },

    storeDidChange: function() {
        this.setState(getStoreState());
    },

    render: function() {
        return (
            <ProjectList projects={this.state.projects} />
        );
    }

});

module.exports = ProjectSection;
