import React, { PropTypes } from 'react';
import ProjectList from '../components/ProjectList';
import { connect } from 'react-redux';
import { projectsListComputedSelector } from '../selectors/projectSelectors';

class ProjectSection extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired
    }
    render () {
        return (
            <ProjectList projects={this.props.projects} />
        );
    }

};

export default connect(projectsListComputedSelector)(ProjectSection);
