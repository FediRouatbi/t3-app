import { type NextPage } from "next";
import Head from "next/head";
import { useUser, SignIn, UserButton } from "@clerk/nextjs";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CustomImage from "~/components/CustomImage";
import LoadingPage from "~/components/Spinner";
import type { FormEvent } from "react";
import { useState } from "react";

dayjs.extend(relativeTime);
type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (post: PostWithUser) => {
  return (
    <div key={post.author?.id} className="flex w-full gap-3">
      <CustomImage image={post.author?.profileImageUrl} />

      <div className="flex flex-col">
        <div className="flex items-end gap-2 text-sm text-slate-100">
          <span className="font-medium">@{post.author?.firstName}</span>
          <span className="text-xs text-slate-500">
            {dayjs(post.post.createdAt).fromNow()}
          </span>
        </div>
        <div>{post.post.content}</div>
      </div>
    </div>
  );
};

const Posts = () => {
  const { data, isLoading } = api.posts.getAll.useQuery();
  console.log(data, isLoading);

  if (isLoading) return <LoadingPage />;

  if (!data) return <div />;

  return (
    <div className=" flex flex-col items-center gap-4 text-xl text-white">
      {data.map((post) => {
        return <PostView key={post.post.id} {...post} />;
      })}
    </div>
  );
};

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const { user, isSignedIn } = useUser();
  api.posts.getAll.useQuery();

  const { mutate, isLoading: isPosting } = api.posts.post.useMutation({
    onSuccess: () => {
      setInput("");
      void api.useContext().posts.invalidate();
    },
  });

  const handelPost = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ content: input });
  };
  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="mx-auto  flex min-h-screen flex-col  gap-10 pt-10 md:max-w-2xl   ">
        {isSignedIn ? (
          <>
            <div className="absolute top-10 right-10">
              <UserButton />
            </div>
            <form className="flex items-center space-x-4" onSubmit={handelPost}>
              <CustomImage image={user?.profileImageUrl} />
              <input
                type="text"
                className="block w-full rounded-lg bg-gray-50  p-2.5 text-sm text-gray-900 outline-none focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Start a post"
                required
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isPosting}
              />
              <button className="rounded-lg bg-gray-700 px-3 py-2 text-center text-xs font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-4 focus:ring-gray-300 dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-800">
                Post
              </button>
            </form>
            <Posts />
          </>
        ) : (
          <div className="self-center">
            <SignIn />
          </div>
        )}
      </main>
    </>
  );
};

export default Home;
