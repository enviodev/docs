import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "chain-density");
  return <ShowcaseDetail site={site} />;
}
