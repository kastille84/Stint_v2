import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table} from 'reactstrap';
import Loader from "react-loader-spinner";
import Tile from './components/Tile';


class ChoreChart extends Component {

  state ={
    isEditable: false,
    editMode: false,
    schedule: []
  }

  componentDidMount() {
    if( this.props.selectedChild) {
      this.setState({
        schedule:this.findChildSchedule(this.props.selectedChild._id),
        isEditable: this.props.personType==='parent'? true: false
      });
    }
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

  editChoreInSchedule = ({day,chore,nextCompletedStatus}) => {
    console.log('day', day)
    console.log('chore', chore)
    console.log('nextCompletedstatus', nextCompletedStatus)

    let copyOfDayArr = [...this.state.schedule[day] ];
    //means, we are manipulating or adding to whats in copyOfDayArr
    if(nextCompletedStatus !== null) {
      //search array for chore object, 
      //ill either come up with an object or no object
      if (copyOfDayArr.length >0) {
        let found = false;
        copyOfDayArr.forEach((choreObj,idx) => {
          if(choreObj.chore===chore) {
            copyOfDayArr[idx].completed=nextCompletedStatus
            found=true;
          }
        })
        if (!found) {
          //means theres chores in here, but not the one we are looking for
          copyOfDayArr.push({
            chore: chore,
            completed: nextCompletedStatus
          })
        }
      } else {
        copyOfDayArr.push({
          chore: chore,
          completed: nextCompletedStatus
        })
      }
    //means theres something in copyOfDayArr that needs to be removed
    } else {
      copyOfDayArr=[...copyOfDayArr].filter( (choreObj, idx) => {
        if (choreObj.chore === chore){
          return false;
        }
        else return true;
      })
    }
    let newSchedule = this.state.schedule;
    newSchedule[day]=copyOfDayArr;
    this.setState({
      schedule: newSchedule
    })
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
            currentSchedule={this.state.schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
          />
        )
      } else if (filtered.length >0 && filtered[0].completed===false) {
        return (
          <Tile
            day={day}
            chore={chore}
            currentSchedule={this.state.schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
          />
          )
      } else {
        //something was assigned but it didn't fit our chore
        return (
          <Tile
            day={day}
            chore={chore}
            currentSchedule={this.state.schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
          />
          )
      }

    } else {
      //nothing assigned
      return (
        <Tile
          day={day}
          chore={chore}
          currentSchedule={this.state.schedule}
          editable={this.state.isEditable}
          editMode={this.state.editMode}
          editChoreInSchedule={this.editChoreInSchedule}
        />
        )
    }
  }

  setEditMode = (val) => {
    this.setState({editMode: val})
  }
  renderEditButtons = () => {
    if(this.state.isEditable) {
      //isEditable means we are in Parent Dashboard
      if(this.state.editMode===false) {
        return (
          <div className="chore-chart-controls">
            <button className="btn btn-success" onClick={()=>{this.setEditMode(true)}}>Edit</button>
          </div>
        )
      } else {
        return (
          <div className="chore-chart-controls">
            <button 
              className="btn btn-primary" 
              onClick={()=>{
                this.setEditMode(false)
              }}>Save</button>
          </div>
        )        
      }
    }
  }

  render() {
    return (
      <section className="chore-chart">
        <p className="page-widget-title">Chore Chart</p>
        <Table responsive className="mt20">
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
        {this.renderEditButtons()}
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