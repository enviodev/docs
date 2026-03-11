import { sites } from "./_data";
import ShowcaseDetail from "./_detail";

export default function Page() {
  const site = sites.find((s) => s.slug === "solana-stables");
  return <ShowcaseDetail site={site} />;
}
