'use client';
import Image from "next/image";


export default function Loading({  }) {
  return (
    <section className="bg-primary/20 fixed top-0 left-0 h-screen w-screen flex items-center justify-center">
        <Image
            src="/logo.svg"   // lives in /public
            alt="Co Design"
            width={500}       // tweak to suit
            height={300}
            priority          // keep logo crisp
          />
    </section>
  );
}