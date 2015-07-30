import React, {PropTypes} from 'react';
import SubProjectType from './SubProjectType'

export default class SubProjectItem extends React.Component {
    static propTypes = {
        subProject: PropTypes.object.isRequired,
        defaultColor: PropTypes.string.isRequired
    }

    static types = [
        'Dev',
        'QA',
        'Adm'
    ]

    renderTypes(subProject, restProps) {
        return SubProjectItem.types.map((type, i) => {
            return (
                <SubProjectType key={i} name={type} subProject={subProject} {...restProps} ></SubProjectType>
            )
        })
    }

    render() {
        const {subProject, defaultColor, ...rest} = this.props;
        return (
            <div className="sub-project">
                <h5 className="sub-project-name">{this.props.subProject.name}</h5>
                <ul className="activity-types list-unstyled">
                    {this.renderTypes(subProject.name, rest)}
                </ul>
            </div>
        );
    }
}
