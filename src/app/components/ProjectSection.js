import React from 'react';
import ProjectList from './ProjectList';
import { connect } from 'redux/react';

@connect(state => ({
  projects: state.projects.toJS()
}))
export default class ProjectSection extends React.Component {
    render() {
        return (
            <ProjectList projects={this.props.projects} />
        );
    }

};
