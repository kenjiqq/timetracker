import React, {PropTypes, Component} from 'react';
import moment from 'moment';

export default class Timesheet extends Component {
    static propTypes = {
        week: PropTypes.number.isRequired,
        daySums: PropTypes.object.isRequired,
        name: PropTypes.string.isRequired
    }

    render () {
        const startOfWeek = moment().week(this.props.week).startOf('week');
        var cells = [0, 1, 1, 1, 1, 1, 1].map((inc, index) => {
            const day = startOfWeek.add(inc, 'days').format('DD-MM-YYYY');
            return (
                <td key={ day }>
                    { this.props.daySums[day] || '-'}
                </td>
            );
        });
        return (
            <tr>
                <td>
                    { this.props.name }
                </td>
                { cells }
            </tr>
        );
    }
}
