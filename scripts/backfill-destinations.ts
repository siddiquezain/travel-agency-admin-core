// Backfill: derive Destinations from existing Tour.country values and link
// each tour to its destination. Idempotent (upsert by slug; only updates a
// tour when its destinationId would change). Skips tours whose country has no
// matching Country master and logs them, so an admin can add the Country and
// re-run safely.
//
// Run inside the app container:
//   docker compose exec app npx tsx scripts/backfill-destinations.ts
import { prisma } from "../src/lib/prisma";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function main() {
  const tours = await prisma.tour.findMany({
    where: { country: { not: null } },
    select: { id: true, country: true, destinationId: true },
  });

  const countries = await prisma.country.findMany({
    select: { id: true, name: true },
  });
  const countryIdByName = new Map(
    countries.map((c) => [c.name.trim().toLowerCase(), c.id]),
  );

  const destIdByCountry = new Map<string, number>(); // country name (lower) -> destination id
  let toursLinked = 0;
  const skipped: Array<{ tourId: number; country: string }> = [];

  for (const t of tours) {
    const cname = (t.country ?? "").trim();
    if (!cname) continue;
    const key = cname.toLowerCase();

    let destId = destIdByCountry.get(key);
    if (destId === undefined) {
      const countryId = countryIdByName.get(key);
      if (!countryId) {
        skipped.push({ tourId: t.id, country: cname });
        continue;
      }
      const dest = await prisma.destination.upsert({
        where: { slug: slugify(cname) },
        update: {},
        create: {
          name: cname,
          slug: slugify(cname),
          countryId,
          isActive: true,
        },
        select: { id: true },
      });
      destId = dest.id;
      destIdByCountry.set(key, destId);
    }

    if (t.destinationId !== destId) {
      await prisma.tour.update({
        where: { id: t.id },
        data: { destinationId: destId },
      });
      toursLinked++;
    }
  }

  console.log(
    `backfill-destinations: destinations touched=${destIdByCountry.size}, tours linked=${toursLinked}, skipped=${skipped.length}`,
  );
  if (skipped.length) {
    console.log("Skipped tours (no matching Country master):");
    for (const s of skipped) console.log(`  tour ${s.tourId} — "${s.country}"`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
