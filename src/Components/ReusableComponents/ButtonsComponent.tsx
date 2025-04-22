import { Button, ButtonProps } from "@mui/material";
import { FC } from "react";

interface CustomButtonProps extends ButtonProps {
  children: React.ReactNode;
}

// filled buttonn
export const CustomButtonFilled: FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      type="submit"
      variant="contained"
      sx={{
        margin: '10px',
        backgroundColor: "#F08C24",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#fff",
          color: "#F08C24",
        },
      }}
      {...props}
      disableRipple={false}
    >
      {children}
    </Button>
  );
};


// outlined button
export const CustomButtonOutlined: FC<CustomButtonProps> = ({ children, ...props }) => {
  return (
    <Button
      variant="outlined"
      sx={{
        margin: '10px',
        borderColor: "#F08C24",
        color: "#F08C24",
        // "&:hover": {
        //   backgroundColor: "#F08C24",
        //   color: "#fff",
        // },
      }}
      disableRipple={false}
      {...props}
    >
      {children}
    </Button>
  );
};

