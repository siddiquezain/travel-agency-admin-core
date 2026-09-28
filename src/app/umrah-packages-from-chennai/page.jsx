import UmrahClient from "../umrah/UmrahClient";

export const metadata = {
  title: "Umrah Packages from Chennai | Origin Tours & Travels",
  description:
    "Book affordable Umrah packages from Chennai with flights, visa assistance, hotel accommodation, transfers and guided Ziyarah.",
};

export default function ChennaiPage() {
  return (
    <UmrahClient
      city="Chennai"
      airport="Chennai International Airport (MAA)"
    />
  );
}