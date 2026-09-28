import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Bangalore | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Bangalore with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function BangalorePage() {
  return (
    <UmrahClient
      city="Bangalore"
      airport="Kempegowda International Airport (BLR)"
    />
  );
}