"use client";
import React, { useEffect, useState } from "react";
import {
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  List,
  Box,
  Typography,
  Divider,
  Select,
  MenuItem as MuiMenuItem,
  FormControl,
  InputLabel,
  Button,
  Tooltip,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CircleIcon from "@mui/icons-material/Circle";
import { NotificationService } from "@/services/notificationService";
import { Notification } from "@/types/notification";
import useUserRole from "@/hooks/useUserRole";

export default function Notifications() {
  const userRole = useUserRole();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filterType, setFilterType] = useState("all");
  const [pageToken, setPageToken] = useState<any>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const unsub = NotificationService.subscribeToNotifications(
      userRole.role,
      (items) => {
        setNotifications(items);
        setUnreadCount(items.filter((i) => !i.read).length);
      }
    );
    return () => unsub();
  }, [userRole.role]);

  // Load initial paginated page when opening
  const loadInitialPage = async () => {
    try {
      const { items, lastDoc } = await NotificationService.getNotificationsPaginated(20);
      setNotifications(items);
      setPageToken(lastDoc || null);
      setHasMore(Boolean(lastDoc));
      setUnreadCount(items.filter(i => !i.read).length);
    } catch (err) {
      console.error('Error loading notifications page', err);
    }
  };

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
  loadInitialPage();
  };
  const handleClose = () => setAnchorEl(null);

  const handleMarkRead = async (id: string, read = true) => {
    await NotificationService.markAsRead(id, read);
  };

  const handleMarkAll = async () => {
    await NotificationService.markAllAsRead();
  };

  const handleDelete = async (id: string) => {
    await NotificationService.deleteNotification(id);
  };

  const filtered = notifications.filter((n) =>
    filterType === "all" ? true : n.type === filterType
  );

  const loadMore = async () => {
    if (!hasMore || loadingMore) return;
    setLoadingMore(true);
    try {
      const { items, lastDoc } = await NotificationService.getNotificationsPaginated(20, pageToken);
      setNotifications(prev => [...prev, ...items]);
      setPageToken(lastDoc || null);
      setHasMore(Boolean(lastDoc));
    } catch (err) {
      console.error('Error loading more notifications', err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div>
      <Tooltip title="Notifications">
        <IconButton color="inherit" onClick={handleOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ style: { width: 360 } }}
      >
        <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 1 }}>
          <Typography variant="subtitle1" sx={{ flex: 1 }}>
            Notifications
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Type</InputLabel>
            <Select
              label="Type"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <MuiMenuItem value="all">All</MuiMenuItem>
              <MuiMenuItem value="blog">Blog</MuiMenuItem>
              <MuiMenuItem value="athlete">Athlete</MuiMenuItem>
              <MuiMenuItem value="event">Event</MuiMenuItem>
              <MuiMenuItem value="contact">Contact</MuiMenuItem>
            </Select>
          </FormControl>
        </Box>
        <Divider />

        <List dense>
          {filtered.length === 0 && (
            <ListItem>
              <ListItemText primary="No notifications" />
            </ListItem>
          )}
          {filtered.slice(0, 20).map((n) => (
            <ListItem key={n.id} divider>
              <ListItemText primary={n.title || n.type} secondary={n.body} />
              <ListItemSecondaryAction>
                <IconButton
                  onClick={() => handleMarkRead(n.id, !n.read)}
                  size="small"
                >
                  <CircleIcon
                    color={n.read ? "disabled" : "error"}
                    style={{ fontSize: 12 }}
                  />
                </IconButton>
                <IconButton onClick={() => handleDelete(n.id)} size="small">
                  ✖
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>

        <Divider />
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {hasMore && (
            <Box sx={{ p: 1 }}>
              <Button fullWidth variant="outlined" onClick={loadMore} disabled={loadingMore}>{loadingMore ? 'Loading...' : 'Load more'}</Button>
            </Box>
          )}
          <Box sx={{ display: "flex", gap: 1, p: 1 }}>
          <Button size="small" onClick={handleMarkAll}>
            Mark all read
          </Button>
          <Button
            size="small"
            onClick={async () => {
              const csv = await NotificationService.exportNotificationsCSV();
              const blob = new Blob([csv], { type: "text/csv" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = `notifications_${
                new Date().toISOString().split("T")[0]
              }.csv`;
              a.click();
              URL.revokeObjectURL(url);
            }}
          >
            Export
          </Button>
          </Box>
        </Box>
      </Menu>
    </div>
  );
}
