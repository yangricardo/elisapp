import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DashboardIcon from '@material-ui/icons/Dashboard';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import PeopleIcon from '@material-ui/icons/People';
import BarChartIcon from '@material-ui/icons/BarChart';
import LayersIcon from '@material-ui/icons/Layers';
import AssignmentIcon from '@material-ui/icons/Assignment';
import { Search, List, GroupWork } from '@material-ui/icons';
import { Link as LinkRouter } from 'react-router-dom'
export const mainListItems = (
  <div>
    <ListItem button component={LinkRouter} to="/buscarprocesso">
      <ListItemIcon>
        <Search/>
      </ListItemIcon>
      <ListItemText primary="Consulta por Processo" />
    </ListItem>
    <ListItem button component={LinkRouter} to="/listarprocessos">
      <ListItemIcon>
        <List />
      </ListItemIcon>
      <ListItemText primary="Busca Paramétrica" />
    </ListItem>
    <ListItem button component={LinkRouter} to="/gruposprocessos">
      <ListItemIcon>
        <GroupWork />
      </ListItemIcon>
      <ListItemText primary="Grupos de Sentenças" />
    </ListItem>
  </div>
);

export const secondaryListItems = (
  <div>
    <ListSubheader inset>Saved reports</ListSubheader>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Current month" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Last quarter" />
    </ListItem>
    <ListItem button>
      <ListItemIcon>
        <AssignmentIcon />
      </ListItemIcon>
      <ListItemText primary="Year-end sale" />
    </ListItem>
  </div>
);
