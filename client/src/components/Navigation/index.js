import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

class Navigation extends Component {
  state={
    isOpen: false
  }
  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  logoutFamily = () => {
    localStorage.removeItem('family_jwt');
    this.props.history.push('/family-login');
  }
  logoutParent = () => {
    localStorage.removeItem('parent_jwt');
    this.props.history.push('/which-user');
  }
  logoutChild = () => {
    localStorage.removeItem('child_jwt');
    this.props.history.push('/which-user');
  }

  _showFamMenu = () => {
    if(localStorage.getItem('family_jwt') && (!localStorage.getItem('parent_jwt') && !localStorage.getItem('child_jwt'))) {
      return ([
        <DropdownToggle nav caret key={'dd'}>
          Family
        </DropdownToggle>,
        <DropdownMenu right key={'dm'}>
          <DropdownItem>
            <NavItem>
              <span onClick={()=>this.logoutFamily()}>Logout</span>
            </NavItem>
          </DropdownItem>
        </DropdownMenu>
      ])
    }else if(!localStorage.getItem('family_jwt') && (!localStorage.getItem('parent_jwt') && !localStorage.getItem('child_jwt'))) {
      return ([
        <DropdownToggle nav caret key={'dd'}>
          Family
        </DropdownToggle>,
        <DropdownMenu right key={'dm'}>
          <DropdownItem>
            <NavItem>
              <NavLink href="/family-register">Register</NavLink>
            </NavItem>
          </DropdownItem>
          <DropdownItem>
            <NavItem>
              <NavLink href="/family-login">Login</NavLink>
            </NavItem>
          </DropdownItem>
        </DropdownMenu>
      ])
    }
  }
  _showParentMenu = () => {
    if(localStorage.getItem('parent_jwt')) {
      return ([
        <DropdownToggle nav caret key={'dd'}>
          Parent
        </DropdownToggle>,
        <DropdownMenu right key={'dm'}>
          <DropdownItem>
            <NavItem>
              <span onClick={()=>this.logoutParent()}>Logout</span>
            </NavItem>
          </DropdownItem>
        </DropdownMenu>
      ])
    }
  }
  _showChildMenu = () => {
    if(localStorage.getItem('child_jwt')) {
      return ([
        <DropdownToggle nav caret key={'dd'}>
          Child
        </DropdownToggle>,
        <DropdownMenu right key={'dm'}>
          <DropdownItem>
            <NavItem>
              <span onClick={()=>this.logoutChild()}>Logout</span>
            </NavItem>
          </DropdownItem>
        </DropdownMenu>
      ])
    }
  }

  render() {
    return (
      <div>
        <Navbar light expand="md">
          
            <NavbarBrand href="/">Stint v2</NavbarBrand>
            <NavbarToggler onClick={()=>this.toggle()} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  {this._showFamMenu()}
                  {this._showParentMenu()}
                  {this._showChildMenu()}
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
         
        </Navbar>
      </div>
    )

  }
}

export default withRouter(Navigation);
