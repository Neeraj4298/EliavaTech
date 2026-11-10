"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import type { ChatWidgetProps } from "./ChatWidget";

const DynamicChatWidget = dynamic(
  () => import("./ChatWidget").then((mod) => mod.ChatWidget),
  {
    ssr: false,
  }
);

/**
 * Code-splits `ChatWidget` out of the initial page JS bundle.
 */
export function LazyChatWidget(props: ChatWidgetProps) {
  return <DynamicChatWidget {...props} />;
}

export default LazyChatWidget;
