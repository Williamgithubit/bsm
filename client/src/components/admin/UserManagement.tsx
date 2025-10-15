"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Avatar,
  TablePagination,
  Alert,
  Snackbar,
  CircularProgress,
  FormHelperText,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@/components/ui/Grid";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  Person as PersonIcon,
  SportsFootball as CoachIcon,
  FitnessCenter as AthleteIcon,
  Business as SponsorIcon,
  Camera as MediaIcon,
  Refresh as RefreshIcon,
  LockReset as LockResetIcon,
} from "@mui/icons-material";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

// Role types for sports management
type UserRole = "admin" | "manager" | "coach" | "athlete" | "sponsor" | "media";

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended";
  lastLogin: string | null;
  createdAt: string;
  emailVerified: boolean;
  photoURL?: string | null;
  phoneNumber?: string | null;
}

interface CreateUserData {
  email: string;
  password?: string;
  name: string;
  role: UserRole;
  status?: "active" | "inactive" | "suspended";
  phoneNumber?: string | null;
}

interface UserManagementProps {
  openDialog?: boolean;
  onCloseDialog?: () => void;
}

const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  manager: "Manager",
  coach: "Coach",
  athlete: "Athlete",
  sponsor: "Sponsor",
  media: "Media",
};

const roleIcons: Record<UserRole, React.ReactElement> = {
  admin: <AdminIcon />,
  manager: <PersonIcon />,
  coach: <CoachIcon />,
  athlete: <AthleteIcon />,
  sponsor: <SponsorIcon />,
  media: <MediaIcon />,
};

const UserManagement: React.FC<UserManagementProps> = ({
  openDialog = false,
  onCloseDialog,
}) => {
  const auth = getAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Fetch users with Firebase Authentication
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch("/api/admin/users", {
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data: User[] = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (openDialog) {
      setDialogOpen(true);
      onCloseDialog?.();
    }
  }, [openDialog, onCloseDialog]);

  const handleOpenDialog = (user: User | null = null) => {
    setEditingUser(user);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setEditingUser(null);
    setDialogOpen(false);
    setError(null);
    setSuccess(null);
  };

  const handleSaveUser = async (data: CreateUserData) => {
    setIsSubmitting(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");
      const idToken = await currentUser.getIdToken(true);

      const url = editingUser ? `/api/admin/users/${editingUser.id}` : "/api/admin/users";
      const method = editingUser ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `Failed to ${editingUser ? "update" : "create"} user`);
      }

      setSuccess(`${data.email} ${editingUser ? "updated" : "created"} successfully`);
      await fetchUsers();
      handleCloseDialog();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to ${editingUser ? "update" : "create"} user`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    setIsLoading(true);
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("User not authenticated");
      const idToken = await currentUser.getIdToken(true);

      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${idToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || "Failed to delete user");
      }

      setSuccess("User deleted successfully");
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (user: User) => {
    if (!confirm(`Send password reset email to ${user.email}?`)) return;
    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, user.email);
      setSuccess(`Password reset email sent to ${user.email}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send password reset email");
    } finally {
      setIsLoading(false);
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" sx={{ color: "#03045e", fontWeight: "bold" }}>
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog(null)}
          sx={{ backgroundColor: "#ADF802", color: "#03045e", "&:hover": { backgroundColor: "#9de702" } }}
        >
          Add User
        </Button>
      </Box>

      <Snackbar
        open={!!success}
        autoHideDuration={5000}
        onClose={() => setSuccess(null)}
      >
        <Alert severity="success">{success}</Alert>
      </Snackbar>
      <Snackbar
        open={!!error}
        autoHideDuration={5000}
        onClose={() => setError(null)}
      >
        <Alert severity="error">{error}</Alert>
      </Snackbar>

      <Paper>
        <Box sx={{ p: 2, display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
          />
          <Button startIcon={<RefreshIcon />} onClick={fetchUsers}>
            Refresh
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} sx={{ textAlign: "center" }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : (
                filtered
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <Avatar src={u.photoURL || undefined}>
                            {roleIcons[u.role]}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 600 }}>
                              {u.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Joined{" "}
                              {new Date(u.createdAt).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={roleLabels[u.role]}
                          size="small"
                          icon={roleIcons[u.role]}
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={u.status}
                          size="small"
                          color={u.status === "active" ? "success" : "default"}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={() => handleOpenDialog(u)}
                          aria-label="edit"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleResetPassword(u)}
                          aria-label="reset"
                        >
                          <LockResetIcon />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(u.id)}
                          aria-label="delete"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => setRowsPerPage(Number(e.target.value))}
        />
      </Paper>

      <UserFormDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveUser}
        user={editingUser}
        isSubmitting={isSubmitting}
      />
    </Box>
  );
};

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CreateUserData) => Promise<void>;
  user: User | null;
  isSubmitting: boolean;
}

const UserFormDialog: React.FC<UserFormDialogProps> = ({
  open,
  onClose,
  onSave,
  user,
  isSubmitting,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [formData, setFormData] = useState<CreateUserData>({
    email: user?.email || "",
    password: "",
    name: user?.name || "",
    role: user?.role || "athlete",
    status: user?.status || "active",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        role: user.role,
        status: user.status,
      });
    } else {
      setFormData({
        email: "",
        password: "",
        name: "",
        role: "athlete",
        status: "active",
      });
    }
    setErrors({});
  }, [user, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = "Name required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      e.email = "Valid email required";
    if (!user && !formData.password) e.password = "Password required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | any
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    await onSave(formData);
  };

  return (
    <Dialog
      open={open}
      onClose={isSubmitting ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Full name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email}
                disabled={!!user}
              />
            </Grid>
            {!user && (
              <Grid item xs={12}>
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password}
                />
              </Grid>
            )}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="coach">Coach</MenuItem>
                  <MenuItem value="athlete">Athlete</MenuItem>
                  <MenuItem value="sponsor">Sponsor</MenuItem>
                  <MenuItem value="media">Media</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            sx={{ backgroundColor: "#ADF802", color: "#03045e", "&:hover": { backgroundColor: "#9de702" } }}
          >
            {isSubmitting ? (
              <CircularProgress size={20} />
            ) : user ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserManagement;