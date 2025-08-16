"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./layout.module.css";

const links = [
    { href: "/landing", label: "Home" },
    { href: "/news", label: "News" },
    { href: "/dev", label: "[IMPORTANT!] Development Notice"},
];

export default function PublicNavbar() {
    const pathname = usePathname();

    return (
        <nav className={styles.publicNavbar}>
            <div>
                <h2>DuckCode</h2>
            </div>
            <ul>
                {links.map(({ href, label }) => (
                    <li 
                        key={href}
                        className={
                            href === pathname
                                ? styles.activeLink
                                : styles.inactiveLink
                        }
                    >
                        <Link href={href}>
                            {label}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    )
}