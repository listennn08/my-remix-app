import { json, Link, Outlet, useLoaderData } from "remix";

import { getPosts } from "~/post";
import type { Post } from "~/post";
import adminStyles from "~/styles/admin.css";

export const links = () => [
  { rel: "stylesheet", href: adminStyles }
];

export const loader = async () => {
  return json(await getPosts());
}

export default function Admin() {
  const post = useLoaderData<Post[]>();

  return (
    <div className="admin">
      <nav>
        <h1>Admin</h1>
        <ul>
          {post.map((post) => (
            <li key={post.slug}>
              <Link to={`/admin/edit/${post.slug}`}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}