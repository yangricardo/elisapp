import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, Select,TextField, Grid, Table, Box } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import { ThemeProvider } from '@material-ui/styles';

const styles = theme => ({

})


class ListProcessPage extends Component {

    constructor(props) {
        super(props)
        this.state = {}
    }

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
            
            <Grid container direction="row" 
            justify="center"
            alignItems="baseline" 
            spacing={2}
            >
                <Grid item md={3}>
                <Grid container direction="column" 
                    justify="center"
                    alignItems="baseline" 
                    spacing={2}
                    >
                        <Grid item >
                        <TextField label='comarca' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='serventia' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='ano' variant='outlined'/>   
                        </Grid>
                        <Grid item >
                        <TextField label='classe' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='assunto' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='advogado' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='personagem' variant='outlined'/>
                        </Grid>
                        <Grid item >
                        <TextField label='juiz' variant='outlined'/>
                        </Grid>
                </Grid>
                </Grid>
                <Grid item md={9}>
                    <Table></Table>
                </Grid>

            </Grid>
        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(ListProcessPage));