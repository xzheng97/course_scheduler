import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import SearchAndFilter from './SearchAndFilter';
import {Button} from 'react-bootstrap';

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.searchAndFilter = new SearchAndFilter();
    this.search = React.createRef();
    this.filter = React.createRef();
    this.tagList = [];
  }

  setCourses() {
    // console.log("filter", this.filter.current.value)
    this.props.setCourses(this.searchAndFilter.searchAndFilter(this.props.courses, this.tagList, this.filter.current.value,));
  }

  addTag() {
    let curTag = this.search.current.value;
    if(curTag.length === 0) alert("Blank tag!")
    else if(this.tagList.includes(curTag)) alert("Duplicate tag!");
    else{   
       this.tagList.push(curTag);
       this.setCourses();
    }
    this.myFormRef.reset();
  }


  removeTag(i) {
    // console.log(i);
    this.tagList.splice(i,1);
    this.setCourses();
  }

  render() {
    return (
      <>
        <Card style={{width: 'calc(25vw - 5px)', marginLeft: '5px', height: 'calc(100vh - 7vh)', position: 'fixed'}}>
          <Card.Body>
            <Card.Title>Search and Filter</Card.Title>
            <Form onSubmit={(e)=>{e.preventDefault();this.addTag();}}  ref={(el) => this.myFormRef = el}>
              <Form.Group controlId="formKeywords" style={{width: '100%'}}>
                <Form.Label>Search by tags </Form.Label>
                <Form.Control type="text" placeholder="e.g. computer" autoComplete="off" ref={this.search}/>
              </Form.Group>
            </Form>

            <div>
              <ul style={{flexWrap:'wrap', margin:'0px',padding:'0px',width:'100%'}}>
                { this.tagList.map((tag,i) => (
                  <li key={tag} style={{display:'inline-block',alignItems:'center', backgroundColor:"#f4f4f4",color:'#606264',fontWeight:'300',listStyle:'none',margin:'5px', padding:'5px 10px'}}>
                  {tag}<Button variant='outline-danger' size='sm' onClick={()=>{this.removeTag(i);}} style={{border:'none', marginLeft:'5px'}}>x</Button></li>
                ))}
              </ul>

            </div>
           

            <Form.Group controlId="formFilter">
                <Form.Control as="select" ref={this.filter} onChange={() => this.setCourses()} size="sm">
                <option key="intersection">intersection of tags</option>
                <option key="union">union of tags</option>
                </Form.Control>
            </Form.Group>
          </Card.Body>
        </Card>
      </>
    )
  }


}


export default Sidebar;
