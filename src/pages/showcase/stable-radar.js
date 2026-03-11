import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "stable-radar");
  return <ShowcaseDetail site={site} />;
}
