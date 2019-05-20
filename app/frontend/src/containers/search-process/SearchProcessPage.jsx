import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Paper, TextField, Grid, Button } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import MaskedInput from 'react-text-mask';

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 25,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    button: {
        margin: theme.spacing.unit,
        marginTop: theme.spacing.unit * 2.5,
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

        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container direction="row" spacing={24}>
                <Grid item xs/>
                <Grid item xs={12} >
                <Paper className={classes.paper}>
                    <form noValidate autoComplete="off">
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
                        <Button size='large' variant="contained" color="primary" className={classes.button}>
                            Consultar Processo
                        </Button>
                    </form>
                </Paper>
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

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(SearchProcessPage));