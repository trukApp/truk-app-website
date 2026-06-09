"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  Backdrop,
  CircularProgress,
  // Box,
  Grid,
} from "@mui/material";
import PackagesTable from "@/Components/LoadOptimizer/PackagesTable";
import { useAppDispatch, useAppSelector } from "@/store";
import styles from "./createorder.module.css";
import { withAuthComponent } from "@/Components/WithAuthComponent";
import {
  useGetAllPackagesForOrderQuery,
  useSelectTheProductsMutation,
  useConfomOrderMutation,
  useSaveAsDraftMutation,
} from "@/api/apiSlice";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import {
  CustomButtonFilled,
  //   CustomButtonOutlined,
} from "@/Components/ReusableComponents/ButtonsComponent";
import { setSelectedPackages, setSelectedTrucks } from "@/store/authSlice";
import { useMediaQuery, useTheme } from "@mui/material";
import RootOptimization, {
  RootOptimizationType,
} from "@/Components/RouteOptimizer/RootOptimization";
import { Truck } from "@/Components/LoadOptimizer/TrucksTable";

interface AllocationType {
  vehicle_ID: string;
  sampledRoutePoints?: { lat: number; lng: number }[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any; // keep flexible for backend fields
}
type RoutePointsMap = Record<string, { lat: number; lng: number }[]>;
interface ConfirmPayload {
  message?: string;
  totalCost?: number;
  allocations: AllocationType[];
  unallocatedPackages: [];
}
const RouteOptimizer: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "warning" | "info"
  >("success");
  const [activeStep, setActiveStep] = useState(0);
  const [
    selectTheTrucks,
    { error: packageSelectErr, isLoading: truckSelectionLoading },
  ] = useSelectTheProductsMutation();
  const [createOrder, { isLoading: confirmOrderLoading }] =
    useConfomOrderMutation();
  const [selectTrucks, setSelectTrucks] = useState<Truck[]>([]);
  //   const [unAllocatedPackages, setUnAllocatedPackages] = useState<[]>([]);
  const [conformOrderPayload, setConformOrderPayload] =
    useState<ConfirmPayload>({
      message: "",
      totalCost: 0,
      allocations: [],
      unallocatedPackages: [],
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [noVechilePopup, setNoVechilePopup] = useState(false);
  const filters = useAppSelector((state) => state.auth.filters);
  const [saveDraftOrder] = useSaveAsDraftMutation();
  const [updatedRoutePointsByVehicle, setUpdatedRoutePointsByVehicle] =
    useState<RoutePointsMap>({});
  useEffect(() => {
    if (packageSelectErr) {
      if (
        "data" in packageSelectErr &&
        packageSelectErr.data &&
        typeof packageSelectErr.data === "object"
      ) {
        const errorMessage = (packageSelectErr.data as { error?: string })
          .error;
        if (
          errorMessage ===
          "All packages must have the same pickup_date (ignoring time)."
        ) {
          setSnackbarMessage(
            "Selected packages must have the same pickup date.",
          );
        } else if (errorMessage === "No valid package IDs provided.") {
          setSnackbarMessage(
            "Please select at least one package to place the order.",
          );
        } else if (errorMessage === "Google Maps API Error: NOT_FOUND") {
          setSnackbarMessage(
            "Location not found. Please check the address and try again.",
          );
        } else if (
          errorMessage === "All packages must have the same ship_from location."
        ) {
          setSnackbarMessage(
            "Please select the packages of the same SHIP FROM location.",
          );
        } else if (errorMessage === "All packages must share pickup date") {
          setSnackbarMessage(`All packages must share pickup date.`);
        } else if (errorMessage === "All packages must share ship_from") {
          setSnackbarMessage(`All packages must be same source location.`);
        } else if (errorMessage?.includes("Stacking-factor mismatch")) {
          setSnackbarMessage(errorMessage);
        } else {
          setSnackbarMessage(
            "Something went wrong please try again after some time.",
          );
        }
      } else {
        setSnackbarMessage("An unexpected error occurred.");
      }
      setSnackbarSeverity("warning");
      setSnackbarOpen(true);
    }
  }, [packageSelectErr]);

  const selectedPackages = useAppSelector(
    (state) => state.auth.selectedPackages || [],
  );
  const {
    data: packagesData,
    error: allProductsFectchingError,
    isLoading: isPackagesLoading,
  } = useGetAllPackagesForOrderQuery([]);
  if (allProductsFectchingError) {
  }

  const allPackagesData = packagesData?.packages || [];

  // const [updatedRoutePointsByVehicle, setUpdatedRoutePointsByVehicle] =
  //   useState<RoutePointsMap>({});

  const [pendingRoutePointsByVehicle, setPendingRoutePointsByVehicle] =
    useState<RoutePointsMap>({});

  const [routeUpdateDialogOpen, setRouteUpdateDialogOpen] = useState(false);

  const [actionType, setActionType] = useState<"draft" | "confirm" | null>(
    null,
  );
  const handleCreateOrder = async () => {
    const createOrderBody = {
      scenario_label: conformOrderPayload?.message,
      total_cost: conformOrderPayload?.totalCost,
      allocations: conformOrderPayload?.allocations.map((vehicle) => ({
        ...vehicle,
        sampledRoutePoints:
          updatedRoutePointsByVehicle[vehicle.vehicle_ID] ||
          vehicle.sampledRoutePoints ||
          [],
      })),
      unallocated_packages: conformOrderPayload?.unallocatedPackages,
      created_at: new Date().toISOString().split("T")[0],
      // order_docs: additionalDocs,
    };

    setModalOpen(false);
    try {
      const response = await createOrder(createOrderBody).unwrap();
      if (response) {
        const orderIds = response.created_orders
          .map((order: { order_ID: string }) => order.order_ID)
          .join(", ");
        setSnackbarMessage(`Order ID ${orderIds} created successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setActiveStep(0);
        dispatch(setSelectedPackages([]));
        dispatch(setSelectedTrucks([]));
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        if (
          error.data.message ===
          "Some packages are already confirmed in an existing order."
        ) {
          setSnackbarMessage(
            `Some packages are already confirmed in an existing order, Please check`,
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    }
  };
  const handleSaveDraftOrder = async () => {
    const createOrderBody = {
      scenario_label: "Best Combinational Scenario route draft",
      total_cost: conformOrderPayload?.totalCost,
      allocations: conformOrderPayload?.allocations.map((vehicle) => ({
        ...vehicle,
        sampledRoutePoints:
          updatedRoutePointsByVehicle[vehicle.vehicle_ID] ||
          vehicle.sampledRoutePoints ||
          [],
      })),
      unallocated_packages: conformOrderPayload?.unallocatedPackages,
      created_at: new Date().toISOString().split("T")[0],
      // order_docs: additionalDocs,
    };

    setModalOpen(false);
    try {
      const response = await saveDraftOrder(createOrderBody).unwrap();
      if (response) {
        // const orderIds = response.created_orders
        //   .map((order: { order_ID: string }) => order.order_ID)
        //   .join(", ");
        setSnackbarMessage(`Draft saved successfully!`);
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setActiveStep(0);
        dispatch(setSelectedPackages([]));
        dispatch(setSelectedTrucks([]));
      }
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof error.data === "object" &&
        error.data !== null &&
        "message" in error.data &&
        typeof error.data.message === "string"
      ) {
        if (
          error.data.message ===
          "Some packages are already confirmed in an existing order."
        ) {
          setSnackbarMessage(
            `Some packages are already confirmed in an existing order, Please check`,
          );
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        }
      }
    }
  };

  const handleSelectTruck = async () => {
    if (activeStep === 0) {
      const packagesIDArray = selectedPackages.map((item) => item.pack_ID);
      const body = {
        packages: packagesIDArray,
        filters,
      };

      const response = await selectTheTrucks(body).unwrap();
      if (response) {
        if (
          response?.message ===
          "No suitable vehicles found for these package(s). Possibly special conditions or capacity mismatch."
        ) {
          setNoVechilePopup(true);
        } else if (response?.message === "No suitable vehicles found") {
          setSnackbarOpen(true);
          setSnackbarMessage(`No suitable vehicles found`);
        } else {
          setConformOrderPayload(response);
          setSelectTrucks(response?.allocations);
          //   setUnAllocatedPackages(response?.unallocatedPackages);
          setActiveStep(1);
        }
      }
    } else {
      setActiveStep(1);
    }
  };

  return (
    <Grid sx={{ width: "100%", p: 3 }}>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={confirmOrderLoading || truckSelectionLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <SnackbarAlert
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
      {modalOpen && (
        <Dialog open={modalOpen} onClose={() => setModalOpen(false)}>
          <DialogTitle>Proceed for order </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to create the order ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <CustomButtonFilled onClick={handleCreateOrder}>
              Confirm
            </CustomButtonFilled>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={routeUpdateDialogOpen}
        onClose={() => setRouteUpdateDialogOpen(false)}
      >
        <DialogTitle>Update Route</DialogTitle>

        <DialogContent>
          <Typography>
            Route has changed based on the selected optimization metrics (Avoid
            Tolls / Avoid Highways / Weather). Do you want to update the current
            route points?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => {
              setRouteUpdateDialogOpen(false);

              if (actionType === "draft") {
                handleSaveDraftOrder();
              } else {
                handleCreateOrder();
              }
            }}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={() => {
              setUpdatedRoutePointsByVehicle(pendingRoutePointsByVehicle);

              setRouteUpdateDialogOpen(false);

              setTimeout(() => {
                if (actionType === "draft") {
                  handleSaveDraftOrder();
                } else {
                  handleCreateOrder();
                }
              }, 100);
            }}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>

      {noVechilePopup && (
        <Dialog open={noVechilePopup} onClose={() => setNoVechilePopup(false)}>
          <DialogTitle sx={{ color: "red" }}>Alert !!!</DialogTitle>
          <DialogContent>
            <Typography>
              Currently, there are no vehicles to send these packages{" "}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setNoVechilePopup(false)}
              color="secondary"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Grid sx={{ px: 2, mt: 2 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Route Optimizer
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", mb: 2 }}>
          This flow helps you create a shipment order by selecting packages,
          optimizing vehicle and route allocation, and reviewing the final
          details. Start by selecting packages with the same pickup location and
          date.
        </Typography>
      </Grid>

      <Grid
        sx={{
          width: "100%",
          overflowX: isMobile ? "auto" : "visible",
          padding: "10px",
        }}
      ></Grid>

      <div>
        {activeStep === 0 && (
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>
              Select packages
            </Typography>
            <PackagesTable
              allPackagesData={allPackagesData}
              isPackagesLoading={isPackagesLoading}
            />
          </div>
        )}

        {activeStep === 1 && (
          <RootOptimization
            // trucks={selectTrucks}
            rootOptimization={selectTrucks as unknown as RootOptimizationType[]}
            // onUpdateSampledPoints={(vehicle_ID, points) => {
            //   setUpdatedRoutePointsByVehicle((prev) => ({
            //     ...prev,
            //     [vehicle_ID]: points,
            //   }));
            // }}
            onUpdateSampledPoints={(vehicle_ID, points) => {
              setPendingRoutePointsByVehicle((prev) => ({
                ...prev,
                [vehicle_ID]: points,
              }));
            }}
            // selectedPackages={selectedPackages}
            onBack={() => setActiveStep(0)}
            // onSaveDraft={handleSaveDraftOrder}
            onSaveDraft={() => {
              setActionType("draft");
              setRouteUpdateDialogOpen(true);
            }}
            // onConfirmOrder={handleCreateOrder}
            onConfirmOrder={() => {
              setActionType("confirm");
              setRouteUpdateDialogOpen(true);
            }}
          />
        )}
      </div>
      {activeStep === 0 && (
        <div className={styles.buttonsContainer}>
          <CustomButtonFilled onClick={handleSelectTruck}>
            Next
          </CustomButtonFilled>
        </div>
      )}
    </Grid>
  );
};

export default withAuthComponent(RouteOptimizer);
