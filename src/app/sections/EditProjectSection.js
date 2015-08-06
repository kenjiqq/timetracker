import React from 'react';
import ProjectForm from '../components/ProjectForm';
import SubProjectForm from '../components/SubProjectForm'
import ProjectSelect from '../components/ProjectSelect';
import * as ProjectActions from '../actions/ProjectActions';
import { connect } from 'redux/react';
import { bindActionCreators } from 'redux';

@connect(state => ({
  projects: state.projects.toJS()
}))
export default class EditProjectSection extends React.Component {

    state = {
        activeProject: undefined,
        activeSubProject: undefined
    }

    handleProjectSelect = project => {
        this.setState({
            activeProject: project !== 'new' ? project : undefined
        });
    }
    handleSubProjectSelect = project => {
        this.setState({
            activeSubProject: project !== 'new' ? project : undefined
        })
    }

    renderSubProjectForm(actions) {
        if(this.state.activeProject) {
            return (
                <div>
                    <h3>Select Sub Project</h3>
                    <ProjectSelect projects={this.state.activeProject.subProjects} onSelect={this.handleSubProjectSelect}></ProjectSelect>
                    <h4>Sub Project Info</h4>
                    <SubProjectForm project={this.state.activeProject} subProject={this.state.activeSubProject} actions={actions}></SubProjectForm>
                </div>
            )
        }
    }

    render() {
        const actions = bindActionCreators(ProjectActions, this.props.dispatch);
        return (
            <div className="editproject-section">
                <h3>Select Project</h3>
                <ProjectSelect projects={this.props.projects} onSelect={this.handleProjectSelect}></ProjectSelect>
                <h4>Project Info</h4>
                <ProjectForm project={this.state.activeProject} actions={actions} />
                { this.renderSubProjectForm(actions) }
            </div>

        );
    }

};
