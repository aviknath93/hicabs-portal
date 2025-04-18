import React, { useState } from "react";
import { Box, Typography, Button, Grid } from "@mui/material";
import CustomTable from "../components/shared/ui-components/custom-table";
import CustomDialog from "../components/shared/ui-components/custom-dialog";
import CustomConfirmationDialog from "../components/shared/ui-components/custom-confirmation-dialog";
import InputSelect from "../components/shared/form-components/input-select";
import useAlertStore from "../utils/alert-store";

const AllBookings = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedDriver, setSelectedDriver] = useState("");
  const [errors, setErrors] = useState({});
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const { setAlert } = useAlertStore();

  const columns = [
    { id: "bookingId", label: "Booking ID" },
    { id: "clientName", label: "Client Name" },
    { id: "clientContact", label: "Client Contact" },
    { id: "pickupTown", label: "Pickup Town" },
    { id: "pickupStreet", label: "Pickup Street" },
    { id: "dropTown", label: "Drop Town" },
    { id: "dropStreet", label: "Drop Street" },
    { id: "pickupNote", label: "Pickup Note" },
    { id: "dropNote", label: "Drop Note" },
    { id: "price", label: "Price" },
    { id: "jobDate", label: "Job Date" },
    { id: "jobTime", label: "Job Time" },
    { id: "action", label: "Action" },
  ];

  const bookingData = [
    {
      bookingId: "BKG123",
      clientName: "Alice Johnson",
      clientContact: "1234567890",
      pickupTown: "Town A",
      pickupStreet: "Street 1",
      dropTown: "Town B",
      dropStreet: "Street 2",
      pickupNote: "Handle with care",
      dropNote: "Leave at the door",
      price: "$100",
      jobDate: "2023-10-01",
      jobTime: "10:00 AM",
    },
    // Add more booking data as needed
  ];

  const driverData = [
    { id: "DRV1234", name: "John Doe" },
    { id: "DRV5678", name: "Jane Smith" },
    // Add more drivers as needed
  ];

  const handleAssignClick = () => {
    setSelectedDriver("");
    setErrors({});
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setSelectedDriver(""); // Clear selected driver
    setErrors({}); // Clear errors
  };

  const handleDriverSelect = (event) => {
    setSelectedDriver(event.target.value);
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedDriver) {
      newErrors.selectedDriver = "Driver selection is required";
    }
    return newErrors;
  };

  const handleSubmit = () => {
    setErrors({}); // Clear previous errors
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      setOpenDialog(false);
      setConfirmationOpen(true);
    } else {
      setErrors(validationErrors);
    }
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
  };

  const handleConfirm = () => {
    setConfirmationOpen(false);
    setAlert({ severity: "success", message: "Driver assigned successfully!" });
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        className="animate__animated animate__fadeInDown"
      >
        All Bookings
      </Typography>
      <CustomTable
        columns={columns}
        data={bookingData.map((booking) => ({
          ...booking,
          action: (
            <Button
              variant="contained"
              color="primary"
              onClick={handleAssignClick}
            >
              Assign
            </Button>
          ),
        }))}
      />
      <CustomDialog
        open={openDialog}
        onClose={handleDialogClose}
        onSubmit={handleSubmit}
        title="Assign Driver"
        content={
          <Grid container spacing={2}>
            <Grid size={{ xs: 12 }}>
              <InputSelect
                label="Select Driver"
                value={selectedDriver}
                onChange={handleDriverSelect}
                options={driverData.map((driver) => ({
                  value: driver.id,
                  label: driver.name,
                }))}
                hasError={!!errors.selectedDriver}
                errorText={errors.selectedDriver}
              />
            </Grid>
          </Grid>
        }
      />
      <CustomConfirmationDialog
        open={confirmationOpen}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirm}
        title="Confirmation"
        message="Are you sure you want to assign this driver?"
      />
    </Box>
  );
};

export default AllBookings;
