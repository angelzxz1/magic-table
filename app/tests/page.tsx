import { cookies } from "next/headers";

export default async function Tests() {
    const cookieStore = await cookies();
    const cookieValue = cookieStore.getAll().map((cookie) => {
        return `${cookie.name}: ${cookie.value}`;
    });

    return (
        <div>
            <h1 className="text-2xl font-bold">Test Page</h1>
            <p className="text-lg">Cookie values:</p>
            <ul className="list-disc pl-5">
                {cookieValue.map((cookie, index) => (
                    <li key={index} className="text-lg">
                        {cookie}
                    </li>
                ))}
            </ul>
        </div>
    );
}
