import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Delhi | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Delhi with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function DelhiPage() {
  return (
    <UmrahClient
      city="Delhi"
      airport="Indira Gandhi International Airport (DEL)"
    />
  );
}