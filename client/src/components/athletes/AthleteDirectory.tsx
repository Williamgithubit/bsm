"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Pagination,
  Chip,
  IconButton,
  Menu,
  Checkbox,
  FormControlLabel,
  Divider,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Tooltip,
  Fab,
  Collapse,
  Card,
  CardContent,
} from "@mui/material";
import Grid from "@/components/ui/Grid";
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Add as AddIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  MoreVert as MoreVertIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Refresh as RefreshIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  Clear as ClearIcon,
  GetApp as ExportIcon,
  CloudUpload as ImportIcon,
} from "@mui/icons-material";
import {
  Athlete,
  AthleteFilters,
  UserRole,
  LIBERIA_COUNTIES,
  SPORTS,
  FOOTBALL_POSITIONS,
  BulkActionType,
} from "@/types/athlete";
import AthleteCard from "./AthleteCard";
import AthleteProfile from "./AthleteProfile";
import AthleteForm from "./AthleteForm";
import BulkActionsDialog from "./BulkActionsDialog";
import AthleteService from "@/services/athleteService";

interface AthleteDirectoryProps {
  userRole: UserRole;
  openDialog?: boolean;
  onCloseDialog?: () => void;
}

export default function AthleteDirectory({
  userRole,
  openDialog = false,
  onCloseDialog,
}: AthleteDirectoryProps) {
  // State management
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAthlete, setSelectedAthlete] = useState<Athlete | null>(null);
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Dialog states
  const [profileDialogOpen, setProfileDialogOpen] = useState(false);
  const [formDialogOpen, setFormDialogOpen] = useState(openDialog);
  const [bulkDialogOpen, setBulkDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [athleteToDelete, setAthleteToDelete] = useState<string | null>(null);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");

  // Filters and pagination
  const [filters, setFilters] = useState<AthleteFilters>({
    search: "",
    sport: "football", // Default to football as requested
    level: "all",
    county: "all",
    scoutingStatus: "all",
    position: "all",
    ageRange: {},
  });

  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 12,
    total: 0,
    totalPages: 0,
  });

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  // Import state
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);

  // Load athletes
  const loadAthletes = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) setLoading(true);

        const result = await AthleteService.getAthletes(filters, {
          page: pagination.page,
          pageSize: pagination.pageSize,
        });

        setAthletes(result.athletes);

        // Get total count for pagination
        const totalCount = await AthleteService.getAthletesCount(filters);
        setPagination((prev) => ({
          ...prev,
          total: totalCount,
          totalPages: Math.ceil(totalCount / prev.pageSize),
        }));
      } catch (error) {
        console.error("Error loading athletes:", error);
        setSnackbar({
          open: true,
          message: "Failed to load athletes",
          severity: "error",
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [filters, pagination.page, pagination.pageSize]
  );

  // Effects
  useEffect(() => {
    loadAthletes();
    
    // Set up real-time subscription
    const unsubscribe = AthleteService.subscribeToAthletes(
      filters,
      (realTimeAthletes) => {
        setAthletes(realTimeAthletes);
        setPagination(prev => ({
          ...prev,
          total: realTimeAthletes.length,
          totalPages: Math.ceil(realTimeAthletes.length / prev.pageSize)
        }));
      }
    );
    
    return () => unsubscribe();
  }, [loadAthletes]);

  useEffect(() => {
    setFormDialogOpen(openDialog);
  }, [openDialog]);

  // Event handlers
  const handleFilterChange = (key: keyof AthleteFilters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    setPagination((prev) => ({ ...prev, page: value }));
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadAthletes(false);
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      sport: "football", // Default to football as requested
      level: "all",
      county: "all",
      scoutingStatus: "all",
      position: "all",
      ageRange: {},
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleAthleteSelect = (athleteId: string, selected: boolean) => {
    setSelectedAthletes((prev) =>
      selected ? [...prev, athleteId] : prev.filter((id) => id !== athleteId)
    );
  };

  const handleSelectAll = () => {
    if (selectedAthletes.length === athletes.length) {
      setSelectedAthletes([]);
    } else {
      setSelectedAthletes(athletes.map((a) => a.id));
    }
  };

  const handleViewAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setProfileDialogOpen(true);
  };

  const handleEditAthlete = (athlete: Athlete) => {
    setSelectedAthlete(athlete);
    setFormMode("edit");
    setFormDialogOpen(true);
  };

  const handleDeleteAthlete = (athleteId: string) => {
    if (!userRole.permissions.canDelete) return;
    
    setAthleteToDelete(athleteId);
    setDeleteConfirmOpen(true);
  };

  const confirmDeleteAthlete = async () => {
    if (!athleteToDelete) return;

    try {
      await AthleteService.deleteAthlete(athleteToDelete);
      setSnackbar({
        open: true,
        message: "Athlete deleted successfully",
        severity: "success",
      });
      loadAthletes(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to delete athlete",
        severity: "error",
      });
    } finally {
      setDeleteConfirmOpen(false);
      setAthleteToDelete(null);
    }
  };

  const handleAddAthlete = () => {
    setSelectedAthlete(null);
    setFormMode("add");
    setFormDialogOpen(true);
  };

  // Updated: accept payload with optional photos/videos
  const handleFormSubmit = async (payload: {
    data: Partial<Athlete>;
    photos?: File[];
    videos?: File[];
  }) => {
    try {
      if (formMode === "add") {
        // Create athlete first
        const id = await AthleteService.createAthlete(
          payload.data as Omit<Athlete, "id" | "createdAt" | "updatedAt">
        );

        // Upload media if any
        if (payload.photos && payload.photos.length > 0) {
          await Promise.all(
            payload.photos.map((file) =>
              AthleteService.uploadAthleteMedia(id, file, "photo")
            )
          );
        }
        if (payload.videos && payload.videos.length > 0) {
          await Promise.all(
            payload.videos.map((file) =>
              AthleteService.uploadAthleteMedia(id, file, "video")
            )
          );
        }

        setSnackbar({
          open: true,
          message: "Athlete added successfully",
          severity: "success",
        });
      } else if (selectedAthlete) {
        await AthleteService.updateAthlete(selectedAthlete.id, payload.data);

        if (payload.photos && payload.photos.length > 0) {
          await Promise.all(
            payload.photos.map((file) =>
              AthleteService.uploadAthleteMedia(
                selectedAthlete.id,
                file,
                "photo"
              )
            )
          );
        }
        if (payload.videos && payload.videos.length > 0) {
          await Promise.all(
            payload.videos.map((file) =>
              AthleteService.uploadAthleteMedia(
                selectedAthlete.id,
                file,
                "video"
              )
            )
          );
        }

        setSnackbar({
          open: true,
          message: "Athlete updated successfully",
          severity: "success",
        });
      }

      setFormDialogOpen(false);
      if (onCloseDialog) onCloseDialog();
      loadAthletes(false);
    } catch (error) {
      console.error("Form submit error", error);
      setSnackbar({
        open: true,
        message: `Failed to ${formMode} athlete`,
        severity: "error",
      });
    }
  };

  const handleExport = async () => {
    try {
      const csvContent = await AthleteService.exportAthletesToCSV(filters);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `athletes_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setSnackbar({
        open: true,
        message: "Athletes exported successfully",
        severity: "success",
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to export athletes",
        severity: "error",
      });
    }
  };

  const handleImport = async () => {
    if (!importFile) return;

    try {
      setImporting(true);
      const csvContent = await importFile.text();
      const result = await AthleteService.importAthletesFromCSV(
        csvContent,
        "current-user-id"
      );

      setSnackbar({
        open: true,
        message: `Import completed: ${result.success} athletes imported${
          result.errors.length > 0 ? `, ${result.errors.length} errors` : ""
        }`,
        severity: result.errors.length > 0 ? "warning" : "success",
      });

      setImportDialogOpen(false);
      setImportFile(null);
      loadAthletes(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to import athletes",
        severity: "error",
      });
    } finally {
      setImporting(false);
    }
  };

  const handleBulkAction = async (actionType: BulkActionType, data?: any) => {
    try {
      await AthleteService.bulkUpdateAthletes({
        type: actionType,
        athleteIds: selectedAthletes,
        data,
      });

      setSnackbar({
        open: true,
        message: "Bulk action completed successfully",
        severity: "success",
      });

      setSelectedAthletes([]);
      setBulkDialogOpen(false);
      loadAthletes(false);
    } catch (error) {
      setSnackbar({
        open: true,
        message: "Failed to perform bulk action",
        severity: "error",
      });
    }
  };

  const getFilteredPositions = () => {
    switch (filters.sport) {
      case "football":
        return FOOTBALL_POSITIONS;
      default:
        return [];
    }
  };

  return (
    <Box>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box>
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", color: "#03045e", mb: 1 }}
          >
            Athlete Directory
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage and discover talented athletes across Liberia
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
          {/* View Toggle */}
          <Box
            sx={{
              display: "flex",
              border: "1px solid #e0e0e0",
              borderRadius: 1,
            }}
          >
            <IconButton
              onClick={() => setViewMode("grid")}
              sx={{
                color: viewMode === "grid" ? "#ADF802" : "text.secondary",
                backgroundColor:
                  viewMode === "grid"
                    ? "rgba(173, 248, 2, 0.1)"
                    : "transparent",
              }}
            >
              <GridViewIcon />
            </IconButton>
            <IconButton
              onClick={() => setViewMode("list")}
              sx={{
                color: viewMode === "list" ? "#ADF802" : "text.secondary",
                backgroundColor:
                  viewMode === "list"
                    ? "rgba(173, 248, 2, 0.1)"
                    : "transparent",
              }}
            >
              <ListViewIcon />
            </IconButton>
          </Box>

          {/* Refresh Button */}
          <Tooltip title="Refresh">
            <IconButton onClick={handleRefresh} disabled={refreshing}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>

          {/* Export Button */}
          {userRole.permissions.canExport && (
            <Tooltip title="Export to CSV">
              <IconButton onClick={handleExport}>
                <ExportIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Import Button */}
          {userRole.permissions.canImport && (
            <Tooltip title="Import from CSV">
              <IconButton onClick={() => setImportDialogOpen(true)}>
                <ImportIcon />
              </IconButton>
            </Tooltip>
          )}

          {/* Add Button */}
          {userRole.permissions.canCreate && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddAthlete}
              sx={{
                backgroundColor: "#ADF802",
                color: "#03045e",
                "&:hover": { backgroundColor: "#9de002" },
              }}
            >
              Add Athlete
            </Button>
          )}
        </Box>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ color: "#03045e", fontWeight: "bold" }}
          >
            Search & Filters
          </Typography>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Button
              size="small"
              onClick={handleClearFilters}
              startIcon={<ClearIcon />}
            >
              Clear All
            </Button>
            <IconButton
              onClick={() => setShowFilters(!showFilters)}
              sx={{ color: "#03045e" }}
            >
              {showFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          </Box>
        </Box>

        {/* Search Bar */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search athletes by name, position, location..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              InputProps={{
                startAdornment: (
                  <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Typography variant="body2" color="text.secondary">
                {pagination.total} athletes found
              </Typography>
              {selectedAthletes.length > 0 && (
                <>
                  <Divider orientation="vertical" flexItem />
                  <Chip
                    label={`${selectedAthletes.length} selected`}
                    color="primary"
                    size="small"
                    onDelete={() => setSelectedAthletes([])}
                  />
                  <Button
                    size="small"
                    onClick={() => setBulkDialogOpen(true)}
                    disabled={!userRole.permissions.canEdit}
                  >
                    Bulk Actions
                  </Button>
                </>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Advanced Filters */}
        <Collapse in={showFilters}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sport</InputLabel>
                <Select
                  value={filters.sport}
                  onChange={(e) => handleFilterChange("sport", e.target.value)}
                  label="Sport"
                >
                  <MenuItem value="all">All Sports</MenuItem>
                  {SPORTS.map((sport) => (
                    <MenuItem key={sport} value={sport}>
                      {sport.charAt(0).toUpperCase() + sport.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Level</InputLabel>
                <Select
                  value={filters.level}
                  onChange={(e) => handleFilterChange("level", e.target.value)}
                  label="Level"
                >
                  <MenuItem value="all">All Levels</MenuItem>
                  <MenuItem value="grassroots">Grassroots</MenuItem>
                  <MenuItem value="semi-pro">Semi-Pro</MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>County</InputLabel>
                <Select
                  value={filters.county}
                  onChange={(e) => handleFilterChange("county", e.target.value)}
                  label="County"
                >
                  <MenuItem value="all">All Counties</MenuItem>
                  {LIBERIA_COUNTIES.map((county) => (
                    <MenuItem key={county} value={county}>
                      {county}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filters.scoutingStatus}
                  onChange={(e) =>
                    handleFilterChange("scoutingStatus", e.target.value)
                  }
                  label="Status"
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="scouted">Scouted</MenuItem>
                  <MenuItem value="signed">Signed</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {getFilteredPositions().length > 0 && (
              <Grid item xs={6} md={2}>
                <FormControl fullWidth size="small">
                  <InputLabel>Position</InputLabel>
                  <Select
                    value={filters.position}
                    onChange={(e) =>
                      handleFilterChange("position", e.target.value)
                    }
                    label="Position"
                  >
                    <MenuItem value="all">All Positions</MenuItem>
                    {getFilteredPositions().map((position) => (
                      <MenuItem key={position} value={position}>
                        {position}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedAthletes.length > 0}
                    indeterminate={
                      selectedAthletes.length > 0 &&
                      selectedAthletes.length < athletes.length
                    }
                    onChange={handleSelectAll}
                  />
                }
                label="Select All"
              />
            </Grid>
          </Grid>
        </Collapse>
      </Paper>

      {/* Athletes Grid/List */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress size={60} sx={{ color: "#ADF802" }} />
        </Box>
      ) : athletes.length === 0 ? (
        <Card sx={{ textAlign: "center", py: 8 }}>
          <CardContent>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              No athletes found
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Try adjusting your search criteria or add new athletes to get
              started.
            </Typography>
            {userRole.permissions.canCreate && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddAthlete}
                sx={{
                  backgroundColor: "#ADF802",
                  color: "#03045e",
                  "&:hover": { backgroundColor: "#9de002" },
                }}
              >
                Add First Athlete
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          <Grid container spacing={3}>
            {athletes.map((athlete) => (
              <Grid
                item
                xs={12}
                sm={viewMode === "grid" ? 6 : 12}
                md={viewMode === "grid" ? 4 : 12}
                lg={viewMode === "grid" ? 3 : 12}
                key={athlete.id}
              >
                <AthleteCard
                  athlete={athlete}
                  userRole={userRole}
                  onView={handleViewAthlete}
                  onEdit={handleEditAthlete}
                  onDelete={handleDeleteAthlete}
                  onSelect={handleAthleteSelect}
                  selected={selectedAthletes.includes(athlete.id)}
                  showSelection={selectedAthletes.length > 0 || showFilters}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root.Mui-selected": {
                    backgroundColor: "#ADF802",
                    color: "#03045e",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}

      {/* Floating Action Button for Mobile */}
      {userRole.permissions.canCreate && (
        <Fab
          color="primary"
          aria-label="add athlete"
          onClick={handleAddAthlete}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            backgroundColor: "#ADF802",
            color: "#03045e",
            "&:hover": { backgroundColor: "#9de002" },
            display: { xs: "flex", md: "none" },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Dialogs */}
      <AthleteProfile
        athlete={selectedAthlete}
        open={profileDialogOpen}
        onClose={() => setProfileDialogOpen(false)}
        onEdit={handleEditAthlete}
        userRole={userRole}
      />

      <AthleteForm
        athlete={formMode === "edit" ? selectedAthlete : null}
        open={formDialogOpen}
        onClose={() => {
          setFormDialogOpen(false);
          if (onCloseDialog) onCloseDialog();
        }}
        onSubmit={handleFormSubmit}
        mode={formMode}
        userRole={userRole}
      />

      <BulkActionsDialog
        open={bulkDialogOpen}
        onClose={() => setBulkDialogOpen(false)}
        selectedCount={selectedAthletes.length}
        onAction={handleBulkAction}
        userRole={userRole}
      />

      {/* Import Dialog */}
      <Dialog
        open={importDialogOpen}
        onClose={() => setImportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Import Athletes from CSV</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setImportFile(e.target.files?.[0] || null)}
              style={{ marginBottom: 16 }}
            />
            <Typography variant="body2" color="text.secondary">
              Upload a CSV file with athlete data. The file should include
              columns for name, age, position, sport, level, county, etc.
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setImportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleImport}
            disabled={!importFile || importing}
            variant="contained"
            sx={{
              backgroundColor: "#ADF802",
              color: "#03045e",
              "&:hover": { backgroundColor: "#9de002" },
            }}
          >
            {importing ? <CircularProgress size={20} /> : "Import"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete{" "}
            <strong>
              {athleteToDelete 
                ? athletes.find(a => a.id === athleteToDelete)?.name || "this athlete"
                : "this athlete"
              }
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            onClick={confirmDeleteAthlete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
