/* eslint-disable @typescript-eslint/no-explicit-any */
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
  Box,
} from "@mui/material";
import PackagesTable, {
  Package,
} from "@/Components/EditDraftOrderTables/PackagesTable";
import TrucksTable, {
  Truck,
} from "@/Components/EditDraftOrderTables/TrucksTable";
import RootOptimization, {
  RootOptimizationType,
} from "@/Components/EditDraftOrderTables/RootOptimization";
import LoadOptimization from "@/Components/EditDraftOrderTables/LoadOptimization";
import { useAppDispatch, useAppSelector } from "@/store";
import styles from "./createorder.module.css";
import { withAuthComponent } from "@/Components/WithAuthComponent";
import {
  useGetAllPackagesForOrderQuery,
  useSelectTheProductsMutation,
  // useConfomOrderMutation,
  useConfirmDraftMutation,
  useGetOrderByIdQuery,
  useUpdateDraftMutation,
} from "@/api/apiSlice";
import ReviewCreateOrder from "@/Components/EditDraftOrderTables/ReviewOrder";
import SnackbarAlert from "@/Components/ReusableComponents/SnackbarAlerts";
import {
  CustomButtonFilled,
  CustomButtonOutlined,
} from "@/Components/ReusableComponents/ButtonsComponent";
import { setSelectedTrucks, setEditDraftPackages } from "@/store/authSlice";
// import { useMediaQuery, useTheme } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

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
const EditDraft: React.FC = () => {
  const router = useRouter();
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId") || "";
  const orderId = draftId.replace(/^DF/, "");
  const { data: orderDetails } = useGetOrderByIdQuery({ orderId });
  const selectedPackages = useAppSelector(
    (state) => state.auth.editDraftPackages || [],
  );
  const {
    data: packagesData,
    error: allProductsFectchingError,
    isLoading: isPackagesLoading,
  } = useGetAllPackagesForOrderQuery([]);
  if (allProductsFectchingError) {
  }
  const allPackagesData = packagesData?.packages || [];
  const [draftPackageIds, setDraftPackageIds] = useState<string[]>([]);

  useEffect(() => {
    if (
      orderDetails?.order?.allocations?.length &&
      allPackagesData.length > 0
    ) {
      const packageIds = orderDetails.order.allocations.flatMap(
        (allocation: any) => allocation.packages || [],
      );
      setDraftPackageIds(packageIds);
      const selectedPackages = allPackagesData.filter((pkg: Package) =>
        packageIds.includes(pkg.pack_ID),
      );

      dispatch(setEditDraftPackages(selectedPackages));
    }
  }, [orderDetails, allPackagesData]);

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
  const [updateDraft, { isLoading: updateDraftLoading }] =
    useUpdateDraftMutation();
  const [confirmDraft, { isLoading: confirmDraftLoading }] =
    useConfirmDraftMutation();
  const [selectTrucks, setSelectTrucks] = useState<Truck[]>([]);
  const [unAllocatedPackages, setUnAllocatedPackages] = useState<[]>([]);
  const [conformOrderPayload, setConformOrderPayload] =
    useState<ConfirmPayload>({
      message: "",
      totalCost: 0,
      allocations: [],
      unallocatedPackages: [],
    });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalOpenConfirm, setModalOpenConfirm] = useState(false);
  const [noVechilePopup, setNoVechilePopup] = useState(false);
  const filters = useAppSelector((state) => state.auth.filters);
  const [additionalDocs, setAdditionalDocs] = useState<
    { [key: string]: string }[]
  >([]);
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

  const loadOptimizationEnabled =
    orderDetails?.order?.scenario_label ===
    "Best Combinational Scenario load draft";
  const steps = loadOptimizationEnabled
    ? [
        "Select Packages",
        "Vehicle Optimization",
        "Load Optimization",
        "Review Order",
      ]
    : ["Select Packages", "Route Optimization", "Review Order"];
  const handleUpdateDraft = async () => {
    const updateDraftBody = {
      scenario_label: orderDetails?.order?.scenario_label,
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
      order_docs: additionalDocs,
    };

    setModalOpen(false);
    try {
      // const response = await updateDraft(updateDraftBody).unwrap();
      const response = await updateDraft({
        order_ID: orderId,
        body: updateDraftBody,
      }).unwrap();
      console.log(response);
      if (response) {
        console.log(response);
        setSnackbarMessage(
          `Draft ID DF${response.order_ID} updated successfully!`,
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setActiveStep(0);
        dispatch(setSelectedTrucks([]));
        dispatch(setEditDraftPackages([]));
        router.push("/order-overview");
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

  const handleConfirmDraft = async () => {
    const confirmDraftBody = {
      order_ID: orderId,
    };

    setModalOpenConfirm(false);
    try {
      const response = await confirmDraft({
        order_ID: orderId,
        body: confirmDraftBody,
      }).unwrap();
      console.log(response);
      if (response) {
        console.log(response);
        setSnackbarMessage(
          `Draft ID DF${response.order_ID} confirmed successfully!`,
        );
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
        setActiveStep(0);
        dispatch(setSelectedTrucks([]));
        dispatch(setEditDraftPackages([]));
        router.push("/order-overview");
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
        draft_order_ID: orderId,
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
          setUnAllocatedPackages(response?.unallocatedPackages);
          setActiveStep((prev) => prev + 1);
        }
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };
  // const CustomStepIcon = (props: StepIconProps) => {
  //   const { active, completed, icon } = props;
  //   return (
  //     <Box
  //       sx={{
  //         width: 25,
  //         height: 25,
  //         display: "flex",
  //         alignItems: "center",
  //         justifyContent: "center",
  //         borderRadius: "50%",
  //         backgroundColor: completed ? "#F08C24" : active ? "#F08C24" : "#ccc",
  //         color: "white",
  //         fontWeight: "bold",
  //       }}
  //     >
  //       {completed ? (
  //         <Typography variant="body2" sx={{ fontSize: 15, fontWeight: "bold" }}>
  //           ✔
  //         </Typography>
  //       ) : (
  //         <Typography variant="body2">{icon}</Typography>
  //       )}
  //     </Box>
  //   );
  // };

  return (
    <Box sx={{ width: "100%", p: 3 }}>
      <Backdrop
        sx={{
          color: "#ffffff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
        open={
          updateDraftLoading || truckSelectionLoading || confirmDraftLoading
        }
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
          <DialogTitle>Proceed to Update </DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to update the draft ?</Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setModalOpen(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <CustomButtonFilled onClick={handleUpdateDraft}>
              Update
            </CustomButtonFilled>
          </DialogActions>
        </Dialog>
      )}

      {modalOpenConfirm && (
        <Dialog
          open={modalOpenConfirm}
          onClose={() => setModalOpenConfirm(false)}
        >
          <DialogTitle>Proceed to Confirm </DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to confirm the draft ?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setModalOpenConfirm(false)}
              color="secondary"
            >
              Cancel
            </Button>
            <CustomButtonFilled onClick={handleConfirmDraft}>
              Confirm
            </CustomButtonFilled>
          </DialogActions>
        </Dialog>
      )}

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
      <Box sx={{ px: 2, mt: 2 }}>
        <Typography
          variant="h5"
          color="primary"
          sx={{ fontWeight: "bold", mb: 1 }}
        >
          Update Draft Order - DF{orderId}
        </Typography>
        <Typography variant="body1" sx={{ color: "gray", mb: 2 }}>
          This flow helps you create a shipment order by selecting packages,
          optimizing vehicle and route allocation, and reviewing the final
          details. Start by selecting packages with the same pickup location and
          date.
        </Typography>
      </Box>

      {/* <Box
        sx={{
          width: "100%",
          overflowX: isMobile ? "auto" : "visible",
          padding: "10px",
        }}
      >
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            flexWrap: "nowrap",
            "& .MuiStepConnector-line": {
              borderWidth: "1px",
            },
          }}
        >
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel StepIconComponent={CustomStepIcon}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: activeStep === index ? "#F08C24" : "#333",
                    fontWeight: activeStep === index ? "bold" : "400",
                    whiteSpace: "nowrap",
                  }}
                >
                  {label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box> */}

      {/* <div>
        {activeStep === 0 && (
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>
              Select packages
            </Typography>
            <PackagesTable
              allPackagesData={allPackagesData}
              isPackagesLoading={isPackagesLoading}
              isEditMode={true}
              draftPackageIds={draftPackageIds || []}
            />
          </div>
        )}

        {activeStep === 1 && (
          <div>
            <TrucksTable
              selectedPackages={selectedPackages}
              trucks={selectTrucks}
              unAllocatedPackages={unAllocatedPackages}
            />
          </div>
        )}

        {activeStep === 2 && (
          <div>
            <RootOptimization
              rootOptimization={
                selectTrucks as unknown as RootOptimizationType[]
              }
              onUpdateSampledPoints={(vehicle_ID, points) => {
                setUpdatedRoutePointsByVehicle((prev) => ({
                  ...prev,
                  [vehicle_ID]: points,
                }));
              }}
            />
          </div>
        )}

        {activeStep === 3 && (
          <div>
            <LoadOptimization
              trucks={selectTrucks}
              selectedPackages={selectedPackages}
            />
          </div>
        )}

        {activeStep === 4 && (
          <div>
            <ReviewCreateOrder
              trucks={selectTrucks}
              additionalDocs={additionalDocs}
              setAdditionalDocs={setAdditionalDocs}
            />
          </div>
        )}
      </div> */}
      <div>
        {activeStep === 0 && (
          <div>
            <Typography variant="h6" sx={{ fontWeight: 600, marginTop: 2 }}>
              Select packages
            </Typography>

            <PackagesTable
              allPackagesData={allPackagesData}
              isPackagesLoading={isPackagesLoading}
              isEditMode={true}
              draftPackageIds={draftPackageIds || []}
            />
          </div>
        )}

        {/* STEP 1 */}
        {activeStep === 1 && (
          <div>
            {loadOptimizationEnabled ? (
              <TrucksTable
                selectedPackages={selectedPackages}
                trucks={selectTrucks}
                unAllocatedPackages={unAllocatedPackages}
              />
            ) : (
              <RootOptimization
                rootOptimization={
                  selectTrucks as unknown as RootOptimizationType[]
                }
                onUpdateSampledPoints={(vehicle_ID, points) => {
                  setUpdatedRoutePointsByVehicle((prev) => ({
                    ...prev,
                    [vehicle_ID]: points,
                  }));
                }}
              />
            )}
          </div>
        )}

        {/* STEP 2 */}
        {activeStep === 2 && (
          <div>
            {loadOptimizationEnabled ? (
              <LoadOptimization
                trucks={selectTrucks}
                selectedPackages={selectedPackages}
              />
            ) : (
              <ReviewCreateOrder
                trucks={selectTrucks}
                additionalDocs={additionalDocs}
                setAdditionalDocs={setAdditionalDocs}
              />
            )}
          </div>
        )}

        {/* STEP 3 - ONLY FOR LOAD OPTIMIZATION FLOW */}
        {loadOptimizationEnabled && activeStep === 3 && (
          <div>
            <ReviewCreateOrder
              trucks={selectTrucks}
              additionalDocs={additionalDocs}
              setAdditionalDocs={setAdditionalDocs}
            />
          </div>
        )}
      </div>
      {/* <div className={styles.buttonsContainer}>
        {activeStep === 0 ? null : (
          <CustomButtonOutlined
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </CustomButtonOutlined>
        )}
        {activeStep === 4 ? (
          <>
            <CustomButtonFilled onClick={() => setModalOpen(true)}>
              Update draft
            </CustomButtonFilled>
            <CustomButtonFilled onClick={() => handleConfirmDraft()}>
              Confirm Order
            </CustomButtonFilled>
          </>
        ) : (
          <CustomButtonFilled onClick={() => handleSelectTruck()}>
            Next
          </CustomButtonFilled>
        )}
      </div> */}
      <div className={styles.buttonsContainer}>
        {activeStep === 0 ? null : (
          <CustomButtonOutlined
            onClick={() => setActiveStep((prev) => prev - 1)}
          >
            Back
          </CustomButtonOutlined>
        )}

        {activeStep === steps.length - 1 ? (
          <>
            <CustomButtonFilled onClick={() => setModalOpen(true)}>
              Update Draft
            </CustomButtonFilled>

            <CustomButtonFilled onClick={() => handleConfirmDraft()}>
              Confirm Order
            </CustomButtonFilled>
          </>
        ) : (
          <CustomButtonFilled onClick={() => handleSelectTruck()}>
            Next
          </CustomButtonFilled>
        )}
      </div>
    </Box>
  );
};

export default withAuthComponent(EditDraft);
