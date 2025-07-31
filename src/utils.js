import LANGUAGE_BUNDLES from "./lang";


export const getLanguageBundles = (locale) =>
  Object.values(LANGUAGE_BUNDLES).reduce(
    (acc, bundle) => ({ ...acc, ...bundle[locale] }),
    {}
  );
