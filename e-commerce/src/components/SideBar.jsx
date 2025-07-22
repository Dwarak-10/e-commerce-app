import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleIcon from '@mui/icons-material/People'

export default function Sidebar() {
  return (
    <Drawer variant="permanent" anchor="left">
      <List>
        <ListItem button>
          <ListItemIcon><DashboardIcon /></ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button>
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Users" />
        </ListItem>
      </List>
    </Drawer>
  )
}
