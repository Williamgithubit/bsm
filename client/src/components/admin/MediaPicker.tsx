import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Tab,
  Tabs,
  IconButton,
} from "@mui/material";
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
} from "@mui/icons-material";
import { MediaAsset, MediaPickerOptions } from "@/types/media";
import BSMMediaLibrary from "./BSMMediaLibrary";
import { uploadMediaToBSM } from "@/services/cloudinaryService";

interface MediaPickerProps extends MediaPickerOptions {
  open: boolean;
  onClose: () => void;
  title?: string;
}

const MediaPicker: React.FC<MediaPickerProps> = ({
  open,
  onClose,
  title = "Select Media",
  allowMultiple = false,
  allowedTypes = ["image", "video"],
  maxFileSize = 10 * 1024 * 1024,
  category = "blog",
  folder,
  onSelect,
  onCancel,
}) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [selectedAssets, setSelectedAssets] = useState<MediaAsset[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleClose = () => {
    setSelectedAssets([]);
    if (onCancel) onCancel();
    onClose();
  };

  const handleSelect = () => {
    if (selectedAssets.length > 0) {
      onSelect(selectedAssets);
      setSelectedAssets([]);
      onClose();
    }
  };

  const handleMediaSelect = (asset: MediaAsset) => {
    if (allowMultiple) {
      setSelectedAssets((prev) => {
        const found = prev.find((p) => p.id === asset.id);
        if (found) return prev.filter((p) => p.id !== asset.id);
        return [...prev, asset];
      });
    } else {
      onSelect([asset]);
      onClose();
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;
    try {
      setUploading(true);
      const uploaded: MediaAsset[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.size > maxFileSize) {
          console.warn(`File ${file.name} exceeds size limit`);
          continue;
        }

        const isValid = allowedTypes.some((t) =>
          t === "image"
            ? file.type.startsWith("image/")
            : file.type.startsWith("video/")
        );
        if (!isValid) {
          console.warn(`File ${file.name} is not an allowed type`);
          continue;
        }

        const options = {
          folder: folder || (category === "blog" ? "bsm/blog" : "bsm/general"),
          category: (category as any) || "general",
          tags: [],
        } as any;

        try {
          const asset = await uploadMediaToBSM(file, options);
          uploaded.push(asset);
        } catch (err) {
          console.error("Upload error", err);
        }
      }

      if (uploaded.length) {
        if (allowMultiple) setSelectedAssets((p) => [...p, ...uploaded]);
        else {
          onSelect(uploaded);
          onClose();
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{ sx: { height: "80vh" } }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          pb: 1,
        }}
      >
        <Typography variant="h6" component="div">
          {title}
        </Typography>
        <IconButton onClick={handleClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={currentTab}
            onChange={(_, v) => setCurrentTab(v)}
            variant="fullWidth"
          >
            <Tab label="Media Library" />
            <Tab
              label="Upload New"
              icon={<UploadIcon />}
              disabled={uploading}
            />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <Box sx={{ p: 2, height: "calc(100% - 48px)", overflow: "auto" }}>
            <BSMMediaLibrary
              onSelectMedia={handleMediaSelect}
              selectionMode
              allowedTypes={allowedTypes}
              category={category}
            />
          </Box>
        )}

        {currentTab === 1 && (
          <Box sx={{ p: 3, textAlign: "center", height: "calc(100% - 48px)" }}>
            <input
              accept={
                allowedTypes.includes("image") && allowedTypes.includes("video")
                  ? "image/*,video/*"
                  : allowedTypes.includes("image")
                  ? "image/*"
                  : "video/*"
              }
              style={{ display: "none" }}
              id="media-picker-upload"
              type="file"
              multiple={allowMultiple}
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <label htmlFor="media-picker-upload">
              <Box
                sx={{
                  border: "2px dashed #ccc",
                  borderRadius: 2,
                  p: 4,
                  cursor: "pointer",
                  "&:hover": {
                    borderColor: "#ADF802",
                    backgroundColor: "rgba(173,248,2,0.05)",
                  },
                }}
              >
                <UploadIcon
                  sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {uploading ? "Uploading..." : "Click to upload files"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Drag and drop files here or click to browse
                </Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mt: 1 }}
                >
                  Max file size: {Math.round(maxFileSize / (1024 * 1024))}MB
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Allowed types: {allowedTypes.join(", ")}
                </Typography>
              </Box>
            </label>
          </Box>
        )}
      </DialogContent>

      {allowMultiple && selectedAssets.length > 0 && (
        <DialogActions sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mr: "auto" }}
          >
            {selectedAssets.length} file{selectedAssets.length !== 1 ? "s" : ""}{" "}
            selected
          </Typography>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={handleSelect}
            variant="contained"
            sx={{
              backgroundColor: "#ADF802",
              color: "#03045e",
              "&:hover": { backgroundColor: "#9DE002" },
            }}
          >
            Select ({selectedAssets.length})
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};

export default MediaPicker;
