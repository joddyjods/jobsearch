import logo from './logo.svg';
import './App.css';
import React from 'react';

class Conversation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      /*history: [
        {
          squares: Array(9).fill(null)
        }
      ],*/
      interactions: [
        {from: 'you', date: 'May 4, 2022', msg: 'Applied at the website', key:'abc'},
        {from: 'Charles English', date: 'May 5, 2022', msg: 'Responded with an email', key:'123'},
        {from: 'you', date: 'May 6, 2022', msg: 'Provided times for an interview', key:'asdf'}
      ]
    };
  }

  dataEnterNewMessage() {
    this.addMessage( 'you', 'May 9, 2022', 'Did some other things','92fjdi' );
  }

  addMessage( who, when, msg, key ) {
    let newstate = this.state;
    newstate.interactions.push( {from: who, date: when, msg: msg, key: key } );
    this.setState( newstate );
  }

  render() {
    const interactions = this.state.interactions;
    let i = 0;

    let output = interactions.map(interaction => {
      let theclass = 'ConversationLineRight';
      if ( interaction.from == 'you' ) {
        theclass = 'ConversationLineLeft';
      }
      let key = 'ConversationLine' + i++;
      return ( 
        <div className={theclass} key={key}>
          <div className='Message' key={interaction.key}>
            {interaction.date} <br />
            {interaction.from} 
            <p>
              {interaction.msg}
            </p>
          </div>
        </div> );
    });

    return ( 
      <div className="ConversationInner"> {output} 
        <div className='AddOne' onClick={() =>this.dataEnterNewMessage()}><p>+ Add a thing</p></div>
      </div>
      );
  }

  
}

class Interaction extends React.Component {
  render() {
    return "hi";
  }
}

function App() {
  return (
    <div className="Conversation">
      <Conversation />
    </div>
  );
}

export default App;
