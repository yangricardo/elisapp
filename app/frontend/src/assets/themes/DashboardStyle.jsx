
const drawerWidth = 240;

const dashboardStyle = theme => ({
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    height: '100vh',
    overflow: 'auto',
  },
});

export default dashboardStyle;