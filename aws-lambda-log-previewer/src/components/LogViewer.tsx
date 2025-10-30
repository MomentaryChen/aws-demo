import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import ReactJson from "react-json-view";

interface Log {
  logStreamName: string;
  timestamp: number;
  message: string;
  ingestionTime: number;
  eventId: string;
}

interface LogViewerProps {
  logData: { events: Log[] };
}

export const LogViewer: React.FC<LogViewerProps> = ({ logData }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {logData.events.map((log) => (
        <Card key={log.eventId} variant="outlined">
          <CardContent>
            <Typography variant="subtitle2" color="textSecondary">
              {log.logStreamName} | {new Date(log.timestamp).toLocaleString()} | EventId: {log.eventId}
            </Typography>
            <Typography variant="body2" component="div">
              <ReactJson
                src={{
                  message: log.message,
                  ingestionTime: log.ingestionTime
                }}
                collapsed={true}
                enableClipboard={true}
                displayDataTypes={false}
              />
            </Typography>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
