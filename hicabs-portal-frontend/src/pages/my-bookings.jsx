import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import CustomTable from "../components/shared/ui-components/custom-table";
import CustomConfirmationDialog from "../components/shared/ui-components/custom-confirmation-dialog";
import useAlertStore from "../utils/alert-store";
import moment from "moment";

const MyBookings = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filter, setFilter] = useState("upcoming");
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
    { id: "driverName", label: "Driver Name" },
    { id: "vehicleNo", label: "Vehicle No" },
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
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG124",
      clientName: "Bob Smith",
      clientContact: "0987654321",
      pickupTown: "Town C",
      pickupStreet: "Street 3",
      dropTown: "Town D",
      dropStreet: "Street 4",
      pickupNote: "Fragile",
      dropNote: "Ring the bell",
      price: "$150",
      jobDate: moment().subtract(1, "days").format("YYYY-MM-DD"),
      jobTime: "2:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG125",
      clientName: "Charlie Brown",
      clientContact: "1122334455",
      pickupTown: "Town E",
      pickupStreet: "Street 5",
      dropTown: "Town F",
      dropStreet: "Street 6",
      pickupNote: "Urgent",
      dropNote: "Call on arrival",
      price: "$200",
      jobDate: moment().add(2, "days").format("YYYY-MM-DD"),
      jobTime: "9:00 AM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    // Add more booking data with varying dates and times
    {
      bookingId: "BKG126",
      clientName: "Daisy Miller",
      clientContact: "2233445566",
      pickupTown: "Town G",
      pickupStreet: "Street 7",
      dropTown: "Town H",
      dropStreet: "Street 8",
      pickupNote: "Handle with care",
      dropNote: "Leave at the door",
      price: "$120",
      jobDate: moment().add(1, "hours").format("YYYY-MM-DD"),
      jobTime: moment().add(1, "hours").format("hh:mm A"),
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG127",
      clientName: "Eve Adams",
      clientContact: "3344556677",
      pickupTown: "Town I",
      pickupStreet: "Street 9",
      dropTown: "Town J",
      dropStreet: "Street 10",
      pickupNote: "Fragile",
      dropNote: "Ring the bell",
      price: "$180",
      jobDate: moment().subtract(2, "days").format("YYYY-MM-DD"),
      jobTime: "11:00 AM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG128",
      clientName: "Frank Wright",
      clientContact: "4455667788",
      pickupTown: "Town K",
      pickupStreet: "Street 11",
      dropTown: "Town L",
      dropStreet: "Street 12",
      pickupNote: "Urgent",
      dropNote: "Call on arrival",
      price: "$220",
      jobDate: moment().add(3, "days").format("YYYY-MM-DD"),
      jobTime: "3:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG129",
      clientName: "Grace Lee",
      clientContact: "5566778899",
      pickupTown: "Town M",
      pickupStreet: "Street 13",
      dropTown: "Town N",
      dropStreet: "Street 14",
      pickupNote: "Handle with care",
      dropNote: "Leave at the door",
      price: "$130",
      jobDate: moment().subtract(3, "days").format("YYYY-MM-DD"),
      jobTime: "4:00 PM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG130",
      clientName: "Hank Green",
      clientContact: "6677889900",
      pickupTown: "Town O",
      pickupStreet: "Street 15",
      dropTown: "Town P",
      dropStreet: "Street 16",
      pickupNote: "Fragile",
      dropNote: "Ring the bell",
      price: "$170",
      jobDate: moment().add(4, "days").format("YYYY-MM-DD"),
      jobTime: "5:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG131",
      clientName: "Ivy White",
      clientContact: "7788990011",
      pickupTown: "Town Q",
      pickupStreet: "Street 17",
      dropTown: "Town R",
      dropStreet: "Street 18",
      pickupNote: "Urgent",
      dropNote: "Call on arrival",
      price: "$210",
      jobDate: moment().subtract(4, "days").format("YYYY-MM-DD"),
      jobTime: "6:00 PM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG132",
      clientName: "Jack Black",
      clientContact: "8899001122",
      pickupTown: "Town S",
      pickupStreet: "Street 19",
      dropTown: "Town T",
      dropStreet: "Street 20",
      pickupNote: "Handle with care",
      dropNote: "Leave at the door",
      price: "$140",
      jobDate: moment().add(5, "days").format("YYYY-MM-DD"),
      jobTime: "7:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG133",
      clientName: "Kara Blue",
      clientContact: "9900112233",
      pickupTown: "Town U",
      pickupStreet: "Street 21",
      dropTown: "Town V",
      dropStreet: "Street 22",
      pickupNote: "Fragile",
      dropNote: "Ring the bell",
      price: "$160",
      jobDate: moment().subtract(5, "days").format("YYYY-MM-DD"),
      jobTime: "8:00 PM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG134",
      clientName: "Liam Red",
      clientContact: "0011223344",
      pickupTown: "Town W",
      pickupStreet: "Street 23",
      dropTown: "Town X",
      dropStreet: "Street 24",
      pickupNote: "Urgent",
      dropNote: "Call on arrival",
      price: "$230",
      jobDate: moment().add(6, "days").format("YYYY-MM-DD"),
      jobTime: "9:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG135",
      clientName: "Mona Yellow",
      clientContact: "1122334455",
      pickupTown: "Town Y",
      pickupStreet: "Street 25",
      dropTown: "Town Z",
      dropStreet: "Street 26",
      pickupNote: "Handle with care",
      dropNote: "Leave at the door",
      price: "$110",
      jobDate: moment().subtract(6, "days").format("YYYY-MM-DD"),
      jobTime: "10:00 PM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
    {
      bookingId: "BKG136",
      clientName: "Nina Purple",
      clientContact: "2233445566",
      pickupTown: "Town AA",
      pickupStreet: "Street 27",
      dropTown: "Town BB",
      dropStreet: "Street 28",
      pickupNote: "Fragile",
      dropNote: "Ring the bell",
      price: "$190",
      jobDate: moment().add(7, "days").format("YYYY-MM-DD"),
      jobTime: "11:00 PM",
      driverName: "Jane Smith",
      vehicleNo: "ABC 5678",
    },
    {
      bookingId: "BKG137",
      clientName: "Oscar Orange",
      clientContact: "3344556677",
      pickupTown: "Town CC",
      pickupStreet: "Street 29",
      dropTown: "Town DD",
      dropStreet: "Street 30",
      pickupNote: "Urgent",
      dropNote: "Call on arrival",
      price: "$240",
      jobDate: moment().subtract(7, "days").format("YYYY-MM-DD"),
      jobTime: "12:00 PM",
      driverName: "John Doe",
      vehicleNo: "XYZ 1234",
    },
  ];

  const handleUnassignClick = (booking) => {
    setSelectedBooking(booking);
    setConfirmationOpen(true);
  };

  const handleConfirmationClose = () => {
    setConfirmationOpen(false);
    setSelectedBooking(null);
  };

  const handleConfirm = () => {
    setConfirmationOpen(false);
    setAlert({
      severity: "success",
      message: "Driver unassigned successfully!",
    });
  };

  const isUnassignable = (jobDate, jobTime) => {
    const jobDateTime = moment(`${jobDate} ${jobTime}`, "YYYY-MM-DD hh:mm A");
    return jobDateTime.isAfter(moment().add(1, "hour"));
  };

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const filteredData = bookingData.filter((booking) => {
    const jobDateTime = moment(
      `${booking.jobDate} ${booking.jobTime}`,
      "YYYY-MM-DD hh:mm A"
    );
    if (filter === "completed") {
      return jobDateTime.isBefore(moment());
    } else if (filter === "upcoming") {
      return jobDateTime.isAfter(moment());
    }
    return true;
  });

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography
        variant="h4"
        gutterBottom
        className="animate__animated animate__fadeInDown"
      >
        My Bookings
      </Typography>
      <ToggleButtonGroup
        value={filter}
        exclusive
        onChange={handleFilterChange}
        aria-label="booking filter"
        sx={{ mb: 2 }}
      >
        <ToggleButton value="all" aria-label="all bookings">
          All
        </ToggleButton>
        <ToggleButton value="completed" aria-label="completed bookings">
          Completed
        </ToggleButton>
        <ToggleButton value="upcoming" aria-label="upcoming bookings">
          Upcoming
        </ToggleButton>
      </ToggleButtonGroup>
      <CustomTable
        columns={columns}
        data={filteredData.map((booking) => ({
          ...booking,
          action: isUnassignable(booking.jobDate, booking.jobTime) ? (
            <Button
              variant="contained"
              color="secondary"
              onClick={() => handleUnassignClick(booking)}
            >
              Unassign
            </Button>
          ) : null,
        }))}
      />
      <CustomConfirmationDialog
        open={confirmationOpen}
        onClose={handleConfirmationClose}
        onConfirm={handleConfirm}
        title="Confirmation"
        message="Are you sure you want to unassign this driver?"
      />
    </Box>
  );
};

export default MyBookings;
