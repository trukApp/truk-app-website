import React, { useState } from 'react';
import Papa from 'papaparse';
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Link,
  Modal,
  Typography,
  useTheme,
} from '@mui/material';
import { DropzoneArea } from 'mui-file-dropzone';
import SnackbarAlert from '../ReusableComponents/SnackbarAlerts';
type Props = {
	onUploadComplete?: (values: string[]) => void;
	// editPro?: string[]
};

const CarrierProNumbers: React.FC<Props> = ({ onUploadComplete,editPro }) => {
	const theme = useTheme();

	 
	const [snackbarOpen, setSnackbarOpen] = useState(false);
	const [snackbarMessage, setSnackbarMessage] = useState("");
	const [snackbarSeverity, setSnackbarSeverity] = useState("success");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [message, setMessage] = useState("");

	// ⬇ CSV Template Downloader
const handleDownloadTemplate = () => {
	const header = ["Carrier Pro numbers"];

	const defaultRows = Array.from({ length: 20 }, () => [""]); // 20 empty rows

	const editRows = editPro?.length
		? editPro?.map((val: string) => [val]) // convert to 2D array
		: defaultRows;

	const csvContent = [header, ...editRows]
		.map((row) => row.join(","))
		.join("\n");

	const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
	const link = document.createElement("a");
	link.href = URL.createObjectURL(blob);
	link.setAttribute("download", "carrier-pro-numbers.csv");
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
};

	// ⬇ Upload and Parse
	const handleUpload = () => {
		if (!file) {
			setMessage("Please select a file.");
			return;
		}

		setIsUploading(true);
		Papa.parse(file, {
			header: true,
			skipEmptyLines: true,
			complete: (results) => {
				const data = results.data as { [key: string]: string }[];
				const columnValues = data.map((row) => Object.values(row)[0]); 
				if (onUploadComplete) {
					onUploadComplete(columnValues);
				}
				// setMessage("Upload successful!");
				setSnackbarMessage("CSV uploaded and parsed successfully");
				setSnackbarSeverity("success");
				setSnackbarOpen(true);
				setFile(null);
				setIsModalOpen(false);
				setIsUploading(false);
			},
			error: () => {
				setMessage("Error parsing CSV");
				setSnackbarMessage("Failed to parse CSV");
				setSnackbarSeverity("error");
				setSnackbarOpen(true);
				setIsUploading(false);
			},
		});
	};

	return (
		<Box>
			<SnackbarAlert
				open={snackbarOpen}
				message={snackbarMessage}
				onClose={() => setSnackbarOpen(false)}
			/>

			<Button variant="contained" onClick={() => setIsModalOpen(true)}>
			 Upload Carrier pro numbers
			</Button>

			<Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
				<Box
					sx={{
						position: "absolute",
						top: "50%",
						left: "50%",
						transform: "translate(-50%, -50%)",
						width: "90%",
						maxWidth: "400px",
						bgcolor: "background.paper",
						p: 4,
						borderRadius: theme.shape.borderRadius,
					}}
				>
					<Typography variant="h6">Mass Upload</Typography>

					<Typography sx={{ mt: 2 }}>
						Step 1: Download the template 👇
					</Typography>
					<Link component="button" onClick={handleDownloadTemplate}>
						Download CSV Template
					</Link>

					<Typography sx={{ mt: 2 }}>Step 2: Upload your CSV file.</Typography>
					<DropzoneArea
						fileObjects={[]}
						acceptedFiles={[".csv"]}
						showAlerts={false}
						filesLimit={1}
						onChange={(files) => setFile(files[0] || null)}
						dropzoneText="Drag and drop a CSV file here or click"
					/>

					{file && (
						<Typography sx={{ mt: 2 }}>
							Selected file:{" "}
							<span style={{ color: "#4766ff", fontWeight: "bold" }}>
								{file.name}
							</span>
						</Typography>
					)}

					<Box sx={{ mt: 3, display: "flex", gap: 2 }}>
						<Button variant="outlined" onClick={() => setFile(null)} fullWidth>
							Cancel
						</Button>
						<Button
							variant="contained"
							color="primary"
							onClick={handleUpload}
							disabled={isUploading}
							fullWidth
						>
							{isUploading ? "Uploading..." : "Upload"}
						</Button>
					</Box>

					{message && (
						<Typography
							sx={{
								mt: 2,
								color: message.includes("successful") ? "green" : "red",
							}}
						>
							{message}
						</Typography>
					)}
				</Box>
			</Modal>
		</Box>
	);
};

export default CarrierProNumbers;