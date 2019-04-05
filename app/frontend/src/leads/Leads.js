import React, { Component, Fragment } from 'react';
import { Typography } from '@material-ui/core';
import LeadsTable from './LeadsTable.js';

export class Leads extends Component {
  render() {
    return (
      <Fragment>
        <Typography variant="h4">
            Leads
        </Typography>
        <LeadsTable/>
      </Fragment>
    )
  }
}

export default Leads;
