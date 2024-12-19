import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import type { MetaFunction,  } from "react-router";
import { useLoaderData } from "react-router";
import { mergeMeta } from "~/utils/merge-meta";


/**
 * Just by adding the loader args, it causes the meta `data` to throw a TS error
 */
export const loader = async ({ context, request }: Route.LoaderArgs) => ({
  orgSlug: "test-org",
  title: "Foo bar baz"
});

/**
 * EXAMPLE 1 - MetaFunction typing
 * 
 * Docs show that it should be possible to type MetaFunction<typeof loader> but data is typed as `unknown`
 * @see - https://api.reactrouter.com/v7/interfaces/react_router.MetaFunction.html
 */
export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.title,
  },
];

/**
 * EXAMPLE 2 - Arrow fn wrapped in mergeMeta util
 * 
 * Remix V2 docs recommended a helper for merging meta from parent routes
 * @see - https://remix.run/docs/zh/main/route/meta#meta-merging-helper
 * @see - https://gist.github.com/ryanflorence/ec1849c6d690cfbffcb408ecd633e069
 * 
 * This function worked in Remix V2, but now TS fails in a similar way to the `meta` function 
 * above; `data` is typed as unknown.
 */
// export const meta = mergeMeta<typeof loader>(({ data }) => [
//   {
//     title: data?.title,
//   },
// ]);

/**
 * EXAMPLE 3 - Using `matches` from Route.MetaArgs
 * 
 * When all other `meta` fn's are commented out, referring to `matches` will cause the `meta` fn to
 * throw a TS error:
 * 
 * "'matches' implicitly has type 'any' because it does not have a type annotation and is referenced directly or indirectly in its own initializer."
 */
// export const meta = ({ data, matches }: Route.MetaArgs) => {
//   console.debug("Matches are", matches);

//   return [{
//     title: data?.title,
//   }]
// };

export default function Home({ loaderData }: Route.ComponentProps) {
  const { title } = useLoaderData<typeof loader>()

  return <Welcome message={loaderData.title} />;
}
