import React, { Fragment } from 'react';
import { ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import { Search, List, LibraryBooks } from '@material-ui/icons';
import { Link as LinkRouter } from 'react-router-dom'
export const mainListItems = (
  <Fragment>
    <ListItem button component={LinkRouter} to="/buscarprocesso">
      <ListItemIcon>
        <Search />
      </ListItemIcon>
      <ListItemText primary="Consulta por Processo" />
    </ListItem>
    <ListItem button component={LinkRouter} to="/listarsimilaridades">
      <ListItemIcon>
        <List />
      </ListItemIcon>
      <ListItemText primary="Listar Processos" />
    </ListItem>
    <ListItem button component={LinkRouter} to="/grupossimilares">
      <ListItemIcon>
        <LibraryBooks />
      </ListItemIcon>
      <ListItemText primary="Grupos Similares" />
    </ListItem>
  </Fragment>
);