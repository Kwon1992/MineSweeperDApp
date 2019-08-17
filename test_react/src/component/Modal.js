import React, { Component }from 'react';

class Modal extends Component {
    render() {
      return (
        <div id="myModal" className="modal">
        <div className="modal-content">
          <h1 style={{textAlign: 'center'}}>HOW TO PLAY</h1>
  
          <p style={{lineHeight: '1.5'}}>Left Click to open the cell </p>
          <p style={{lineHeight: '1.5'}}>If you open a bomb, you will lose the game. </p>
          <p style={{lineHeight: '1.5'}}>Use flag properly to WIN the game. </p>
          <p style={{lineHeight: '1.5'}}>Right Click(Long Press for Mobile) to mark a flag.</p>
  
          <br /><br />
  
          <h1 style={{textAlign: 'center'}}>ITEM DESCRIPTION</h1>
  
          <p style={{lineHeight: '1.5'}}><b>Protect</b> </p>
          <p style={{lineHeight: '1.5'}}>When you click the cell which has a bomb, it will protect you from defeat and mark a flag.</p>
          <p style={{lineHeight: '1.5'}}><b>Start Pin</b> </p>
          <p style={{lineHeight: '1.5'}}>Show only one cell which does not a bomb before the game begin. </p>
          <p style={{lineHeight: '1.5'}}>If you reveal another cell, the mark will be disappeared.</p>
          <p style={{lineHeight: '1.5'}}><b>Reveal MAP</b> </p>
          <p style={{lineHeight: '1.5'}}>Show 1/5 of map for 0.5 seconds. </p>
          <p><br /></p>
  
          <div id="close-btn" style={{cursor: 'pointer', backgroundColor: '#DDDDDD', textAlign: 'center', paddingBottom: '10px', paddingTop: '10px'}}>CLOSE</div>
        </div>
        <input className="textBox" type="text" id="modalBox" style={{display: 'none'}} />
      </div>
      );
    }
}

export default Modal;