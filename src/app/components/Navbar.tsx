/**
 * v0 by Vercel.
 * @see https://v0.dev/t/wOZwPPbO5Bo
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import Link from "next/link"
import Logo from "@/lib/media/logo.svg";
import Image from "next/image";

export default function Component() {
  return (
    <header className="flex h-16 w-full items-center justify-between bg-white px-6 shadow-sm">
      <Link href={"/"} className="flex items-center gap-2" prefetch={false}>  
          <Image src={Logo} alt="Logo" width={30} height={30} className="mr-2" />
        <span className="text-lg font-semibold">VAE SMS</span>
      </Link>
      <nav className="flex items-center gap-6">
        <Link
          href="/contactmgmt"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          prefetch={false}
        >
          Contactos
        </Link>
        <Link
          href="/templatemgmt"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          prefetch={false}
        >
          Modelos
        </Link>
        <Link
          href="/broadcastmgmt"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          prefetch={false}
        >
          Difusão
        </Link>
        <Link
          href="/analytics"
          className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          prefetch={false}
        >
          Relatórios
        </Link>
        
      </nav>
    </header>
  )
}

