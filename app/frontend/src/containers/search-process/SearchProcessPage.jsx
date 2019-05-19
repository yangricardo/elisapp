import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography } from '@material-ui/core';
import { createMessage } from '../../actions/message';

const styles = theme => ({

})


class SearchProcessPage extends Component {


    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }

        return (<Fragment>
            <Typography>Oi</Typography>
        </Fragment>)
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(SearchProcessPage));