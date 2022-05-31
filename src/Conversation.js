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
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import InteractionEditor from './InteractionEditor';

export default function render( props ) {
    return ( <Conversation {...props}></Conversation> );
}



class Conversation extends React.Component {
    constructor(props) {
      super(props);
      this.state = props;
    }

    getNameFor( personId ) {
      let name = 'Unknown!';
      for ( var i = 0; i < this.state.people.length; ++i ) {
        if ( this.state.people[i].id == personId ) {
          name = this.state.people[i].first + ' ' + this.state.people[i].last; 
        }
      }
      return name;
    }

    directionalizeInteraction( person, fromYou ) {
      if ( fromYou ) {
        return "You ==> " + person;
      }
      else return person + " ==> You";
    }

    componentWillReceiveProps(newProps){
        this.setState({scope: newProps.scope})
        }

    deleteMessage( id ) {
        this.state.convoDeleteHandler(id);
    }
  
    dataEnterNewMessage() {
        this.state.convoAddHandler( 'linkedin', 'you', 'May 9, 2022', 'Did some other things', this.state.scope.company, this.state.scope.opportunity, this.state.scope.person );
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

    scopeInteractions( interactions ) {

        const scopedInteractions = [];
        
        for ( var i = 0; i < interactions.length; ++i )
        {
          let keepIt = true;
    
          if ( this.state.scope.opportunity != null && interactions[i].opptyId != this.state.scope.opportunity ) {
            keepIt = false;
          }
    
          if ( this.state.scope.company != null && interactions[i].companyId != this.state.scope.company ) {
            keepIt = false;
          }

          if ( this.state.scope.person != null && interactions[i].personId != this.state.scope.person ) {
            keepIt = false;
          }
    
          if ( keepIt ) {
            scopedInteractions.push( interactions[i] );
          }
        }
    
        return scopedInteractions;
      }

    render() {
      
      let interactions = this.scopeInteractions( this.state.interactions );
      let i = 0;

      let output = interactions.map(interaction => {
        
        interaction.key = 'ConversationLine' + i;
        interaction.textkey = 'TextKey' + i;
        i++;
  
        return ( 
          <span>
          <ListItem alignItems="flex-start" key={interaction.key}>
            <ListItemAvatar>
              {this.getIcon(interaction.source)}
            </ListItemAvatar>
            <ListItemText
              primary={this.directionalizeInteraction( this.getNameFor( interaction.personId ), interaction.fromYou )}
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
            <IconButton edge="end" aria-label="delete">
                <DeleteIcon onClick={() =>this.deleteMessage(interaction.id)}/>
            </IconButton>
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
        <InteractionEditor 
          scope={this.state.scope} 
          opportunities={this.state.opportunities} 
          companies={this.state.companies} 
          people={this.state.people}
          convoAddHandler={this.state.convoAddHandler}
          >

        </InteractionEditor>
      </span>
    )
    } 
  }