import React from "react";
import { Box, Grid, Paper, Typography } from "@mui/material";
import { LineChart, BarChart, PieChart } from "@mui/x-charts";
import "animate.css";

export default function Dashboard() {
  // Sample data for the charts

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Typography
        variant="h4"
        gutterBottom
        className="animate__animated animate__fadeInDown"
      >
        Dashboard
      </Typography>
      <Grid
        container
        spacing={{ xs: 2, md: 3 }}
        columns={{ xs: 4, sm: 8, md: 12 }}
      >
        <Grid
          size={{ xs: 4, sm: 4, md: 4 }}
          className="animate__animated animate__fadeInLeft"
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Sales Over Time
            </Typography>
            <LineChart
              xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
              series={[
                {
                  data: [2, 5.5, 2, 8.5, 1.5, 5],
                  area: true,
                },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 4, sm: 4, md: 4 }}
          className="animate__animated animate__fadeInUp"
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Monthly Revenue
            </Typography>
            <BarChart
              xAxis={[
                { scaleType: "band", data: ["group A", "group B", "group C"] },
              ]}
              series={[
                { data: [4, 3, 5] },
                { data: [1, 6, 3] },
                { data: [2, 5, 6] },
              ]}
              height={300}
            />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 4, sm: 4, md: 4 }}
          className="animate__animated animate__fadeInRight"
        >
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Product Distribution
            </Typography>
            <PieChart
              series={[
                {
                  data: [
                    { id: 0, value: 10, label: "series A" },
                    { id: 1, value: 15, label: "series B" },
                    { id: 2, value: 20, label: "series C" },
                  ],
                },
              ]}
              width={200}
              height={200}
            />
          </Paper>
        </Grid>
        <Grid
          size={{ xs: 4, sm: 8, md: 12 }}
          className="animate__animated animate__fadeInUp"
        >
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Additional Information
            </Typography>
            <Typography variant="body1">
              Here you can add more information relevant to the vendor, such as
              recent orders, notifications, or other key metrics.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
