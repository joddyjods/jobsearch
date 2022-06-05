import './App.css';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import Conversation from './Conversation';
import Opportunities from './Opportunities';

import ReactPolling from "react-polling";

/*

The App has flat lists of companies, opportunities, people and conversations.  
// TODO - it needs to get these from an API that will read/write them

As changes occur, App will combine the flat lists to combine information that can be used for
rendering different lists with rich information.  All of these are in its state.

App also keeps a "scope" in its state that gives information to the child components on what items
to render.  That scope can be defined in terms of companies, opportunities or people.  The scope
is passed to child components so they know how to render and also can fill in information when 
you add information.

The children use callbacks to add items as well as to change the scope.

*/

const drawerWidth = 700;
const serverUrl = 'http://localhost:8080/';

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginRight: -drawerWidth,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginRight: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: drawerWidth,
  }),
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-start',
}));
  
export default function Render(props) {
  
  const theme = useTheme();
  const open = React.useState(true);

  return ( <App {...props} theme={theme} open={open}/> )
}

class App extends React.Component {

  convoDeleteHandler(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : serverUrl },
    };

    var url = new URL( serverUrl + "interactions" );
    var params = { id : id };
    url.search = new URLSearchParams( params ).toString();

    fetch( url, requestOptions)
        .then(response => response.json())
        .then( data => console.log( data ) );

  }

  addCompany( company ) {
    company.id = this.generateNextId();
    this.state.companies.push( company );
    this.setState( { companies : this.state.companies } );
  }

  addOpportunity( oppty ) {
    oppty.id = this.generateNextId();
    this.state.opportunities.push( oppty );
    this.setState( { opportunities : this.state.opportunities } );
  }

  addPerson( person ) {
    person.id = this.generateNextId();
    this.state.people.push( person );
    this.setState( { people : this.state.people } );
  }

  convoAddHandler( newInteraction ) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : serverUrl },
        body: JSON.stringify( newInteraction )
    };

    fetch( serverUrl + "interactions", requestOptions)
        .then(response => response.json())
        .then( data => console.log( data ) );

  }

  /**
   * Add or remove scoping for the items being shown
   * @param {*} scopeType 'company', 'opportunity', or 'person' 
   * @param {*} newValue The ID of the object to scope down to, or null for unscoped
   */
  scopeChange( scopeType, newValue ) {
    const newScope = { ...this.state.scope };

    newScope[scopeType] = newValue;
    this.setState( {scope: newScope} );
  }

  generateNextId() {
    let nextId = this.state.nextId;
    this.setState( {nextId : ++nextId} );
    return nextId;
  }


 constructor(props) {
    super(props);

    this.state = {
      companies : [],
      opportunities : [],
      interactions : [],
      people : [],
      convoDeleteHandler : this.convoDeleteHandler.bind(this),
      convoAddHandler : this.convoAddHandler.bind( this ),
      scopeChangeHandler : this.scopeChange.bind( this ),
      nextId : 9999999,

      scope : {
        company : null,
        person : null,
        opportunity : null
      }
    };
  }
  
  render() {

    const { theme } = this.props;
    const [open, setOpen] = this.props['open'];
    
    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    return (
      <Box sx={{ display: 'flex' }}>

        <ReactPolling
          url={serverUrl + "all"}
          interval= {2000} // in milliseconds(ms)
          retryCount={3} // this is optional
          headers={ { 'Access-Control-Allow-Origin' : serverUrl } }
          onSuccess={resp => {
              this.setState( {opportunities : resp.opportunities} );
              this.setState( {companies : resp.companies} );
              this.setState( {interactions : resp.interactions} );
              this.setState( {people : resp.people } );
              return true;
            }
          }
          onFailure={resp => {
            console.log({ resp });
            return true;
          }} // this is optional
          method={'GET'}
          // body={JSON.stringify("hello")} // data to send in a post call. Should be stringified always
          render={({ startPolling, stopPolling, isPolling }) => {
            
          }}
        />

        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
              Opportunities
            </Typography>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerOpen}
              sx={{ ...(open && { display: 'none' }) }}
            >
              <MessageOutlinedIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Main open={open}>
          <DrawerHeader />
            <Opportunities opportunities={this.state.opportunities} companies={this.state.companies} people={this.state.people} scopeChangeHandler={this.state.scopeChangeHandler} />
          
        </Main>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
            },
          }}
          variant="persistent"
          anchor="right"
          open={open}
        >
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === 'rtl' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </IconButton>
          </DrawerHeader>
          <Divider />
          <div className="Conversation">
            <Conversation scope={this.state.scope} interactions={this.state.interactions} convoDeleteHandler={this.state.convoDeleteHandler} opportunities={this.state.opportunities} companies={this.state.companies} people={this.state.people} convoAddHandler={this.state.convoAddHandler}/>
          </div>
        </Drawer>
      </Box>
    );
  }
}
