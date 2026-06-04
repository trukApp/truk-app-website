"use client";

import { Suspense } from "react";
import AutoReply from "./AutoReply";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AutoReply />
    </Suspense>
  );
}
