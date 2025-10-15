"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
  Card,
  CardContent,
  IconButton,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Grid from "@/components/ui/Grid";
import {
  Close as CloseIcon,
  Edit as EditIcon,
  LocationOn as LocationIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Cake as CakeIcon,
  Height as HeightIcon,
  FitnessCenter as WeightIcon,
  SportsFootball as SportsIcon,
  EmojiEvents as TrophyIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Download as DownloadIcon,
  Share as ShareIcon,
  Instagram as InstagramIcon,
  Twitter as TwitterIcon,
  Facebook as FacebookIcon,
} from "@mui/icons-material";
import { Athlete, UserRole } from "@/types/athlete";

interface AthleteProfileProps {
  athlete: Athlete | null;
  open: boolean;
  onClose: () => void;
  onEdit: (athlete: Athlete) => void;
  userRole: UserRole;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`athlete-tabpanel-${index}`}
      aria-labelledby={`athlete-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AthleteProfile({
  athlete,
  open,
  onClose,
  onEdit,
  userRole,
}: AthleteProfileProps) {
  const [tabValue, setTabValue] = useState(0);

  if (!athlete) return null;

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getProfileImage = () => {
    const profilePhoto = athlete.media?.find((m) => m.type === "photo");
    return profilePhoto?.url;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "scouted":
        return "warning";
      case "signed":
        return "info";
      case "inactive":
        return "default";
      default:
        return "default";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "grassroots":
        return "info";
      case "semi-pro":
        return "warning";
      case "professional":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const photos = athlete.media?.filter((m) => m.type === "photo") || [];
  const videos = athlete.media?.filter((m) => m.type === "video") || [];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          minHeight: "80vh",
          maxHeight: "90vh",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#03045e",
          color: "white",
        }}
      >
        <Typography variant="h5" component="div" sx={{ fontWeight: "bold" }}>
          Athlete Profile
        </Typography>
        <Box>
          {userRole.permissions.canEdit && (
            <IconButton
              onClick={() => onEdit(athlete)}
              sx={{ color: "white", mr: 1 }}
            >
              <EditIcon />
            </IconButton>
          )}
          <IconButton onClick={onClose} sx={{ color: "white" }}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        {/* Header Section */}
        <Box
          sx={{
            background: "linear-gradient(135deg, #03045e 0%, #000054 100%)",
            color: "white",
            p: 3,
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              {getProfileImage() ? (
                <Avatar
                  src={getProfileImage()}
                  sx={{ width: 120, height: 120, border: "4px solid #ADF802" }}
                />
              ) : (
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: "#ADF802",
                    color: "#03045e",
                    fontSize: "3rem",
                    border: "4px solid #ADF802",
                  }}
                >
                  <PersonIcon fontSize="large" />
                </Avatar>
              )}
            </Grid>
            <Grid item xs>
              <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
                {athlete.name}
              </Typography>
              <Typography variant="h6" sx={{ mb: 2, opacity: 0.9 }}>
                {athlete.position} • {athlete.sport}
              </Typography>
              <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                <Chip
                  label={athlete.level}
                  color={getLevelColor(athlete.level) as any}
                  sx={{ color: "white" }}
                />
                <Chip
                  label={athlete.scoutingStatus}
                  color={getStatusColor(athlete.scoutingStatus) as any}
                  sx={{ color: "white" }}
                />
                {athlete.county && (
                  <Chip
                    icon={<LocationIcon />}
                    label={athlete.county}
                    variant="outlined"
                    sx={{ color: "white", borderColor: "white" }}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="athlete profile tabs"
          >
            <Tab label="Overview" />
            <Tab label="Statistics" />
            <Tab label="Media" />
            <Tab label="Contact" />
            <Tab label="History" />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <Box sx={{ p: 3 }}>
          {/* Overview Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={3}>
              {/* Personal Information */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                    >
                      Personal Information
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {athlete.age && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CakeIcon sx={{ color: "#03045e" }} />
                          <Typography>
                            <strong>Age:</strong> {athlete.age} years
                          </Typography>
                        </Box>
                      )}
                      {athlete.dateOfBirth && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <CakeIcon sx={{ color: "#03045e" }} />
                          <Typography>
                            <strong>Date of Birth:</strong>{" "}
                            {formatDate(athlete.dateOfBirth)}
                          </Typography>
                        </Box>
                      )}
                      {athlete.height && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <HeightIcon sx={{ color: "#03045e" }} />
                          <Typography>
                            <strong>Height:</strong> {athlete.height} cm
                          </Typography>
                        </Box>
                      )}
                      {athlete.weight && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <WeightIcon sx={{ color: "#03045e" }} />
                          <Typography>
                            <strong>Weight:</strong> {athlete.weight} kg
                          </Typography>
                        </Box>
                      )}
                      {athlete.preferredFoot && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <SportsIcon sx={{ color: "#03045e" }} />
                          <Typography>
                            <strong>Preferred Foot:</strong>{" "}
                            {athlete.preferredFoot}
                          </Typography>
                        </Box>
                      )}
                      {athlete.nationality && (
                        <Typography>
                          <strong>Nationality:</strong> {athlete.nationality}
                        </Typography>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Bio and Training */}
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                    >
                      Bio & Training
                    </Typography>
                    {athlete.bio && (
                      <Typography sx={{ mb: 2 }}>{athlete.bio}</Typography>
                    )}
                    {athlete.trainingProgram && (
                      <Box sx={{ mb: 2 }}>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "#03045e" }}
                        >
                          Training Program:
                        </Typography>
                        <Typography>{athlete.trainingProgram}</Typography>
                      </Box>
                    )}
                    {athlete.performanceNotes && (
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold", color: "#03045e" }}
                        >
                          Performance Notes:
                        </Typography>
                        <Typography>{athlete.performanceNotes}</Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Achievements */}
              {athlete.achievements && athlete.achievements.length > 0 && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        <TrophyIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Achievements
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                        {athlete.achievements.map((achievement, index) => (
                          <Chip
                            key={index}
                            label={achievement}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Statistics Tab */}
          <TabPanel value={tabValue} index={1}>
            {athlete.stats ? (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        Performance Statistics
                      </Typography>
                      <TableContainer>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Metric
                              </TableCell>
                              <TableCell sx={{ fontWeight: "bold" }}>
                                Value
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(athlete.stats).map(
                              ([key, value]) => (
                                <TableRow key={key}>
                                  <TableCell
                                    sx={{ textTransform: "capitalize" }}
                                  >
                                    {key.replace(/([A-Z])/g, " $1").trim()}
                                  </TableCell>
                                  <TableCell
                                    sx={{
                                      fontWeight: "bold",
                                      color: "#03045e",
                                    }}
                                  >
                                    {value}
                                  </TableCell>
                                </TableRow>
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            ) : (
              <Typography
                variant="body1"
                color="text.secondary"
                textAlign="center"
              >
                No statistics available for this athlete.
              </Typography>
            )}
          </TabPanel>

          {/* Media Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={3}>
              {/* Photos */}
              {photos.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                  >
                    Photos ({photos.length})
                  </Typography>
                  <ImageList cols={4} rowHeight={200}>
                    {photos.map((photo) => (
                      <ImageListItem key={photo.id}>
                        <img
                          src={photo.url}
                          alt={photo.caption || "Athlete photo"}
                          loading="lazy"
                          style={{ objectFit: "cover" }}
                        />
                        {photo.caption && (
                          <ImageListItemBar
                            title={photo.caption}
                            actionIcon={
                              <IconButton
                                sx={{ color: "rgba(255, 255, 255, 0.54)" }}
                              >
                                <DownloadIcon />
                              </IconButton>
                            }
                          />
                        )}
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Grid>
              )}

              {/* Videos */}
              {videos.length > 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                  >
                    Videos ({videos.length})
                  </Typography>
                  <Grid container spacing={2}>
                    {videos.map((video) => (
                      <Grid item xs={12} sm={6} md={4} key={video.id}>
                        <Card>
                          <Box
                            sx={{ position: "relative", paddingTop: "56.25%" }}
                          >
                            <video
                              controls
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                              }}
                            >
                              <source src={video.url} type={video.mimeType} />
                              Your browser does not support the video tag.
                            </video>
                          </Box>
                          {video.caption && (
                            <CardContent>
                              <Typography variant="body2">
                                {video.caption}
                              </Typography>
                            </CardContent>
                          )}
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              )}

              {photos.length === 0 && videos.length === 0 && (
                <Grid item xs={12}>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    textAlign="center"
                  >
                    No media files available for this athlete.
                  </Typography>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* Contact Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                    >
                      Contact Information
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {athlete.contact?.email && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <EmailIcon sx={{ color: "#03045e" }} />
                          <Typography>{athlete.contact.email}</Typography>
                        </Box>
                      )}
                      {athlete.contact?.phone && (
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <PhoneIcon sx={{ color: "#03045e" }} />
                          <Typography>{athlete.contact.phone}</Typography>
                        </Box>
                      )}
                      {athlete.contact?.address && (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 1,
                          }}
                        >
                          <LocationIcon sx={{ color: "#03045e", mt: 0.5 }} />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ fontWeight: "bold" }}
                            >
                              Address:
                            </Typography>
                            <Typography>
                              {athlete.contact.address.street &&
                                `${athlete.contact.address.street}, `}
                              {athlete.contact.address.city &&
                                `${athlete.contact.address.city}, `}
                              {athlete.contact.address.county &&
                                `${athlete.contact.address.county}, `}
                              {athlete.contact.address.country}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Emergency Contact */}
              {athlete.contact?.emergencyContact && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        Emergency Contact
                      </Typography>
                      <Typography>
                        <strong>Name:</strong>{" "}
                        {athlete.contact.emergencyContact.name}
                      </Typography>
                      <Typography>
                        <strong>Phone:</strong>{" "}
                        {athlete.contact.emergencyContact.phone}
                      </Typography>
                      <Typography>
                        <strong>Relationship:</strong>{" "}
                        {athlete.contact.emergencyContact.relationship}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Social Media */}
              {athlete.socialMedia && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        Social Media
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                        {athlete.socialMedia.instagram && (
                          <Button
                            startIcon={<InstagramIcon />}
                            href={athlete.socialMedia.instagram}
                            target="_blank"
                            variant="outlined"
                          >
                            Instagram
                          </Button>
                        )}
                        {athlete.socialMedia.twitter && (
                          <Button
                            startIcon={<TwitterIcon />}
                            href={athlete.socialMedia.twitter}
                            target="_blank"
                            variant="outlined"
                          >
                            Twitter
                          </Button>
                        )}
                        {athlete.socialMedia.facebook && (
                          <Button
                            startIcon={<FacebookIcon />}
                            href={athlete.socialMedia.facebook}
                            target="_blank"
                            variant="outlined"
                          >
                            Facebook
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </TabPanel>

          {/* History Tab */}
          <TabPanel value={tabValue} index={4}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Card>
                  <CardContent>
                    <Typography
                      variant="h6"
                      sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                    >
                      System Information
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>Created:</strong> {formatDate(athlete.createdAt)}
                    </Typography>
                    <Typography sx={{ mb: 1 }}>
                      <strong>Last Updated:</strong>{" "}
                      {formatDate(athlete.updatedAt)}
                    </Typography>
                    {athlete.createdBy && (
                      <Typography>
                        <strong>Created By:</strong> {athlete.createdBy}
                      </Typography>
                    )}
                  </CardContent>
                </Card>
              </Grid>

              {/* Previous Clubs */}
              {athlete.previousClubs && athlete.previousClubs.length > 0 && (
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        <SchoolIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                        Previous Clubs
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {athlete.previousClubs.map((club, index) => (
                          <Chip key={index} label={club} variant="outlined" />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              )}

              {/* Medical Information */}
              {athlete.medicalInfo && (
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography
                        variant="h6"
                        sx={{ mb: 2, color: "#03045e", fontWeight: "bold" }}
                      >
                        Medical Information
                      </Typography>
                      <Grid container spacing={2}>
                        {athlete.medicalInfo.allergies &&
                          athlete.medicalInfo.allergies.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", mb: 1 }}
                              >
                                Allergies:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {athlete.medicalInfo.allergies.map(
                                  (allergy, index) => (
                                    <Chip
                                      key={index}
                                      label={allergy}
                                      color="warning"
                                      size="small"
                                    />
                                  )
                                )}
                              </Box>
                            </Grid>
                          )}
                        {athlete.medicalInfo.injuries &&
                          athlete.medicalInfo.injuries.length > 0 && (
                            <Grid item xs={12} md={6}>
                              <Typography
                                variant="subtitle2"
                                sx={{ fontWeight: "bold", mb: 1 }}
                              >
                                Previous Injuries:
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexWrap: "wrap",
                                  gap: 1,
                                }}
                              >
                                {athlete.medicalInfo.injuries.map(
                                  (injury, index) => (
                                    <Chip
                                      key={index}
                                      label={injury}
                                      color="error"
                                      size="small"
                                    />
                                  )
                                )}
                              </Box>
                            </Grid>
                          )}
                        <Grid item xs={12}>
                          <Typography>
                            <strong>Medical Clearance:</strong>{" "}
                            <Chip
                              label={
                                athlete.medicalInfo.medicalClearance
                                  ? "Cleared"
                                  : "Pending"
                              }
                              color={
                                athlete.medicalInfo.medicalClearance
                                  ? "success"
                                  : "warning"
                              }
                              size="small"
                            />
                          </Typography>
                          {athlete.medicalInfo.lastMedicalCheck && (
                            <Typography sx={{ mt: 1 }}>
                              <strong>Last Medical Check:</strong>{" "}
                              {formatDate(athlete.medicalInfo.lastMedicalCheck)}
                            </Typography>
                          )}
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              )}
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
        {userRole.permissions.canEdit && (
          <Button
            onClick={() => onEdit(athlete)}
            variant="contained"
            sx={{
              backgroundColor: "#ADF802",
              color: "#03045e",
              "&:hover": { backgroundColor: "#9de002" },
            }}
          >
            Edit Athlete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
