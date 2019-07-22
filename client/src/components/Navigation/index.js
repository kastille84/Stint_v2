import React, {Component} from 'react';
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


  render() {
    return (
      <div>
        <Navbar light expand="md">
          <div className="container">
            <NavbarBrand href="/">Stint v2</NavbarBrand>
            <NavbarToggler onClick={this.toggle} />
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav className="ml-auto" navbar>
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret>
                    Family
                  </DropdownToggle>
                  <DropdownMenu right>
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
                </UncontrolledDropdown>
              </Nav>
            </Collapse>
          </div>
        </Navbar>
      </div>
    )

  }
}

export default Navigation;

// <nav className="navbar navbar-expand-lg navbar-light bg-light">
// <a className="navbar-brand" href="#">Stint v2</a>
// <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
//   <span className="navbar-toggler-icon"></span>
// </button>

// <div className="collapse navbar-collapse" id="navbarSupportedContent">
//   <ul className="navbar-nav mr-auto">
//     <li className="nav-item active">
//       <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
//     </li>
//     <li className="nav-item">
//       <a className="nav-link" href="#">Link</a>
//     </li>
//   </ul>
// </div>
// </nav>