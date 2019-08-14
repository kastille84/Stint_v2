import React, {Component} from 'react';

class Tile extends Component {

  determineColor = () => {
    if(this.props.completed===true) {
      return 'green'
    } else if(this.props.completed===false) {
      return 'red'
    } else if (this.props.completed===null) {
      return 'white'
    }
  }

  render(){
    return (
      <div 
        className={`tile tile--${this.determineColor()} ${this.props.editable? 'tile--edit':'tile--no-edit'}`}>
        
      </div>
    )
  }
}

export default Tile;