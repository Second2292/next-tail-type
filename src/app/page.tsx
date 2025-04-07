import Image from "next/image";

export default function Home() {
  return (
    <>
    <h1 className="text-4xl font-bold text-center">Welcome to the Next.js + Prisma Starter</h1>
    <div className="flex justify-center mt-10">
      <Image src="/nextjs.svg" alt="Next.js Logo" width={200} height={200} />
      <Image src="/prisma.svg" alt="Prisma Logo" width={200} height={200} />
    </div>   

    // Embed in app/page.tsx or a component 
    </>
  );
}
