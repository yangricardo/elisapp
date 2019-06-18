import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withStyles, Typography, TextField, CssBaseline, Grid, Table } from '@material-ui/core';
import { createMessage } from '../../actions/message';
import MaskedInput from 'react-text-mask';

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
            <div>
            <Grid container direction="row" 
                justify="center"
                alignItems="baseline" 
                spacing={2}
            >
                <Grid item md={2}>
                    <Typography>Oi</Typography>
                </Grid>
                <Grid item md={10}>
                    <Table></Table>
                </Grid>

            </Grid>
            </div>

        )
    }

}


const mapStateToProps = (state) => ({
    isAuthenticated: state.authReducer.isAuthenticated
})

export default connect(mapStateToProps, { createMessage })(withStyles(styles)(ListProcessPage));