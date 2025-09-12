import { useLocation } from 'react-router-dom';
import { metaRoutes } from '../../seo/metaRoutes';
import Seo from './Seo';

export default function RouteSeoWrapper() {
  const { pathname } = useLocation();
  const meta = metaRoutes[pathname] || metaRoutes['/404'];
  return <Seo {...meta} />;
}