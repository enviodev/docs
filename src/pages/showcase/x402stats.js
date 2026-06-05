import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "x402stats");
  return <ShowcaseDetail site={site} />;
}
