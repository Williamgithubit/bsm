'use client'
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Badge,
  Button
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  SportsFootball as SportsIcon,
  EmojiEvents as TrophyIcon,
  Person as PersonIcon,
  PhotoLibrary as MediaIcon
} from '@mui/icons-material';
import { Athlete, UserRole } from '@/types/athlete';
import toast, { Toaster } from 'react-hot-toast';

interface AthleteCardProps {
  athlete: Athlete;
  userRole: UserRole;
  onView: (athlete: Athlete) => void;
  onEdit: (athlete: Athlete) => void;
  onDelete: (athleteId: string) => void;
  onSelect?: (athleteId: string, selected: boolean) => void;
  selected?: boolean;
  showSelection?: boolean;
}

export default function AthleteCard({
  athlete,
  userRole,
  onView,
  onEdit,
  onDelete,
  onSelect,
  selected = false,
  showSelection = false
}: AthleteCardProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleCardClick = () => {
    if (showSelection && onSelect) {
      onSelect(athlete.id, !selected);
    } else {
      onView(athlete);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'scouted': return 'warning';
      case 'signed': return 'info';
      case 'inactive': return 'default';
      default: return 'default';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'grassroots': return 'info';
      case 'semi-pro': return 'warning';
      case 'professional': return 'success';
      default: return 'default';
    }
  };

  const getSportIcon = (sport: string) => {
    switch (sport) {
      case 'football': return <SportsIcon />;
      default: return <SportsIcon />;
    }
  };

  const getProfileImage = () => {
    const profilePhoto = athlete.media?.find(m => m.type === 'photo');
    return profilePhoto?.url;
  };

  const formatAge = (age?: number, dateOfBirth?: string) => {
    if (age) return `${age} years`;
    if (dateOfBirth) {
      const birthDate = new Date(dateOfBirth);
      const today = new Date();
      const calculatedAge = today.getFullYear() - birthDate.getFullYear();
      return `${calculatedAge} years`;
    }
    return 'Age unknown';
  };

  const handleViewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.loading('Loading athlete details...');
    setTimeout(() => {
      onView(athlete);
      toast.dismiss();
    }, 1000);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.loading('Loading edit form...');
    setTimeout(() => {
      onEdit(athlete);
      toast.dismiss();
    }, 1000);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toast.loading('Deleting athlete...');
    setTimeout(() => {
      onDelete(athlete.id);
      toast.dismiss();
    }, 1000);
  };

  return (
    <>
      <Toaster position="top-right" />
      <Card 
        sx={{ 
          height: '100%', 
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          border: selected ? '2px solid #ADF802' : 'none',
          backgroundColor: selected ? 'rgba(173, 248, 2, 0.05)' : 'white',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: 300, // Decreased width of the card
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
            '& .athlete-actions': {
              opacity: 1
            },
            '& .athlete-image': {
              transform: 'scale(1.1)' // Enhanced image scaling on hover
            },
            '& .athlete-overlay': {
              opacity: 1
            }
          }
        }}
        onClick={handleCardClick}
      >
        {/* Selection Checkbox */}
        {showSelection && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              zIndex: 2
            }}
          >
            <Badge
              color="primary"
              variant="dot"
              invisible={!selected}
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#ADF802',
                  width: 12,
                  height: 12
                }
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  border: '2px solid',
                  borderColor: selected ? '#ADF802' : 'rgba(0,0,0,0.3)',
                  backgroundColor: selected ? '#ADF802' : 'transparent',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              />
            </Badge>
          </Box>
        )}

        {/* Profile Image or Avatar */}
        <Box sx={{ position: 'relative', height: 180, overflow: 'hidden' }}> {/* Increased height for better image display */}
          {getProfileImage() ? (
            <>
              <CardMedia
                component="img"
                height="180"
                image={getProfileImage()}
                alt={athlete.name}
                className="athlete-image"
                sx={{ 
                  objectFit: 'cover',
                  width: '100%', // Ensure image fills the card width
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
              {/* Gradient Overlay */}
              <Box
                className="athlete-overlay"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '50%',
                  background: 'linear-gradient(transparent, rgba(3, 4, 94, 0.8))',
                  opacity: 0,
                  transition: 'opacity 0.3s ease'
                }}
              />
            </>
          ) : (
            <Box
              sx={{
                height: 180,
                background: 'linear-gradient(135deg, #03045e 0%, #000054 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: '#ADF802',
                  color: '#03045e',
                  width: 70,
                  height: 70,
                  fontSize: '2rem',
                  boxShadow: '0 4px 20px rgba(173, 248, 2, 0.3)'
                }}
              >
                <PersonIcon fontSize="large" />
              </Avatar>
              {/* Decorative elements */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 20,
                  right: 20,
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  border: '2px solid rgba(173, 248, 2, 0.2)',
                  '@keyframes pulse': {
                    '0%': {
                      transform: 'scale(1)',
                      opacity: 0.7,
                    },
                    '50%': {
                      transform: 'scale(1.1)',
                      opacity: 0.4,
                    },
                    '100%': {
                      transform: 'scale(1)',
                      opacity: 0.7,
                    },
                  },
                  animation: 'pulse 2s infinite'
                }}
              />
            </Box>
          )}

          {/* Media Count Badge */}
          {athlete.media && athlete.media.length > 0 && (
            <Chip
              icon={<MediaIcon />}
              label={athlete.media.length}
              size="small"
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                backgroundColor: 'rgba(173, 248, 2, 0.9)',
                color: '#03045e',
                fontWeight: 'bold',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                '& .MuiChip-icon': { color: '#03045e' }
              }}
            />
          )}

          {/* Actions Menu */}
          <Box
            className="athlete-actions"
            sx={{
              position: 'absolute',
              top: 12,
              right: showSelection ? 52 : 12,
              opacity: 0,
              transition: 'all 0.3s ease',
              transform: 'translateY(-10px)',
              '&:hover': {
                transform: 'translateY(0)'
              }
            }}
          >
            <IconButton
              onClick={handleMenuClick}
              size="small"
              sx={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.2)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                '&:hover': { 
                  backgroundColor: 'white',
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <MoreVertIcon sx={{ color: '#03045e' }} />
            </IconButton>
          </Box>
        </Box>

        <CardContent sx={{ p: 2, pt: 1.5 }}>
          {/* Name and Basic Info */}
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 700, 
              mb: 1, 
              color: '#03045e',
              fontSize: '1.1rem',
              lineHeight: 1.2
            }}
          >
            {athlete.name}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box
              sx={{
                p: 0.5,
                borderRadius: 1,
                backgroundColor: 'rgba(173, 248, 2, 0.1)',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {getSportIcon(athlete.sport)}
            </Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}
            >
              {athlete.position} • {formatAge(athlete.age, athlete.dateOfBirth)}
            </Typography>
          </Box>

          {/* Location */}
          {(athlete.location || athlete.county) && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <LocationIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
              <Typography variant="body2" color="text.secondary">
                {athlete.county ? `${athlete.county}${athlete.location ? `, ${athlete.location}` : ''}` : athlete.location}
              </Typography>
            </Box>
          )}

          {/* Bio */}
          {athlete.bio && (
            <Typography 
              variant="body2" 
              sx={{ 
                mb: 1.5, 
                minHeight: 32,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '0.8rem',
                color: 'text.secondary'
              }}
            >
              {athlete.bio}
            </Typography>
          )}

          {/* Status Chips */}
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1.5, flexWrap: 'wrap' }}>
            <Chip
              label={athlete.level}
              size="small"
              sx={{ 
                textTransform: 'capitalize',
                backgroundColor: getLevelColor(athlete.level) === 'success' ? 'rgba(76, 175, 80, 0.1)' : 
                               getLevelColor(athlete.level) === 'warning' ? 'rgba(255, 152, 0, 0.1)' : 
                               'rgba(33, 150, 243, 0.1)',
                color: getLevelColor(athlete.level) === 'success' ? '#2e7d32' : 
                       getLevelColor(athlete.level) === 'warning' ? '#f57c00' : 
                       '#1976d2',
                fontWeight: 600,
                border: '1px solid',
                borderColor: getLevelColor(athlete.level) === 'success' ? 'rgba(76, 175, 80, 0.3)' : 
                            getLevelColor(athlete.level) === 'warning' ? 'rgba(255, 152, 0, 0.3)' : 
                            'rgba(33, 150, 243, 0.3)'
              }}
            />
            <Chip
              label={athlete.scoutingStatus}
              size="small"
              sx={{ 
                textTransform: 'capitalize',
                backgroundColor: getStatusColor(athlete.scoutingStatus) === 'success' ? 'rgba(173, 248, 2, 0.15)' : 
                               getStatusColor(athlete.scoutingStatus) === 'warning' ? 'rgba(255, 193, 7, 0.15)' : 
                               getStatusColor(athlete.scoutingStatus) === 'info' ? 'rgba(3, 4, 94, 0.1)' :
                               'rgba(158, 158, 158, 0.1)',
                color: getStatusColor(athlete.scoutingStatus) === 'success' ? '#03045e' : 
                       getStatusColor(athlete.scoutingStatus) === 'warning' ? '#f57c00' : 
                       getStatusColor(athlete.scoutingStatus) === 'info' ? '#03045e' :
                       '#757575',
                fontWeight: 600,
                border: '1px solid',
                borderColor: getStatusColor(athlete.scoutingStatus) === 'success' ? 'rgba(173, 248, 2, 0.3)' : 
                            getStatusColor(athlete.scoutingStatus) === 'warning' ? 'rgba(255, 193, 7, 0.3)' : 
                            getStatusColor(athlete.scoutingStatus) === 'info' ? 'rgba(3, 4, 94, 0.2)' :
                            'rgba(158, 158, 158, 0.3)'
              }}
            />
          </Box>

          {/* Stats */}
          {athlete.stats && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(3, 1fr)', 
              gap: 1,
              p: 1.5,
              backgroundColor: 'rgba(173, 248, 2, 0.08)',
              borderRadius: 1.5,
              mb: 2,
              border: '1px solid rgba(173, 248, 2, 0.2)'
            }}>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#03045e', 
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    lineHeight: 1
                  }}
                >
                  {athlete.stats.goals || 0}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.3
                  }}
                >
                  Goals
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#03045e', 
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    lineHeight: 1
                  }}
                >
                  {athlete.stats.assists || 0}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.3
                  }}
                >
                  Assists
                </Typography>
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Typography 
                  variant="h6" 
                  sx={{ 
                    color: '#03045e', 
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    lineHeight: 1
                  }}
                >
                  {athlete.stats.matches || 0}
                </Typography>
                <Typography 
                  variant="caption" 
                  sx={{ 
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.65rem',
                    textTransform: 'uppercase',
                    letterSpacing: 0.3
                  }}
                >
                  Matches
                </Typography>
              </Box>
            </Box>
          )}

          {/* Contact Info */}
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
            {athlete.contact?.email && (
              <Tooltip title={athlete.contact.email}>
                <IconButton size="small" sx={{ color: '#03045e' }}>
                  <EmailIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
            {athlete.contact?.phone && (
              <Tooltip title={athlete.contact.phone}>
                <IconButton size="small" sx={{ color: '#03045e' }}>
                  <PhoneIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          {/* Quick Actions */}
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button
              size="small"
              variant="outlined"
              onClick={handleViewClick}
              sx={{
                flex: 1,
                borderColor: '#03045e',
                color: '#03045e',
                fontWeight: 600,
                borderRadius: 1.5,
                py: 0.5,
                textTransform: 'none',
                fontSize: '0.8rem',
                minHeight: 32,
                '&:hover': {
                  borderColor: '#ADF802',
                  backgroundColor: 'rgba(173, 248, 2, 0.1)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 2px 8px rgba(173, 248, 2, 0.2)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View
            </Button>
            {userRole.permissions.canEdit && (
              <Button
                size="small"
                variant="contained"
                onClick={handleEditClick}
                sx={{
                  flex: 1,
                  backgroundColor: '#ADF802',
                  color: '#03045e',
                  fontWeight: 700,
                  borderRadius: 1.5,
                  py: 0.5,
                  textTransform: 'none',
                  fontSize: '0.8rem',
                  minHeight: 32,
                  boxShadow: '0 1px 4px rgba(173, 248, 2, 0.3)',
                  '&:hover': {
                    backgroundColor: '#9de002',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 3px 8px rgba(173, 248, 2, 0.4)'
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Edit
              </Button>
            )}
          </Box>
        </CardContent>

        {/* Context Menu */}
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          onClick={(e) => e.stopPropagation()}
        >
          {/* View Details - Available to all users */}
          <MenuItem onClick={(e) => { handleViewClick(e); handleMenuClose(); }}>
            <ViewIcon sx={{ mr: 1 }} />
            View Details
          </MenuItem>
          
          {/* Edit - Show for admin users */}
          {(userRole.role === 'admin' || userRole.permissions.canEdit) && (
            <MenuItem onClick={(e) => { handleEditClick(e); handleMenuClose(); }}>
              <EditIcon sx={{ mr: 1 }} />
              Edit
            </MenuItem>
          )}
          
          {/* Delete - Show only for admin users */}
          {(userRole.role === 'admin' || userRole.permissions.canDelete) && (
            <MenuItem 
              onClick={(e) => { handleDeleteClick(e); handleMenuClose(); }}
              sx={{ color: 'error.main' }}
            >
              <DeleteIcon sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          )}
        </Menu>
      </Card>
    </>
  );
}