import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent, 
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  Button,
  Stack, 
  useMediaQuery,
  useTheme,
} from '@mui/material';
import Grid from '@/components/ui/Grid';
import {
  People as PeopleIcon,
  SportsFootball as SportsIcon,
  Event as EventIcon,
  CheckCircle as CheckCircleIcon,
  PersonAdd as PersonAddIcon,
  Add as AddIcon,
  Schedule as ScheduleIcon,
  Refresh as RefreshIcon,
  Storage as StorageIcon,
  FitnessCenter as AthleteIcon,
  EmojiEvents as TrophyIcon,
  Article as BlogIcon,
  ContactMail as ContactIcon,
  Analytics as AnalyticsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { 
  fetchDashboardStats, 
  fetchRecentActivity, 
  getTimeAgo,
  DashboardStats,
  RecentActivity 
} from '@/services/dashboardService';
import { seedSampleData } from '@/utils/seedDashboardData';
import QuickActions from './QuickActions';
import SportsAnalytics from './SportsAnalytics';

const Dashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seeding, setSeeding] = useState(false);
  
  // Sports-specific stats
  const [sportsStats, setSportsStats] = useState({
    totalAthletes: 150,
    scoutedAthletes: 45,
    upcomingEvents: 8,
    activeTrainingPrograms: 12,
    recentRegistrations: 23,
    blogPosts: 15,
    contactSubmissions: 7
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsData, activityData] = await Promise.all([
        fetchDashboardStats(),
        fetchRecentActivity(10)
      ]);
      
      setStats(statsData);
      setRecentActivity(activityData);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
  };

  const handleSeedData = async () => {
    try {
      setSeeding(true);
      await seedSampleData();
      // Refresh data after seeding
      await loadDashboardData();
    } catch (err) {
      console.error('Error seeding data:', err);
      setError('Failed to seed sample data');
    } finally {
      setSeeding(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
    // Load mock sports activity data
    const mockSportsActivity = [
      {
        id: '1',
        type: 'athlete_added' as const,
        description: 'New athlete John Doe registered from Monrovia',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '2',
        type: 'event_created' as const,
        description: 'Youth Football Tournament scheduled for Paynesville Stadium',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '3',
        type: 'training_completed' as const,
        description: 'Elite Development training session completed',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '4',
        type: 'contact_received' as const,
        description: 'Partnership inquiry received from local sports club',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString()
      },
      {
        id: '5',
        type: 'user_registered' as const,
        description: 'New coach Mary Johnson joined the platform',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
      }
    ];
    // Cast to RecentActivity[] to match the state type (these are mock items)
    setRecentActivity(mockSportsActivity as unknown as RecentActivity[]);
  }, []);

  // Activity icons
  const getActivityIcon = (type: string): React.ReactElement => {
    switch (type) {
      case 'user_registered':
        return <PersonAddIcon color="primary" />;
      case 'athlete_added':
        return <AthleteIcon color="secondary" />;
      case 'event_created':
        return <ScheduleIcon color="success" />;
      case 'training_completed':
        return <CheckCircleIcon color="action" />;
      case 'contact_received':
        return <ContactIcon color="info" />;
      default:
        return <AddIcon />;
    }
  };
  
  // Activity colors
  const getActivityColor = (type: string): 'primary' | 'secondary' | 'success' | 'default' | 'info' => {
    switch (type) {
      case 'user_registered':
        return 'primary';
      case 'athlete_added':
        return 'secondary';
      case 'event_created':
        return 'success';
      case 'training_completed':
        return 'default';
      case 'contact_received':
        return 'info';
      default:
        return 'default';
    }
  };

  // Loading state
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>Loading dashboard...</Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  const statsCards = [
    { 
      title: 'Total Athletes', 
      value: sportsStats.totalAthletes.toLocaleString(), 
      icon: <AthleteIcon fontSize="large" color="primary" />,
      trend: '+12%',
      trendUp: true
    },
    { 
      title: 'Scouted Athletes', 
      value: sportsStats.scoutedAthletes.toString(), 
      icon: <TrophyIcon fontSize="large" color="warning" />,
      trend: '+8%',
      trendUp: true
    },
    { 
      title: 'Upcoming Events', 
      value: sportsStats.upcomingEvents.toString(), 
      icon: <EventIcon fontSize="large" color="success" />,
      trend: '+3',
      trendUp: true
    },
    { 
      title: 'Training Programs', 
      value: sportsStats.activeTrainingPrograms.toString(), 
      icon: <SportsIcon fontSize="large" color="secondary" />,
      trend: '+2',
      trendUp: true
    },
    { 
      title: 'Recent Registrations', 
      value: sportsStats.recentRegistrations.toString(), 
      icon: <PersonAddIcon fontSize="large" color="info" />,
      trend: '+15%',
      trendUp: true
    },
    { 
      title: 'Blog Posts', 
      value: sportsStats.blogPosts.toString(), 
      icon: <BlogIcon fontSize="large" sx={{ color: '#E32845' }} />,
      trend: '+5',
      trendUp: true
    },
    { 
      title: 'Contact Submissions', 
      value: sportsStats.contactSubmissions.toString(), 
      icon: <ContactIcon fontSize="large" color="action" />,
      trend: '+2',
      trendUp: true
    },
  ];

  return (
    <Box>
      <Box 
        display="flex" 
        flexDirection={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between" 
        alignItems={{ xs: 'stretch', sm: 'center' }} 
        gap={2}
        mb={2}>
        <Typography variant="h5" component="h1" sx={{ 
          fontWeight: 'bold', 
          color: '#000054',
          fontSize: { xs: '1.25rem', sm: '1.5rem' } 
        }}>
          BSM Sports Management Dashboard
        </Typography>
        
        <Stack 
          direction={{ xs: 'column', sm: 'row' }} 
          spacing={2} 
          width={{ xs: '100%', sm: 'auto' }}
        >
          <Button
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
            variant="outlined"
            disabled={loading}
            fullWidth={isMobile}
            size={isMobile ? 'small' : 'medium'}
          >
            Refresh
          </Button>
          
          <Button
            startIcon={<StorageIcon />}
            onClick={handleSeedData}
            variant="contained"
            disabled={loading || seeding}
            fullWidth={isMobile}
            size={isMobile ? 'small' : 'medium'}
            sx={{
              backgroundColor: '#E32845',
              '&:hover': {
                backgroundColor: '#c41e3a',
              },
            }}
          >
            {seeding ? 'Seeding...' : 'Seed Sample Data'}
          </Button>
        </Stack>
      </Box>
      
      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ mt: 2, mb: 4 }}>
        {statsCards.map((stat, index) => (
          <Grid key={index} xs={12} sm={6} lg={3} xl={2}>
            <Paper 
              elevation={2}
              sx={{
                background: 'linear-gradient(135deg, #000054 0%, #1a1a6e 100%)',
                color: 'white',
                borderRadius: 2,
              }}
            >
              <Card sx={{ background: 'transparent', boxShadow: 'none' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography 
                        color="rgba(255, 255, 255, 0.8)" 
                        gutterBottom
                        sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}
                      >
                        {stat.title}
                      </Typography>
                      <Typography 
                        variant="h5" 
                        component="div" 
                        sx={{ 
                          color: 'white', 
                          fontWeight: 'bold',
                          fontSize: { xs: '1.25rem', sm: '1.5rem' } 
                        }}
                      >
                        {stat.value}
                      </Typography>
                      {stat.trend && (
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                          <TrendingUpIcon 
                            sx={{ 
                              fontSize: '1rem', 
                              color: stat.trendUp ? '#4caf50' : '#f44336',
                              mr: 0.5,
                              transform: stat.trendUp ? 'none' : 'rotate(180deg)'
                            }} 
                          />
                          <Typography 
                            variant="caption" 
                            sx={{ 
                              color: stat.trendUp ? '#4caf50' : '#f44336',
                              fontWeight: 'medium'
                            }}
                          >
                            {stat.trend}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                    <Box sx={{ color: '#E32845' }}>
                      {React.cloneElement(stat.icon, { 
                        sx: { 
                          color: '#E32845', 
                          fontSize: { xs: '2rem', sm: '2.5rem' } 
                        } 
                      })}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid xs={12} md={8}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: { xs: 1.5, sm: 2 }, 
              mb: 3,
              background: 'white',
              borderRadius: 2,
              border: '1px solid rgba(0, 0, 84, 0.1)',
              overflow: 'hidden',
            }}
          >
            <Typography 
              variant="h6" 
              gutterBottom 
              sx={{ 
                color: '#000054', 
                fontWeight: 'bold',
                fontSize: { xs: '1rem', sm: '1.25rem' } 
              }}
            >
              Recent Sports Activity
            </Typography>
            {recentActivity.length > 0 ? (
              <List>
                {recentActivity.map((activity) => (
                  <ListItem key={activity.id} divider sx={{ 
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    py: { xs: 1.5, sm: 1 },
                    px: { xs: 1, sm: 2 },
                    gap: { xs: 1, sm: 0 }
                  }}>
                    <ListItemIcon sx={{ 
                      minWidth: { xs: '30px', sm: '40px' },
                      mr: { xs: 0, sm: 1 }
                    }}>
                      {getActivityIcon(activity.type)}
                    </ListItemIcon>
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      gap: 0.5,
                      width: { xs: '100%', sm: 'auto' }
                    }}>
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {activity.description}
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        gap: 1,
                        flexDirection: { xs: 'column', sm: 'row' },
                        alignItems: { xs: 'flex-start', sm: 'center' }
                      }}>
                        <Typography variant="caption" color="textSecondary">
                          {getTimeAgo(activity.timestamp)}
                        </Typography>
                        <Chip 
                          label={activity.type.replace('_', ' ')} 
                          size="small" 
                          color={getActivityColor(activity.type)}
                          variant="outlined"
                          sx={{ maxWidth: { xs: '100%', sm: '120px' } }}
                        />
                      </Box>
                    </Box>
                  </ListItem>
                ))}
              </List>
            ) : (
              <Typography color="textSecondary">
                No recent activity found
              </Typography>
            )}
          </Paper>
        </Grid>
        <Grid xs={12} md={4}>
          <QuickActions />
        </Grid>
      </Grid>
      
      {/* Sports Analytics Section */}
      <Box sx={{ mt: 4 }}>
        <SportsAnalytics />
      </Box>
    </Box>
  );
};

export default Dashboard;
