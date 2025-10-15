'use client'
import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Menu,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Paper,
  Divider,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Reply as ReplyIcon,
  Archive as ArchiveIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Business as BusinessIcon
} from '@mui/icons-material';

interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  category: string;
  status: string;
  response?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactManagementProps {
  openDialog: boolean;
  onCloseDialog: () => void;
}

export default function ContactManagement({ openDialog, onCloseDialog }: ContactManagementProps) {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedContact, setSelectedContact] = useState<ContactSubmission | null>(null);
  const [dialogMode, setDialogMode] = useState<'view' | 'reply'>('view');
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedContactId, setSelectedContactId] = useState<string>('');
  const [replyMessage, setReplyMessage] = useState('');
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  // Mock data for demonstration
  useEffect(() => {
    const mockContacts: ContactSubmission[] = [
      {
        id: '1',
        name: 'Samuel Williams',
        email: 'samuel@example.com',
        subject: 'Partnership Opportunity',
        message: 'I would like to discuss a potential partnership for youth football development in rural Liberia.',
        category: 'partnerships',
        status: 'new',
        createdAt: '2024-10-10T10:00:00Z',
        updatedAt: '2024-10-10T10:00:00Z'
      },
      {
        id: '2',
        name: 'Grace Johnson',
        email: 'grace@example.com',
        subject: 'Scouting Request',
        message: 'My son is 16 and plays for his school team. We would like him to be scouted for potential opportunities.',
        category: 'scouting',
        status: 'responded',
        response: 'Thank you for your interest. We have scheduled a scouting session for next week.',
        createdAt: '2024-10-08T14:30:00Z',
        updatedAt: '2024-10-09T09:15:00Z'
      },
      {
        id: '3',
        name: 'Moses Kpehe',
        email: 'moses@example.com',
        subject: 'Training Camp Inquiry',
        message: 'When is the next training camp? I have several young players who would benefit from professional training.',
        category: 'events',
        status: 'new',
        createdAt: '2024-10-12T16:45:00Z',
        updatedAt: '2024-10-12T16:45:00Z'
      }
    ];
    setContacts(mockContacts);
    setLoading(false);
  }, []);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, contactId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedContactId(contactId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedContactId('');
  };

  const handleViewContact = (contact: ContactSubmission) => {
    setDialogMode('view');
    setSelectedContact(contact);
    setReplyMessage('');
    handleMenuClose();
  };

  const handleReplyContact = (contact: ContactSubmission) => {
    setDialogMode('reply');
    setSelectedContact(contact);
    setReplyMessage('');
    handleMenuClose();
  };

  const handleArchiveContact = (contactId: string) => {
    const updatedContacts = contacts.map(c =>
      c.id === contactId
        ? { ...c, status: 'archived', updatedAt: new Date().toISOString() }
        : c
    );
    setContacts(updatedContacts);
    setSnackbar({
      open: true,
      message: 'Contact archived successfully',
      severity: 'success'
    });
    handleMenuClose();
  };

  const handleDeleteContact = (contactId: string) => {
    setContacts(contacts.filter(c => c.id !== contactId));
    setSnackbar({
      open: true,
      message: 'Contact deleted successfully',
      severity: 'success'
    });
    handleMenuClose();
  };

  const handleSendReply = () => {
    if (selectedContact && replyMessage.trim()) {
      const updatedContacts = contacts.map(c =>
        c.id === selectedContact.id
          ? {
              ...c,
              status: 'responded',
              response: replyMessage,
              updatedAt: new Date().toISOString()
            }
          : c
      );
      setContacts(updatedContacts);
      setSnackbar({
        open: true,
        message: 'Reply sent successfully',
        severity: 'success'
      });
      onCloseDialog();
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || contact.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || contact.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'error';
      case 'responded': return 'success';
      case 'archived': return 'default';
      default: return 'default';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'partnerships': return 'primary';
      case 'scouting': return 'warning';
      case 'events': return 'info';
      default: return 'default';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'partnerships': return <BusinessIcon />;
      case 'scouting': return <EmailIcon />;
      case 'events': return <PhoneIcon />;
      default: return <EmailIcon />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1a1a1a' }}>
          Contact Management
        </Typography>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />
              }}
            />
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                label="Category"
              >
                <MenuItem value="all">All Categories</MenuItem>
                <MenuItem value="partnerships">Partnerships</MenuItem>
                <MenuItem value="scouting">Scouting</MenuItem>
                <MenuItem value="events">Events</MenuItem>
                <MenuItem value="general">General</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                label="Status"
              >
                <MenuItem value="all">All Status</MenuItem>
                <MenuItem value="new">New</MenuItem>
                <MenuItem value="responded">Responded</MenuItem>
                <MenuItem value="archived">Archived</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* Contacts List */}
      <Grid container spacing={2}>
        {filteredContacts.map((contact) => (
          <Grid item xs={12} key={contact.id}>
            <Card sx={{ position: 'relative' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        {contact.name}
                      </Typography>
                      <Chip
                        label={contact.category}
                        color={getCategoryColor(contact.category) as any}
                        size="small"
                        icon={getCategoryIcon(contact.category)}
                      />
                      <Chip
                        label={contact.status}
                        color={getStatusColor(contact.status) as any}
                        size="small"
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {contact.email} • {formatDate(contact.createdAt)}
                    </Typography>
                    
                    <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 1 }}>
                      {contact.subject}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {contact.message.length > 150 
                        ? `${contact.message.substring(0, 150)}...` 
                        : contact.message}
                    </Typography>
                    
                    {contact.response && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 'medium', mb: 1 }}>
                          Response:
                        </Typography>
                        <Typography variant="body2">
                          {contact.response}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                  
                  <IconButton
                    onClick={(e) => handleMenuClick(e, contact.id)}
                    size="small"
                  >
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {filteredContacts.length === 0 && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            No contacts found
          </Typography>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => {
          const contact = contacts.find(c => c.id === selectedContactId);
          if (contact) handleViewContact(contact);
        }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        <MenuItem onClick={() => {
          const contact = contacts.find(c => c.id === selectedContactId);
          if (contact) handleReplyContact(contact);
        }}>
          <ReplyIcon sx={{ mr: 1 }} />
          Reply
        </MenuItem>
        <MenuItem onClick={() => handleArchiveContact(selectedContactId)}>
          <ArchiveIcon sx={{ mr: 1 }} />
          Archive
        </MenuItem>
        <MenuItem onClick={() => handleDeleteContact(selectedContactId)}>
          <DeleteIcon sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>

      {/* View/Reply Dialog */}
      <Dialog
        open={openDialog}
        onClose={onCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {dialogMode === 'view' ? 'Contact Details' : 'Reply to Contact'}
        </DialogTitle>
        <DialogContent>
          {selectedContact && (
            <Box sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Name"
                    value={selectedContact.name}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    value={selectedContact.email}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Category"
                    value={selectedContact.category}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Status"
                    value={selectedContact.status}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    value={selectedContact.subject}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Message"
                    multiline
                    rows={4}
                    value={selectedContact.message}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                
                {selectedContact.response && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Previous Response"
                      multiline
                      rows={3}
                      value={selectedContact.response}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
                
                {dialogMode === 'reply' && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Your Reply"
                      multiline
                      rows={4}
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      placeholder="Type your reply here..."
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseDialog}>
            {dialogMode === 'view' ? 'Close' : 'Cancel'}
          </Button>
          {dialogMode === 'reply' && (
            <Button
              onClick={handleSendReply}
              variant="contained"
              disabled={!replyMessage.trim()}
              sx={{
                backgroundColor: '#E32845',
                '&:hover': { backgroundColor: '#c41e3a' }
              }}
            >
              Send Reply
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
