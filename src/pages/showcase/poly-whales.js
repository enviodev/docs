import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "poly-whales");
  return <ShowcaseDetail site={site} />;
}
