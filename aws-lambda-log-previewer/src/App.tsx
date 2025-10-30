import React, { useState } from "react";
import { 
    Container, 
    Typography, 
    Button, 
    Box, 
    Paper,
    ThemeProvider,
    createTheme,
    CssBaseline,
    Alert,
    Snackbar
} from "@mui/material";
import { CloudUpload, Description, DataObject } from "@mui/icons-material";
import { LogTable } from "./components/LogTable";
import { Clock } from "./components/Clock";

const theme = createTheme({
    palette: {
        primary: {
            main: "#667eea",
        },
        secondary: {
            main: "#764ba2",
        },
    },
    typography: {
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
        ].join(','),
        h4: {
            fontWeight: 700,
        },
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
    },
});

function App() {
    const [logData, setLogData] = useState<{ events: any[] } | null>(null);
    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({
        open: false,
        message: "",
        severity: "success",
    });

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target?.result as string);
                if (json.events) {
                    setLogData(json);
                    setSnackbar({
                        open: true,
                        message: `成功載入 ${json.events.length} 條日誌記錄`,
                        severity: "success",
                    });
                } else {
                    setSnackbar({
                        open: true,
                        message: "JSON 格式錯誤，缺少 events 陣列",
                        severity: "error",
                    });
                }
            } catch (err) {
                setSnackbar({
                    open: true,
                    message: "無法解析 JSON 檔案",
                    severity: "error",
                });
                console.error(err);
            }
        };
        reader.readAsText(file);
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box
                sx={{
                    minHeight: "100vh",
                    padding: { xs: 2, sm: 3, md: 4 },
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                }}
            >
                <Container maxWidth="xl">
                    <Paper
                        elevation={8}
                        sx={{
                            p: { xs: 3, sm: 4, md: 5 },
                            borderRadius: 3,
                            background: "rgba(255, 255, 255, 0.98)",
                            backdropFilter: "blur(10px)",
                            mb: 3,
                        }}
                    >
                        <Box 
                            display="flex" 
                            justifyContent="space-between" 
                            alignItems={{ xs: "flex-start", sm: "center" }}
                            flexDirection={{ xs: "column", sm: "row" }}
                            gap={2}
                            mb={4}
                        >
                            <Box>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <DataObject sx={{ fontSize: 32, color: "primary.main" }} />
                                    <Typography 
                                        variant="h4" 
                                        sx={{ 
                                            fontWeight: 700,
                                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                            WebkitBackgroundClip: "text",
                                            WebkitTextFillColor: "transparent",
                                        }}
                                    >
                                        AWS Lambda Log Preview
                                    </Typography>
                                </Box>
                                <Typography variant="body2" color="textSecondary">
                                    上傳並預覽 AWS Lambda 日誌檔案
                                </Typography>
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 0.5, display: "block" }}>
                                    請上傳 <code style={{ fontSize: "0.9em", background: "rgba(102, 126, 234, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>/result/log/full-events-log.json</code>
                                </Typography>
                            </Box>
                            <Clock />
                        </Box>

                        <Box mb={4}>
                            <input
                                accept=".json"
                                type="file"
                                id="json-file"
                                style={{ display: "none" }}
                                onChange={handleFileUpload}
                            />
                            <label htmlFor="json-file">
                                <Button
                                    variant="contained"
                                    component="span"
                                    size="large"
                                    startIcon={<CloudUpload />}
                                    sx={{
                                        px: 4,
                                        py: 1.5,
                                        borderRadius: 2,
                                        textTransform: "none",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
                                            boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                                            transform: "translateY(-2px)",
                                        },
                                        transition: "all 0.3s ease",
                                    }}
                                >
                                    上傳 JSON 檔案
                                </Button>
                            </label>
                        </Box>

                        {logData ? (
                            <LogTable logData={logData} />
                        ) : (
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 6,
                                    textAlign: "center",
                                    background: "linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)",
                                    borderRadius: 2,
                                    border: "2px dashed",
                                    borderColor: "primary.main",
                                }}
                            >
                                <Description sx={{ fontSize: 64, color: "primary.main", mb: 2, opacity: 0.5 }} />
                                <Typography variant="h6" color="textSecondary" gutterBottom>
                                    尚未上傳檔案
                                </Typography>
                                <Typography variant="body2" color="textSecondary" gutterBottom>
                                    請點擊上方按鈕選擇 JSON 格式的日誌檔案
                                </Typography>
                                <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: "block" }}>
                                    建議上傳：<code style={{ fontSize: "0.9em", background: "rgba(102, 126, 234, 0.1)", padding: "2px 6px", borderRadius: "4px" }}>/result/log/full-events-log.json</code>
                                </Typography>
                            </Paper>
                        )}
                    </Paper>
                </Container>

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                >
                    <Alert
                        onClose={handleCloseSnackbar}
                        severity={snackbar.severity}
                        variant="filled"
                        sx={{ width: "100%" }}
                    >
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>
        </ThemeProvider>
    );
}

export default App;
