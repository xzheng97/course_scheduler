import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';

import Day from './Day';

class ScheduleView extends React.Component {
  constructor(props) {
    super(props);
    this.courseBlocks=[]
    this.numSchedules = 0
    this.state={
      curView: 0
    }
  }

  render() {
    this.courseBlocks= this.checkConflict();
    this.numSchedules = this.courseBlocks.length;
    return (
      <>
        <Card style={this.props.showSchedule?{width:'calc(70vw - 10px)', height: 'calc(100vh - 9vh)', position: 'fixed',}:{display:'none'}}>
          <div style={{textAlign:'center', margin:'0 auto', padding:'10px'}}>
            <small>{this.numSchedules!==0?this.state.curView+1:0}/{this.numSchedules}</small>
          </div>
          <div>
            <button type="button" className='btn btn-outline-secondary' style={{ display:'block', float:'left',marginTop:'25vw',
            marginLeft:'5px', width: '40px', height: '40px', borderRadius: '35px', fontSize: '14px',fontWeight:'bold', textAlign: 'center'}}
            onClick={()=>this.switch(-1)}>{"<"}</button> 
            <button type="button" className='btn btn-outline-secondary' style={{ display:'block', float:'right',marginTop:'25vw',
            marginRight:'5px', width: '40px', height: '40px', borderRadius: '35px', fontSize: '14px',fontWeight:'bold', textAlign: 'center'}}
            onClick={()=>this.switch(1)}>{">"}</button> 
            <div className='row' style={{width: '60vw', margin:'0 auto'}}>
              <div className='col-sm'>
                <Day title={'Monday'}
                blocks={this.courseBlocks[this.state.curView]?this.courseBlocks[this.state.curView].monBlocks:NaN} 
                start={7} 
                end={19} 
                height={620}
                width='12vw'
                />

              </div>
              <div className='col-sm'>
              <Day title={'Tuesday'} 
                blocks={this.courseBlocks[this.state.curView]?this.courseBlocks[this.state.curView].tuesBlocks:NaN}
                start={7} 
                end={19} 
                height={620}
                width='12vw'/>
              </div>
              <div className='col-sm'>
                <Day title={'Wednesday'} 
                blocks={this.courseBlocks[this.state.curView]?this.courseBlocks[this.state.curView].wednesBlocks:NaN}
                start={7} 
                end={19} 
                height={620}
                width='12vw'/>
              </div>
              <div className='col-sm'>
                <Day title={'Thursday'} 
                blocks={this.courseBlocks[this.state.curView]?this.courseBlocks[this.state.curView].thursBlocks:NaN}
                start={7} 
                end={19} 
                height={620}
                width='12vw'/>
              </div>
              <div className='col-sm'>
                <Day title={'Friday'} 
                blocks={this.courseBlocks[this.state.curView]?this.courseBlocks[this.state.curView].friBlocks:NaN}
                start={7} 
                end={19} 
                height={620}
                width='12vw'/>
              </div>
            </div>
          </div>
        </Card>
      </>
    )
  }

  switch(flag) {

    if(flag < 0) {
      if(this.state.curView > 0)
        this.setState((prevState)=> ({curView:prevState.curView-1}));
    }
    else {
      if(this.state.curView < this.numSchedules-1)
        this.setState((prevState)=> ({curView:prevState.curView+1}));
    }
  }

  checkConflict() {
    let inputBlocks = this.props.timeBlocks;
    let data = this.props.data;
    let retList = [];
    // each course
    for(let course of inputBlocks) {
      let new_retList = [];
      if(retList.length!== 0) {
        for (let schedule of retList) {
          //each section
          for (let section of course) {
            let modified_schedule = JSON.parse(JSON.stringify(schedule));
            let name = "";
            let lectureTime = {};
            let times = section.length === 2?data[section[0]].sections[section[1]].time:data[section[0]].sections[section[1]].subsections[section[2]].time;
            let canAdd = true;

            if (section.length !== 2) {
              name = (section[0]+':').concat(section[1]);
              lectureTime = data[section[0]].sections[section[1]].time;
              Object.keys(lectureTime).forEach(day_i => {
                let start = lectureTime[day_i].split('-')[0];
                let end = lectureTime[day_i].split('-')[1];
                if(day_i === 'monday'){
                  if(!Object.values(schedule.monBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                    canAdd = false;
                  }
                  else
                    modified_schedule.monBlocks[name] = {"start":start,"end": end};
                }
                else if (day_i === 'tuesday') {
                  if(!Object.values(schedule.tuesBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                    canAdd = false;
                  }
                  else
                    modified_schedule.tuesBlocks[name] = {"start":start,"end": end};
                }
                else if (day_i === 'wednesday') {
                  if(!Object.values(schedule.wednesBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))) {
                    canAdd = false;
                  }
                  else 
                    modified_schedule.wednesBlocks[name] = {"start":start,"end": end};
                }
                else if (day_i === 'thursday') {
                  if(!Object.values(schedule.thursBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                    canAdd = false;
                  }
                  else 
                    modified_schedule.thursBlocks[name] = {"start":start,"end": end};
                }
                else if (day_i === 'friday') {
                  if(!Object.values(schedule.friBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                    canAdd = false;
                  }
                  else 
                    modified_schedule.friBlocks[name] = {"start":start,"end": end};
                }
              });
            }
            if(!canAdd) continue;
            name = section.length === 2?(section[0]+':').concat(section[1]):(section[0]+':').concat(section[1]).concat(section[2]);
            Object.keys(times).forEach(day_i => {
              let start = times[day_i].split('-')[0];
              let end = times[day_i].split('-')[1];
              if(day_i === 'monday'){
                if(!Object.values(schedule.monBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                  canAdd = false;
                }
                else
                  modified_schedule.monBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'tuesday') {
                if(!Object.values(schedule.tuesBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                  canAdd = false;
                }
                else
                  modified_schedule.tuesBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'wednesday') {
                if(!Object.values(schedule.wednesBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))) {
                  canAdd = false;
                }
                else 
                  modified_schedule.wednesBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'thursday') {
                if(!Object.values(schedule.thursBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                  canAdd = false;
                }
                else 
                  modified_schedule.thursBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'friday') {
                if(!Object.values(schedule.friBlocks).every((i)=>this.compareTime(i.start,end) || this.compareTime(start,i.end))){
                  canAdd = false;
                }
                else 
                  modified_schedule.friBlocks[name] = {"start":start,"end": end};
              }
            });
            if(canAdd) {
              new_retList.push(modified_schedule);
            }
          }
        }
      }
      else {
        for (let section of course) {
          let [monBlocks,tuesBlocks,wednesBlocks,thursBlocks,friBlocks] = [{},{},{},{},{}];
          let name = "";
          let times = section.length === 2?data[section[0]].sections[section[1]].time:data[section[0]].sections[section[1]].subsections[section[2]].time;
          let lectureTime = {};
          if (section.length !== 2) {
            name = (section[0]+':').concat(section[1]);
            lectureTime = data[section[0]].sections[section[1]].time;
            Object.keys(lectureTime).forEach(day_i => {
              let start = lectureTime[day_i].split('-')[0];
              let end = lectureTime[day_i].split('-')[1];
              if(day_i === 'monday'){
                monBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'tuesday') {
                tuesBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'wednesday') {
                wednesBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'thursday') {
                thursBlocks[name] = {"start":start,"end": end};
              }
              else if (day_i === 'friday') {
                friBlocks[name] = {"start":start,"end": end};
              }
            });
          }

          name = section.length === 2?(section[0]+':').concat(section[1]):(section[0]+':').concat(section[1]).concat(section[2]);
          Object.keys(times).forEach(day_i => {
            let start = times[day_i].split('-')[0];
            let end = times[day_i].split('-')[1];
            if(day_i === 'monday'){
              monBlocks[name] = {"start":start,"end": end};
            }
            else if (day_i === 'tuesday') {
              tuesBlocks[name] = {"start":start,"end": end};
            }
            else if (day_i === 'wednesday') {
              wednesBlocks[name] = {"start":start,"end": end};
            }
            else if (day_i === 'thursday') {
              thursBlocks[name] = {"start":start,"end": end};
            }
            else if (day_i === 'friday') {
              friBlocks[name] = {"start":start,"end": end};
            }
          });
          let new_schedule = {'monBlocks': monBlocks,
                              'tuesBlocks': tuesBlocks,
                              'wednesBlocks': wednesBlocks,
                              'thursBlocks': thursBlocks,
                              'friBlocks':friBlocks}
          new_retList.push(new_schedule);
        }

      }
      retList = new_retList;
    }
    return retList;
  }


  // if time1 is later, retrun true;
  compareTime(time1,time2) {
   let tempDay = "11/1/2019 ";
   time1 = time1.trim().slice(0,-2) + " " + time1.trim().slice(-2);
   time2 = time2.trim().slice(0,-2) + " " + time2.trim().slice(-2);
   let date1 = new Date(tempDay+time1).getTime();
   let date2 = new Date(tempDay+time2).getTime();
   if(date1 > date2) return true;
   else return false;
  }



}


export default ScheduleView;
