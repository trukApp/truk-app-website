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
          margin:'10px',
          backgroundColor: "#83214F",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#fff",
          color: "#83214F",
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
          margin:'10px',
        borderColor: "#83214F",
        color: "#83214F",
        // "&:hover": {
        //   backgroundColor: "#83214F",
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

