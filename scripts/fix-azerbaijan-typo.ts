// One-off DB cleanup: rename the misspelled "Azherbaijan" visa rows.
// Run inside the app container:
//   docker compose exec app npx tsx scripts/fix-azerbaijan-typo.ts
import { prisma } from "../src/lib/prisma";

const slugMap: Record<string, string> = {
  "azherbaijan-urgent-e-visa": "azerbaijan-urgent-e-visa",
  "azherbaijan-standard-e-visa": "azerbaijan-standard-e-visa",
};

async function main() {
  for (const [oldSlug, newSlug] of Object.entries(slugMap)) {
    const row = await prisma.visa.findUnique({ where: { slug: oldSlug } });
    if (!row) {
      console.log(`skip: no visa with slug "${oldSlug}"`);
      continue;
    }
    const newCountry = row.country?.replace(/Azherbaijan/gi, "Azerbaijan") ?? row.country;
    await prisma.visa.update({
      where: { id: row.id },
      data: { slug: newSlug, country: newCountry },
    });
    console.log(`updated: ${oldSlug} -> ${newSlug} (country: ${row.country} -> ${newCountry})`);
  }
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
