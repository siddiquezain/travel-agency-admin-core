import React from "react";
import { prisma } from "@/lib/prisma";
import { ToursTable } from "@/modules/tours/ToursTable";

export default async function ToursPage() {
    const tours = await prisma.tour.findMany({ orderBy: { createdAt: "desc" } });
    return <ToursTable initialTours={tours} />;
}
