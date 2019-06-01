import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Box, TextField, Grid, Button } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import { getProcess } from '../../actions/similarprocesses';

import MaskedInput from 'react-text-mask';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(600 + theme.spacing(6))]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(15),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    button: {
        margin: theme.spacing(1),
        marginTop: theme.spacing(2.5),
    },
    formControl: {
        margin: theme.spacing(1),
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
            /\d/,/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,'.',/\d/,/\d/,/\d/,/\d/,/\d/,/\d/,'-',/\d/,/[A-Za-z]?/
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

    onSubmit = e => {
        e.preventDefault();
        const { processo } = this.state;
        this.props.getProcess(processo.trim())
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Login Required" });
            return <Redirect to="/login"/>
        }
        const { classes } = this.props;

        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container direction="row" justify="center"
                            alignItems="center" spacing={10}>
                <Grid item xs/>
                <Grid item xs={12} >
                <Box borderColor="primary.main"
                    border={2}
                    borderRadius={10}
                    boxShadow={5}
                    className={classes.paper}>
                    <form onSubmit={this.onSubmit} autoComplete="on">
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
                        <Button size='large' type="submit" variant="contained" color="primary" className={classes.button}>
                            Consultar Processo
                        </Button>
                    </form>
                </Box>
                </Grid>
                <Grid item xs/>
            </Grid>
            </main>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

const mapDispatchToProps = {
    getProcess,
    createMessage
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchProcessPage));