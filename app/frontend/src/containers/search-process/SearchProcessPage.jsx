import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, TextField, FormControl, Input, InputLabel } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import MaskedInput from 'react-text-mask';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
    },
})

function TextMaskCustom(props) {
    const { inputRef, ...other } = props;
  
    return (
    <MaskedInput
        {...other}
        ref={ref => {
        inputRef(ref ? ref.inputElement : null);
        }}
        mask={[
            /\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/\w?/
        ]}
        placeholderChar={'\u2000'}
        showMask
    />
    );
}
  
TextMaskCustom.propTypes = {
inputRef: PropTypes.func.isRequired,
};

class SearchProcessPage extends Component {
    state = {}

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes } = this.props;

        return (<Fragment>
            <form className={classes.container} noValidate autoComplete="off">
                <TextField
                    id="processo"
                    name="processo"
                    label="Processo"
                    className={classes.textField}
                    value={this.state.name}
                    onChange={this.onChange}
                    margin="normal"
                    variant="outlined"
                    InputProps={{
                        inputComponent: TextMaskCustom,
                      }}
                    >
                </TextField>
            </form>
        </Fragment>)
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(SearchProcessPage));