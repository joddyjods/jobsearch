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

import Box from '@mui/material/Box';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import InboxIcon from '@mui/icons-material/Inbox';
import DraftsIcon from '@mui/icons-material/Drafts';

import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

export default function Render( props ) {
    return ( <Opportunities  {...props}></Opportunities> );
}


class Opportunities extends React.Component {
    constructor(props) {
        super(props);
        this.state = props;
        this.setState( {selectedIndex : 0} );
      }

    handleListItemClick = (event, index, opportunityId ) => {   
        this.setState( {selectedIndex : index} );
        this.state.scopeChangeHandler( 'opportunity', opportunityId );
      };
  
    dataEnterNewMessage() {
      this.addMessage( 'you', 'May 9, 2022', 'Did some other things','92fjdi' );
    }
  
    addMessage( who, when, msg, key ) {
      let newstate = this.state;
      newstate.interactions.push( {from: who, date: when, msg: msg, key: key } );
      this.setState( newstate );
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
  
        oppty.lineIndex = i;
        oppty.key = 'Opptyline' + i++;
        oppty.textkey = 'Opptyline' + i++;
        
        return ( 
            <ListItemButton
                selected={this.state.selectedIndex === oppty.lineIndex} 
                onClick={(event) => this.handleListItemClick(event, oppty.lineIndex, oppty.id)}
                key={oppty.key}
                >
                <ListItemIcon  >
                    <InboxIcon />
                </ListItemIcon>
                <ListItemText key={oppty.textkey} primary={oppty.jobtitle} 
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
                  }/>
            </ListItemButton>
        );
      });
  
  
    return (
      <span>
    <Box sx={{ width: '100%', maxWidth: 1200, bgcolor: 'background.paper' }}>
      <List component="nav" aria-label="main mailbox folders">
        {output}
        </List>
    </Box>
      </span>
    )
  }


}