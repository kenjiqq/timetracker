import React, { PropTypes } from 'react';
import ProjectItem from './ProjectItem';

export default class ProjectList extends React.Component {
    static propTypes = {
        projects: PropTypes.array.isRequired
    }
    renderProjects () {
        return this.props.projects.map((project) => {
            return (
                <ProjectItem key={project.code} project={project} />
            );
        });
    }
    render () {
        return (
            <div className='projects'>
                <h4 className='header'>Projects</h4>
                <ul className='project-list list-unstyled'>
                    {this.renderProjects()}
                </ul>
            </div>
        );
    }
}
