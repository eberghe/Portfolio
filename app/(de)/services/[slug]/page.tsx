import ServiceDetail from '@/components/services/ServiceDetail';
import { findService, serviceMetadata, serviceStaticParams } from '@/lib/pages/services';

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = serviceStaticParams;

export async function generateMetadata({ params }: Props) {
  return serviceMetadata((await params).slug, 'de');
}

export default async function ServicePage({ params }: Props) {
  return <ServiceDetail service={findService((await params).slug)} locale="de" />;
}
