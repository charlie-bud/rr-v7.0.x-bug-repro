import type { LoaderFunction, MetaFunction } from "react-router";

/**
 * Remix V2 docs recommended a helper for merging meta from parent routes
 * @see - https://remix.run/docs/zh/main/route/meta#meta-merging-helper
 * 
 * This function worked as expected in Remix V2, but now TS fails when adding a callback function and referencing `data`
 * which is typed as unknown
 */
export function mergeMeta<
  Loader extends LoaderFunction | unknown = unknown,
  ParentsLoaders extends Record<string, LoaderFunction | unknown> = Record<
    string,
    unknown
  >,
>(
  leafMetaFn: MetaFunction<Loader, ParentsLoaders>,
): MetaFunction<Loader, ParentsLoaders> {
  return (arg) => {
    const leafMeta = leafMetaFn(arg);

    return arg.matches.reduceRight((acc, match) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const parentMeta of match.meta) {
        const index = acc?.findIndex(
          (meta) =>
            ("name" in meta &&
              "name" in parentMeta &&
              meta.name === parentMeta.name) ||
            ("property" in meta &&
              "property" in parentMeta &&
              meta.property === parentMeta.property) ||
            ("title" in meta && "title" in parentMeta),
        );
        if (index === -1) {
          // Parent meta not found in acc, so add it
          acc?.push(parentMeta);
        }
      }
      return acc;
    }, leafMeta);
  };
}
