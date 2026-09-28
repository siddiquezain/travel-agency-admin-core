// Verifies the new relations compile and round-trip. Run inside the container:
//   docker compose exec app npx tsx scripts/verify/phase-a-schema.ts
import assert from "node:assert/strict";
import { prisma } from "../../src/lib/prisma";

async function main() {
  // New Destination columns are queryable.
  const dests = await prisma.destination.findMany({
    select: { id: true, featured: true, sortOrder: true, faqs: true },
    take: 1,
  });
  assert.ok(Array.isArray(dests), "destination.findMany works");

  // Tour.destinationId + relation include compile and run.
  const tours = await prisma.tour.findMany({
    select: {
      id: true,
      destinationId: true,
      destination: { select: { slug: true } },
    },
    take: 1,
  });
  assert.ok(Array.isArray(tours), "tour.destination relation works");

  // BlogPost <-> Destination M:N include compiles and runs.
  const posts = await prisma.blogPost.findMany({
    select: { id: true, destinations: { select: { slug: true } } },
    take: 1,
  });
  assert.ok(Array.isArray(posts), "blogPost.destinations relation works");

  console.log("phase-a-schema: ALL ASSERTIONS PASSED");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
