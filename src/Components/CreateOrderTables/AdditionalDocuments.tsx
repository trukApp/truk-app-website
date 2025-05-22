import React, { useState } from "react";
import { Grid, Typography, TextField,   FormLabel, Dialog, IconButton } from "@mui/material";
import { useImageUploadingMutation } from "@/api/apiSlice";
import AttachFileIcon from "@mui/icons-material/AttachFile";
interface AdditionalDocumentsProps {
  documents: { [key: string]: string }[];
  setDocuments: React.Dispatch<React.SetStateAction<{ [key: string]: string }[]>>;
}

interface DocumentField {
  label: string;
  key: string;
}

const documentFields: DocumentField[] = [
  { label: "Dangerous Goods", key: "dangerousGoods" },
  { label: "Lorry Receipt", key: "lorryReceipt" },
  { label: "E-Way Bill", key: "ewayBill" },
  { label: "MSDS", key: "msds" },
];

const AdditionalDocuments: React.FC<AdditionalDocumentsProps> = ({ documents, setDocuments }) => {
  const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File | null }>({});
  const [openPreview, setOpenPreview] = useState<{ url: string; open: boolean }>({
    url: "",
    open: false,
  });

  const [imageUpload] = useImageUploadingMutation();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>, key: string) => {
    const file = event.target.files?.[0] || null;
    if (!file) return;

    setSelectedFiles((prev) => ({ ...prev, [key]: file }));

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await imageUpload(formData).unwrap();
      if (response?.imageUrl) {
        setDocuments((prev) => [
          ...prev.filter((doc) => !doc.hasOwnProperty(key)),
          { [key]: response.imageUrl },
        ]);
      }
    } catch (error) {
      console.error("File upload failed:", error);
    }
  };

  const getImageUrl = (key: string) => {
    const doc = documents.find((doc) => doc.hasOwnProperty(key));
    return doc ? doc[key] : undefined;
  };

  return (
    <Grid container spacing={2}  >
      <Dialog
        open={openPreview.open}
        onClose={() => setOpenPreview({ url: "", open: false })}
        fullWidth
        maxWidth="md"
      >
        <embed
          src={openPreview.url}
          type="application/pdf"
          width="100%"
          height="600px"
          style={{ border: "none" }}
        />
      </Dialog>

      <Grid item xs={12}>
        <Typography variant="h6" color="primary" fontWeight="bold">
          Upload Additional Documents (pdf format only)
        </Typography>
      </Grid>

      {documentFields.map((field) => {
        const url = getImageUrl(field.key);

        return (
          <Grid item xs={12} md={3} key={field.key}>
            <FormLabel>{field.label}</FormLabel>
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              value={selectedFiles[field.key]?.name || ""}
              placeholder="Choose a file"
              InputProps={{
                readOnly: true,
                // endAdornment: (
                //   <Button
                //     variant="contained"
                //     component="label"
                //     sx={{
                //       minWidth: "auto",
                //       margin: 0,
                //       marginRight: "-12px",
                //       height: "100%",
                //       color: "#fff",
                //     }}
                //   >
                //     Browse
                //     <input
                //       type="file"
                //       hidden
                //       accept="image/*,application/pdf"
                //       onChange={(e) => handleFileChange(e, field.key)}
                //     />
                //   </Button>
                  // ),
                  endAdornment: (
                    <IconButton
                        component="label"
                        sx={{
                        padding: 0,
                        marginRight: "-12px",
                        height: "100%",
                        color: "#F08C24"
                        }}
                    >
                        <AttachFileIcon />
                        <input
                        type="file"
                        hidden
                        accept="image/*,application/pdf"
                        onChange={(e) => handleFileChange(e, field.key)}
                        />
                    </IconButton>
                )

              }}
            />
            {url && (
              <div style={{ marginTop: 8 }}>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpenPreview({ url, open: true })}
                >
                  <embed
                    src={url}
                    type="application/pdf"
                    width="100%"
                    height="150px"
                    style={{ borderRadius: 4, border: "1px solid #ccc" }}
                  />
                  <Typography variant="caption" color="primary">
                    Click to view full screen
                  </Typography>
                </div>
              </div>
            )}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default AdditionalDocuments;
