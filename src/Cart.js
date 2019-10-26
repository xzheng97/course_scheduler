import React from 'react';
import './App.css';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';

class Cart extends React.Component {

  render () {
      return (
        <>
          <div>
          <h2 style={{padding:'10px 20px'}}>Cart</h2>
          </div>
            {this.renderCard()}
        </>
      )
  }

  renderCard() {
    let courses = this.props.data;
    return Object.keys(courses).map((key,index) => {
      return (
        <Card style={{width:'48%', margin:'5px', float:'left'}}>
          <Card.Body>
              <Button variant="danger" style={{float:'right'}} 
              onClick={()=>this.removeButtonClicked('all',this.props.data[key],this.props.data[key].sections,NaN)}>Remove All</Button>
              <Card.Title>{key}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">{courses[key].name}-{courses[key].credit} Credits</Card.Subtitle>
                  {this.renderSections(key,courses[key].sections)}
          </Card.Body>
        </Card>
      )
    })
  }
 renderSections(abs_key,sections) {
    return Object.keys(sections).map((key,index) => {
        return (
            <Table responsive>
                <tbody>
                    <tr>
                        <td style={{fontWeight: 'bold'}}> {key}:</td>
                        <td>{Object.entries(sections[key].time).join("; ")}</td>
                        <td><Button variant="outline-danger" size="sm" style={{float:'right'}}
                        onClick={()=>this.removeButtonClicked('sections',this.props.data[abs_key],key,sections[key])}>Remove</Button></td>
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
               <td> {key}:</td>
               <td>{Object.entries(subsections[key].time).join('; ')}</td>
                <td><Button variant="outline-danger" size="sm" style={{float:'right'}}
                onClick={()=>this.removeButtonClicked('subsections',this.props.data[abs_key],secNumber,key)}>x</Button></td>
          </tr>
        )
      })
  }
  removeButtonClicked(attr,data, sections,subsections){
    const {callbackFromCart} = this.props;
    callbackFromCart(attr,data,sections,subsections);
  }

// timeToString(time) {
//     let result = '';
//     const conv = {'monday':'M','tuesday':'T','wednesday':'W','thursday':'Th','friday':'F'};
    

//     }
}

export default Cart