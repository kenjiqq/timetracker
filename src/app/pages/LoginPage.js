'use strict';
import React from 'react';
import LoginForm from '../components/LoginForm';

export default class LoginPage extends React.Component {
    render() {
        return (
            <div className="app">
                <LoginForm></LoginForm>
            </div>
        );
    }
}
