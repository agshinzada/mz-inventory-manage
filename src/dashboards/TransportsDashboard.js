import { memo } from "react";
import TitleBox from "../components/tools/TitleBox";

function TransportsDashboard() {
  return (
    <div>
      <TitleBox title={"nəqliyyat"} />
    </div>
  );
}

export default memo(TransportsDashboard);
