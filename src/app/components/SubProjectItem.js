import React, {PropTypes} from 'react';
import SubProjectActivity from './SubProjectActivity'

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
                <SubProjectActivity key={i} name={type} subProject={subProject.id} {...restProps} ></SubProjectActivity>
            )
        })
    }

    render() {
        const {subProject, defaultColor, ...rest} = this.props;
        return (
            <div className="sub-project">
                <h5 className="sub-project-name">{this.props.subProject.name}</h5>
                <ul className="activity-types list-unstyled">
                    {this.renderTypes(subProject, rest)}
                </ul>
            </div>
        );
    }
}
