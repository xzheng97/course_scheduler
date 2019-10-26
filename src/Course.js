import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class Course extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: this.props.data.sections,
      showTable: false,
      button_text: 'View Sections',
    }
    this.sectionViewer = this.sectionViewer.bind(this);
  }

  render() {
    return (
      <Card style={{ marginTop: '5px', marginBottom: '5px'}}>
        <Card.Body>
          <Button variant="light" style={{float: 'right'}} onClick={this.sectionViewer}>{this.state.button_text}</Button>
          <Button variant="primary" style={this.state.showTable?{float: 'right', marginRight: '10px', display:""}:
          {float: 'right', marginRight: '10px', display:'none'}} onClick={()=>this.addAllButtonClicked('all',this.state.sections,NaN)}>Add All</Button>
          <Card.Title>{this.props.data.name}</Card.Title>
          
          
          <Card.Subtitle className="mb-2 text-muted">{this.props.data.number} - {this.getCredits()}</Card.Subtitle>
         
          <div>
          <Table responsive hover style={this.state.showTable?{display:""}:{display:"none"}}>
            <thead>
              <tr>
                <th />
                <th>Location</th>
                <th>Time</th>
                <th>Instructor</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.renderTableData()}
            </tbody>
          </Table>
          </div>
        </Card.Body>
      </Card>
    )
  }



  addAllButtonClicked(attr, sections,subsections){
    const {callbackFromCourse} = this.props;
    var ndata= JSON.parse(JSON.stringify(this.props.data));
    var nsections= JSON.parse(JSON.stringify(sections));
    var nsubsections= JSON.parse(JSON.stringify(subsections));
    callbackFromCourse(attr,ndata,nsections,nsubsections);
  }




  renderTableData() {
    let sections  = this.state.sections;
    return Object.keys(sections).map((key,index) => {
      return (
        <>
        <tr>
          <td style={{fontWeight:'bold'}}>{key}</td>
          <td>{sections[key]["location"]}</td>
          <td>{Object.entries(sections[key]["time"]).join("; ")}</td>
          <td>{sections[key]["instructor"]}</td>
          <td><Button variant="outline-primary" 
          onClick={()=>this.addAllButtonClicked('sections',key,sections[key])}>Add</Button>
          </td>
        </tr>
        {this.addSubsections(key, sections[key]["subsections"])}
        </>
      )
    })
  }

  addSubsections(secNumber,subsections) {
    return Object.keys(subsections).map((key,index) => {
      return (
        <tr style={{backgroundColor:'#f4f4f4'}}>
          <td >{key}</td>
          <td>{subsections[key]["location"]}</td>
          <td >{Object.entries(subsections[key]["time"]).join("; ")}</td>
          <td></td>
          
          <td><Button variant="outline-primary" size="sm"
           onClick={()=>this.addAllButtonClicked('subsections',secNumber,key)}>+</Button></td>
        </tr>
      )
    })
  }

  sectionViewer() {
  this.setState({
    showTable: !this.state.showTable,
    button_text:this.state.showTable?'View Sections':'Hide Sections',
  },
  () => {
    console.log('callback value', this.state.showTable)
  })

  }

  getCredits() {
    if(this.props.data.credits === 1)
      return '1 credit';
    else
      return this.props.data.credits + ' credits';
  }
}

export default Course;
