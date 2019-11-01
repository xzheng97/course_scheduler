import React from 'react';
import Card from 'react-bootstrap/Card';

class Day extends React.Component {

  // Day Component
  // Props:
  //  title (string)
  //  blocks, an array of objects with properties:
  //          - name (string)
  //          - start (float)
  //          - end (float))
  //  start (float) start as float
  //  end (float) end as float
  //  height (int) height - Must be numeric!
  //  width (int or string)

  getBlocks() {
    let blockComponents = [];
    if(this.props.blocks) {
      Object.keys(this.props.blocks).forEach((courseKey)=>{
        let pxHeight = this.props.height*(this.convertTime(this.props.blocks[courseKey].end)
         - this.convertTime(this.props.blocks[courseKey].start))/(this.props.end-this.props.start);
        let pxY = this.props.height*(this.convertTime(this.props.blocks[courseKey].start)
         -this.props.start)/(this.props.end-this.props.start)

        blockComponents.push(<Card key={courseKey} 
                                  style={{height:pxHeight,
                                          marginTop:pxY,
                                          marginLeft:'1px',
                                          backgroundColor:'#f0f6ff',
                                          position:'fixed',
                                          fontSize:'10px',
                                          width:'calc('+this.props.width+' - 4px)'}}>
          {courseKey.split(":")[0] + ' ' + courseKey.split(':')[1] + ' '}
          {this.props.blocks[courseKey].start + '-' + this.props.blocks[courseKey].end}
                                </Card>);
      })
    }
    return blockComponents;
  }

  render() {
    return (<Card style={{borderRadius:0,
                          width:this.props.width,
                          textAlign:'center',
                          position:'fixed'}}>
              <Card.Header className='square'>{this.props.title}</Card.Header>
              <Card.Body style={{height:this.props.height,padding:0}}>
                {this.getBlocks()}
              </Card.Body>
           
           </Card>)
  }

  convertTime(time) {
   let hour = time.split(':')[0];
   if(time.includes('pm') && hour != 12){
      hour = Number(hour) +  12;
   }
   let minute = Number(time.split(':')[1].trim().slice(0,-2));
   return Number(hour) + minute/60;
  }

}

export default Day; 