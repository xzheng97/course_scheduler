import React from 'react';
import './App.css';
import CourseDisplay from './CourseDisplay';
import ScheduleView from './ScheduleView';
class Scheduler extends React.Component {

  constructor(props) {
    super(props);
    this.chosenCourses = {};
    this.state = {
      timeBlocks: [],
      showSchedule: false
    };
  }

  render () {
      return (
        <>
          <CourseDisplay CoursesInCart={this.chosenCourses} 
                        data={this.props.data}
          callbackFromDisplay={this.showSchedules}
          callbackFromDisplayRemove={this.DisplayCallbackRemove}
          callbackFromDisplayAdd={this.DisplayCallbackAdd}/>
          <div style={{marginLeft: '30vw'}}>
            <ScheduleView showSchedule={this.state.showSchedule} timeBlocks={this.state.timeBlocks} data={this.props.data}/>
          </div>
        </>
      )
  }

  showSchedules= () =>{
    this.setState({showSchedule:true});
    let new_timeBlocks = [];
    Object.keys(this.chosenCourses).forEach(courseKey => {
      let courseTimeBlocks = [];
      Object.keys(this.chosenCourses[courseKey].sections).forEach(secKey => {
        let subsections = this.chosenCourses[courseKey].sections[secKey].subsections;
       
        if(Object.entries(subsections).length === 0) {
          courseTimeBlocks.push([courseKey, secKey]);
        }
        else {
          Object.keys(subsections).forEach(subsecKey => {
            courseTimeBlocks.push([courseKey, secKey,subsecKey]);
          });
        }
      });
      new_timeBlocks.push(courseTimeBlocks)
    });
    this.setState({timeBlocks: new_timeBlocks});
  }

  DisplayCallbackRemove = (callBackAttr,callBackData,callBackSections,callBackSubsections) => {
    if(callBackAttr  === 'all') delete this.chosenCourses[callBackData.number];
    else if (callBackAttr === 'sections') {
      delete this.chosenCourses[callBackData.number].sections[callBackSections];
      let temp_obj = this.chosenCourses[callBackData.number].sections;
      if(Object.entries(temp_obj).length === 0 && temp_obj.constructor=== Object)
        delete this.chosenCourses[callBackData.number];
    }
    else if (callBackAttr === 'subsections') {
      delete this.chosenCourses[callBackData.number].sections[callBackSections].subsections[callBackSubsections];
      let temp_obj = this.chosenCourses[callBackData.number].sections[callBackSections].subsections;
      if(Object.entries(temp_obj).length === 0 && temp_obj.constructor=== Object){
        delete this.chosenCourses[callBackData.number].sections[callBackSections];
        let temp_obj2 = this.chosenCourses[callBackData.number].sections;
        if(Object.entries(temp_obj2).length === 0 && temp_obj2.constructor=== Object)
          delete this.chosenCourses[callBackData.number];
      }
    }
  }

  DisplayCallbackAdd = (callBackAttr,callBackData,callBackSections,callBackSubsections) => {
    if(callBackAttr  === 'all') {
      this.chosenCourses[callBackData.number] = {"name": callBackData.name,
                                                 "credit": callBackData.credits,
                                                 "number": callBackData.number,
                                                 "sections": callBackSections};                  
    }
    else if (callBackAttr === 'sections') {
      if(this.chosenCourses[callBackData.number]) {
        let sections = this.chosenCourses[callBackData.number].sections;
        sections[callBackSections] = callBackSubsections;

      }
      else {
        this.chosenCourses[callBackData.number] = {"name": callBackData.name,
                                                   "credit": callBackData.credits,
                                                   "number": callBackData.number,
                                                   "sections": {[callBackSections]:callBackSubsections}};
      }
    }
    else if (callBackAttr === 'subsections') {
        if(this.chosenCourses[callBackData.number]) {
            let sections = this.chosenCourses[callBackData.number].sections;
            if(Object.keys(sections).includes(callBackSections)) {
              sections[callBackSections].subsections[callBackSubsections] = 
              callBackData.sections[callBackSections].subsections[callBackSubsections];
            }
            else {
              sections[callBackSections] = {"time":callBackData.sections[callBackSections].time,
              "subsections":{[callBackSubsections]:callBackData.sections[callBackSections].subsections[callBackSubsections]}}
            }
        }
        else {
          this.chosenCourses[callBackData.number] = {"name": callBackData.name,
                                                     "credit": callBackData.credits,
                                                     "number": callBackData.number,
                                                     "sections": {[callBackSections]:{
                                                      "time":callBackData.sections[callBackSections].time,
              "subsections":{[callBackSubsections]:callBackData.sections[callBackSections].subsections[callBackSubsections]}}}};                                            
        }
    }

  }

}

export default Scheduler