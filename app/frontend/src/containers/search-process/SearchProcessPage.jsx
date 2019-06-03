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
    },
    paper: {
        marginTop: theme.spacing(20),
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'primary',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
    progress: {
        marginTop: theme.spacing(2.5),
        marginLeft: theme.spacing(1)
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
            loading : false
        };
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value,
            searched : false, loading : false, found: false
        })
    }

    onClick = e => {
        e.preventDefault();
        this.setState({searched:true, loading:true, found:false});
        const { token } = this.props
        const { processo } = this.state;
        axios.get(`/api/models/processossimilaresreport/?processo_tj=${processo.trim()}`, buildTokenHeader(token))
        .then(res => {
            const { results } = res.data;
            const found = results[0] !== undefined
            if (found){
                this.props.setSearchedProcess(results[0]);
            } else {
                this.props.clearSearchedProcess();
            }
            this.setState({loading:false,found});
        })
        .catch(err => {
            // this.setState({loading:false, found:false, searched : false});
            this.props.returnError(err.response.data, err.response.status);
        });
    }


    shouldComponentUpdate(nextState) {
        if(nextState.loading & nextState.result !== null){
            return false
        }
        return true
    }

    render() {
        const {loading, searched, found } = this.state
        const {isAuthenticated, createMessage, classes } = this.props
        if(!isAuthenticated){
            createMessage({ loginRequired: "Autenticação necessária" });
            return <Redirect to="/login"/>
        }

        if (found){
            return <Redirect to="/detalharsentencas"/>
        } 
        if (searched && !found & !loading) {
            createMessage({ notFound: "Código de Processo Não Disponível" });
        }

        return (
            <main className={classes.main}>
            <CssBaseline/>
            <Grid container spacing={2}>
                <Grid item xs/>
                <Grid item xs={5} >
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
                        { loading ? <CircularProgress className={classes.progress}/> :
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