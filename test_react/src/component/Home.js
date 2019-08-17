import React, { Component }from 'react';

import MainPage from './MainPage.js'
import Modal from './Modal.js'

class Home extends Component {

    render() {
      return (
        <div className="mainPage">
            <MainPage />
            <Modal/>
        </div>
      ) 
    }
}

export default Home;