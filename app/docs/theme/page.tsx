import ThemeSwitcher from "@/components/ThemeSwitcher";
import React from "react";

const Theme = () => {
  return (
    <div className="w-full min-h-full flex flex-col items-start justify-start">
      <h1 className="text-4xl font-bold mt-5">Theme</h1>
      <p className="text-gray-500 mt-2">
        This is the theme documentation. Here you can find information about how to customize the theme, supported themes, and best practices for theming your application.
      </p>
      <ThemeSwitcher size="lg" />
    </div>
  );
};

export default Theme;
