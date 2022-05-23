import './Conversation.css';
import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import EmailIcon from '@mui/icons-material/EmailOutlined';
import WebIcon from '@mui/icons-material/Web';
import TextsmsIcon from '@mui/icons-material/Textsms';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import PhoneIcon from '@mui/icons-material/Phone';
import VideoIcon from '@mui/icons-material/VideoCameraFront';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function render() {
    return ( <Conversation></Conversation> );
}


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
          {source: 'website', from: 'you', date: 'May 4, 2022', msg: 'Applied at the website', key:'abc'},
          {source: 'email', from: 'Charles English', date: 'May 5, 2022', msg: 'Responded with an email', key:'123'},
          {source: 'message', from: 'you', date: 'May 6, 2022', msg: 'Provided times for an interview.  I told them that I didnt really care when the times were and gave them lots of times and then even more times, and then some other things happened', key:'asdf'}
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
  
    getIcon( source ) {
      if ( source == 'website' ) {
        return (
          <WebIcon />
        );
      }
      if ( source == 'email' ) {
        return (
          <EmailIcon />
        );
      }
      if ( source == 'message' ) {
        return (
          <TextsmsIcon />
        );
      }
  
      if ( source == 'linkedin' ) {
        return (
          <LinkedInIcon />
        );
      }
      if ( source == 'phone' ) {
        return (
          <PhoneIcon />
        );
      }
      if ( source == 'video' ) {
        return (
          <VideoIcon />
        );
      }
  
      return ( <EmailIcon /> );
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
  
        /*<div className={theclass} key={key}>
            <div className='Message' key={interaction.key}>
              {interaction.date} <br />
              {interaction.from} 
              <p>
                {interaction.msg}
              </p>
            </div>
          </div>*/
  
        return ( 
          <span>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              {this.getIcon(interaction.source)}
            </ListItemAvatar>
            <ListItemText
              primary={interaction.from}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {interaction.date}
                  </Typography>
                   - {interaction.msg}
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          </span>
          );
      });
  
  
    return (
      <span>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {output}
    </List>
      <div className='AddOne'>
        <Button variant="outlined" onClick={() =>this.dataEnterNewMessage()}>
          + Add a thing
        </Button>
        
      </div>
      </span>
    )
    } 
  }