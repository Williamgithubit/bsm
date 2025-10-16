import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  CircularProgress,
  Alert,
  Snackbar,
  useTheme,
  useMediaQuery,
  Tabs,
  Tab,
  LinearProgress,
  Menu,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Badge,
} from "@mui/material";
import Grid from "@/components/ui/Grid";
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  ViewModule as GridViewIcon,
  ViewList as ListViewIcon,
  Image as ImageIcon,
  VideoFile as VideoIcon,
  MoreVert as MoreIcon,
  PhotoLibrary as MediaIcon,
  ContentCopy as CopyIcon,
} from "@mui/icons-material";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/services/firebase";
import {
  MediaAsset,
  MediaFilters,
  BulkUploadProgress,
  BSM_MEDIA_FOLDERS,
  BSM_MEDIA_TAGS,
} from "@/types/media";
import {
  uploadMediaToBSM,
  bulkUploadMedia,
  getMediaAssets,
  deleteMediaAsset,
  updateMediaAsset,
  generateOptimizedUrl,
} from "@/services/cloudinaryService";
import {
  getUserMediaPermissions,
  canUserPerformAction,
} from "@/services/bsmMediaService";

interface BSMMediaLibraryProps {
  onSelectMedia?: (media: MediaAsset) => void;
  selectionMode?: boolean;
  allowedTypes?: Array<"image" | "video">;
  category?: "athlete" | "event" | "blog" | "general";
}

const BSMMediaLibrary: React.FC<BSMMediaLibraryProps> = ({
  onSelectMedia,
  selectionMode = false,
  allowedTypes = ["image", "video"],
  category,
}) => {
  const [user] = useAuthState(auth);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] =
    useState<BulkUploadProgress | null>(null);
  const [editingMedia, setEditingMedia] = useState<MediaAsset | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<MediaAsset | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [currentTab, setCurrentTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<MediaFilters>({
    search: "",
    category: category || "",
    resourceType: "",
    folder: "",
    tags: [],
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuMedia, setMenuMedia] = useState<MediaAsset | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error" | "info" | "warning",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const userRole = "admin"; // TODO: Get from auth context
  const permissions = getUserMediaPermissions(userRole);

  useEffect(() => {
    loadMediaAssets();
  }, [filters]);

  const loadMediaAssets = async () => {
    try {
      setLoading(true);
      const { assets } = await getMediaAssets(filters, 1, 50);
      setMediaAssets(assets);
    } catch (error) {
      console.error("Error loading media assets:", error);
      setSnackbar({
        open: true,
        message: "Failed to load media assets",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || !user || !permissions.canUpload) return;

    const fileArray = Array.from(files);

    // Validate files
    for (const file of fileArray) {
      if (file.size > permissions.maxFileSize) {
        setSnackbar({
          open: true,
          message: `File ${file.name} exceeds size limit`,
          severity: "error",
        });
        return;
      }
    }

    try {
      setUploading(true);

      const folder = category
        ? `${BSM_MEDIA_FOLDERS.ATHLETES}`
        : BSM_MEDIA_FOLDERS.GENERAL;

      await bulkUploadMedia(
        fileArray,
        {
          folder,
          category: category || "general",
          tags: [BSM_MEDIA_TAGS.FEATURED],
        },
        (progress) => setUploadProgress(progress)
      );

      setSnackbar({
        open: true,
        message: "Files uploaded successfully",
        severity: "success",
      });

      loadMediaAssets();
    } catch (error) {
      console.error("Error uploading files:", error);
      setSnackbar({
        open: true,
        message: "Failed to upload files",
        severity: "error",
      });
    } finally {
      setUploading(false);
      setUploadProgress(null);
    }
  };

  const handleDeleteMedia = async () => {
    if (
      !mediaToDelete ||
      !canUserPerformAction(userRole, "delete", mediaToDelete)
    )
      return;

    try {
      await deleteMediaAsset(
        mediaToDelete.publicId,
        mediaToDelete.resourceType
      );

      setSnackbar({
        open: true,
        message: "Media deleted successfully",
        severity: "success",
      });

      setDeleteConfirmOpen(false);
      setMediaToDelete(null);
      loadMediaAssets();
    } catch (error) {
      console.error("Error deleting media:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete media",
        severity: "error",
      });
    }
  };

  const handleCopyUrl = (asset: MediaAsset) => {
    const optimizedUrl = generateOptimizedUrl(asset.publicId, {
      quality: "auto",
      format: "auto",
    });
    navigator.clipboard.writeText(optimizedUrl);
    setSnackbar({
      open: true,
      message: "URL copied to clipboard",
      severity: "success",
    });
  };

  const filteredAssets = mediaAssets.filter((asset) => {
    const matchesSearch =
      asset.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      asset.originalFilename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (asset.caption &&
        asset.caption.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      allowedTypes.length === 0 ||
      allowedTypes.includes(asset.resourceType as "image" | "video");

    return matchesSearch && matchesType;
  });

  const assetsByType = {
    all: filteredAssets,
    image: filteredAssets.filter((a) => a.resourceType === "image"),
    video: filteredAssets.filter((a) => a.resourceType === "video"),
  };

  const currentAssets = Object.values(assetsByType)[currentTab] || [];

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ ml: 2 }}>
          Loading media library...
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        {/* Use a non-heading container to avoid nested heading tags when this component is rendered inside dialogs that already provide a heading */}
        <Typography
          variant="h5"
          component="div"
          sx={{
            fontWeight: "bold",
            color: "#03045e",
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <MediaIcon />
          BSM Media Library
        </Typography>
        <Box display="flex" gap={1}>
          {permissions.canUpload && (
            <>
              <input
                accept="image/*,video/*"
                style={{ display: "none" }}
                id="file-upload"
                type="file"
                multiple
                onChange={(e) => handleFileUpload(e.target.files)}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<UploadIcon />}
                  disabled={uploading}
                  sx={{
                    backgroundColor: "#ADF802",
                    color: "#03045e",
                    "&:hover": {
                      backgroundColor: "#9DE002",
                    },
                  }}
                >
                  Upload
                </Button>
              </label>
            </>
          )}
          <IconButton
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? <ListViewIcon /> : <GridViewIcon />}
          </IconButton>
        </Box>
      </Box>

      {/* Upload Progress */}
      {uploading && uploadProgress && (
        <Box sx={{ mb: 2 }}>
          <LinearProgress
            variant="determinate"
            value={(uploadProgress.completed / uploadProgress.total) * 100}
          />
          <Typography variant="caption" color="text.secondary">
            Uploading {uploadProgress.current}... ({uploadProgress.completed}/
            {uploadProgress.total})
          </Typography>
        </Box>
      )}

      {/* Search */}
      <Paper elevation={2} sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search media files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <SearchIcon sx={{ mr: 1, color: "action.active" }} />
            ),
          }}
          size="small"
        />
      </Paper>

      {/* File Type Tabs */}
      <Paper elevation={2} sx={{ mb: 3 }}>
        <Tabs
          value={currentTab}
          onChange={(_, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab
            label={
              <Badge badgeContent={assetsByType.all.length} color="primary">
                All Files
              </Badge>
            }
          />
          <Tab
            label={
              <Badge badgeContent={assetsByType.image.length} color="primary">
                Images
              </Badge>
            }
            icon={<ImageIcon />}
          />
          <Tab
            label={
              <Badge badgeContent={assetsByType.video.length} color="primary">
                Videos
              </Badge>
            }
            icon={<VideoIcon />}
          />
        </Tabs>
      </Paper>

      {/* Media Grid */}
      {currentAssets.length === 0 ? (
        <Paper elevation={1} sx={{ p: 4, textAlign: "center" }}>
          <MediaIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No media files found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Upload some files to get started
          </Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {currentAssets.map((asset) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={viewMode === "grid" ? 3 : 12}
              key={asset.id}
            >
              <Card
                sx={{
                  cursor: selectionMode ? "pointer" : "default",
                  "&:hover": {
                    boxShadow: theme.shadows[4],
                  },
                }}
                onClick={() =>
                  selectionMode && onSelectMedia && onSelectMedia(asset)
                }
              >
                {asset.resourceType === "image" ? (
                  <CardMedia
                    component="img"
                    height={viewMode === "grid" ? 200 : 100}
                    image={generateOptimizedUrl(asset.publicId, {
                      width: 400,
                      height: 300,
                      crop: "fill",
                      quality: "auto",
                      format: "auto",
                    })}
                    alt={asset.altText || asset.originalFilename}
                    sx={{ objectFit: "cover" }}
                  />
                ) : (
                  <Box
                    sx={{
                      height: viewMode === "grid" ? 200 : 100,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "grey.100",
                    }}
                  >
                    <VideoIcon sx={{ fontSize: 48 }} />
                  </Box>
                )}
                <CardContent sx={{ pb: 1 }}>
                  <Typography variant="subtitle2" noWrap>
                    {asset.originalFilename}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {Math.round(asset.bytes / 1024)} KB •{" "}
                    {new Date(asset.uploadedAt).toLocaleDateString()}
                  </Typography>
                  {asset.tags.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      {asset.tags.slice(0, 2).map((tag) => (
                        <Chip
                          key={tag}
                          label={tag}
                          size="small"
                          sx={{ mr: 0.5, mb: 0.5 }}
                        />
                      ))}
                      {asset.tags.length > 2 && (
                        <Chip
                          label={`+${asset.tags.length - 2}`}
                          size="small"
                        />
                      )}
                    </Box>
                  )}
                </CardContent>
                <CardActions sx={{ pt: 0, justifyContent: "space-between" }}>
                  <Typography variant="caption" color="text.secondary">
                    {asset.category}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget);
                      setMenuMedia(asset);
                    }}
                  >
                    <MoreIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          key="copy"
          onClick={() => {
            if (menuMedia) handleCopyUrl(menuMedia);
            setAnchorEl(null);
          }}
        >
          <ListItemIcon>
            <CopyIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Copy URL</ListItemText>
        </MenuItem>

        {permissions.canDelete && <Divider />}

        {permissions.canDelete && (
          <MenuItem
            key="delete"
            onClick={() => {
              if (menuMedia) {
                setMediaToDelete(menuMedia);
                setDeleteConfirmOpen(true);
              }
              setAnchorEl(null);
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteIcon fontSize="small" color="error" />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        )}
      </Menu>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{mediaToDelete?.originalFilename}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteMedia} color="error" variant="contained">
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
};

export default BSMMediaLibrary;
