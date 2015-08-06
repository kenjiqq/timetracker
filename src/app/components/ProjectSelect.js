import React, {PropTypes} from 'react';

export default class ProjectSelect extends React.Component {
    static propTypes = {
        projects: PropTypes.array,
        onSelect: PropTypes.func
    }

    state = {
        activeProject: 'new'
    }

    handleSelect = event => {
        this.setState({
            activeProject: event.currentTarget.value
        });
        this.notifyProjectSelected(event.currentTarget.value, this.props);
    }

    notifyProjectSelected(activeProject, props) {
        props.onSelect && props.onSelect(props.projects.find(project => project.id === activeProject) || 'new');
    }

    componentDidMount() {
        this.notifyProjectSelected(this.state.activeProject, this.props);
    }

    componentWillReceiveProps(newProps) {
        newProps.projects !== this.props.projects && this.notifyProjectSelected(this.state.activeProject, newProps);
    }

    renderProjects() {
        const projects = this.props.projects;
        return [(<option key="new" value="new">New</option>)].concat(projects && projects.map(project => {
            return (
                <option key={project.id} value={project.id}>{project.name}</option>
            )
        }));
    }

    render() {
        return (
            <select className="form-control" value={this.state.activeProject} onChange={this.handleSelect}>
                {this.renderProjects()}
            </select>
        )
    }
}
