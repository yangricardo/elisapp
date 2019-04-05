import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { Table, TableHead, TableCell, TableBody, TableRow, Button, Paper, withStyles } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import PropTypes from 'prop-types';
import { getLeads, deleteLead } from '../actions/leads';


const styles = {
  paper: {
    width: '100%',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

class LeadsTable extends Component {

  static propTypes = {
    leads: PropTypes.array.isRequired,
    getLeads: PropTypes.func.isRequired,
    deleteLead: PropTypes.func.isRequired
  }

  componentDidMount() {
    this.props.getLeads();
  }

  render() {
    const { classes } = this.props;
    return (
        <Fragment>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                <TableCell component="th">ID</TableCell>
                <TableCell component="th">Name</TableCell>
                <TableCell component="th">Email</TableCell>
                <TableCell component="th">Message</TableCell>
                <TableCell component="th"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                this.props.leads.map(lead => (
                  <TableRow key={lead.id}>
                    <TableCell component="td" scope="row">{lead.id}</TableCell>
                    <TableCell component="td">{lead.name}</TableCell>
                    <TableCell component="td">{lead.email}</TableCell>
                    <TableCell component="td">{lead.message}</TableCell>
                    <TableCell component="td">
                      <Button variant="contained" color="secondary" onClick={this.props.deleteLead.bind(this, lead.id)}>
                        Delete <Delete/>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </Paper>
      </Fragment>
    )
  }
}

LeadsTable.propTypes = {
  classes: PropTypes.object.isRequired,
}


const mapStateToProps = (state) => ({
  leads: state.leadReducer.leads
})

const mapDispatchToProps = {
  
}


export default connect(mapStateToProps, {getLeads, deleteLead})(withStyles(styles)(LeadsTable));