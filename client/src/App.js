import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landing from './components/layout/Landing';
import Auth from './views/Auth';
import Menu from './views/Menu';
import AuthContextProvider from './contexts/AuthContext';
import MenuContextProvider from './contexts/MenuContext'
import Home from './views/Home';
import MyMenuList from './views/MyMenuList';
import MyMenu from './views/MyMenu';
import MenuList from './views/MenuList';
import UserList from './views/UserList';
import MenuByUser from './views/MenuByUser';
import AllMenu from './views/AllMenu';
import InPublicMenu from './views/InPublicMenu';
import ProtectedRoute from './components/routing/ProtectedRoute';

function App() {
  return (
    <AuthContextProvider>
      <MenuContextProvider>
      <Router>
        <Switch>
          <Route exact path='/' component={Landing} />
          <Route exact path='/login' render={props => <Auth {...props} authRoute='login' />} />
          <Route exact path='/register' render={props => <Auth {...props} authRoute='register' />} />
          <Route exact path='/verify_email' render={props => <Auth {...props} authRoute='verifyEmail' />} />
          <Route exact path='/change_password' render={props => <Auth {...props} authRoute='changePassword' />} />
          <ProtectedRoute exact path='/menus' component={Menu} />
          <ProtectedRoute exact path='/home' component={Home} />
          <ProtectedRoute exact path='/my_menu_list' component={MyMenuList} />
          <ProtectedRoute exact path='/my_menu' component={MyMenu} />
          <ProtectedRoute exact path='/menu_list' component={MenuList} />
          <ProtectedRoute exact path='/user_list' component={UserList} />
          <ProtectedRoute exact path='/user_menu' component={MenuByUser} />
          <ProtectedRoute exact path='/all_menu' component={AllMenu} />
          <ProtectedRoute exact path='/rating_menu' component={InPublicMenu} />
        </Switch>
      </Router>
      </MenuContextProvider>
    </AuthContextProvider>
  )
}

export default App;
