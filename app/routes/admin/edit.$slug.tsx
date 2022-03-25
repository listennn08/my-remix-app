import {
  ActionFunction,
  Form,
  json,
  LoaderFunction,
  redirect,
  useLoaderData,
  useTransition 
} from "remix";
import invariant from "tiny-invariant";
import { getPost, createPost, NewPost } from "~/post";

type Post = NewPost & {
  error: boolean,
  message: string,
}

type PostError = {
  title?: boolean;
  slug?: boolean;
  markdown?: boolean;
} 

export const action: ActionFunction = async ({ request }) => {
  await new Promise((res) => setTimeout(res, 1000));
  const formData = await request.formData();
  const title = formData.get("title");
  const slug =  formData.get("slug");
  const markdown = formData.get("markdown");

  const errors: PostError = {};
  if (!title) errors.title = true;
  if (!slug) errors.slug = true;
  if (!markdown) errors.markdown = true;

  if (Object.keys(errors).length) {
    return json(errors);
  }
  
  invariant(typeof title === "string");
  invariant(typeof slug === "string");
  invariant(typeof markdown === "string");

  await createPost({ title, slug, markdown });

  return redirect("/admin");
}

export const loader: LoaderFunction = async ({ params }) => {
  invariant(params.slug, "expected params.slug");
  return json(await getPost(params.slug, false));
}

export default function EditPostSlug() {
  const post = useLoaderData<Post>();
  const transition = useTransition();

  return (
    <>
      {post.error 
        ? <h2>{post.message}</h2>
        : <Form method="post">
          <p>
            <label>
              Post Title: {" "}
              <input type="text" name="title" defaultValue={post.title} />
            </label>
          </p>
          <p>
            <label>
              Post Slug: {" "}
              <input type="text" name="slug" defaultValue={post.slug} />

            </label>
          </p>
          <p>
            <label htmlFor="markdown">Markdown:</label>{" "}
            <br />
            <textarea id="markdown" name="markdown" rows={20} cols={80} defaultValue={post.markdown} />
          </p>
          <p>
            <button type="submit">
              {transition.submission ? "Updating" : "Update Post"}
            </button>
          </p>
        </Form>
      }
    </>
  )
}