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

import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import ReactPolling from "react-polling";

import LogInButton from "./components/login";
import LogOutButton from "./components/logout";

import {useEffect} from 'react';
import {gapi} from 'gapi-script';


const clientId = "152798730660-61397c89b64orq4a0d0i56p74p0ljks2.apps.googleusercontent.com";


/*

The App has flat lists of companies, opportunities, people and conversations.  

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
  const [loggedIn, setLoggedIn] = React.useState( false );
  const [userToken, setUserToken] = React.useState( null );

  useEffect(() => {
    function start() {
      gapi.auth2.init({
        clientId: clientId,
        scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/drive.file"
      })
    }

    gapi.load( 'client:auth2', start );
  } );

  const onLogin = () => {
    //console.log( gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile() );
    //console.log( gapi.auth2.getAuthInstance().currentUser.get().tokenObj );
    setLoggedIn( gapi.auth != null && gapi.auth.getToken() != null );
    setUserToken( gapi.auth2.getAuthInstance().currentUser.get().tokenObj );
  };

  const onLogout = () => {
    setLoggedIn( false );
  }

  const onFailedLogin = (res) => {
    console.log( "FAILED TO LOGIN", res );
    setLoggedIn( false );
  }

  return ( 
    <span>
      {!loggedIn && 
      <LogInButton onSuccess={onLogin} onFailure={onFailedLogin}/> }
      {loggedIn && 
      <App {...props} theme={theme} open={open} onLogout={onLogout} userToken={userToken} /> }
    </span>
  )
}

class App extends React.Component {

  convoDeleteHandler(id) {
    const requestOptions = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : serverUrl, 'Authorization': JSON.stringify(this.props.userToken) },
    };

    var url = new URL( serverUrl + "interactions" );
    var params = { id : id };
    url.search = new URLSearchParams( params ).toString();

    fetch( url, requestOptions)
        .then(response => response.json())
        .then( data => console.log( data ) );

  }

  convoAddHandler( newInteraction ) {

    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin' : serverUrl, 'Authorization': JSON.stringify(this.props.userToken) },
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
      userToken : null,

      scope : {
        company : null,
        person : null,
        opportunity : null
      }
    };
  }

  render() {

    const Alert = React.forwardRef(function Alert(props, ref) {
      return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
    });

    const { theme } = this.props;
    const [open, setOpen] = this.props['open'];

    const handleDrawerOpen = () => {
      setOpen(true);
    };
  
    const handleDrawerClose = () => {
      setOpen(false);
    };

    const handleAlertClose = (event, reason) => {
      if (reason === 'clickaway') {
        return;
      }
  
      this.setState( {synced : false});
    };

    return (
      <Box sx={{ display: 'flex' }}>
        <ReactPolling
          url={serverUrl + "all"}
          interval= {2000} // in milliseconds(ms)
          retryCount={10} // this is optional
          headers={ 
            { 
              'Access-Control-Allow-Origin' : serverUrl,
              'Authorization': JSON.stringify(this.props.userToken)
            } 
          }
          onSuccess={resp => {
            if ( resp.opportunities != null && resp.companies != null && resp.interactions != null && resp.people != null ) {
                this.setState( {opportunities : resp.opportunities} );
                this.setState( {companies : resp.companies} );
                this.setState( {interactions : resp.interactions} );
                this.setState( {people : resp.people } );
                this.setState( { synced : true });
                this.setState( { commError : false } );
                return true;
              }
              else {
                console.log( resp );
                this.setState( { synced : true });
                this.setState( { commError : true } );
                return true;
              }
            }
          }
          onFailure={resp => {
            this.setState( { synced : false } );
            this.setState( { commError : true } );
            return true;
          }} // this is optional
          catch={resp => {
            this.setState( { synced : false } );
            this.setState( { commError : true } );
            return true;
          }}
          method={'GET'}
          render={({ startPolling, stopPolling, isPolling }) => {
            return <Snackbar open={!isPolling} onClose={handleAlertClose}>
                    <Alert severity="error" sx={{ width: '100%' }} onClose={handleAlertClose}>
                      No longer attempting to contact the server.  Consider restarting.
                    </Alert>
                  </Snackbar>
          }}
        />

        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
              {gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile().getGivenName()}'s Opportunities
            </Typography>
            <LogOutButton onLogoutSuccess={this.props.onLogout}/>
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
        <Snackbar open={this.state.synced} onClose={handleAlertClose}>
          <Alert severity="success" sx={{ width: '100%' }} onClose={handleAlertClose}>
            Communicating with Server
          </Alert>
        </Snackbar>
        <Snackbar open={this.state.commError} onClose={handleAlertClose}>
          <Alert severity="error" sx={{ width: '100%' }} onClose={handleAlertClose}>
            Error Communicating with Server
          </Alert>
        </Snackbar>
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
            <Conversation scope={this.state.scope} interactions={this.state.interactions} convoDeleteHandler={this.state.convoDeleteHandler} opportunities={this.state.opportunities} companies={this.state.companies} people={this.state.people} commError={this.state.commError} convoAddHandler={this.state.convoAddHandler}/>
          </div>
        </Drawer>
      </Box>
    );
  }
}
