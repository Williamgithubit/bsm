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

  return (
    <Card 
      sx={{ 
        height: '100%', 
        position: 'relative',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: selected ? '2px solid #ADF802' : '1px solid rgba(0, 0, 0, 0.12)',
        backgroundColor: selected ? 'rgba(173, 248, 2, 0.05)' : 'white',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          '& .athlete-actions': {
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
      <Box sx={{ position: 'relative', height: 200 }}>
        {getProfileImage() ? (
          <CardMedia
            component="img"
            height="200"
            image={getProfileImage()}
            alt={athlete.name}
            sx={{ objectFit: 'cover' }}
          />
        ) : (
          <Box
            sx={{
              height: 200,
              background: 'linear-gradient(135deg, #03045e 0%, #000054 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Avatar
              sx={{
                bgcolor: '#ADF802',
                color: '#03045e',
                width: 80,
                height: 80,
                fontSize: '2rem'
              }}
            >
              <PersonIcon fontSize="large" />
            </Avatar>
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
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.7)',
              color: 'white',
              '& .MuiChip-icon': { color: 'white' }
            }}
          />
        )}

        {/* Actions Menu */}
        <Box
          className="athlete-actions"
          sx={{
            position: 'absolute',
            top: 8,
            right: showSelection ? 40 : 8,
            opacity: 0,
            transition: 'opacity 0.3s ease'
          }}
        >
          <IconButton
            onClick={handleMenuClick}
            size="small"
            sx={{
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': { backgroundColor: 'white' }
            }}
          >
            <MoreVertIcon />
          </IconButton>
        </Box>
      </Box>

      <CardContent sx={{ p: 2 }}>
        {/* Name and Basic Info */}
        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#03045e' }}>
          {athlete.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
          {getSportIcon(athlete.sport)}
          <Typography variant="body2" color="text.secondary">
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
              mb: 2, 
              minHeight: 40,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}
          >
            {athlete.bio}
          </Typography>
        )}

        {/* Status Chips */}
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          <Chip
            label={athlete.level}
            color={getLevelColor(athlete.level) as any}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
          <Chip
            label={athlete.scoutingStatus}
            color={getStatusColor(athlete.scoutingStatus) as any}
            size="small"
            sx={{ textTransform: 'capitalize' }}
          />
        </Box>

        {/* Stats */}
        {athlete.stats && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(3, 1fr)', 
            gap: 1,
            p: 1,
            backgroundColor: 'rgba(173, 248, 2, 0.1)',
            borderRadius: 1,
            mb: 2
          }}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#03045e', fontWeight: 'bold' }}>
                {athlete.stats.goals || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Goals
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#03045e', fontWeight: 'bold' }}>
                {athlete.stats.assists || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Assists
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" sx={{ color: '#03045e', fontWeight: 'bold' }}>
                {athlete.stats.matches || 0}
              </Typography>
              <Typography variant="caption" color="text.secondary">
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
            onClick={(e) => {
              e.stopPropagation();
              onView(athlete);
            }}
            sx={{
              flex: 1,
              borderColor: '#03045e',
              color: '#03045e',
              '&:hover': {
                borderColor: '#ADF802',
                backgroundColor: 'rgba(173, 248, 2, 0.1)'
              }
            }}
          >
            View
          </Button>
          {userRole.permissions.canEdit && (
            <Button
              size="small"
              variant="contained"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(athlete);
              }}
              sx={{
                flex: 1,
                backgroundColor: '#ADF802',
                color: '#03045e',
                '&:hover': {
                  backgroundColor: '#9de002'
                }
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
        <MenuItem onClick={() => { onView(athlete); handleMenuClose(); }}>
          <ViewIcon sx={{ mr: 1 }} />
          View Details
        </MenuItem>
        {userRole.permissions.canEdit && (
          <MenuItem onClick={() => { onEdit(athlete); handleMenuClose(); }}>
            <EditIcon sx={{ mr: 1 }} />
            Edit
          </MenuItem>
        )}
        {userRole.permissions.canDelete && (
          <MenuItem 
            onClick={() => { onDelete(athlete.id); handleMenuClose(); }}
            sx={{ color: 'error.main' }}
          >
            <DeleteIcon sx={{ mr: 1 }} />
            Delete
          </MenuItem>
        )}
      </Menu>
    </Card>
  );
}
