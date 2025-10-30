import React, { useState } from "react";
import { DataGrid, GridColDef, GridPaginationModel } from "@mui/x-data-grid";
import { Button, Box, Paper, Typography, IconButton, Tooltip } from "@mui/material";
import { ExpandMore, ExpandLess, ContentCopy, CheckCircle } from "@mui/icons-material";
import { formatMessage, isJSON, formatJSON } from "../utils/logUtils";

interface Log {
  timestamp: number;
  message: string;
  level?: "INFO" | "WARN" | "ERROR"; // 可依 log level 改顏色
}

interface LogTableProps {
  logData: { events: Log[] };
}

export const LogTable: React.FC<LogTableProps> = ({ logData }) => {
  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    pageSize: 100,
    page: 0,
  });

  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedRows(newSet);
  };

  const handleCopy = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("複製失敗:", err);
    }
  };

  const rows = logData.events.map((log, index) => ({
    id: index.toString(),
    timestamp:
      typeof log.timestamp === "string" ? new Date(Number(log.timestamp)) : new Date(log.timestamp),
    message: log.message,
    level: log.level || "INFO", // 預設 INFO
  }));

  // 顏色對應
  const getMessageColor = (level: string) => {
    switch (level) {
      case "ERROR":
        return "#fdecea"; // 淺紅
      case "WARN":
        return "#fff4e5"; // 淺橙
      case "INFO":
      default:
        return "#e8f5e9"; // 淺綠
    }
  };

  // 邊框顏色對應
  const getBorderColor = (level: string, hover: boolean = false) => {
    const opacity = hover ? 0.4 : 0.2;
    switch (level) {
      case "ERROR":
        return `rgba(211, 47, 47, ${opacity})`;
      case "WARN":
        return `rgba(237, 108, 2, ${opacity})`;
      case "INFO":
      default:
        return `rgba(46, 125, 50, ${opacity})`;
    }
  };

  const columns: GridColDef[] = [
    {
      field: "timestamp",
      headerName: "Timestamp",
      width: 220,
      renderCell: (params) => {
        const value = params.value as Date;
        return (
          <Typography variant="body2" color="textSecondary">
            {value.toLocaleString()}
          </Typography>
        );
      },
    },
    {
      field: "message",
      headerName: "Message",
      flex: 1,
      minWidth: 500,
      renderCell: (params) => {
        const id = params.row.id as string;
        const msg = params.value as string;
        const level = params.row.level as string;
        const isExpanded = expandedRows.has(id);
        const isCopied = copiedId === id;

        // 检测是否为JSON并格式化
        const isJsonFormat = isJSON(msg.trim());
        const formattedMsg = isJsonFormat ? formatJSON(msg.trim()) : msg;
        const displayText = formatMessage(formattedMsg, 5, isExpanded);

        // 计算行数
        const normalizedMsg = msg.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
        const totalLines = normalizedMsg.split("\n").length;

        return (
          <Box display="flex" flexDirection="column" width="100%" gap={1}>
            <Box position="relative">
              <Paper
                elevation={0}
                sx={{
                  padding: 2,
                  backgroundColor: getMessageColor(level),
                  borderRadius: 2,
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  maxHeight: isExpanded ? "none" : 140,
                  overflow: "hidden",
                  position: "relative",
                  border: "1.5px solid",
                  borderColor: getBorderColor(level),
                  transition: "all 0.2s ease",
                  fontFamily: isJsonFormat ? "'Courier New', 'Monaco', 'Consolas', monospace" : "inherit",
                  fontSize: "0.875rem",
                  lineHeight: 1.6,
                  "&:hover": {
                    borderColor: getBorderColor(level, true),
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
                  },
                }}
              >
                <Typography
                  component="pre"
                  sx={{
                    margin: 0,
                    fontFamily: "inherit",
                    fontSize: "inherit",
                    lineHeight: "inherit",
                    color: "text.primary",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {displayText}
                </Typography>
                {!isExpanded && totalLines > 5 && (
                  <Box
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: "100%",
                      height: 32,
                      background:
                        `linear-gradient(to bottom, rgba(255,255,255,0), ${getMessageColor(level)})`,
                      pointerEvents: "none",
                    }}
                  />
                )}
              </Paper>
              <Tooltip title={isCopied ? "已複製！" : "複製內容"}>
                <IconButton
                  size="small"
                  onClick={() => handleCopy(msg, id)}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    "&:hover": {
                      backgroundColor: "rgba(255, 255, 255, 1)",
                    },
                    transition: "all 0.2s ease",
                  }}
                >
                  {isCopied ? (
                    <CheckCircle sx={{ fontSize: 18, color: "success.main" }} />
                  ) : (
                    <ContentCopy sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </Tooltip>
            </Box>
            <Box display="flex" justifyContent="space-between" alignItems="center">
              {totalLines > 5 && (
                <Button
                  size="small"
                  color="primary"
                  variant="outlined"
                  startIcon={isExpanded ? <ExpandLess /> : <ExpandMore />}
                  sx={{ 
                    textTransform: "none",
                    borderRadius: 2,
                    px: 2,
                    borderWidth: 1.5,
                    "&:hover": {
                      borderWidth: 1.5,
                      transform: "translateY(-1px)",
                      boxShadow: "0 2px 8px rgba(102, 126, 234, 0.2)",
                    },
                    transition: "all 0.2s ease",
                  }}
                  onClick={() => toggleExpand(id)}
                >
                  {isExpanded ? "收起" : `展開更多 (共 ${totalLines} 行)`}
                </Button>
              )}
              {isJsonFormat && (
                <Typography variant="caption" color="textSecondary" sx={{ ml: "auto" }}>
                  JSON 格式
                </Typography>
              )}
            </Box>
          </Box>
        );
      },
    },
  ];

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 2, 
        p: 2, 
        border: "1px solid",
        borderColor: "divider",
        background: "rgba(255, 255, 255, 0.8)",
      }}
    >
      <Box mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: "text.primary" }}>
          日誌記錄 ({logData.events.length} 筆)
        </Typography>
      </Box>
      <DataGrid
        rows={rows}
        columns={columns}
        autoHeight
        getRowHeight={() => "auto"}
        pagination
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[20, 50, 100]}
        sx={{
          border: "none",
          "& .MuiDataGrid-cell": {
            alignItems: "flex-start",
            borderBottom: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: 700,
            fontSize: "0.95rem",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "rgba(102, 126, 234, 0.08)",
            borderBottom: "2px solid",
            borderColor: "primary.main",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid",
            borderColor: "divider",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(102, 126, 234, 0.04)",
          },
        }}
      />
    </Paper>
  );
};
