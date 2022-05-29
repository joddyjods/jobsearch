import './App.css';

import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
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

const companies = [
  {
    id : 1,
    name : 'Amazon'
  },
  {
    id : 2,
    name : 'Kava.io'
  }
];

const opportunities = [
  {
    id : 1001,
    companyid : 1,
    jobtitle : 'Sr Software Development Manager, Go',
    hiringmanager : 10001
  },
  {
    id : 1002,
    companyid : 1,
    jobtitle : 'Sr Software Development Manager, Assets',
    hiringmanager : -1
  },
  {
    id : 1003,
    companyid : 2,
    jobtitle : 'Vice President, Engineering',
    hiringmanager : 10002
  }
];

const people = [
  { 
    id : 10001,
    first : 'Charles',
    last : 'Jansen',
    title : 'Director, Amazon Go'
  },
  { 
    id : 10002,
    first : 'Jason',
    last : 'Ward',
    title : 'Senior Vice President, Engineering'
  }
];

const interactions = [
  {id: 1, source: 'website', from: 'you', date: 'May 4, 2022', msg: 'Applied at the website', key:'abc', opptyId : '1001', personId : 10001},
  {id: 2, source: 'email', from: 'Charles English', date: 'May 5, 2022', msg: 'Responded with an email', key:'123', opptyId : '1001', personId : 10002},
  {id: 3, source: 'message', from: 'you', date: 'May 6, 2022', msg: 'Provided times for an interview.  I told them that I didnt really care when the times were and gave them lots of times and then even more times, and then some other things happened', key:'asdf', opptyId : '1003', personId : 10002}
];

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
  const setOpen = React.useState(false);
  const open = React.useState(false);

  return ( <App {...props} theme={theme} open={open}/> )
}

class App extends React.Component {

  convoDeleteHandler(id) {
    let interactions = this.state.interactions;
    for ( var i = interactions.length-1; i >= 0; --i ) {
      if ( interactions[i].id == id ) {
        interactions.splice( i, 1 );
      }
    }

    this.setState( {interactions: interactions} );
  }

  convoAddHandler( source, from, date, msg ) {
    let interactions = this.state.interactions;
    interactions.push( {
      id: 55, 
      source: source,
      from: from,
      date: date,
      msg: msg,
      key: 'asldfkjalsdkfj'
    });
    this.setState( {interactions: interactions} );
  }

  /**
   * Add or remove scoping for the items being shown
   * @param {*} scopeType 'company', 'opportunity', or 'person' 
   * @param {*} newValue The ID of the object to scope down to, or null for unscoped
   */
  scopeChange( scopeType, newValue ) {
    const newScope = { ... this.state.scope };

    newScope[scopeType] = newValue;
    this.setState( {scope: newScope} );
  }


 constructor(props) {
    super(props);

    this.state = {
      companies : companies,
      opportunities : opportunities,
      interactions : interactions,
      convoDeleteHandler : this.convoDeleteHandler.bind(this),
      convoAddHandler : this.convoAddHandler.bind( this ),
      scopeChangeHandler : this.scopeChange.bind( this ),

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
        <CssBaseline />
        <AppBar position="fixed" open={open}>
          <Toolbar>
            <Typography variant="h6" noWrap sx={{ flexGrow: 1 }} component="div">
              Opportunities will go here
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
          <Typography paragraph>
            <Opportunities opportunities={this.state.opportunities} companies={this.state.companies} people={this.state.people} scopeChangeHandler={this.state.scopeChangeHandler} />
          </Typography>
          
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
            <Conversation scope={this.state.scope} interactions={this.state.interactions} convoDeleteHandler={this.state.convoDeleteHandler} convoAddHandler={this.state.convoAddHandler}/>
          </div>
        </Drawer>
      </Box>
    );
  }
}
