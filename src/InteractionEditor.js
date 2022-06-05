import * as React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import TextareaAutosize from '@mui/base/TextareaAutosize';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';

import Autocomplete from '@mui/material/Autocomplete';

import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

// TODO - include an "update" mechanism
// TODO - create validation and required fields (probably validate server-side tho)
// TODO - figure out how to put in date values
// TODO - Add some fields that cause status updates on the opportunities (closed, opened, etc)
// TODO - Add some fields to rank your performance in the experience

export default function InteractionEditor( props ) {
  const [open, setOpen] = React.useState(false);
  
  const handleClickOpen = () => {
    const defaults = setDefaults( props );

    setTheSource( defaults.source );
    setCompanyName( defaults.company );
    setOpportunityName( defaults.opportunity );
    setNotes( defaults.notes );
    setDate( defaults.date );
    setTo( defaults.to );
    setFromYou( defaults.fromYou );

    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getCompanyAndOpportunity = (company, opportunity, props) => {
    const retVal = { company : -1, opportunity : -1 };
    if ( props.opportunities != null ) {
            for ( var i = 0; i < props.opportunities.length; ++i ) {
                if ( props.opportunities[i].jobtitle === opportunity ) {
                    if ( getCompanyNameForId(props.opportunities[i].company, props) === company ) {
                        retVal.company = props.opportunities[i].company;
                        retVal.opportunity = props.opportunities[i].id;
                    }
                }
            }
        }
        if ( retVal.company === -1 ) {
            for ( i = 0; i < props.companies.length; ++i ) {
                if ( props.companies[i].name === company ) {
                    retVal.company = props.companies[i].id;
                }
            }
        }

        return retVal;
  }

  const getPeopleIdsAndNames = (to, props) => {
    // TODO - this is pretty darn error prone, so it needs eventual fixing.  Maybe just get rid of first and last names
    const toArray = to.split( " " );

    const retVal = { to : -1, 
        toFirst : toArray.length > 0 ? toArray[0] : '',
        toLast : toArray.length > 1 ? toArray[1] : '',
    };

    if ( props.people != null ) {
        for ( var i = 0; i < props.people.length; ++i ) {

            if ( props.people[i].first + " " + props.people[i].last  === to ) {
                retVal.to = props.people[i].id;
            }
        }
    }

    return retVal;
  }

  const handleUpdate = ( props ) => {

    // Get the opportunity ID for the name typed
    const companyAndOppty = getCompanyAndOpportunity( companyName, opportunityName, props );

    // Get the IDs and names of the people facts for the interaction
    const interactionPeeps = getPeopleIdsAndNames( to, props );

    // TODO - if we have an existing interaction ID, use it

    // Do the update with the information gathered
    const newInteraction = {
        source : thesource,
        from : interactionPeeps.from,
        fromYou : fromYou,
        date : thedate,
        msg : notes,
        companyId : companyAndOppty.company,
        personId : interactionPeeps.to, 
        opptyId : companyAndOppty.opportunity, 
        companyName : companyName, 
        opptyName : opportunityName,
        toFirst : interactionPeeps.toFirst,
        toLast : interactionPeeps.toLast,
    };

    props.convoAddHandler( newInteraction );
    handleClose();
  };

  
  const getCompanyNameForId = (companyId, props) => {
    if ( props.companies != null ) {
        for ( var i = 0; i < props.companies.length; ++i ) {
            if ( props.companies[i].id === companyId ) {
                return props.companies[i].name;
            }
        }
    }
    return "";
  }

  const populateDefaultsFromOpportunity = (opportunityId, props, defaults) => {
    if ( props.opportunities != null ) {
        for ( var i = 0; i < props.opportunities.length; ++i ) {
            if ( props.opportunities[i].id === opportunityId ) {
                defaults.opportunity = props.opportunities[i].jobtitle;
                defaults.company = getCompanyNameForId( props.opportunities[i].company, props, defaults );
            }
        }
    }
  }

  const setDefaults = (props) => {
    const defaults = {};

    defaults.source = "email";
    defaults.company = "";
    defaults.opportunity = "";
    defaults.fromYou = false;
    defaults.to = "";
    defaults.date = new Date().toLocaleDateString('en-US');
    
    // Put together the defaults based on scope
    if ( props.scope.company != null ) {
        defaults.company = getCompanyNameForId( props.scope.company, props );
    }
    if ( props.scope.opportunity != null ) {
        populateDefaultsFromOpportunity( props.scope.opportunity, props, defaults );
    }
    if ( props.scope.person != null ) {
        defaults.to = props.scope.person;
    }

    // Put in the actual values if they got passed
    if ( props.source != null ) { defaults.source = props.source; }
    if ( props.company != null ) { defaults.company = props.company; }
    if ( props.opportunity != null ) { defaults.opportunity = props.opportunity; }
    if ( props.fromYou != null ) { defaults.fromYou = props.fromYou; }
    if ( props.to != null ) { defaults.to = props.to; }
    if ( props.date != null ) { defaults.date = props.date; }
    if ( props.notes != null ) { defaults.notes = props.notes; }

    return defaults;
  }

  const [thesource, setTheSource] = React.useState( '' );
  const [companyName, setCompanyName] = React.useState( '' );
  const [opportunityName, setOpportunityName] = React.useState( '' );
  const [notes, setNotes] = React.useState( '' );
  const [thedate, setDate] = React.useState( '' );
  const [to, setTo] = React.useState( '' );
  const [fromYou, setFromYou] = React.useState( false );

  const defaults = setDefaults( props );

  /**
 * Conversation interface that allows you to view, add, edit and delete conversations, informed by the scope that is passed in.
 */
const StyledFab = styled(Fab)({
    position: 'absolute',
    zIndex: 1,
    bottom: 30,
    left: 0,
    right: 0,
    margin: '0 auto',
  });

  return (
    <div>
        <StyledFab color="secondary" aria-label="add"  onClick={handleClickOpen}>
            <AddIcon />
          </StyledFab>
      
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Interaction</DialogTitle>
        
        <DialogContent>
          
          <InputLabel id="demo-simple-select-label">Type of Interaction</InputLabel>
            <Select
            labelId="demo-simple-select-label"
            id="source"
            defaultValue={defaults.source}
            label="Type of Interaction"
            onChange={(e) => setTheSource(e.target.value)}
            >
            <MenuItem value='email'>Email</MenuItem>
            <MenuItem value='linkedin'>LinkedIn</MenuItem>
            <MenuItem value='website'>Website Interaction</MenuItem>
            <MenuItem value='message'>Message</MenuItem>
            <MenuItem value='phone'>Phone Call</MenuItem>
            <MenuItem value='video'>Video</MenuItem>
            </Select>
          <Autocomplete
            id="company"
            freeSolo
            options={props.companies.map( (option) => option.name )}
            onChange={(e, newValue) => setCompanyName(newValue)} 
            onInputChange={(event, newInputValue) => { setCompanyName(newInputValue); }}
            defaultValue={defaults.company}
            renderInput={(params) => <TextField {...params} label="Company" margin="dense" fullWidth variant="standard" />}
          />
          <Autocomplete
            id="oppty"
            freeSolo
            options={props.opportunities.map( (option) => option.jobtitle )}
            onChange={(e, newValue) => setOpportunityName(newValue)} 
            onInputChange={(event, newInputValue) => { setOpportunityName(newInputValue); }}
            defaultValue={defaults.opportunity}
            renderInput={(params) => <TextField {...params} label="Opportunity" margin="dense" fullWidth variant="standard"  />}
          />

          <FormControlLabel control={<Checkbox defaultChecked={defaults.fromYou} onChange={(event, newInputValue) => { setFromYou(newInputValue); }}/>} label="From You" />

          <Autocomplete
            id="to"
            freeSolo
            options={props.people.map( (option) => option.first + " " + option.last )}
            onChange={(e, newValue) => setTo(newValue)} 
            onInputChange={(event, newInputValue) => { setTo(newInputValue); }}
            defaultValue={defaults.to}
            renderInput={(params) => <TextField {...params} label="corresponded with" margin="dense" fullWidth variant="standard"  />}
          />    
          
          
          <TextField
            autoFocus
            margin="dense"
            id="date"
            label="date"
            type="date"
            fullWidth
            variant="standard"
            onChange={(e) => setDate(e.target.value)}
            required
          />
          <InputLabel id="demo-simple-select-label">What happened in the interaction</InputLabel>
          <TextareaAutosize
            aria-label="minimum height"
            minRows={4}
            maxRows={4}
            value={defaults.notes}
            placeholder="Description of what occurred in the meeting"
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: 500 }}
            />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={(event) => handleUpdate(props)}>Update</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
