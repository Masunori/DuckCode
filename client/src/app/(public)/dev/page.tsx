import Link from "next/link";
import styles from "./page.module.css";

export default function Page() {
    return (
        <main className={styles.devNotice}>
            <h1>Development Notice</h1>
            <section>
                <p>
                    If you are seeing this, it means that DuckCode is still in development. The website you are
                    viewing is a demonstration of the most current UI. The server is online, feel free to navigate.
                </p>
                {/* <p>
                    Here, the following routes are accessible:
                </p>
                <table>
                    <thead>
                        <tr>
                            <th>Route</th>
                            <th>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><Link href={"/landing"}>/landing</Link></td>
                            <td>The first page a user will see.</td>
                        </tr>
                        <tr>
                            <td><Link href={"/news"}>/news</Link></td>
                            <td>Shows all news and patch notes related to DuckCode. Navigable using the navigation bar on the landing page. Sample news on the page are also navigable.</td>
                        </tr>
                        <tr>
                            <td><Link href={"/portal"}>/portal</Link></td>
                            <td>User authentication happens here. Navigable from the landing page.</td>
                        </tr>
                        <tr>
                            <td><Link href={"/home"}>/home</Link></td>
                            <td><b>(AUTH-GATED)</b> The main game interface after the user logs in.</td>
                        </tr>
                        <tr>
                            <td><Link href={"/gameplay"}>/gameplay</Link></td>
                            <td><b>(AUTH-GATED)</b> A generic gameplay interface template in which many game modes will copy from and modify. Accessible by route because it is just a generic template.</td>
                        </tr>
                        <tr>
                            <td><Link href={"/multiplayer"}>/multiplayer</Link></td>
                            <td><b>(AUTH-GATED)</b> A gameplay interface adapted for multiplayer. Accessible by route.</td>
                        </tr>
                    </tbody>
                </table> */}
            </section>
        </main>
    )
}