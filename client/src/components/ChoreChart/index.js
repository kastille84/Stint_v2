import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Table} from 'reactstrap';
import Loader from "react-loader-spinner";
import Tile from './components/Tile';
import {Alert} from 'reactstrap';

import {
  SAVE_SCHEDULE,
  SAVE_SCHEDULE_DONE,
  SET_FAMILY_DATA,
  SET_FAMILY_DATA_DONE                
} from '../../constants';
import api from '../../api';

const mapStateToProps = state => ({
  user: state.user,
  family: state.family,
  familyData: state.family.familyData,
  fetching: state.family.fetching,
  selectedChild: state.family.selectedChild,
  personType: state.user.personType
})

const mapDispatchToProps = dispatch => ({
  saveSchedule: (child_id, schedule, cbVisible, cbEditMode) => {
    dispatch({type: SAVE_SCHEDULE})
    api.Schedule.saveSchedule(child_id, schedule)
      .then(payload => {
        dispatch({type: SAVE_SCHEDULE_DONE, payload})
        cbEditMode()
      })
      .catch(err=> {
        dispatch({type: SAVE_SCHEDULE_DONE, error: err}) 
        cbVisible(true)
        cbEditMode()
      })
  },
  getFamilyData: () => {
    dispatch({type: SET_FAMILY_DATA})
    api.Family.getFam()
      .then(payload => {
        dispatch({type: SET_FAMILY_DATA_DONE, payload})
      })
  }
})

class ChoreChart extends Component {

  state ={
    isEditable: false,
    editMode: false,
    schedule: null,
    visible: false,
    errorMessage: null
  }

  componentDidMount() { 
    if(this.props.selectedChild) {
      this.setState({
        schedule:this.findChildSchedule(this.props.selectedChild._id),
        isEditable: this.props.personType==='parent'? true: false
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if((prevProps.selectedChild||{})._id !== (this.props.selectedChild||{})._id) {
      this.setState({
        schedule:this.findChildSchedule(this.props.selectedChild._id),
        isEditable: (this.props.personType==='parent'||this.props.personType==='child')? true: false
      });
    }
    if( 
        prevState.editMode===true && this.state.editMode === false
      ) {
      this.setState({
        schedule:this.findChildSchedule(this.props.selectedChild._id),
        isEditable: (this.props.personType==='parent'||this.props.personType==='child')? true: false
      });
    }
  }

  onDismissAlert = () => {
    this.setState({visible: false})
  }

  findChildSchedule = (child_id) => {
      return (this.props.familyData||{}).schedules.filter(s=> {
        if(s.child_id === child_id) {return true}
        return false;
      })[0]
  }

  editChoreInSchedule = ({day,chore,nextCompletedStatus}) => {
    let copyOfDayArr = [...this.state.schedule[day] ];
    //means, we are manipulating or adding to whats already in copyOfDayArr
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
        //means this day is completely empty, so add first entry
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
    let newSchedule = {...this.state.schedule};
    newSchedule[day]=copyOfDayArr;
    this.setState({
      schedule: newSchedule
    })
  }

  renderAlert = (type) => {
    if(this.props.family.apiError) {
      return (
        <Alert color="danger" isOpen={this.state.visible} toggle={this.onDismissAlert}>
          {this.props.family.apiError.response.data.message}
      </Alert>
      )
    }
  }

  determineTile = (day,chore) => {
    //find schedule
    let schedule = this.state.schedule ||{};
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
            currentSchedule={schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
            personType={this.props.personType}
            
          />
        )
      } else if (filtered.length >0 && filtered[0].completed===false) {
        return (
          <Tile
            day={day}
            chore={chore}
            currentSchedule={schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
            personType={this.props.personType}
          />
          )
      } else {
        //something was assigned but it didn't fit our chore
        return (
          <Tile
            day={day}
            chore={chore}
            currentSchedule={schedule}
            editable={this.state.isEditable}
            editMode={this.state.editMode}
            editChoreInSchedule={this.editChoreInSchedule}
            personType={this.props.personType}
          />
          )
      }

    } else {
      //nothing assigned
      return (
        <Tile
          day={day}
          chore={chore}
          currentSchedule={schedule}
          editable={this.state.isEditable}
          editMode={this.state.editMode}
          editChoreInSchedule={this.editChoreInSchedule}
          personType={this.props.personType}
        />
        )
    }
  }

  setEditMode = (val) => {
    this.setState({
      editMode: val
    })    
  }



  saveSchedule = () => {
    this.props.saveSchedule(
      this.props.selectedChild._id,
      this.state.schedule,
      ()=> {
        this.setState({visible: true})
      },
      ()=> {
        this.setEditMode(false)
      }
    )
  }

  renderEditButtons = () => {
    if(this.state.isEditable) {
      //isEditable means we are in Parent Dashboard
      if(this.state.editMode===false) {
        return (
          <div className="chore-chart-controls">
            <button 
              className="btn btn-success" 
              onClick={()=>{
                this.setEditMode(true)
              }}              
            >Edit</button>
          </div>
        )
      } else {
        return (
          <div className="chore-chart-controls">
            <button 
              className="btn btn-primary" 
              onClick={()=>{
                this.saveSchedule()
              }}>Save</button>
            <button 
              className="btn btn-info" 
              onClick={()=>{
                this.setEditMode(false)
                this.props.getFamilyData()
              }}>Cancel</button>
          </div>
        )        
      }
    }
  }

  render() {
    return (
      <section className="chore-chart">
        <p className="page-widget-title">Chore Chart</p>
        {this.renderAlert()}
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
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('monday', c)}
                  </td>
                  {/*Tue*/}
                  <td className="tile-wrapper">
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('tuesday', c)}
                  </td>
                  {/*Wed*/}
                  <td className="tile-wrapper">
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('wednesday', c)}
                  </td>
                  {/*Thur*/}
                  <td className="tile-wrapper">
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('thursday', c)}
                  </td>
                  {/*Fri*/}
                  <td className="tile-wrapper">
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('friday', c)}
                  </td>
                  {/*Sat*/}
                  <td className="tile-wrapper">
                   {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('saturday', c)}
                  </td>
                  {/*Sun*/}
                  <td className="tile-wrapper">
                    {(this.props.selectedChild && (Object.keys(this.state.schedule||[]).length>0)) && this.determineTile('sunday', c)}
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


export default connect(mapStateToProps, mapDispatchToProps)(ChoreChart)