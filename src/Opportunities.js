import './Opportunities.css';
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

export default function render( props ) {
    return ( <Opportunities  {...props}></Opportunities> );
}


class Opportunities extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
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

    mapCompanies( companies ) {
        const companyMap = {};

        for ( var i = 0; i < companies.length; ++i ) {
            companyMap[companies[i]['id']] = companies[i];
        }

        return companyMap;
    }
  
    enrichOpportunities( oppties, companies, people ) {
        let o = [];

        const companyMap = this.mapCompanies( companies );

        for ( var i = 0; i < oppties.length; ++i ) {
            // Spread/clone the opportunity
            let oppty = { ... oppties[i] };

            // Enrich it with the company name
            oppty.company = companyMap[oppty.companyid];


            // Enrich it with all associated contacts
            

            // Add it to the list you're returning
            o.push( oppty );
        }

        return o;
    }
    
    render() {
      
      const opportunities = this.enrichOpportunities( this.state.opportunities, this.state.companies, this.state.people );
      let i = 0;
  
      let output = opportunities.map(oppty => {
  
        let key = 'Opptyline' + i++;
        return ( 
          <span>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              {this.getIcon(oppty.source)}
            </ListItemAvatar>
            <ListItemText
              primary={oppty.jobtitle}
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {oppty.company.name}
                  </Typography>
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