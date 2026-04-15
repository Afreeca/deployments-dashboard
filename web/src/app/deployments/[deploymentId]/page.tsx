import { DeploymentDetailPage } from "@/domains/deployments/pages/deployment-detail/deployment-detail-page";

type DeploymentDetailRouteProps = {
  params: Promise<{
    deploymentId: string;
  }>;
};

export default async function DeploymentDetailRoute({
  params,
}: DeploymentDetailRouteProps) {
  const { deploymentId } = await params;

  return <DeploymentDetailPage deploymentId={deploymentId} />;
}
