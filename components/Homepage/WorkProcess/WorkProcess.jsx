'use client';

import WorkProcessMobile from './WorkProcessMobile';
import WorkProcessDesktop from './WorkProcessDesktop';

export default function WorkProcess({ data = {} }) {
  const items = Array.isArray(data?.items) ? data.items : [];

  if (!items.length) return null;

  return (
    <>
      <WorkProcessMobile data={data} items={items} />
      <WorkProcessDesktop data={data} items={items} headerOffset={0} />
    </>
  );
}