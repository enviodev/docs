import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "cryptokitties-genome-visualiser");
  return <ShowcaseDetail site={site} />;
}
