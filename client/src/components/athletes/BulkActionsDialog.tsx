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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Divider,
  Alert,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Assignment as AssignIcon,
  GetApp as ExportIcon,
  Group as GroupIcon,
} from "@mui/icons-material";
import { BulkActionType, UserRole } from "@/types/athlete";

interface BulkActionsDialogProps {
  open: boolean;
  onClose: () => void;
  selectedCount: number;
  onAction: (actionType: BulkActionType, data?: any) => void;
  userRole: UserRole;
}

export default function BulkActionsDialog({
  open,
  onClose,
  selectedCount,
  onAction,
  userRole,
}: BulkActionsDialogProps) {
  const [selectedAction, setSelectedAction] = useState<BulkActionType | "">("");
  const [actionData, setActionData] = useState<any>({});

  const handleActionSelect = (action: BulkActionType) => {
    setSelectedAction(action);
    setActionData({});
  };

  const handleExecute = () => {
    if (!selectedAction) return;

    onAction(selectedAction, actionData);
    setSelectedAction("");
    setActionData({});
  };

  const renderActionForm = () => {
    switch (selectedAction) {
      case "updateStatus":
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              value={actionData.status || ""}
              onChange={(e) => setActionData({ status: e.target.value })}
              label="New Status"
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="scouted">Scouted</MenuItem>
              <MenuItem value="signed">Signed</MenuItem>
              <MenuItem value="inactive">Inactive</MenuItem>
            </Select>
          </FormControl>
        );

      case "updateLevel":
        return (
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>New Level</InputLabel>
            <Select
              value={actionData.level || ""}
              onChange={(e) => setActionData({ level: e.target.value })}
              label="New Level"
            >
              <MenuItem value="grassroots">Grassroots</MenuItem>
              <MenuItem value="semi-pro">Semi-Pro</MenuItem>
              <MenuItem value="professional">Professional</MenuItem>
            </Select>
          </FormControl>
        );

      case "assignProgram":
        return (
          <TextField
            fullWidth
            label="Training Program"
            value={actionData.program || ""}
            onChange={(e) => setActionData({ program: e.target.value })}
            sx={{ mt: 2 }}
            placeholder="Enter training program name"
          />
        );

      case "delete":
        return (
          <Alert severity="warning" sx={{ mt: 2 }}>
            This action will permanently delete {selectedCount} athletes. This
            cannot be undone.
          </Alert>
        );

      case "export":
        return (
          <Alert severity="info" sx={{ mt: 2 }}>
            This will export {selectedCount} selected athletes to a CSV file.
          </Alert>
        );

      default:
        return null;
    }
  };

  const getActionTitle = () => {
    switch (selectedAction) {
      case "updateStatus":
        return "Update Status";
      case "updateLevel":
        return "Update Level";
      case "assignProgram":
        return "Assign Training Program";
      case "delete":
        return "Delete Athletes";
      case "export":
        return "Export Athletes";
      default:
        return "Select Action";
    }
  };

  const canExecute = () => {
    switch (selectedAction) {
      case "updateStatus":
        return !!actionData.status;
      case "updateLevel":
        return !!actionData.level;
      case "assignProgram":
        return !!actionData.program?.trim();
      case "delete":
      case "export":
        return true;
      default:
        return false;
    }
  };

  const availableActions = [
    {
      type: "updateStatus" as BulkActionType,
      label: "Update Status",
      description: "Change scouting status for selected athletes",
      icon: <EditIcon />,
      permission: userRole.permissions.canEdit,
    },
    {
      type: "updateLevel" as BulkActionType,
      label: "Update Level",
      description: "Change competition level for selected athletes",
      icon: <EditIcon />,
      permission: userRole.permissions.canEdit,
    },
    {
      type: "assignProgram" as BulkActionType,
      label: "Assign Training Program",
      description: "Assign a training program to selected athletes",
      icon: <AssignIcon />,
      permission: userRole.permissions.canEdit,
    },
    {
      type: "export" as BulkActionType,
      label: "Export to CSV",
      description: "Export selected athletes data to CSV file",
      icon: <ExportIcon />,
      permission: userRole.permissions.canExport,
    },
    {
      type: "delete" as BulkActionType,
      label: "Delete Athletes",
      description: "Permanently delete selected athletes",
      icon: <DeleteIcon />,
      permission: userRole.permissions.canDelete,
      dangerous: true,
    },
  ].filter((action) => action.permission);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        component="div"
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          backgroundColor: "#03045e",
          color: "white",
        }}
      >
        <GroupIcon />
        Bulk Actions ({selectedCount} selected)
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        {!selectedAction ? (
          <Box>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Choose an action to perform on {selectedCount} selected athletes:
            </Typography>

            <List>
              {availableActions.map((action, index) => (
                <React.Fragment key={action.type}>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      border: "1px solid",
                      borderColor: action.dangerous ? "error.main" : "divider",
                      padding: 0,
                    }}
                  >
                    <ListItemButton
                      onClick={() => handleActionSelect(action.type)}
                      sx={{
                        borderRadius: 1,
                        "&:hover": {
                          backgroundColor: action.dangerous
                            ? "error.light"
                            : "action.hover",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          color: action.dangerous ? "error.main" : "#03045e",
                        }}
                      >
                        {action.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={action.label}
                        secondary={action.description}
                        sx={{
                          "& .MuiListItemText-primary": {
                            color: action.dangerous ? "error.main" : "inherit",
                            fontWeight: "bold",
                          },
                        }}
                      />
                    </ListItemButton>
                  </ListItem>
                  {index < availableActions.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Box>
        ) : (
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{ mb: 2, color: "#03045e" }}
            >
              {getActionTitle()}
            </Typography>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This action will be applied to {selectedCount} selected athletes.
            </Typography>

            {renderActionForm()}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2, backgroundColor: "#f5f5f5" }}>
        {selectedAction ? (
          <>
            <Button onClick={() => setSelectedAction("")} variant="outlined">
              Back
            </Button>
            <Button
              onClick={handleExecute}
              disabled={!canExecute()}
              variant="contained"
              color={selectedAction === "delete" ? "error" : "primary"}
              sx={
                selectedAction !== "delete"
                  ? {
                      backgroundColor: "#ADF802",
                      color: "#03045e",
                      "&:hover": { backgroundColor: "#9de002" },
                    }
                  : {}
              }
            >
              Execute Action
            </Button>
          </>
        ) : (
          <Button onClick={onClose} variant="outlined">
            Cancel
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
