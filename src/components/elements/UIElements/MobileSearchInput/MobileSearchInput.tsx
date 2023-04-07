import { useRouter } from "next/router";
import { useState } from "react";
import { BiSearchAlt } from "react-icons/bi";

export function MobileSearchInput({ className }: any) {
  const router = useRouter();

  const [mobileQuery, setMobileQuery] = useState<string>("");

  const navigateToLink = () => {
    router.push(`/search/${mobileQuery}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      navigateToLink();
    }
  };

  return (
    <div className={`mobile-search relative ${className}`}>
      <input
        type="text"
        value={mobileQuery}
        onChange={(e) => setMobileQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Search for movies"
        className="input-bordered input input-md  w-full"
      />
      {mobileQuery.length > 1 && (
        <BiSearchAlt
          onClick={navigateToLink}
          className="absolute top-4 right-3 text-xl"
        />
      )}
    </div>
  );
}
