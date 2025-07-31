
import React, { useMemo } from "react";
import { getLanguageBundles } from "./utils";
import { CommonCanvas } from "@elyra/canvas";
import { IntlProvider } from "react-intl";

const DEFAULT_LOCALE = "en" 

function ElyraCanvas({
  locale = DEFAULT_LOCALE,
  intlProviderProps,
  canvasController,
  ...restCanvasProps
}) {
  const messages = useMemo(() => getLanguageBundles(locale), [locale]);

  return (
    <IntlProvider
      locale={locale}
      defaultLocale={DEFAULT_LOCALE}
      messages={messages}
      {...intlProviderProps}
    >
      <CommonCanvas canvasController={canvasController} {...restCanvasProps} />
    </IntlProvider>
  );
}

export default ElyraCanvas;
