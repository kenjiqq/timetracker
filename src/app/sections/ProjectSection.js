import React, { PropTypes } from 'react';
import ProjectList from '../components/ProjectList';
import { connect } from 'react-redux';

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

function select (state) {
    return {
        projects: state.projects.toJS()
    };
}

export default connect(select)(ProjectSection);
