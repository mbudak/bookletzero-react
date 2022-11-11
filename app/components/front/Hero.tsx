import { Link } from "@remix-run/react";
// import { useTranslation } from "react-i18next";
import HeroImage from "~/assets/img/hero.webp";

import Header from "./Header";

export default function Hero() {
  // const { t } = useTranslation();
  return (
    <div className="relative">
      <Header />

      <section className="bg-white dark:bg-gray-900">
    <div className="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
        <div className="mr-auto place-self-center lg:col-span-7">
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              Power your knowledge with PDF exam booklets, easily
            </h1>
            <p className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400">
              BookletZero helps to generate exam booklets for students, teacher & content generators.
            </p>
            
            
            <a href="/register"
                      target="_self"
                      rel="noreferrer" className="mx-2 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-100 border border-red-500 rounded-lg hover:bg-red-600 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800 bg-red-500">
                Free Registration
            </a> 
            <a href="/learn"
                      target="_self"
                      rel="noreferrer" className="mx-2 inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Learn List
            </a> 

        </div>
        <div className="hidden lg:mt-0 lg:col-span-5 lg:flex">            
            <img src={HeroImage} className="h-fit" alt="BookletZero Hero Image"/>
        </div>                
    </div>
</section>
</div>

  );
}