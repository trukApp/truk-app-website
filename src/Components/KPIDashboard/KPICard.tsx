import { Card, CardContent, Typography, Grid } from "@mui/material";

interface KPICardProps {
  title: string;
  value: string | number;
}

const KPICard: React.FC<KPICardProps> = ({ title, value }) => {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        background: "linear-gradient(135deg, #ffffff, #f9fafb)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        transition: "all 0.3s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            fontWeight: 600,
            letterSpacing: 0.5,
            mb: 1,
          }}
        >
          {title}
        </Typography>

        <Grid display="flex" alignItems="center">
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#111827",
            }}
          >
            {value}
          </Typography>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default KPICard;
