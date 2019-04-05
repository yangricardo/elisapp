import React, { Component, Fragment } from 'react'
import Dashboard from './Dashboard';
import { withStyles, IconButton } from '@material-ui/core';
import dashboardStyle from '../assets/themes/DashboardStyle.jsx';
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { createMessage } from '../actions/message';
class AppLeads extends Component {
    
    static propTypes = {
        classes: PropTypes.object.isRequired,
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes } = this.props;
        return (
            <Dashboard/>
        )
    }
}
const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(dashboardStyle)(AppLeads));