import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { enqueueSnackbar, removeSnackbar } from './actions/snackbar'
import { Close } from '@material-ui/icons';
import { IconButton } from '@material-ui/core';
import Notifier from './notifier.js';


class Alerts extends Component {
  static propTypes = {
    error: PropTypes.object.isRequired,
    message: PropTypes.object.isRequired,
  }

  componentDidUpdate(prevProps) {
    const { error, message } = this.props;
    if(error !== prevProps.error) {
        if(error.msg.name )
          this.snackAlert(`Name: ${error.msg.name.join()}`, 'error')
        if(error.msg.email )
          this.snackAlert(`Email: ${error.msg.email.join()}`, 'error')
        if(error.msg.message )
          this.snackAlert(`Message: ${error.msg.message.join()}`, 'error')
        if (error.msg.non_field_errors)
          this.snackAlert(error.msg.non_field_errors.join(),'error')
        if (error.msg.username) 
          this.snackAlert(error.msg.username.join(),'error');
    }

    if(message !== prevProps.message) {
        if(message.deleteLead)
          this.snackAlert(message.deleteLead,'success')
        if(message.addLead)
          this.snackAlert(message.addLead, 'success')
        if(message.passwordNotMatch) 
          this.snackAlert(message.passwordNotMatch,'error')
        if(message.login)
          this.snackAlert(message.login,'info')
        if(message.register)
          this.snackAlert(message.register,'info')
        if(message.authError)
          this.snackAlert(message.authError,'error')
        if(message.logout)
          this.snackAlert(message.logout,'info')          
        if(message.notFound)
          this.snackAlert(message.notFound,'error')
        if(message.loginRequired)
          this.snackAlert(message.loginRequired,'error')
        if(message.loading)
          this.snackAlert(message.loading,'warning')
          if(message.loadingFail)
          this.snackAlert(message.loadingFail,'error')
        if(message.ratingSuccess)
          this.snackAlert(message.ratingSuccess,'success')
        if(message.ratingSuccess)
          this.snackAlert(message.ratingSuccess,'error')
    }
  }

  snackAlert(message,variant) {
    const key = this.props.enqueueSnackbar({
        message: message,
        options: {
            variant: variant,
            preventDuplicate: true,
            action: (
                <IconButton onClick={() => { this.props.closeSnackbar(key) }} size="small" color="inherit"><Close/></IconButton>
            ),
        },
    });
}

  render() {
    return (
      <Fragment>
        <Notifier/>
      </Fragment>
    )
  }
}

const mapStateToProps = (state) => ({
  error: state.errorReducer,
  message: state.messageReducer,
})

const mapDispatchToProps = dispatch => bindActionCreators({ enqueueSnackbar,removeSnackbar }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Alerts)
