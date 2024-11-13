import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

function Content({ children }: Props) {
  return <div className="content">{children}</div>;
}

export default Content;
