import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

/* renvoie un tableau prêt pour <Breadcrumb items={...}> */
export const useBreadcrumbBoats = () => {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const items = [{ label: 'Accueil', href: '/' }]; // première maille

    /* 1 - port */
    const port = searchParams.get('port');
    if (port) items.push({ label: `Port : ${port}`, href: `?port=${port}` });

    /* 2 - type */
    const type = searchParams.get('type');
    if (type) items.push({ label: `Type : ${type}`, href: `?type=${type}` });

    /* 3 - capacité */
    const capacity = searchParams.get('capacity');
    if (capacity) items.push({ label: `Capacité : ${capacity} pers.`, href: `?capacity=${capacity}` });

    /* 4 - prix */
    const price = searchParams.get('price');
    if (price) items.push({ label: `Prix ≤ ${price} €`, href: `?price=${price}` });

    /* 5 - longueur */
    const length = searchParams.get('length');
    if (length) items.push({ label: `Longueur ≤ ${length} m`, href: `?length=${length}` });

    /* 6 - recherche libre */
    const search = searchParams.get('search');
    if (search) items.push({ label: `Recherche : ${search}`, href: `?search=${search}` });

    /* dernière maille = page courante (non cliquable) */
    items.push({ label: 'Bateaux' });

    return items;
  }, [searchParams]);
};