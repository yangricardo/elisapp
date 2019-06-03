import React, { Component, useState } from 'react'
import axios from 'axios';
import PropTypes from 'prop-types'
import { Redirect } from "react-router-dom";
import { connect } from 'react-redux'
import { withStyles, CssBaseline, Box, TextField, Grid, Button, CircularProgress } from '@material-ui/core';
import { createMessage, returnError } from '../../actions/message';
import { getProcess, clearSearchedProcess, setSearchedProcess, setLoadingProcess } from '../../actions/similarprocesses';

import MaskedInput from 'react-text-mask';
import { buildTokenHeader } from '../../actions/auth';

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

const TextMaskCustom = props => {
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
    />
    );
}
  
TextMaskCustom.propTypes = {
inputRef: PropTypes.func.isRequired,
};

class SearchProcessPage extends Component {
    
    constructor (props) {
        super(props);
        this.props.clearSearchedProcess();
        this.state = {
            found : false,
            searched : false,
            loading : false,
        };
    }

    onChange = e => {
        this.setState({[e.target.name]: e.target.value})
    }

    onClick = e => {
        e.preventDefault();
        this.setState({searched:true, loading:true});
        const { processo } = this.state;
        axios.get(`/api/models/processossimilaresreport/?processo_tj=${processo.trim()}`, buildTokenHeader(this.props.token))
        .then(res => {
            const { results } = res.data
            if (results[0].hasOwnProperty('id')){
                this.setState({found:true});
                this.props.setSearchedProcess(results[0]);
            }
        })
        .catch(err => dispatch(returnError(err.response.data, err.response.status)));
    }


    shouldComponentUpdate(nextProps) {
        if (this.state.loading && nextProps.searchedProcess.hasOwnProperty('id')) {
            this.setState({loading:false})
            return true
        }
        return false
    }

    render() {
        if(!this.props.isAuthenticated){
            this.props.createMessage({ loginRequired: "Autenticação necessária" });
            return <Redirect to="/login"/>
        }
        if (this.state.loading === false ){
            if(this.state.searched === true){
                if(this.state.found === true){
                    return <Redirect to="/detalharsentencas"/>
                } else {
                    this.props.createMessage({ notFound: "Código de Processo Não Disponível" });
                }
            } 
        }

        const { classes } = this.props;

        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container spacing={5}>
                <Grid item xs/>
                <Grid item md={10} >
                <Box borderColor="primary.main"
                    border={2}
                    borderRadius={10}
                    boxShadow={5}
                    className={classes.paper}>
                    <form autoComplete="on">
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
                        { this.state.loading ? <CircularProgress/> :
                            <Button size='large' type="button" color="primary" 
                            className={classes.button} onClick={this.onClick} variant="contained" 
                            >
                                Consultar Processo
                            </Button>
                        }
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
    token : state.authReducer.token,
    isAuthenticated: state.authReducer.isAuthenticated,
    searchedProcess : state.similarProcessesReducer.searchedProcess,
    loading : state.similarProcessesReducer.loading
})

const mapDispatchToProps = {
    getProcess,
    returnError,
    createMessage,
    clearSearchedProcess,
    setSearchedProcess,
    setLoadingProcess,
}


export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(SearchProcessPage));