import React, { Fragment } from "react";
import Form from "./Form";
import Leads from "./Leads";
import PropTypes from "prop-types";
import { withStyles, Snackbar } from "@material-ui/core";
import dashboardStyle from "../assets/themes/DashboardStyle.jsx";


function Dashboard(props) {
  const { classes } = props;
  return (
    <Fragment>
      <Form />
      <div className={classes.appBarSpacer} />
      <Leads />
    </Fragment>
  );
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(Dashboard);
