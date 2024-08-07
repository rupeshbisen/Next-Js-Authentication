"use client";

import { PulseLoader } from "react-spinners";

interface loderProps {
  text: string
  color: string
  loading: boolean
  size?: number
}
export default function ComponentLevelLoader(loderProps: loderProps) {
  return (
    <span className="flex gap-1 items-center">
      {loderProps.text}
      <PulseLoader
        color={loderProps.color}
        loading={loderProps.loading}
        size={loderProps.size || 10}
        data-testid="loader"
      />
    </span>
  );
}