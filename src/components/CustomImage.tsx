import Image from "next/image";
import React from "react";

const CustomImage = ({ image }: { image: string | undefined }) => {
  return (
    <Image
      className="h-14 w-14 rounded-full p-1 ring-2 ring-gray-300 dark:ring-gray-500"
      src={image || ""}
      alt="Bordered avatar"
      width={56}
      height={56}
    />
  );
};

export default CustomImage;
