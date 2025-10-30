import React, { useState, useEffect } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { AccessTime } from "@mui/icons-material";

export const Clock: React.FC = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
    });
  };

  return (
    <Paper
      elevation={4}
      sx={{
        padding: 2,
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        borderRadius: 2,
        display: "inline-block",
        minWidth: { xs: "100%", sm: 180 },
        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
      }}
    >
      <Box display="flex" flexDirection="column" alignItems="center" gap={0.5}>
        <Box display="flex" alignItems="center" gap={0.5}>
          <AccessTime sx={{ fontSize: 20 }} />
          <Typography variant="body2" component="div" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
            現在時間
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          component="div" 
          sx={{ 
            fontWeight: 700,
            fontFamily: "monospace",
            letterSpacing: "0.05em",
          }}
        >
          {formatTime(currentTime)}
        </Typography>
        <Typography variant="body2" component="div" sx={{ opacity: 0.9, fontSize: "0.75rem" }}>
          {formatDate(currentTime)}
        </Typography>
      </Box>
    </Paper>
  );
};

