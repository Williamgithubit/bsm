'use client'
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Grid from "@/components/ui/Grid";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const SportsAnalytics = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for athlete distribution by region
  const regionData = [
    { name: 'Monrovia', athletes: 65, events: 12 },
    { name: 'Paynesville', athletes: 45, events: 8 },
    { name: 'Buchanan', athletes: 25, events: 5 },
    { name: 'Gbarnga', athletes: 15, events: 3 },
  ];

  // Mock data for athlete levels
  const levelData = [
    { name: 'Grassroots', value: 85, color: '#8884d8' },
    { name: 'Semi-Pro', value: 45, color: '#82ca9d' },
    { name: 'Professional', value: 20, color: '#ffc658' },
  ];

  // Mock data for monthly growth
  const growthData = [
    { month: 'Jan', athletes: 120, events: 15 },
    { month: 'Feb', athletes: 125, events: 18 },
    { month: 'Mar', athletes: 135, events: 20 },
    { month: 'Apr', athletes: 140, events: 22 },
    { month: 'May', athletes: 150, events: 25 },
    { month: 'Jun', athletes: 150, events: 28 },
  ];

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300'];

  return (
    <Box>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          color: '#000054', 
          fontWeight: 'bold',
          mb: 3
        }}
      >
        Sports Analytics Overview
      </Typography>

      <Grid container spacing={3}>
        {/* Athlete Growth Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Athlete & Event Growth (6 Months)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="athletes" 
                  stroke="#E32845" 
                  strokeWidth={3}
                  name="Athletes"
                />
                <Line 
                  type="monotone" 
                  dataKey="events" 
                  stroke="#000054" 
                  strokeWidth={3}
                  name="Events"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Level Distribution */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Athletes by Level
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={levelData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : '0'}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {levelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Regional Distribution */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: 350 }}>
            <Typography variant="h6" gutterBottom>
              Athletes & Events by Region (Liberia)
            </Typography>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={regionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="athletes" fill="#E32845" name="Athletes" />
                <Bar dataKey="events" fill="#000054" name="Events" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Key Metrics Cards */}
        <Grid item xs={12}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Typography variant="h4" color="#E32845" fontWeight="bold">
                    92%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Event Attendance Rate
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Typography variant="h4" color="#000054" fontWeight="bold">
                    30%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Athletes Scouted
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Typography variant="h4" color="#4caf50" fontWeight="bold">
                    85%
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Training Completion
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6} md={3}>
              <Card sx={{ textAlign: 'center', p: 1 }}>
                <CardContent>
                  <Typography variant="h4" color="#ff9800" fontWeight="bold">
                    12
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Active Programs
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SportsAnalytics;
