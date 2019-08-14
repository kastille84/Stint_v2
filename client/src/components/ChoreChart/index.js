import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table} from 'reactstrap';
import Loader from "react-loader-spinner";
import Tile from './components/Tile';


class ChoreChart extends Component {

  state ={
    isEditable: false,
    schedule: []
  }



  componentDidUpdate(prevProps) {
    if( prevProps.selectedChild !== this.props.selectedChild) {
      this.setState({
        schedule:this.findChildSchedule(this.props.selectedChild._id),
        isEditable: this.props.personType==='parent'? true: false
      });
    }
  }


  findChildSchedule = (child_id) => {
      return (this.props.familyData||{}).schedules.filter(s=> {
        if(s.child_id === child_id) {return true}
        return false;
      })[0]
  }

  determineTile = (day,chore) => {
    //find schedule
    let schedule = this.state.schedule ||[];
    if( schedule[day] && schedule[day].length>0) {
      //check if anything assigned matches our current chore
      let filtered = schedule[day].filter(choreObj => {
        if(choreObj.chore === chore) {return true}
        return false;
      })
  
      if(filtered.length >0 && filtered[0].completed===true) {
        return (
          <Tile
            day={day}
            chore={chore}
            completed={true}
            editable={this.state.isEditable}
          />
        )
      } else if (filtered.length >0 && filtered[0].completed===false) {
        return (
          <Tile
            day={day}
            chore={chore}
            completed={false}
            editable={this.state.isEditable}
          />
          )
      } else {
        //something was assigned but it didn't fit our chore
        return (
          <Tile
            day={day}
            chore={chore}
            completed={null}
            editable={this.state.isEditable}
          />
          )
      }

    } else {
      //nothing assigned
      return (
        <Tile
          day={day}
          chore={chore}
          completed={null}
          editable={this.state.isEditable}
        />
        )
    }

  }

  render() {
    return (
      <section className="chore-chart">
        <p className="page-widget-title">Chore Chart</p>
        <Table responsive>
          <thead>
            <tr>
              <th></th><th>Mon</th><th>Tues</th><th>Wed</th><th>Thurs</th><th>Fri</th><th>Sat</th><th>Sun</th>
            </tr>
          </thead>
          <tbody>
            {this.props.fetching===true? 
            <Loader
              type="Grid"
              color="#2e40dc"
              height={20}
              width={20}
            />:null}
            {((this.props.familyData||{}).chorelist||[]).map(c=> {
              return (
                <tr key={c} >
                  <td>{c}</td>
                  {/*Mon*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('monday', c)}
                  </td>
                  {/*Tue*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('tuesday', c)}
                  </td>
                  {/*Wed*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('wednesday', c)}
                  </td>
                  {/*Thur*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('thursday', c)}
                  </td>
                  {/*Fri*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('friday', c)}
                  </td>
                  {/*Sat*/}
                  <td className="tile-wrapper">
                   {this.props.selectedChild && this.determineTile('saturday', c)}
                  </td>
                  {/*Sun*/}
                  <td className="tile-wrapper">
                    {this.props.selectedChild && this.determineTile('sunday', c)}
                  </td>

                </tr>
              )
            })}
          </tbody>
        </Table>
      </section>
    )
  }
}

const mapStateToProps = state => ({
  user: state.user,
  familyData: state.family.familyData,
  fetching: state.family.fetching,
  selectedChild: state.family.selectedChild,
  personType: state.user.personType
})
export default connect(mapStateToProps)(ChoreChart)