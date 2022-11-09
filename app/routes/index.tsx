import Footer from "~/components/front/Footer";
import Landing from "~/components/front/Landing";
import Hero from "~/components/front/Hero";
import Features from "~/components/front/Features";



export default function Index() {
  
  
  return (
    <div className="relative overflow-hidden bg-white dark:bg-gray-900 text-gray-800 dark:text-slate-200 space-y-16">
      
      <Hero />
      <Landing />

      <Features />
      <Footer />
    </div>    
  );
}
