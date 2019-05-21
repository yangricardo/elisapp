import React, { Fragment } from 'react'
import { Route, HashRouter, BrowserRouter ,Switch, Redirect } from 'react-router-dom'
import Dashboard from './containers/dashboard/Dashboard.jsx';
import ScrollToTop from './components/ScrollToTop.jsx';
import AppLeads from './leads/AppLeads.js';
import Header from './components/Header.jsx';
import Alerts from './Alerts.jsx';
import Login from './containers/auth/Login.jsx';
import Register from './containers/auth/Register.jsx';
import PrivateRoute from './containers/auth/PrivateRoute.js';
import SearchProcessPage from './containers/search-process/SearchProcessPage.jsx';
import ListProcessPage from './containers/list-process/ListProcessPage.jsx';
import GroupProcessPage from './containers/group-process/GroupProcessPage.jsx';
import DetailSentencesPage from './containers/detail-sentences/DetailSentencesPage.jsx';

const Page404 = ({ location }) => (
  <div>
     <h2>No match found for <code>{location.pathname}</code></h2>
  </div>
);

export default props => (
  <Fragment>
    <HashRouter>
      <ScrollToTop>
        <Alerts/>
        <Header>
          <Switch>
              <PrivateRoute exact path="/leads" component={AppLeads} />
              <PrivateRoute exact path="/buscarprocesso" component={SearchProcessPage} />
              <PrivateRoute exact path="/listarsentencas" component={ListProcessPage} />
              <PrivateRoute exact path="/gruposanalise" component={GroupProcessPage} />
              <PrivateRoute exact path="/detalharsentencas" component={DetailSentencesPage} />
              <Route exact path='/dashboard' component={ Dashboard } />
              <Route exact path='/register' component={ Register } />
              <Route exact path='/login' component={ Login } />
              {/* <Route component={Page404} /> */}
          </Switch>
        </Header>
        </ScrollToTop>
    </HashRouter>
  </Fragment>
  )