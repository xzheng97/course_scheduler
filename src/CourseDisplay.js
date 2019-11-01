import React from 'react';
import './App.css';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap';
import Table from 'react-bootstrap/Table'

class CourseDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalCredit: 0,
      checkingValue:{}
    }
  }

  render() {
    return (
      <>
        <div className="card bg-light mb-3" style={{width: 'calc(30vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 8vh)', position: 'fixed'}}>
        <div className="card-header" style={{textAlign:'center'}}><b>Courses in Cart</b></div>
          <div className="card-body" style={{height:'calc(100vh-10vh)', overflow:'auto'}}>
            {this.renderCard()}
          </div>
          <div className="card-footer">
          <small style={{position:"relative",top:"20%",fontSize:'medium'}}>Total Credits:{this.state.totalCredit}</small>
            <Button variant="secondary" style={{float:'right'}} onClick={()=>this.generateSchedule()}>Generate Schedule</Button>
          </div>
        </div>
      </>
    )
  }

  renderCard() {
    return Object.keys(this.props.data).map((key,index) => {
      return (
        <div className="card bg-light mb-3">
           <div className="card-body">
            <p className="mb-2 text-muted" style={{float:'right',fontSize:'medium'}}>{this.props.data[key].credit} Credits</p>
            <h5 className="card-title">
              <Form.Group>
                <Form.Check label={key} 
                checked={this.state.checkingValue[key]}
                onChange={()=>this.checkBoxChange(key,'all',this.props.data[key],this.props.data[key].sections,NaN)} 
                id={key}/>
              </Form.Group>
            </h5>
            {/* <h5 className="card-title">{key}</h5> */}
            <p className="card-text">
              {this.renderSections(key,this.props.data[key].sections)}
            </p>
          </div>
        </div>
      )
    })
  }

  renderSections(abs_key,sections) {
    return Object.keys(sections).map((key,index) => {
        return (
            <Table responsive>
                <tbody>
                    <tr>
                      <td style={{fontWeight: 'bold'}}> 
                        <Form.Group>
                          <Form.Check label={key}
                          checked={this.state.checkingValue[abs_key+key]}
                           onChange={()=>this.checkBoxChange(abs_key+key,'sections',this.props.data[abs_key],key,sections[key])}  
                          id={abs_key+key}/>
                        </Form.Group>
                      </td>
                      {/* <td>{Object.entries(sections[key].time).join("; ")}</td> */}
                      <td>{this.convertTime(sections[key].time)}</td>
                    </tr>
                    {this.renderSubsections(abs_key,key,sections[key].subsections)}
                </tbody>  
            </Table>
        )
      })
  }
  renderSubsections(abs_key, secNumber, subsections) {
    return Object.keys(subsections).map((key,index) => {
        return (
          <tr>
            <td> 
              <Form.Group>
                <Form.Check label={key}
                  checked={this.state.checkingValue[abs_key+secNumber+key]}
                  onChange={()=>this.checkBoxChange(abs_key+secNumber+key,'subsections',this.props.data[abs_key],secNumber,key)}  
                id={abs_key+secNumber+key}/>
              </Form.Group>
            </td>
            {/* <td>{Object.entries(subsections[key].time).join('; ')}</td> */}
            <td>{this.convertTime(subsections[key].time)}</td>
          </tr>
        )
      })
  }


  generateSchedule() {
    const {callbackFromDisplay} = this.props;
    callbackFromDisplay();
  }

  checkBoxChange(key,attr,data, sections,subsections) {
    if(document.getElementById(key).checked){
      const {callbackFromDisplayAdd} = this.props;
      var ndata= JSON.parse(JSON.stringify(data));
      var nsections= JSON.parse(JSON.stringify(sections));
      var nsubsections= JSON.parse(JSON.stringify(subsections));
      callbackFromDisplayAdd(attr,ndata,nsections,nsubsections);
    }
    else {
      const {callbackFromDisplayRemove} = this.props;
      callbackFromDisplayRemove(attr,data,sections,subsections);
    }
    // deal with appearance of the following checkboxes
    if(attr === 'all') {
      let new_value = Object.assign({},this.state.checkingValue);
      //check course's checkbox first
      new_value[key] = !(!!this.state.checkingValue[key]);
      Object.keys(sections).forEach(sectionKey => {
        // check sections' checkboxes
        new_value[key+sectionKey] = new_value[key];
        Object.keys(sections[sectionKey].subsections).forEach(subsectionKey => {
          // check subsections' checkboxes as well
          new_value[key+sectionKey+subsectionKey] = new_value[key];
        });
      });
      this.setState({checkingValue:new_value},()=>this.checkCredit());
    }
    else if (attr === 'sections') {
      let new_value = Object.assign({},this.state.checkingValue);
       //check section's checkbox first
       new_value[key] = !(!!this.state.checkingValue[key]);
      Object.keys(subsections.subsections).forEach(subsectionKey => {
        // check following subsections' checkboxes
        new_value[key+subsectionKey] = new_value[key];
      });
      this.setState({checkingValue:new_value}, () =>{
        if(Object.keys(data.sections).every(i => this.state.checkingValue[key.replace(sections,'').concat(i)]===false)) {
          new_value[key.replace(sections,'')] = false;
        }
        this.setState({checkingValue:new_value},()=>this.checkCredit());
      });
    }
    else if (attr === 'subsections') {
      let new_value = Object.assign({},this.state.checkingValue);
      //check section's checkbox first
      new_value[key] = !(!!this.state.checkingValue[key]);
      this.setState({checkingValue:new_value}, ()=>{
        if(Object.keys(data.sections[sections].subsections).every(i => this.state.checkingValue[key.replace(subsections,'').concat(i)]===false)) {
          new_value[key.replace(subsections,'')] = false;
        }
        if(Object.keys(data.sections).every(i => this.state.checkingValue[key.replace(subsections,'').replace(sections,'').concat(i)]===false)) {
          new_value[key.replace(subsections,'').replace(sections,'')] = false;
        }
        this.setState({checkingValue:new_value},()=>this.checkCredit());
      });
    }

  }

  // aims to update total credit
  checkCredit() {
    let creditMap = {}
    Object.keys(this.state.checkingValue).forEach(element => {
      if(this.state.checkingValue[element]) {
        Object.keys(this.props.data).forEach(elemKey => {
          if(element.includes(elemKey)) {
            creditMap[elemKey] = this.props.data[elemKey].credit;
          }
        });
      }
    });
    let mapKeys = Object.keys(creditMap);
    let tempArray = []
    for (let i = 0; i < mapKeys.length; i++) {
      for (let j = 0;j < mapKeys.length; j++) {
        if(i !== j && mapKeys[i].includes(mapKeys[j])) {
          tempArray.push(i)
        }
      }
    }
    tempArray.forEach(i => {
      delete creditMap[mapKeys[i]]
    });
    let sum = 0;
    Object.values(creditMap).forEach(credit => {
      sum += credit;
    });
    this.setState({totalCredit:sum});
  }

 
  convertTime(times) {
    let timeKeys = Object.keys(times);
    let new_times = {};
    let output = "";
    let dict = {monday:'M',tuesday:'Tu',wednesday:'W',thursday:'Th',friday:'F'};
    timeKeys.forEach(element => {
      if(times[element] in new_times) {
        new_times[times[element]].push(dict[element]);
      }
      else {
        new_times[times[element]] = [dict[element]];
      }
    });
    
    Object.keys(new_times).forEach(element => {
      if(output) output += "; ";
      for(let i in new_times[element]) {
        output += new_times[element][i];
      }
      output += " " + element;
    });
    return output;
  }




}


export default CourseDisplay;
