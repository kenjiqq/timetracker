import React from 'react';
import ProjectList from './ProjectList';
import ProjectStore from '../stores/ProjectStore';

function getStoreState() {
    return {
        projects: ProjectStore.getList()
    };
}

var ProjectSection = React.createClass({
    mixins: [ProjectStore.mixin],
    getInitialState() {
        return getStoreState();
    },

    storeDidChange() {
        this.setState(getStoreState());
    },

    render() {
        return (
            <ProjectList projects={this.state.projects} />
        );
    }

});

module.exports = ProjectSection;
