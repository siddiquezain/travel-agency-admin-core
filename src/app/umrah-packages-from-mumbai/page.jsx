import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Mumbai | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Mumbai with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function MumbaiPage() {
  return (
    <UmrahClient
      city="Mumbai"
      airport="Chhatrapati Shivaji Maharaj International Airport (BOM)"
    />
  );
}