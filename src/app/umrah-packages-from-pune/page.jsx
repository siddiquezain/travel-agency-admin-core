import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Pune | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Pune with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function PunePage() {
  return (
    <UmrahClient
      city="Pune"
      airport="Pune International Airport (PNQ)"
    />
  );
}