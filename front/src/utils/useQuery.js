import { useMemo, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { fetchPorts } from '../services/portServices';
import { fetchBoatTypes } from '../services/boatTypeSevices';

export const useBreadcrumbBoats = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [ports, setPorts] = useState([]);
  const [types, setTypes] = useState([]);

  useEffect(() => {
    fetchPorts().then(setPorts);
    fetchBoatTypes().then(setTypes);
  }, []);

  return useMemo(() => {
    const items = [{ label: 'Accueil', href: '/' }];

    const portId = searchParams.get('port');
    if (portId) {
      const port = ports.find(p => String(p.id) === portId);
      const portLabel = port ? `${port.name} (${port.country})` : `Port : ${portId}`;
      items.push({ label: portLabel, href: `?port=${portId}` });
    }

    const typeId = searchParams.get('type');
    if (typeId) {
      const type = types.find(t => String(t.id) === typeId);
      const typeLabel = type ? type.name : `Type : ${typeId}`;
      items.push({ label: typeLabel, href: `?type=${typeId}` });
    }

    const capacity = searchParams.get('capacity');
    if (capacity) items.push({ label: `Capacité : ${capacity} pers.`, href: `?capacity=${capacity}` });

    const price = searchParams.get('price');
    if (price) items.push({ label: `Prix ≤ ${price} €`, href: `?price=${price}` });

    const length = searchParams.get('length');
    if (length) items.push({ label: `Longueur ≤ ${length} m`, href: `?length=${length}` });

    const search = searchParams.get('search');
    if (search) items.push({ label: `Recherche : ${search}`, href: `?search=${search}` });

    items.push({ label: 'Bateaux' });

    return items;
  }, [location.search, ports, types]);
};
