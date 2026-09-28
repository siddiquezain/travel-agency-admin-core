import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Vijayawada | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Vijayawada with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function VijayawadaPage() {
  return (
    <UmrahClient
      city="Vijayawada"
      airport="Vijayawada International Airport (VGA)"
    />
  );
}