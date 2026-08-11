import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import HelpButton, { type HelpBlock } from "@/components/HelpButton";

interface PageLayoutProps {
  title: string;
  breadcrumbLabel: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
  helpTitle?: string;
  helpBlocks?: HelpBlock[];
}

const PageLayout = ({ title, breadcrumbLabel, children, actions, helpTitle, helpBlocks }: PageLayoutProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={isMobile ? "px-3 py-3" : "p-6"}>
      {!isMobile && (
        <Breadcrumb className="mb-4">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink>{breadcrumbLabel}</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      )}
      <div className={`flex items-center justify-between ${isMobile ? "mb-3" : "mb-6"}`}>
        <div className="flex items-center gap-1 min-w-0">
          <h1 className={`font-bold text-foreground ${isMobile ? "text-lg" : "text-2xl"}`}>{title}</h1>
          {helpBlocks && helpBlocks.length > 0 && (
            <HelpButton pageTitle={helpTitle || title} blocks={helpBlocks} />
          )}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
};

export default PageLayout;
