// "use client";

// import React from "react";

// import { Chip } from "@mui/material";

// interface Props {
//   idleTime: number;
// }

// export default function IdleChip({ idleTime }: Props) {
//   const getColor = () => {
//     if (idleTime === 0) return "#22c55e";
//     if (idleTime <= 15) return "#F08C24";
//     return "#ef4444";
//   };

//   const getLabel = () => {
//     if (idleTime === 0) return "Running";
//     return `${idleTime} mins`;
//   };

//   return (
//     <Chip
//       label={getLabel()}
//       size="small"
//       sx={{
//         bgcolor: getColor(),
//         color: "#fff",
//         fontWeight: 700,
//         minWidth: 90,
//       }}
//     />
//   );
// }

"use client";

import React from "react";
import { Chip } from "@mui/material";

interface Props {
  idleTime: number;
}

export default function IdleChip({ idleTime }: Props) {
  // API returns milliseconds
  const minutes = Math.floor(idleTime / 60000);

  const getColor = () => {
    if (minutes === 0) return "#22C55E";

    if (minutes < 15) return "#F59E0B";

    return "#EF4444";
  };

  const getLabel = () => {
    if (minutes === 0) {
      return "0 min";
    }

    if (minutes < 60) {
      return `${minutes} min`;
    }

    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;

    return `${hrs}h ${mins}m`;
  };

  return (
    <Chip
      size="small"
      label={getLabel()}
      sx={{
        bgcolor: getColor(),
        color: "#fff",
        fontWeight: 700,
        minWidth: 90,
      }}
    />
  );
}
