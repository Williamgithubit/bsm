"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Divider,
  IconButton,
  Chip,
  Avatar,
} from "@mui/material";
import Grid from "@/components/ui/Grid";
import {
  Close as CloseIcon,
  PhotoCamera as PhotoIcon,
  VideoCall as VideoIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import {
  Athlete,
  AthleteFormData,
  AthleteContact,
  UserRole,
  LIBERIA_COUNTIES,
  SPORTS,
  FOOTBALL_POSITIONS,
} from "@/types/athlete";
import toast from "react-hot-toast";

interface AthleteFormProps {
  athlete: Athlete | null;
  open: boolean;
  onClose: () => void;
  // onSubmit now accepts an object with athlete partial data and optional files
  onSubmit: (payload: {
    data: Partial<Athlete>;
    photos?: File[];
    videos?: File[];
  }) => void;
  mode: "add" | "edit";
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
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ py: 2 }}>{children}</Box>}
    </div>
  );
}

export default function AthleteForm({
  athlete,
  open,
  onClose,
  onSubmit,
  mode,
  userRole,
}: AthleteFormProps) {
  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState<AthleteFormData>({
    name: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    age: "",
    dateOfBirth: "",
    position: "",
    bio: "",
    location: "",
    county: "",
    sport: "football",
    level: "grassroots",
    scoutingStatus: "active",
    trainingProgram: "",
    performanceNotes: "",
    height: "",
    weight: "",
    preferredFoot: "",
    nationality: "Liberian",
    previousClubs: "",
    achievements: "",
    instagram: "",
    twitter: "",
    facebook: "",
  });

  // Local file inputs
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth: string): number => {
    if (!dateOfBirth) return 0;
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Helper function to validate age and date of birth consistency
  const validateAgeAndDateOfBirth = (age: string, dateOfBirth: string): boolean => {
    if (!age || !dateOfBirth) return true; // Skip validation if either is empty
    
    const enteredAge = parseInt(age);
    const calculatedAge = calculateAge(dateOfBirth);
    
    // Allow 1 year difference to account for birthdays
    const ageDifference = Math.abs(enteredAge - calculatedAge);
    return ageDifference <= 1;
  };
  //
  useEffect(() => {
    if (athlete && mode === "edit") {
      setFormData({
        name: athlete.name || "",
        firstName: athlete.firstName || "",
        lastName: athlete.lastName || "",
        email: athlete.contact?.email || "",
        phone: athlete.contact?.phone || "",
        age: athlete.age?.toString() || "",
        dateOfBirth: athlete.dateOfBirth || "",
        position: athlete.position || "",
        bio: athlete.bio || "",
        location: athlete.location || "",
        county: athlete.county || "",
        sport: athlete.sport || "football",
        level: athlete.level || "grassroots",
        scoutingStatus: athlete.scoutingStatus || "active",
        trainingProgram: athlete.trainingProgram || "",
        performanceNotes: athlete.performanceNotes || "",
        height: athlete.height?.toString() || "",
        weight: athlete.weight?.toString() || "",
        preferredFoot: athlete.preferredFoot || "",
        nationality: athlete.nationality || "Liberian",
        previousClubs: athlete.previousClubs?.join(", ") || "",
        achievements: athlete.achievements?.join(", ") || "",
        instagram: athlete.socialMedia?.instagram || "",
        twitter: athlete.socialMedia?.twitter || "",
        facebook: athlete.socialMedia?.facebook || "",
      });
    } else {
      // Reset form for add mode
      setFormData({
        name: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        age: "",
        dateOfBirth: "",
        position: "",
        bio: "",
        location: "",
        county: "",
        sport: "football",
        level: "grassroots",
        scoutingStatus: "active",
        trainingProgram: "",
        performanceNotes: "",
        height: "",
        weight: "",
        preferredFoot: "",
        nationality: "Liberian",
        previousClubs: "",
        achievements: "",
        instagram: "",
        twitter: "",
        facebook: "",
      });
    }
    setErrors({});
    setTabValue(0);
  }, [athlete, mode, open]);

  const handleInputChange = (field: keyof AthleteFormData, value: string) => {
    let updatedFormData = { ...formData, [field]: value };
    
    // Special handling for date of birth - auto-calculate age
    if (field === 'dateOfBirth' && value) {
      const calculatedAge = calculateAge(value);
      if (calculatedAge > 0) {
        updatedFormData.age = calculatedAge.toString();
      }
    }
    
    // Validation for age and date of birth consistency
    if (field === 'age' || field === 'dateOfBirth') {
      const ageToCheck = field === 'age' ? value : updatedFormData.age;
      const dobToCheck = field === 'dateOfBirth' ? value : updatedFormData.dateOfBirth;
      
      if (ageToCheck && dobToCheck) {
        const isValid = validateAgeAndDateOfBirth(ageToCheck, dobToCheck);
        if (!isValid) {
          const calculatedAge = calculateAge(dobToCheck);
          toast.error(`Age doesn't match date of birth. Based on the date of birth, age should be ${calculatedAge}.`);
          
          // Set error state
          setErrors((prev) => ({
            ...prev,
            age: `Should be ${calculatedAge} based on date of birth`,
            dateOfBirth: `Age ${ageToCheck} doesn't match this date`
          }));
        } else {
          // Clear errors if validation passes
          setErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors.age;
            delete newErrors.dateOfBirth;
            return newErrors;
          });
        }
      }
    }
    
    setFormData(updatedFormData);
    
    // Clear field-specific error if it exists
    if (errors[field] && field !== 'age' && field !== 'dateOfBirth') {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (
      formData.age &&
      (isNaN(Number(formData.age)) ||
        Number(formData.age) < 0 ||
        Number(formData.age) > 100)
    ) {
      newErrors.age = "Age must be a valid number between 0 and 100";
    }

    // Validate age and date of birth consistency
    if (formData.age && formData.dateOfBirth) {
      const isValid = validateAgeAndDateOfBirth(formData.age, formData.dateOfBirth);
      if (!isValid) {
        const calculatedAge = calculateAge(formData.dateOfBirth);
        newErrors.age = `Should be ${calculatedAge} based on date of birth`;
        newErrors.dateOfBirth = `Age ${formData.age} doesn't match this date`;
        toast.error("Please correct the age and date of birth mismatch before submitting.");
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    // Build athlete data object, omitting undefined fields for Firebase compatibility
    const athleteData: Partial<Athlete> = {
      name: formData.name.trim(),
      sport: formData.sport,
      level: formData.level as any,
      scoutingStatus: formData.scoutingStatus as any,
    };

    // Only add optional fields if they have values (avoid undefined)
    if (formData.firstName.trim()) {
      athleteData.firstName = formData.firstName.trim();
    }
    if (formData.lastName.trim()) {
      athleteData.lastName = formData.lastName.trim();
    }
    if (formData.age && !isNaN(parseInt(formData.age))) {
      athleteData.age = parseInt(formData.age);
    }
    if (formData.dateOfBirth) {
      athleteData.dateOfBirth = formData.dateOfBirth;
    }
    if (formData.position) {
      athleteData.position = formData.position;
    }
    if (formData.bio.trim()) {
      athleteData.bio = formData.bio.trim();
    }
    if (formData.location.trim()) {
      athleteData.location = formData.location.trim();
    }
    if (formData.county) {
      athleteData.county = formData.county;
    }
    if (formData.trainingProgram.trim()) {
      athleteData.trainingProgram = formData.trainingProgram.trim();
    }
    if (formData.performanceNotes.trim()) {
      athleteData.performanceNotes = formData.performanceNotes.trim();
    }
    if (formData.height && !isNaN(parseInt(formData.height))) {
      athleteData.height = parseInt(formData.height);
    }
    if (formData.weight && !isNaN(parseInt(formData.weight))) {
      athleteData.weight = parseInt(formData.weight);
    }
    if (formData.preferredFoot) {
      athleteData.preferredFoot = formData.preferredFoot as any;
    }
    if (formData.nationality.trim()) {
      athleteData.nationality = formData.nationality.trim();
    }
    if (formData.previousClubs.trim()) {
      athleteData.previousClubs = formData.previousClubs.split(",").map((s) => s.trim());
    }
    if (formData.achievements.trim()) {
      athleteData.achievements = formData.achievements.split(",").map((s) => s.trim());
    }

    // Handle contact info - only add if there are values
    const contact: AthleteContact = {};
    if (formData.email.trim()) {
      contact.email = formData.email.trim();
    }
    if (formData.phone.trim()) {
      contact.phone = formData.phone.trim();
    }
    if (Object.keys(contact).length > 0) {
      athleteData.contact = contact;
    }

    // Handle social media - only add if there are values
    const socialMedia: any = {};
    if (formData.instagram.trim()) {
      socialMedia.instagram = formData.instagram.trim();
    }
    if (formData.twitter.trim()) {
      socialMedia.twitter = formData.twitter.trim();
    }
    if (formData.facebook.trim()) {
      socialMedia.facebook = formData.facebook.trim();
    }
    if (Object.keys(socialMedia).length > 0) {
      athleteData.socialMedia = socialMedia;
    }

    // Attach stats if present
    const stats: any = {};
    if ((formData as any).goals)
      stats.goals = parseInt((formData as any).goals);
    if ((formData as any).assists)
      stats.assists = parseInt((formData as any).assists);
    if ((formData as any).matches)
      stats.matches = parseInt((formData as any).matches);
    if (Object.keys(stats).length > 0) athleteData.stats = stats;

    onSubmit({
      data: athleteData,
      photos: photoFiles.length > 0 ? photoFiles : undefined,
      videos: videoFiles.length > 0 ? videoFiles : undefined,
    });
  };

  const getPositionOptions = () => {
    switch (formData.sport) {
      case "football":
        return FOOTBALL_POSITIONS;
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#03045e",
          color: "white",
        }}
      >
        <Typography variant="h6" component="div">
          {mode === "add" ? "Add New Athlete" : "Edit Athlete"}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
          <Tab label="Basic Info" />
          <Tab label="Sports Details" />
          <Tab label="Contact" />
          <Tab label="Additional" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          {/* Basic Info Tab */}
          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange("firstName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange("lastName", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  error={!!errors.age}
                  helperText={errors.age || "Will auto-calculate from date of birth"}
                  placeholder="Enter age or select date of birth"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Date of Birth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange("dateOfBirth", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Bio"
                  multiline
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  placeholder="Brief description of the athlete..."
                />
              </Grid>
              {/* Stats inputs */}
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Goals"
                  type="number"
                  value={(formData as any).goals || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, goals: e.target.value }))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Assists"
                  type="number"
                  value={(formData as any).assists || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      assists: e.target.value,
                    }))
                  }
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Matches"
                  type="number"
                  value={(formData as any).matches || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      matches: e.target.value,
                    }))
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Sports Details Tab */}
          <TabPanel value={tabValue} index={1}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Sport</InputLabel>
                  <Select
                    value={formData.sport}
                    onChange={(e) => handleInputChange("sport", e.target.value)}
                    label="Sport"
                  >
                    {SPORTS.map((sport) => (
                      <MenuItem key={sport} value={sport}>
                        {sport.charAt(0).toUpperCase() + sport.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Level</InputLabel>
                  <Select
                    value={formData.level}
                    onChange={(e) => handleInputChange("level", e.target.value)}
                    label="Level"
                  >
                    <MenuItem value="grassroots">Grassroots</MenuItem>
                    <MenuItem value="semi-pro">Semi-Pro</MenuItem>
                    <MenuItem value="professional">Professional</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {getPositionOptions().length > 0 && (
                <Grid item xs={6}>
                  <FormControl fullWidth>
                    <InputLabel>Position</InputLabel>
                    <Select
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      label="Position"
                    >
                      {getPositionOptions().map((position) => (
                        <MenuItem key={position} value={position}>
                          {position}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Scouting Status</InputLabel>
                  <Select
                    value={formData.scoutingStatus}
                    onChange={(e) =>
                      handleInputChange("scoutingStatus", e.target.value)
                    }
                    label="Scouting Status"
                  >
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="scouted">Scouted</MenuItem>
                    <MenuItem value="signed">Signed</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Height (cm)"
                  type="number"
                  value={formData.height}
                  onChange={(e) => handleInputChange("height", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Weight (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => handleInputChange("weight", e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Training Program"
                  value={formData.trainingProgram}
                  onChange={(e) =>
                    handleInputChange("trainingProgram", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Performance Notes"
                  multiline
                  rows={3}
                  value={formData.performanceNotes}
                  onChange={(e) =>
                    handleInputChange("performanceNotes", e.target.value)
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Contact Tab */}
          <TabPanel value={tabValue} index={2}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>County</InputLabel>
                  <Select
                    value={formData.county}
                    onChange={(e) =>
                      handleInputChange("county", e.target.value)
                    }
                    label="County"
                  >
                    <MenuItem value="">Select County</MenuItem>
                    {LIBERIA_COUNTIES.map((county) => (
                      <MenuItem key={county} value={county}>
                        {county}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="City/Location"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Social Media
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Instagram"
                  value={formData.instagram}
                  onChange={(e) =>
                    handleInputChange("instagram", e.target.value)
                  }
                  placeholder="@username"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Twitter"
                  value={formData.twitter}
                  onChange={(e) => handleInputChange("twitter", e.target.value)}
                  placeholder="@username"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  label="Facebook"
                  value={formData.facebook}
                  onChange={(e) =>
                    handleInputChange("facebook", e.target.value)
                  }
                  placeholder="Profile URL"
                />
              </Grid>
            </Grid>
          </TabPanel>

          {/* Additional Tab */}
          <TabPanel value={tabValue} index={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Nationality"
                  value={formData.nationality}
                  onChange={(e) =>
                    handleInputChange("nationality", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Preferred Foot</InputLabel>
                  <Select
                    value={formData.preferredFoot}
                    onChange={(e) =>
                      handleInputChange("preferredFoot", e.target.value)
                    }
                    label="Preferred Foot"
                  >
                    <MenuItem value="">Not specified</MenuItem>
                    <MenuItem value="left">Left</MenuItem>
                    <MenuItem value="right">Right</MenuItem>
                    <MenuItem value="both">Both</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Previous Clubs"
                  value={formData.previousClubs}
                  onChange={(e) =>
                    handleInputChange("previousClubs", e.target.value)
                  }
                  placeholder="Separate multiple clubs with commas"
                  helperText="Enter previous clubs separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Achievements"
                  value={formData.achievements}
                  onChange={(e) =>
                    handleInputChange("achievements", e.target.value)
                  }
                  placeholder="Separate multiple achievements with commas"
                  helperText="Enter achievements separated by commas"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="subtitle2"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  Upload Photos & Videos
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) =>
                    setPhotoFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                  style={{ marginBottom: 8 }}
                />
                <br />
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  onChange={(e) =>
                    setVideoFiles(
                      e.target.files ? Array.from(e.target.files) : []
                    )
                  }
                />
              </Grid>
            </Grid>
          </TabPanel>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#ADF802",
            color: "#03045e",
            "&:hover": { backgroundColor: "#9de002" },
          }}
        >
          {mode === "add" ? "Add Athlete" : "Update Athlete"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
