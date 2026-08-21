import React from "react";
import MDXComponents from "@theme-original/MDXComponents";
import HyperSyncChainCount, {
  HyperSyncChainCountPlain,
} from "@site/src/components/HyperSyncChainCount";
import MarkdownTable from "@site/src/components/MarkdownTable";

export default {
  ...MDXComponents,
  table: MarkdownTable,
  HyperSyncChainCount,
  HyperSyncChainCountPlain,
};
