import React from 'react';
import './App.css';
import Sidebar from './Sidebar';
import CourseArea from './CourseArea';
import Cart from './Cart';
import Scheduler from './Scheduler';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allCourses: {},
      filteredCourses: {},
      subjects: [],
      selectedCourse: {},
      showCourseSearch: true,
      showCart: false,
      showScheduler: false
    };
  }

  componentDidMount() {
    fetch('https://xzheng97.github.io/project-files/data.json').then(
      res => res.json()
    ).then(data => this.setState({allCourses: data, filteredCourses: data, subjects: this.getSubjects(data)}));
  }

  getSubjects(data) {
    let subjects = [];
    subjects.push("All");

    for(const course of Object.values(data)) {
      if(subjects.indexOf(course.subject) === -1)
        subjects.push(course.subject);
    }

    return subjects;
  }

  setCourses(courses) {
    this.setState({filteredCourses: courses})
  }

  addSelectedCourses(pre_selectedCourse,callBackAttr,callBackData,callBackSections,callBackSubsections) {
    // console.log(callBackAttr, callBackData,callBackSections,callBackSubsections);
    var new_selectedCourse = Object.assign({},pre_selectedCourse);
    if(callBackAttr  === 'all') {
      new_selectedCourse[callBackData.number] = {"name": callBackData.name,
                                                 "credit": callBackData.credits,
                                                 "number": callBackData.number,
                                                 "sections": callBackSections};
      // console.log(new_selectedCourse);                   
    }
    else if (callBackAttr === 'sections') {
      if(new_selectedCourse[callBackData.number]) {
        let sections = new_selectedCourse[callBackData.number].sections;
        sections[callBackSections] = callBackSubsections;

      }
      else {
        new_selectedCourse[callBackData.number] = {"name": callBackData.name,
                                                   "credit": callBackData.credits,
                                                   "number": callBackData.number,
                                                   "sections": {[callBackSections]:callBackSubsections}};
      }


    }
    else if (callBackAttr === 'subsections') {
        if(new_selectedCourse[callBackData.number]) {
            let sections = new_selectedCourse[callBackData.number].sections;
            if(Object.keys(sections).includes(callBackSections)) {
              // console.log(callBackData.sections[callBackSections].subsections[callBackSubsections])
              sections[callBackSections].subsections[callBackSubsections] = 
              callBackData.sections[callBackSections].subsections[callBackSubsections];
            }
            else {
              sections[callBackSections] = {"time":callBackData.sections[callBackSections].time,
              "subsections":{[callBackSubsections]:callBackData.sections[callBackSections].subsections[callBackSubsections]}}
              
            }
        }
        else {
          new_selectedCourse[callBackData.number] = {"name": callBackData.name,
                                                     "credit": callBackData.credits,
                                                     "number": callBackData.number,
                                                     "sections": {[callBackSections]:{
                                                      "time":callBackData.sections[callBackSections].time,
              "subsections":{[callBackSubsections]:callBackData.sections[callBackSections].subsections[callBackSubsections]}}}};
                                                      
                                                      
                                                     
        }


    }
    // console.log(new_selectedCourse);        
    return new_selectedCourse;
  }

  
  courseAreaCallback = (callBackAttr,callBackData,callBackSections,callBackSubsections) => {

    this.setState((prevState)=> ({
      // allCourses:prevState.allCourses,
      // filteredCourses: prevState.filteredCourses,
      // subjects: prevState.subjects,
      selectedCourse: this.addSelectedCourses(prevState.selectedCourse,callBackAttr,callBackData,callBackSections,callBackSubsections),

    }))

    // console.log(this.state.selectedCourse);
  }




  removeSelectedCourses(pre_selectedCourse,callBackAttr,callBackData,callBackSections,callBackSubsections) {
    // console.log(callBackAttr, callBackData,callBackSections,callBackSubsections);
    var new_selectedCourse = Object.assign({},pre_selectedCourse);
    if(callBackAttr  === 'all') delete new_selectedCourse[callBackData.number];
    else if (callBackAttr === 'sections') {
      // console.log(callBackData.number)
      delete new_selectedCourse[callBackData.number].sections[callBackSections];
      let temp_obj = new_selectedCourse[callBackData.number].sections;
      console.log(temp_obj);
      if(Object.entries(temp_obj).length === 0 && temp_obj.constructor=== Object)
        delete new_selectedCourse[callBackData.number];
    }
    else if (callBackAttr === 'subsections') {
      delete new_selectedCourse[callBackData.number].sections[callBackSections].subsections[callBackSubsections];
      let temp_obj = new_selectedCourse[callBackData.number].sections[callBackSections].subsections;
      if(Object.entries(temp_obj).length === 0 && temp_obj.constructor=== Object){
        delete new_selectedCourse[callBackData.number].sections[callBackSections];
        let temp_obj2 = new_selectedCourse[callBackData.number].sections;
        if(Object.entries(temp_obj2).length === 0 && temp_obj2.constructor=== Object)
          delete new_selectedCourse[callBackData.number];
      
      }

    }
     console.log(new_selectedCourse);
    return new_selectedCourse;
  }


  cartCallback = (callBackAttr,callBackData,callBackSections,callBackSubsections) => {
    this.setState((prevState)=> ({
      selectedCourse: this.removeSelectedCourses(prevState.selectedCourse,callBackAttr,callBackData,callBackSections,callBackSubsections),
    }))
  }

  showSections(section) {
    if(section === 'search')
      this.setState({showCourseSearch:true, showCart:false, showScheduler:false});
    else if(section === 'cart')
      this.setState({showCourseSearch:false, showCart:true, showScheduler:false});
    else
      this.setState({showCourseSearch:false, showCart:false, showScheduler:true});
  }

  render() {
    return (
      <>
        <link
          rel="stylesheet"
          href="https://maxcdn.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
          integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T"
          crossOrigin="anonymous"
        />

        <Navbar bg="light" variant="light" style={{position:'fixed', top:'0',left:'0',zIndex:'9999', width:'100%'}}>
            <Nav className="mr-auto">
              <Nav.Link onClick={()=>this.showSections('search')}>Course Search</Nav.Link>
              <Nav.Link onClick={()=>this.showSections('cart')}>Cart</Nav.Link>
              <Nav.Link onClick={()=>this.showSections('scheduler')}>Scheduler</Nav.Link>
            </Nav>
        </Navbar>

        <div style = {this.state.showCourseSearch?{display:'',paddingTop:'60px'}:{display:'none',paddingTop:'60px'}}>
        <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
          <div style={{marginLeft: '25vw'}}>
            <CourseArea data={this.state.filteredCourses} callbackFromCourseArea={this.courseAreaCallback}/>
          </div>
        </div>
        <div style = {this.state.showCart?{display:'',paddingTop:'60px'}:{display:'none',paddingTop:'60px'}}>
          <Cart data={this.state.selectedCourse} callbackFromCart={this.cartCallback}/>
        </div>
        <div style = {this.state.showScheduler?{display:'',paddingTop:'60px'}:{display:'none',paddingTop:'60px'}}>
          <Scheduler data={this.state.selectedCourse} callbackFromCart={this.cartCallback}/>
        </div>

        {/* <Tabs defaultActiveKey="home" id="uncontrolled-tab-example" >
          <Tab eventKey="home" title="Course Search">
          <Sidebar setCourses={(courses) => this.setCourses(courses)} courses={this.state.allCourses} subjects={this.state.subjects}/>
          <div style={{marginLeft: '25vw'}}>
            <CourseArea data={this.state.filteredCourses} callbackFromCourseArea={this.courseAreaCallback}/>
          </div>
          </Tab>
          <Tab eventKey="cart" title="Cart">
            <Cart data={this.state.selectedCourse} callbackFromCart={this.cartCallback}/>
          </Tab>
        </Tabs> */}

      </>
    )
  }
}

export default App;
